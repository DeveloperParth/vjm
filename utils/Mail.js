const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

function sendPasswordMail(email, password) {
  transporter.sendMail(
    {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your account has been created",
      html: `Your account has been created with the following email and password \n Email: ${email} \n Password: ${password}`,
    },
    (error, info) => {
      if (error) {
        throw error;
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  );
}

function sendDataVerificationMail(email, link) {
  transporter.sendMail(
    {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your application has been submitted",
      html: `Your application has been submitted please verify via clicking the link <a href=${link}>Verify</a>`,
    },
    (error, info) => {
      if (error) {
        throw error;
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  );
}
module.exports = { sendPasswordMail, sendDataVerificationMail };
