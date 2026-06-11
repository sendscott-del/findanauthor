const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const FROM = process.env.RESEND_FROM ?? "Writers for Readers <hello@findanauthor.org>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "hello@findanauthor.org";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://findanauthor.org";

async function send(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({ from: FROM, reply_to: ADMIN_EMAIL, to, subject, html }),
  });
}

export async function sendApplicationReceived(name: string, email: string, autoCheckPassed: boolean) {
  await send(
    email,
    "We received your application — Writers for Readers",
    `<p>Hi ${name},</p>
<p>Thanks for applying to <strong>Writers for Readers</strong>! We've received your application and will review it shortly.</p>
${autoCheckPassed
  ? `<p>Your publisher was automatically verified. Our team will follow up within a few business days.</p>`
  : `<p>Your publisher wasn't on our auto-verification list, so your application will go through manual review. We'll be in touch soon.</p>`
}
<p>If you have questions, reply to this email.</p>
<p>— The Writers for Readers team</p>`
  );

  await send(
    ADMIN_EMAIL,
    `New author application: ${name}`,
    `<p><strong>New application received</strong></p>
<p>Name: ${name}<br>Email: ${email}<br>Publisher check: ${autoCheckPassed ? "✓ Passed" : "⚠ Failed — manual review needed"}</p>
<p><a href="${SITE_URL}/admin/applications">Review in admin →</a></p>`
  );
}

export async function sendRequestReceived(requesterName: string, email: string, schoolName: string) {
  await send(
    email,
    "Your visit request was received — Writers for Readers",
    `<p>Hi ${requesterName},</p>
<p>Thanks for submitting a visit request through <strong>Writers for Readers</strong>! We've received your request for <strong>${schoolName}</strong> and will match you with an author soon.</p>
<p>We'll follow up by email once we've found a great match.</p>
<p>— The Writers for Readers team</p>`
  );

  await send(
    ADMIN_EMAIL,
    `New visit request: ${schoolName}`,
    `<p><strong>New school visit request</strong></p>
<p>School: ${schoolName}<br>Requester: ${requesterName} (${email})</p>
<p><a href="${SITE_URL}/admin/requests">Review in admin →</a></p>`
  );
}

export async function sendProfileSetupLink(name: string, email: string, token: string) {
  const link = `${SITE_URL}/profile/setup/${token}`;
  await send(
    email,
    "You're approved! Set up your Writers for Readers profile",
    `<p>Hi ${name},</p>
<p>Congratulations — you've been approved to join <strong>Writers for Readers</strong>!</p>
<p>Use the link below to set up your public author profile. The link expires in 7 days.</p>
<p><a href="${link}" style="display:inline-block;padding:12px 24px;background:#e85d04;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">Set up my profile →</a></p>
<p>Once your profile is live, schools and librarians across the country can find and request you.</p>
<p>— The Writers for Readers team</p>`
  );
}
