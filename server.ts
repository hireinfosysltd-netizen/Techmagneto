import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Pragma, Cache-Control');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware for parsing JSON & Urlencoded payloads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Never cache API responses - always serve freshest server state to visitors
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// File paths for persistent storage
const CONFIG_FILE = path.resolve(__dirname, 'upi_config.json');
const SETTINGS_FILE = path.resolve(__dirname, 'site_settings.json');

export interface UpiConfig {
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
  upiId: '6655788954488',
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
      const parsed = JSON.parse(data);
      return { ...DEFAULT_CONFIG, ...parsed };
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
// REAL-TIME BROADCAST ENGINE (Server-Sent Events)
// ----------------------------------------------------
const sseClients = new Set<express.Response>();

function broadcastUpiUpdate(config: UpiConfig) {
  const payload = JSON.stringify({
    type: 'upi_update',
    upi: {
      upiId: config.upiId,
      payeeName: config.payeeName,
      paymentLink: config.paymentLink || '',
      scannerImageUrl: config.scannerImageUrl || '',
      merchantCode: config.merchantCode || 'TECHMAGNET',
      acceptedApps: config.acceptedApps || DEFAULT_CONFIG.acceptedApps,
      lastSyncedAt: config.lastSyncedAt,
      syncSource: config.syncSource,
    },
    syncLogs: config.syncLogs?.slice(-15) || [],
    timestamp: Date.now(),
  });

  for (const client of sseClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

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

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TECHMAGNET Live API',
    connectedClients: sseClients.size,
    timestamp: new Date().toISOString(),
  });
});

// 2. Real-time SSE stream for instant visitor synchronization
app.get('/api/upi/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders?.();

  // Send current state immediately on connection
  const config = readConfig();
  const initialPayload = JSON.stringify({
    type: 'upi_update',
    upi: {
      upiId: config.upiId,
      payeeName: config.payeeName,
      paymentLink: config.paymentLink || '',
      scannerImageUrl: config.scannerImageUrl || '',
      merchantCode: config.merchantCode || 'TECHMAGNET',
      acceptedApps: config.acceptedApps || DEFAULT_CONFIG.acceptedApps,
      lastSyncedAt: config.lastSyncedAt,
      syncSource: config.syncSource,
    },
    syncLogs: config.syncLogs?.slice(-15) || [],
    timestamp: Date.now(),
  });

  res.write(`data: ${initialPayload}\n\n`);

  sseClients.add(res);

  // Keep-alive ping every 12 seconds to prevent Cloud Run/proxy timeout
  const heartbeat = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 12000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

// 3. GET current UPI & Payment Gateway details (instant JSON read)
app.get('/api/upi', (req, res) => {
  const config = readConfig();
  res.json({
    success: true,
    upi: {
      upiId: config.upiId,
      payeeName: config.payeeName,
      paymentLink: config.paymentLink || '',
      scannerImageUrl: config.scannerImageUrl || '',
      merchantCode: config.merchantCode || 'TECHMAGNET',
      acceptedApps: config.acceptedApps || DEFAULT_CONFIG.acceptedApps,
      lastSyncedAt: config.lastSyncedAt,
      syncSource: config.syncSource,
    },
    syncLogs: config.syncLogs?.slice(-15) || [],
    activeConnections: sseClients.size,
  });
});

// 4. POST update UPI configuration (called by Admin Panel or external webhook)
app.post(['/api/upi', '/api/upi/sync'], (req, res) => {
  const {
    upiId,
    upiLink,
    paymentLink,
    payeeName,
    scannerImageUrl,
    merchantCode,
    acceptedApps,
    source,
    apiKey,
  } = req.body;

  // Optional security key check
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

  const currentConfig = readConfig();
  const now = new Date().toISOString();

  // If explicitly provided, use target; otherwise keep current
  const resolvedUpiId = targetUpiId !== undefined ? targetUpiId : currentConfig.upiId;
  const resolvedPaymentLink = targetPaymentLink !== undefined ? targetPaymentLink : (currentConfig.paymentLink || '');

  const updatedConfig: UpiConfig = {
    ...currentConfig,
    upiId: resolvedUpiId,
    payeeName: targetPayee || currentConfig.payeeName || 'TECHMAGNET',
    paymentLink: resolvedPaymentLink,
    scannerImageUrl: scannerImageUrl !== undefined ? scannerImageUrl : (currentConfig.scannerImageUrl || ''),
    merchantCode: merchantCode || currentConfig.merchantCode || 'TECHMAGNET',
    acceptedApps: Array.isArray(acceptedApps) ? acceptedApps : (currentConfig.acceptedApps || DEFAULT_CONFIG.acceptedApps),
    lastSyncedAt: now,
    syncSource: (source as any) || 'manual',
    syncLogs: [
      ...(currentConfig.syncLogs || []),
      {
        id: `sync-${Date.now()}`,
        timestamp: now,
        upiId: resolvedUpiId || 'Cleared',
        paymentLink: resolvedPaymentLink || undefined,
        source: source || 'Admin Panel Manual',
        success: true,
      },
    ].slice(-25),
  };

  writeConfig(updatedConfig);

  // Broadcast instantly to all active visitors
  broadcastUpiUpdate(updatedConfig);

  return res.json({
    success: true,
    message: resolvedUpiId
      ? `Payment details updated to "${resolvedUpiId}" and broadcast live to all visitors!`
      : 'UPI configuration updated (cleared)',
    activeUpiId: updatedConfig.upiId,
    activePaymentLink: updatedConfig.paymentLink,
    payeeName: updatedConfig.payeeName,
    lastSyncedAt: now,
    upi: updatedConfig,
  });
});

// 5. POST Reset UPI config
app.post('/api/upi/reset', (req, res) => {
  writeConfig(DEFAULT_CONFIG);
  broadcastUpiUpdate(DEFAULT_CONFIG);
  res.json({
    success: true,
    message: 'Reset UPI configuration to default state',
    config: DEFAULT_CONFIG,
  });
});

// 6. Generic Site Settings API (Plans, Contact, GST, Platforms, Services)
app.get('/api/settings', (req, res) => {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return res.json({ success: true, settings: JSON.parse(data) });
    }
  } catch (err) {
    console.warn('Error reading site_settings.json:', err);
  }
  res.json({ success: true, settings: null });
});

app.post('/api/settings', (req, res) => {
  try {
    const newSettings = req.body;
    if (newSettings && typeof newSettings === 'object') {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings, null, 2), 'utf-8');
      // If UPI is included in site settings, sync upi_config as well
      if (newSettings.upi) {
        const currentConfig = readConfig();
        const merged: UpiConfig = {
          ...currentConfig,
          ...newSettings.upi,
          lastSyncedAt: new Date().toISOString(),
        };
        writeConfig(merged);
        broadcastUpiUpdate(merged);
      }
      return res.json({ success: true, message: 'Settings saved to server' });
    }
  } catch (err) {
    console.error('Error saving site_settings.json:', err);
    return res.status(500).json({ success: false, error: 'Could not write settings file' });
  }
  res.status(400).json({ success: false, error: 'Invalid settings body' });
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
