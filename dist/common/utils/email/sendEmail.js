import nodemailer from 'nodemailer';
import { env } from '../../../config/env.service.js';
export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.emailSender,
        pass: env.emailPass
    }
});
export const sendEmail = async ({ to, subject, html }) => {
    const info = await transporter.sendMail({
        from: `"${env.emailSender}": <${env.emailSender}>`, //sender email address
        to, //recipient email address      
        subject,
        html
    });
    console.log("Message Sent", info.messageId);
};
