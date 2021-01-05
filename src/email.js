const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

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
      text: `Hello ${name} 👋
We Are From Webcited - Sorry to take your time, But we are here to deliver something really amazing to you.

Your Webflow Site Code 😄
      
Your webflow site code file is in attachment


Want To Host This Code On Own Custom Domain & Hosting?

If you want to host this webflow code, Then we can help you for free, Try our Webflow Code Managed Hosting, Were we manage everything for you + you get unlimited form submissions & you can add up-to 8 pages at webcited.co


Happy with our work? Want To Say Thanks?

Well now you are our mate, bro

We need to pay rent of server's, dev's & domain rewenal

Please donate and help us, We need that $

https://webcited.co/redirect?utm_term=file+download&utm_medium=website&utm_source=file-download&utm_content=Download+File&utm_campaign=download-KPI&url=https%3A%2F%2Fwww.buymeacoffee.com%2Fwebcited%3Futm_term%3Dfile%2Bdownload%26utm_medium%3Dwebsite%26utm_source%3Dfile-download%26utm_content%3DDownload%2BFile%26utm_campaign%3Ddownload-KPI



Your Feedback is fuel to us

Please give us freedom & feedback to grow

Mail: Jerryatbusiness@gmail.com

https://webcited.co/redirect?utm_term=file+download&utm_medium=website&utm_source=file-download&utm_content=Download+File&utm_campaign=download-KPI&url=https%3A%2F%2Ftally.so%2Fr%2FemJbRm%3Futm_term%3Dfile%2Bdownload%26utm_medium%3Dwebsite%26utm_source%3Dfile-download%26utm_content%3DDownload%2BFile%26utm_campaign%3Ddownload-KPI


Webcited

Pushing No-code With code ⚡

© From India 2021
`,
      html: emailBody.toString().replace("${*namehere*}", name),
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
        {
          filename: filename,
          filePath: filepath,
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
