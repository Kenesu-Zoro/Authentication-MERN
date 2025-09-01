import { MailtrapClient } from "mailtrap"
import { sender, mailtrapClient } from "./mailtrap.config.js"
import {VERIFICATION_EMAIL_TEMPLATE} from "./emailTemplate.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Email Verification",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })

        console.log("Verification email sent", response);
    } catch (error) {
        console.error("Error sending verification email", error);
        throw new Error(`Error sending email ${error}`)
    }
}