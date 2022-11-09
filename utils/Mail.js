const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

console.log(process.env.MAIL_USER);
const transporter = nodemailer.createTransport({
  // host: "smtp.zoho.in",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      //extension name
      extName: ".handlebars",
      // layout path declare
      layoutsDir: "./views/",
      defaultLayout: false,
      helpers: {
        formatKey: function (str) {
          return str.replace(/_/g, " ");
        },
      },
      // express,
    },
    //View path declare
    viewPath: "./views",
    extName: ".handlebars",
  })
);
function sendPasswordMail(email, password, link) {
  transporter.sendMail(
    {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your account has been created",
      html: `Your account has been created with the following email and password \n Email: ${email} \n Password: ${password}
              <a href=${link}>Change password</a>`,
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

function sendDataVerificationMail(email, data, link) {
  transporter.sendMail(
    {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your application has been submitted",
      template: "verify",

      context: {
        data,
        link,
      },
    },
    (error, info) => {
      if (error) {
        throw error;
      }
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  );
}
module.exports = { sendPasswordMail, sendDataVerificationMail };
