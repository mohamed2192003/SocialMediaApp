import nodemailer from 'nodemailer';
import { env } from '../../../config/env.service.js'
import Mail from 'nodemailer/lib/mailer/index.js';

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.emailSender,
    pass: env.emailPass,
  },
  tls: {
    rejectUnauthorized: false,
    // Same fix as Redis: Node calls checkServerIdentity() BEFORE honouring
    // rejectUnauthorized — returning undefined accepts the cert chain.
    checkServerIdentity: () => undefined,
  },
})

export const sendEmail = async ({ to, subject, html }: Mail.Options): Promise<void> => {
  const info = await transporter.sendMail({
    from: `"${env.emailSender}" <${env.emailSender}>`,  // RFC 5322: "Display Name" <address>
    to,
    subject,
    html,
  })
  console.log("Message Sent", info.messageId);
}