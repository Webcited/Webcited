const express = require("express");
const bodyParser = require("body-parser");
const scraper = require("./src/scraper");
const fs = require("fs");
const nodemailer = require("nodemailer");
const app = express();

const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Email configuration
const mailOptions = {
  host: "smtp.webcited.co",
  port: 587,
  secure: false,
  auth: {
    user: "username",
    pass: "password",
  },
};
const transporter = nodemailer.createTransport(mailOptions);

fs.access("./download", (err) => { // Check if downloads folder exists
  if (err) {
    const errHandler = (err) => {
      if (err) console.log(err);
    };
    fs.mkdir("./download/sites", { recursive: true }, errHandler); // If it doesn't, create them
    fs.mkdir("./download/zips", { recursive: true }, errHandler);
  }
});

app.use(express.static("public")); // Serve static assets from public directory

app.post("/", urlencodedParser, (req, res) => { // HTTP POST at /

  scraper(req, res); // Call scraper function

  // Create the email
  let message = {
    from: "sender@webcited.co",
    to: "squad@webcited.co",
    subject: "Submission recieved",
    text: `name: ${req.body.name},
    email: ${req.body.EMAIL},
    Site URL: ${req.body.SiteUrlToExport},
    Status: ${req.body.Status}`,
  };
  transporter.sendMail(message).catch((err) => console.log(err)); // Send email
});

app.listen(4000);
