const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const htmlToText = require("nodemailer-html-to-text").htmlToText;

const emailBody = fs.readFileSync(path.join(__dirname, "../assets/email.html"));

/**
 * Email configuration
 *
 */
const mailOptions = {
  ...JSON.parse(process.env.MAIL),
  logger: true,
};

const mailOptions2 = {
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "4d4546f4381d35",
    pass: "578018a5625c4f",
  },
  logger: true,
};

const transporter = nodemailer.createTransport(mailOptions);
transporter.use("compile", htmlToText());

module.exports = (name, mailTo, filename, filepath) => {
  transporter
    .sendMail({
      from: {
        name: "Pravin K Singh from Webcited.co",
        address: "squad@webcited.co",
      },
      to: {
        name,
        address: mailTo,
      },
      subject: `Thank You ${name} for using Webcited.co, your exported site is ready.`,
      html: emailBody.toString().replace("${*namehere*}", name).replace(
        "${*filelink*}",
        `<div align="center" class="button-container"
          style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;"><a
            href="https://webcited.herokuapp.com/download/${filename}"
            style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #000000; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width: auto; width: auto; border-top: 1px solid #000000; border-right: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; padding-top: 5px; padding-bottom: 5px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;"
            target="_blank"><span
              style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span
                style="font-size: 16px; line-height: 2; word-break: break-word; font-family: Montserrat, 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 32px;"><u>
                Download</u></span></span></a></div>`
      ),
      attachments: [
        {
          filename: "giphy.gif",
          path: path.join(__dirname, "../assets/giphy.gif"),
          cid: "gif",
        },
        {
          filename: "800.png",
          path: path.join(__dirname, "../assets/800.png"),
          cid: "logo",
        },
      ],
      list: {
        help: "squad@webcited.co?subject=Help",
        unsubscribe: {
          url: "https://webcited.co/",
          comment: "Unsubscribe",
        },
        subscribe: [
          "squad@webcited.co?subject=subscribe",
          {
            url: "https://webcited.co/thanks.html",
            comment: "Subscribe",
          },
        ],
      },
      dsn: {
        id: `${name} <${mailTo}>`,
        return: "headers",
        notify: ["success", "failure", "delay"],
        recipient: "squad@webcited.co",
      },
    })
    .catch((e) => console.log(e));
};
