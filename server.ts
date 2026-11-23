import 'dotenv/config';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
// Strictly only this single account is authorized as UniDoc Administrator
const ADMIN_EMAIL = 'loandang.31251023483@st.ueh.edu.vn';

interface OtpValidationFailure {
  valid: false;
  error: string;
}

interface OtpValidationSuccess {
  valid: true;
  email: string;
  verification_code: string;
  expires_in_minutes: number;
}

type OtpValidationResult = OtpValidationFailure | OtpValidationSuccess;

interface StoredOtpRecord {
  code: string;
  expiresAt: number;
  invalidated: boolean;
}

const otpStore = new Map<string, StoredOtpRecord>();

/**
 * Quy tắc bắt buộc kiểm tra email .edu.vn & sinh mã xác minh 6 chữ số phía server:
 * 1. Chỉ chấp nhận địa chỉ email hợp lệ và kết thúc chính xác bằng ".edu.vn"
 *    (không phân biệt chữ hoa/thường, không có khoảng trắng thừa).
 * 2. Nếu không hợp lệ hoặc không có đuôi ".edu.vn", từ chối và giải thích ngắn gọn lý do.
 * 3. Nếu hợp lệ, sinh mã ngẫu nhiên 6 chữ số và trả về JSON đúng định dạng.
 */
export function validateAndGenerateEduOtp(rawEmail: unknown): OtpValidationResult {
  if (typeof rawEmail !== 'string' || rawEmail.length === 0) {
    return {
      valid: false,
      error: 'Vui lòng nhập địa chỉ email sinh viên.',
    };
  }

  // Reject any leading, trailing, or internal whitespace
  if (rawEmail !== rawEmail.trim() || /\s/.test(rawEmail)) {
    return {
      valid: false,
      error: 'Email không hợp lệ vì chứa khoảng trắng thừa.',
    };
  }

  const normalizedEmail = rawEmail.toLowerCase();

  // Validate general email format
  const basicEmailRegex =
    /^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;

  if (
    normalizedEmail.includes('..') ||
    !basicEmailRegex.test(normalizedEmail)
  ) {
    return {
      valid: false,
      error: 'Định dạng địa chỉ email không hợp lệ.',
    };
  }

  // Must end strictly with ".edu.vn" (case-insensitive)
  if (!normalizedEmail.endsWith('.edu.vn')) {
    return {
      valid: false,
      error: 'Chỉ chấp nhận email sinh viên kết thúc chính xác bằng ".edu.vn".',
    };
  }

  const verificationCode = crypto.randomInt(100000, 1000000).toString();

  return {
    valid: true,
    email: normalizedEmail,
    verification_code: verificationCode,
    expires_in_minutes: 10,
  };
}

