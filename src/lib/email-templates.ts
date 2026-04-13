export function getWelcomeEmailHtml(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background:#2563eb;padding:32px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">⚡ AutoApply AI</h1>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <h2 style="color:#1e293b;margin:0 0 16px;font-size:20px;">Welcome, ${name}! 🎉</h2>

      <p style="color:#64748b;line-height:1.6;margin:0 0 24px;">
        Your account is ready. Here's how to get started:
      </p>

      <!-- Steps -->
      <div style="margin-bottom:24px;">
        <div style="display:flex;align-items:flex-start;margin-bottom:16px;">
          <div style="background:#eff6ff;color:#2563eb;width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;margin-right:12px;flex-shrink:0;">1</div>
          <div>
            <strong style="color:#1e293b;">Generate your AI resume</strong>
            <p style="color:#64748b;margin:4px 0 0;font-size:14px;">Our AI creates a professional resume from your profile in seconds</p>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;margin-bottom:16px;">
          <div style="background:#eff6ff;color:#2563eb;width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;margin-right:12px;flex-shrink:0;">2</div>
          <div>
            <strong style="color:#1e293b;">Find jobs on hh.ru & staff.am</strong>
            <p style="color:#64748b;margin:4px 0 0;font-size:14px;">Import jobs by URL or search by keyword</p>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;margin-bottom:16px;">
          <div style="background:#eff6ff;color:#2563eb;width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;margin-right:12px;flex-shrink:0;">3</div>
          <div>
            <strong style="color:#1e293b;">Auto-apply with one click</strong>
            <p style="color:#64748b;margin:4px 0 0;font-size:14px;">AI generates cover letters and submits applications for you</p>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align:center;margin:32px 0;">
        <a href="https://autoapply-ai-vert.vercel.app/dashboard" style="background:#2563eb;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;display:inline-block;">
          Go to Dashboard →
        </a>
      </div>

      <p style="color:#94a3b8;font-size:13px;text-align:center;margin:24px 0 0;">
        You're on the Free plan (5 applications/month).<br>
        <a href="https://autoapply-ai-vert.vercel.app/payments" style="color:#2563eb;text-decoration:none;">Upgrade to Pro</a> for unlimited applications.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="color:#94a3b8;font-size:12px;margin:0;">
        AutoApply AI — Apply to 100 jobs in 1 click<br>
        <a href="https://autoapply-ai-vert.vercel.app/settings" style="color:#64748b;text-decoration:none;">Manage notifications</a> ·
        <a href="https://autoapply-ai-vert.vercel.app/privacy" style="color:#64748b;text-decoration:none;">Privacy</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

export function getApplicationSentEmailHtml(name: string, jobTitle: string, company: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#2563eb;padding:24px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:20px;">⚡ AutoApply AI</h1>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#1e293b;margin:0 0 8px;">Application Sent! 📨</h2>
      <p style="color:#64748b;margin:0 0 20px;">Hi ${name}, your application was submitted successfully.</p>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:24px;">
        <p style="margin:0;color:#166534;font-weight:600;">${jobTitle}</p>
        <p style="margin:4px 0 0;color:#15803d;font-size:14px;">${company}</p>
      </div>

      <div style="text-align:center;">
        <a href="https://autoapply-ai-vert.vercel.app/tracker" style="background:#2563eb;color:#ffffff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block;">
          View in Tracker →
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;
}
