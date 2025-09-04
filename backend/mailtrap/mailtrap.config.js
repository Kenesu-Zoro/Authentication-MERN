// mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,                 // e.g. sandbox.smtp.mailtrap.io
  port: Number(process.env.MAILTRAP_PORT || 587),  // 587 or 2525
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const sender = {
  email: process.env.FROM_EMAIL,       // e.g. no-reply@yourapp.test (Sandbox accepts any)
  name: process.env.FROM_NAME || "Your App",
};

export async function sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: `"${sender.name}" <${sender.email}>`,
    to,
    subject,
    html,
  });
}
