import { MailtrapClient } from "mailtrap"
import { sender, mailtrapClient } from "./mailtrap.config.js"
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE } from "./emailTemplate.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Email Verification",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })

        console.log("Verification email sent", response);
    } catch (error) {
        console.error("Error sending verification email", error);
        throw new Error(`Error sending email ${error}`)
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "fdcda09c-fca5-4a56-a81f-a94bf390331a",
            template_variables: {
                "name": name,
                "company_info_name": "KenzBazaar"
            }
        })

        console.log("Welcome email sent", response);
    } catch (error) {
        console.error("Error sending welcome email", error);
    }
}

export const sendPasswordResetEmail = async (email, resetUrl) => {
    const recipient = [{email}];

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