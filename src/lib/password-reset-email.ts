import { resend } from "@/lib/resend";

interface SendPasswordResetEmailParams {
  to: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({ to, resetUrl }: SendPasswordResetEmailParams) {
  const { error } = await resend.emails.send({
    from: "DevStash <onboarding@resend.dev>",
    to,
    subject: "Reset your DevStash password",
    html: `
      <p>We received a request to reset your DevStash password.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
    `,
  });

  if (error) {
    throw new Error(`${error.name}: ${error.message}`);
  }
}
