import config from "./config";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
    },
});

export async function sendEmail(to: string, subject: string, html: string) {
    await transporter.sendMail({
        from: "Ecommerce Store Next",
        to,
        subject,
        html,
    });
}