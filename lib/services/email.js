require('dotenv').config();
const nodemailer = require('nodemailer');
const { Service } = require("@hapipal/schmervice");

module.exports = class EmailService extends Service {
    static get name() {
        return 'emailService';
    }

    constructor(server, options) {
        super(server, options);
    }

    async sendWelcomeEmail(to, name, password) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: false,
                auth: {
                    user: to,
                    pass: password
                }
            });
            const info = await transporter.sendMail({
                from: `"Support" <${process.env.SMTP_USER}>`,
                to,
                subject: "Welcome to our app!",
                text: `Hi ${name},\n\nWelcome to our application !`,
                html: `<p>Hi <strong>${name}</strong>,</p><p>Welcome to our application !</p>`
            });
            console.log("Email sent: ", info.messageId);
        } catch (error) {
            console.error("An error occurred upon sending the email: ", error);
        }
    }
};
