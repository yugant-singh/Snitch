import nodemailer from 'nodemailer'
import { config } from '../config/config.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
    }
})

export async function sendVerificationEmail(toEmail, verificationLink) {
    const mailOptions = {
        from: `"Snitch App" <${config.EMAIL_USER}>`,
        to: toEmail,
        subject: "Verify your email for Snitch App",
        html: `
            <p>Hi,</p>
            <p>Please click the link below to verify your email:</p>
            <a href="${verificationLink}">Verify Email</a>
            <p>This link will expire in 24 hours.</p>
            <p>Best regards,<br/>Snitch App Team</p>
        `
    }
    await transporter.sendMail(mailOptions)
}