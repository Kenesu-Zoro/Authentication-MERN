import { MailtrapClient } from "mailtrap"
// import { sender, mailtrapClient } from "./mailtrap.config.js"

import { sendEmail } from "./mailtrap.config.js"
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplate.js"



export const sendVerificationEmail = async (email, verificationToken) => {
    const html = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);

    try {
        const response = await sendEmail({
            to: email,                        // string is fine; Nodemailer also accepts arrays
            subject: "Email Verification",
            html,
        });
        console.log("Verification email sent", response.messageId);
        return response;
    } catch (error) {
        console.error("Error sending verification email", error);
        throw new Error(`Error sending email: ${error.message || error}`);
    }
};


export const sendWelcomeEmail = async (email, name) => {
    const html = `
    <!doctype html><html><body>
      <h2>Welcome, ${name}! 🎉</h2>
      <p>We’re excited to have you at <strong>KenzBazaar</strong>.</p>
    </body></html>
  `;
    return transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Welcome to KenzBazaar 🎉",
        html,
    });
};


export const sendPasswordResetEmail = async (email, resetUrl) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
            category: "Password Reset"
        })

        console.log("Password reset email sent", response);
    } catch (error) {
        console.error("Error sending password reset email", error);
        throw new Error(`Error sending email ${error}`)
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Success"
        })

        console.log("Password reset success email sent", response);
    } catch (error) {
        console.error("Error sending password reset success email", error);
        throw new Error(`Error sending email ${error}`)
    }
}