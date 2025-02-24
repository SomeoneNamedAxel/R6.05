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

    async sendWelcomeEmail(to, name) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
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

    async sendNewMovieEmail(movieTitle) {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT,
                    secure: false,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASSWORD
                    }
                });

                const users = await this.server.services().userService.getAllUsers();

                for (const user of users) {
                    const info = await transporter.sendMail({
                        from: `"Support" <${process.env.SMTP_USER}>`,
                        to: user.email,
                        subject: "New Movie Added!",
                        text: `Hi ${user.firstName},\n\nA new movie titled "${movieTitle}" has been added to our collection.`,
                        html: `<p>Hi <strong>${user.firstName}</strong>,</p><p>A new movie titled "<strong>${movieTitle}</strong>" has been added to our collection.</p>`
                    });
                    console.log("Email sent to:", user.email, "Message ID:", info.messageId);
                }
            } catch (error) {
                console.error("An error occurred upon sending the email: ", error);
            }
        }

    async sendUpdatedMovieEmail(movieId, movieTitle) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                }
            });

            const users = await this.server.services().userService.getUsersFromFavoriteMovie(movieId);

            for (const user of users) {
                const info = await transporter.sendMail({
                    from: `"Support" <${process.env.SMTP_USER}>`,
                    to: user.email,
                    subject: "Modified Movie!",
                    text: `Hi ${user.firstName},\n\nThe movie titled "${movieTitle}" has been updated.`,
                    html: `<p>Hi <strong>${user.firstName}</strong>,</p><p>The movie titled "<strong>${movieTitle}</strong>" has been updated.</p>`
                });
                console.log("Email sent to:", user.email, "Message ID:", info.messageId);
            }
        } catch (error) {
            console.error("An error occurred upon sending the email: ", error);
        }
    }
};
