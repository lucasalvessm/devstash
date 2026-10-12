import { resend } from "@/lib/resend";

interface SendVerificationEmailParams {
  to: string;
  verifyUrl: string;
}

export async function sendVerificationEmail({ to, verifyUrl }: SendVerificationEmailParams) {
  const { error } = await resend.emails.send({
    from: "DevStash <onboarding@resend.dev>",
    to,
    subject: "Verify your email for DevStash",
    html: `
      <p>Welcome to DevStash — confirm your email address to finish setting up your account.</p>
      <p><a href="${verifyUrl}">Verify your email</a></p>
      <p>This link expires in 24 hours. If you didn't create this account, you can ignore this email.</p>
    `,
  });

  if (error) {
    throw new Error(`${error.name}: ${error.message}`);
  }
}
