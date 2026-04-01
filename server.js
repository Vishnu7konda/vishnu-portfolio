// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const { Server } = require('socket.io');
const multer = require('multer');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static site from project root
app.use(express.static(path.join(__dirname)));

// ─── Data Store ─────────────────────────────────────────────────────────────
const DATA_FILE = path.join(process.cwd(), 'data.json');

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { skills: [], projects: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ─── Admin Auth ──────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vishnu@konda';

function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (auth === `Bearer ${ADMIN_PASSWORD}`) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

// ─── Public Data API ─────────────────────────────────────────────────────────
app.get('/api/data', (req, res) => {
  res.json(readData());
});

// ─── Admin Login ─────────────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (password === ADMIN_PASSWORD) {
    res.json({ token: ADMIN_PASSWORD });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// ─── Upload API ─────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, Date.now() + '-' + safeName);
  }
});
const upload = multer({ storage });

app.post('/api/admin/upload', adminAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ─── Skills CRUD ─────────────────────────────────────────────────────────────
app.post('/api/admin/skills', adminAuth, (req, res) => {
  const data = readData();
  const skill = { id: `skill-${Date.now()}`, ...req.body };
  data.skills.push(skill);
  writeData(data);
  res.json(skill);
});

app.put('/api/admin/skills/:id', adminAuth, (req, res) => {
  const data = readData();
  const i = data.skills.findIndex((s) => s.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Not found' });
  data.skills[i] = { ...data.skills[i], ...req.body };
  writeData(data);
  res.json(data.skills[i]);
});

app.delete('/api/admin/skills/:id', adminAuth, (req, res) => {
  const data = readData();
  data.skills = data.skills.filter((s) => s.id !== req.params.id);
  writeData(data);
  res.json({ ok: true });
});

// ─── Projects CRUD ───────────────────────────────────────────────────────────
app.post('/api/admin/projects', adminAuth, (req, res) => {
  const data = readData();
  const project = { id: `proj-${Date.now()}`, ...req.body };
  data.projects.push(project);
  writeData(data);
  res.json(project);
});

app.put('/api/admin/projects/:id', adminAuth, (req, res) => {
  const data = readData();
  const i = data.projects.findIndex((p) => p.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Not found' });
  data.projects[i] = { ...data.projects[i], ...req.body };
  writeData(data);
  res.json(data.projects[i]);
});

app.delete('/api/admin/projects/:id', adminAuth, (req, res) => {
  const data = readData();
  data.projects = data.projects.filter((p) => p.id !== req.params.id);
  writeData(data);
  res.json({ ok: true });
});

// ─── Contact Form ────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify()
  .then(() => console.log('SMTP transporter verified'))
  .catch((err) => console.warn('SMTP verification failed:', err.message));

io.on('connection', (socket) => {
  console.log('Admin connected:', socket.id);
  socket.on('disconnect', () => console.log('Admin disconnected:', socket.id));
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !message)
      return res.status(400).json({ error: 'name, email and message are required' });

    const receivedAt = new Date().toISOString();
    const mailTo = process.env.EMAIL_TO || process.env.SMTP_USER;

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: mailTo,
      subject: subject?.trim() ? `New contact: ${subject}` : 'New contact message',
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || '(none)'}\nMessage:\n${message}\nReceived: ${receivedAt}`,
      html: `
        <h3>New message from your website</h3>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject || '(none)')}</p>
        <p><strong>Message:</strong><br/>${nl2br(escapeHtml(message))}</p>
        <p><small>Received: ${receivedAt}</small></p>
      `,
    });

    io.emit('new-message', { name, email, subject, message, receivedAt });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error in /api/contact:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// ─── SPA Fallback ────────────────────────────────────────────────────────────
// Serve index.html for /admin route in production
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── Start Server ────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
}
module.exports = app;

function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function nl2br(s) {
  return String(s).replace(/\n/g, '<br/>');
}