async function sendPrivateVerificationEmail(
  recipientEmail: string,
  code: string,
  expiresInMinutes: number
): Promise<{ sent: boolean; channel: 'resend' | 'smtp' | 'unconfigured'; detail?: string }> {
  const subject = '[UniDoc] Mã xác minh tài khoản sinh viên của bạn';
  const textBody = [
    'Xin chào bạn,',
    '',
    `Mã xác minh đăng ký tài khoản UniDoc của bạn là: ${code}`,
    `Mã có hiệu lực trong vòng ${expiresInMinutes} phút (vui lòng nhập trong 60 giây trên màn hình xác thực).`,
    '',
    'Vì lý do bảo mật, tuyệt đối không chia sẻ mã này cho bất kỳ ai.',
    'Trân trọng,',
    'Đội ngũ UniDoc',
  ].join('\n');

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #edf8fe; padding: 24px; border-radius: 16px; border: 1px solid #b9e7ff;">
      <h2 style="color: #0860c9; margin: 0 0 8px;">Xác minh tài khoản UniDoc</h2>
      <p style="color: #334155; font-size: 14px; line-height: 1.6;">
        Cảm ơn bạn đã đăng ký tài khoản sinh viên trên <strong>UniDoc</strong>. Vui lòng sử dụng mã xác minh riêng tư dưới đây để hoàn tất kích hoạt:
      </p>
      <div style="background: #ffffff; border: 1px solid #b9e7ff; border-radius: 12px; padding: 16px; text-align: center; margin: 16px 0;">
        <span style="font-size: 28px; font-weight: 800; letter-spacing: 6px; color: #0860c9;">${code}</span>
      </div>
      <p style="color: #5b728f; font-size: 12px; line-height: 1.5; margin: 0;">
        Mã có hiệu lực trong ${expiresInMinutes} phút. Không chia sẻ mã này với người khác.
      </p>
    </div>
  `;

  // 1. Try Resend API if configured
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  if (resendApiKey) {
    try {
      const fromAddr = process.env.SMTP_FROM?.trim() || 'UniDoc <onboarding@resend.dev>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddr,
          to: [recipientEmail],
          subject,
          text: textBody,
          html: htmlBody,
        }),
      });
      if (res.ok) {
        return { sent: true, channel: 'resend' };
      }
      const errText = await res.text();
      console.error('[UniDoc Email API] Resend error:', errText);
      return { sent: false, channel: 'resend', detail: 'Không thể gửi qua Resend API.' };
    } catch (err) {
      console.error('[UniDoc Email API] Resend exception:', err);
      return { sent: false, channel: 'resend', detail: 'Lỗi kết nối Resend API.' };
    }
  }

  // 2. Try SMTP via Nodemailer if configured
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const smtpPort = Number(process.env.SMTP_PORT || 465);
      const smtpSecure =
        process.env.SMTP_SECURE !== undefined
          ? process.env.SMTP_SECURE === 'true'
          : smtpPort === 465;

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM?.trim() || `UniDoc <${smtpUser}>`,
        to: recipientEmail,
        subject,
        text: textBody,
        html: htmlBody,
      });

      return { sent: true, channel: 'smtp' };
    } catch (err) {
      console.error('[UniDoc SMTP] Send mail error:', err);
      return { sent: false, channel: 'smtp', detail: 'Không thể gửi email qua máy chủ SMTP.' };
    }
  }

  return {
    sent: false,
    channel: 'unconfigured',
    detail: 'Máy chủ chưa cấu hình SMTP hoặc Email API để gửi thư trực tiếp.',
  };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // 1. Admin authorization check (Admin email stays strictly private on server)
  app.post('/api/auth/check-admin', (req: Request, res: Response) => {
    const rawEmail = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const isAdmin = rawEmail.length > 0 && rawEmail === ADMIN_EMAIL;
    res.json({ isAdmin });
  });

  // 1b. Admin action authorization gate (only loandang.31251023483@st.ueh.edu.vn allowed)
  app.post('/api/admin/authorize-action', (req: Request, res: Response) => {
    const rawEmail = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!rawEmail || rawEmail !== ADMIN_EMAIL) {
      res.status(403).json({
        authorized: false,
        error: 'Chỉ dành cho Quản trị viên hệ thống UniDoc.',
      });
      return;
    }
    res.json({ authorized: true });
  });

  // 2. Request private OTP sent directly to student's .edu.vn email (NEVER expose code in HTTP response)
  app.post('/api/auth/request-otp', async (req: Request, res: Response) => {
    const result = validateAndGenerateEduOtp(req.body?.email);

    if (!result.valid) {
      res.status(400).json({
        valid: false,
        error: result.error,
      });
      return;
    }

    // Store OTP securely on server (invalidates any previous code for this email)
    otpStore.set(result.email, {
      code: result.verification_code,
      expiresAt: Date.now() + result.expires_in_minutes * 60 * 1000,
      invalidated: false,
    });

    const delivery = await sendPrivateVerificationEmail(
      result.email,
      result.verification_code,
      result.expires_in_minutes
    );

    if (!delivery.sent) {
      res.status(503).json({
        valid: true,
        email: result.email,
        expires_in_minutes: result.expires_in_minutes,
        emailSent: false,
        deliveryChannel: delivery.channel,
        error:
          delivery.channel === 'unconfigured'
            ? 'Máy chủ chưa được cấu hình SMTP/Email API (SMTP_HOST, SMTP_USER, SMTP_PASS hoặc RESEND_API_KEY) nên chưa thể gửi mã xác minh riêng tư tới email của bạn.'
            : delivery.detail || 'Gửi email xác minh thất bại. Vui lòng thử lại.',
      });
      return;
    }

    // Strictly omit verification_code from response for privacy/security
    res.json({
      valid: true,
      email: result.email,
      expires_in_minutes: result.expires_in_minutes,
      emailSent: true,
      deliveryChannel: delivery.channel,
      message: `Mã xác minh 6 chữ số đã được gửi riêng tới hộp thư ${result.email}.`,
    });
  });

  // 3. Verify OTP submitted by student on server
  app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
    const rawEmail = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const rawCode = typeof req.body?.code === 'string' ? req.body.code.trim() : '';

    if (!rawEmail || !rawCode) {
      res.status(400).json({
        verified: false,
        error: 'Vui lòng nhập đầy đủ email và mã xác minh 6 chữ số.',
      });
      return;
    }

    const record = otpStore.get(rawEmail);
    if (!record || record.invalidated) {
      res.status(400).json({
        verified: false,
        error: 'Mã xác minh đã hết hiệu lực hoặc bị vô hiệu. Vui lòng ấn "Gửi lại mã khác".',
      });
      return;
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(rawEmail);
      res.status(400).json({
        verified: false,
        error: 'Mã xác minh đã hết hạn. Vui lòng ấn "Gửi lại mã khác".',
      });
      return;
    }

    const expectedBuf = Buffer.from(record.code, 'utf8');
    const submittedBuf = Buffer.from(rawCode, 'utf8');

    if (
      expectedBuf.length !== submittedBuf.length ||
      !crypto.timingSafeEqual(expectedBuf, submittedBuf)
    ) {
      res.status(400).json({
        verified: false,
        error: 'Mã xác minh không chính xác. Vui lòng kiểm tra lại hộp thư email cá nhân của bạn.',
      });
      return;
    }

    otpStore.delete(rawEmail);
    res.json({
      verified: true,
      email: rawEmail,
    });
  });

  // 4. Invalidate active OTP when 60-second timer expires
  app.post('/api/auth/invalidate-otp', (req: Request, res: Response) => {
    const rawEmail = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (rawEmail && otpStore.has(rawEmail)) {
      const existing = otpStore.get(rawEmail)!;
      otpStore.set(rawEmail, { ...existing, invalidated: true });
    }
    res.json({ invalidated: true });
  });

  // Mount Vite middleware in development or serve dist/ in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UniDoc server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start UniDoc server:', err);
  process.exit(1);
});
