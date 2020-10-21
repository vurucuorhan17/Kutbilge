const express = require("express");
const router = express.Router();


router.post("/email", (req, res) => {

    let outputHTML = `
        <h2>Mail Details</h2>
        <ul>
            <li>İsim: ${req.body.name}</li>
            <li>Mail: ${req.body.email}</li>
            <li>Tel: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

    const nodemailer = require("nodemailer");

    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.NODEMAILER_AUTH_USER, // generated ethereal user
                pass: process.env.NODEMAILER_AUTH_PASS // generated ethereal password
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Kutbilge İletişim Formu" <>', // sender address
            to: `${process.env.NODEMAILER_AUTH_USER}`, // list of receivers
            subject: "Kutbilge İletişim Mesajı", // Subject line
            text: "Hello world?", // plain text body
            html: outputHTML // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    req.session.sessionFlash = {
        type: "alert alert-success",
        message: "Mesajınız başarılı bir şekilde gönderildi"
    };

    res.redirect("/about");

    main().catch(console.error);

});

module.exports = router;