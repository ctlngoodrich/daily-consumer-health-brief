/**
 * send-email.js
 *
 * Reads digest-output.md (written by Claude Code) and sends it as an HTML email.
 * No Anthropic API key required — this script only handles email delivery.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ─── Validate env ─────────────────────────────────────────────────────────────

const required = ['EMAIL_TO', 'EMAIL_FROM', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required env var: ${key}`);
    console.error('Add it to your .env file. See .env.example for reference.');
    process.exit(1);
  }
}

// ─── Read brief ───────────────────────────────────────────────────────────────

const outputPath = path.join(ROOT, 'digest-output.md');
if (!fs.existsSync(outputPath)) {
  console.error('digest-output.md not found.');
  console.error('Run the /daily-health-brief skill in Claude Code first to generate the brief.');
  process.exit(1);
}

const briefText = fs.readFileSync(outputPath, 'utf8');

const date = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});

// ─── Markdown → HTML ─────────────────────────────────────────────────────────

function markdownToHtml(text) {
  return text
    .replace(/^## (.+)$/gm, '<h2 style="color:#1a1a2e;margin:24px 0 8px;font-size:17px;">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="color:#16213e;margin:20px 0 6px;font-size:15px;">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#0066cc;text-decoration:none;">$1</a>')
    .replace(/^[-•] (.+)$/gm, '<li style="margin:4px 0;">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul style="margin:8px 0 8px 20px;padding:0;">$&</ul>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;">')
    .replace(/\n\n/g, '</p><p style="margin:10px 0;line-height:1.7;">')
    .replace(/\n/g, '<br>');
}

function buildHtml(briefText, date) {
  const body = markdownToHtml(briefText);
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;max-width:680px;margin:0 auto;padding:32px 24px;color:#1a1a1a;background:#ffffff;">
  <div style="border-bottom:2px solid #1a1a2e;padding-bottom:14px;margin-bottom:28px;">
    <h1 style="margin:0;font-size:20px;font-weight:700;color:#1a1a2e;letter-spacing:-0.3px;">
      Daily Consumer Health Brief
    </h1>
    <p style="margin:5px 0 0;font-size:13px;color:#888;">${date}</p>
  </div>
  <div style="font-size:15px;line-height:1.7;">
    <p style="margin:10px 0;line-height:1.7;">${body}</p>
  </div>
</body>
</html>`;
}

// ─── Send ─────────────────────────────────────────────────────────────────────

async function main() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Daily Health Brief" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_TO,
    subject: `Daily Consumer Health Brief — ${date}`,
    html: buildHtml(briefText, date),
    text: briefText,
  });

  console.log(`✅ Brief sent to ${process.env.EMAIL_TO}`);
}

main().catch(err => {
  console.error('Failed to send email:', err.message);
  process.exit(1);
});
