const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    // user: "vjmgcs@gmail.com",
    // pass: "vexgyutbrkvmfikq",
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
      template: "password",
      context: {
        password,
        link,
        email,
      },
    },
    (error, info) => {
      if (error) {
        throw error;
      }
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
    }
  );
}
function sendErrorEmail(email, error) {
  transporter.sendMail(
    {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Error occured on VJM",
      html: `<h1>Error occured on VJM</h1>
      <p>${error}</p>`,
    },
    (error, info) => {
      if (error) {
        throw error;
      }
    }
  );
}
function sendPasswordResetMail(email, link) {
  transporter.sendMail(
    {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password reset",
      template: "forgot",
      context: {
        link,
        email,
      },
    },
    (error, info) => {
      if (error) {
        throw error;
      }
    }
  );
}

function sendStudentCreatedMail(email) {
  transporter.sendMail(
    {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Account verified",
      template: "student-created",
      context: {
        FRONTEND_URL: process.env.FRONTEND_URL,
      },
    },
    (error, info) => {
      if (error) {
        throw error;
      }
    }
  );
}
module.exports = {
  sendPasswordMail,
  sendDataVerificationMail,
  sendErrorEmail,
  sendPasswordResetMail,
  sendStudentCreatedMail,
};
