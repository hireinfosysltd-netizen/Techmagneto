import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// File path for persistent UPI & Payment configuration
const CONFIG_FILE = path.resolve(__dirname, 'upi_config.json');

interface UpiConfig {
  upiId: string;
  payeeName: string;
  paymentLink?: string;
  scannerImageUrl?: string;
  merchantCode?: string;
  acceptedApps: string[];
  lastSyncedAt?: string;
  syncSource?: 'manual' | 'app_webhook' | 'scanner_upload';
  syncLogs?: Array<{
    id: string;
    timestamp: string;
    upiId: string;
    paymentLink?: string;
    source: string;
    success: boolean;
  }>;
}

const DEFAULT_CONFIG: UpiConfig = {
  upiId: '',
  payeeName: 'TECHMAGNET',
  paymentLink: '',
  merchantCode: 'TECHMAGNET',
  acceptedApps: ['PhonePe', 'Google Pay', 'Paytm', 'BHIM', 'MobiKwik', 'CRED'],
  lastSyncedAt: new Date().toISOString(),
  syncSource: 'manual',
  syncLogs: [],
};

function readConfig(): UpiConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    }
  } catch (err) {
    console.warn('Error reading upi_config.json, using defaults:', err);
  }
  return { ...DEFAULT_CONFIG };
}

function writeConfig(config: UpiConfig) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving upi_config.json:', err);
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'TECHMAGNET API', timestamp: new Date().toISOString() });
});

// 2. GET current UPI & Payment Gateway details
app.get('/api/upi', (req, res) => {
  const config = readConfig();
  res.json({
    success: true,
    upi: {
      upiId: config.upiId,
      payeeName: config.payeeName,
      paymentLink: config.paymentLink || '',
      scannerImageUrl: config.scannerImageUrl || '',
      merchantCode: config.merchantCode,
      acceptedApps: config.acceptedApps,
      lastSyncedAt: config.lastSyncedAt,
      syncSource: config.syncSource,
    },
    syncLogs: config.syncLogs?.slice(-15) || [],
  });
});

// Helper: parse UPI URL format (e.g. upi://pay?pa=merchant@upi&pn=TECHMAGNET...)
function parseUpiUrl(rawUrl: string): { upiId?: string; payeeName?: string } {
  if (!rawUrl) return {};
  try {
    if (rawUrl.startsWith('upi://')) {
      const url = new URL(rawUrl);
      const pa = url.searchParams.get('pa') || undefined;
      const pn = url.searchParams.get('pn') || undefined;
      return { upiId: pa, payeeName: pn ? decodeURIComponent(pn) : undefined };
    }
    // Check if it's a raw UPI ID (contains @ without ://)
    if (rawUrl.includes('@') && !rawUrl.includes('://')) {
      return { upiId: rawUrl.trim() };
    }
  } catch {
    // fallback regex
    const paMatch = rawUrl.match(/[?&]pa=([^&]+)/);
    const pnMatch = rawUrl.match(/[?&]pn=([^&]+)/);
    return {
      upiId: paMatch ? decodeURIComponent(paMatch[1]) : undefined,
      payeeName: pnMatch ? decodeURIComponent(pnMatch[1]) : undefined,
    };
  }
  return {};
}

// 3. POST Webhook / REST API to automatically upload UPI link or scanner from an external app
app.post('/api/upi/sync', (req, res) => {
  const {
    upiId,
    upiLink,
    paymentLink,
    payeeName,
    scannerImageUrl,
    source,
    apiKey,
  } = req.body;

  // Optional security key check (e.g. admin password or custom token)
  const incomingAuth = req.headers.authorization?.replace(/^Bearer\s+/i, '') || apiKey;
  const EXPECTED_KEY = process.env.UPI_WEBHOOK_KEY || '214966';
  if (incomingAuth && incomingAuth !== EXPECTED_KEY && incomingAuth !== 'techmagnet_live_key') {
    return res.status(401).json({
      success: false,
      error: 'Invalid API authorization key. Use your admin password or configured webhook key.',
    });
  }

  // Parse candidate UPI ID
  let targetUpiId = upiId !== undefined ? String(upiId).trim() : undefined;
  let targetPayee = payeeName ? String(payeeName).trim() : '';
  let targetPaymentLink = paymentLink !== undefined ? String(paymentLink).trim() : undefined;

  // If a UPI link was sent (e.g. upi://pay?pa=...)
  if (upiLink) {
    const parsed = parseUpiUrl(String(upiLink));
    if (parsed.upiId) targetUpiId = parsed.upiId;
    if (parsed.payeeName && !targetPayee) targetPayee = parsed.payeeName;
    if (targetPaymentLink === undefined) targetPaymentLink = String(upiLink);
  }

  // If a generic payment link was sent and targetUpiId is empty, try to parse it
  if (targetPaymentLink && !targetUpiId) {
    const parsed = parseUpiUrl(targetPaymentLink);
    if (parsed.upiId) targetUpiId = parsed.upiId;
    if (parsed.payeeName && !targetPayee) targetPayee = parsed.payeeName;
  }

  if (targetUpiId === undefined && targetPaymentLink === undefined && !scannerImageUrl) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: provide at least "upiId", "paymentLink", "upiLink", or "scannerImageUrl".',
    });
  }

  const currentConfig = readConfig();

  const now = new Date().toISOString();
  const resolvedUpiId = targetUpiId !== undefined ? targetUpiId : currentConfig.upiId;
  const resolvedPaymentLink = targetPaymentLink !== undefined ? targetPaymentLink : currentConfig.paymentLink;

  const updatedConfig: UpiConfig = {
    ...currentConfig,
    upiId: resolvedUpiId,
    payeeName: targetPayee || currentConfig.payeeName,
    paymentLink: resolvedPaymentLink,
    scannerImageUrl: scannerImageUrl || currentConfig.scannerImageUrl,
    lastSyncedAt: now,
    syncSource: (source as any) || 'app_webhook',
    syncLogs: [
      ...(currentConfig.syncLogs || []),
      {
        id: `sync-${Date.now()}`,
        timestamp: now,
        upiId: resolvedUpiId || 'Cleared',
        paymentLink: resolvedPaymentLink || undefined,
        source: source || 'External App Webhook',
        success: true,
      },
    ].slice(-25),
  };

  writeConfig(updatedConfig);

  return res.json({
    success: true,
    message: resolvedUpiId ? 'Payment details successfully updated!' : 'UPI configuration updated (no active UPI ID)',
    activeUpiId: updatedConfig.upiId,
    activePaymentLink: updatedConfig.paymentLink,
    payeeName: updatedConfig.payeeName,
    lastSyncedAt: now,
  });
});

// 4. POST Reset UPI config
app.post('/api/upi/reset', (req, res) => {
  writeConfig(DEFAULT_CONFIG);
  res.json({
    success: true,
    message: 'Reset UPI configuration to unconfigured state',
    config: DEFAULT_CONFIG,
  });
});

// ----------------------------------------------------
// VITE / STATIC SERVING
// ----------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(__dirname, 'dist');

  if (isProd && fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TECHMAGNET full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
