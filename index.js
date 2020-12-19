/**
 * Starting point of application.
 * Creates the expressjs instance
 * Defines the HTTP API routes
 */


const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const morgan = require("morgan");
const mailchimp = require("mailchimp_transactional")(
  "58d0278a32c3b292f8543d8b35cb8934"
);

const scraper = require("./src/scraper");
const reCaptchaVerify = require("./src/reCaptchaVerify");

const app = express();

/**
 * Object for reCaptcha configuration
 * @type {Object}
 */
const reCaptchaConfig = {
  secret: "6LftxQkaAAAAAORw98jHn24SCHt_eiWsrZvtoM5d",
};

const urlencodedParser = bodyParser.urlencoded({ extended: false });

/**
 * Email configuration
 * 
 */
const mailOptions = {
  host: "mail.webcited.co",
  auth: {
    user: "dev@webcited.co",
    pass: "Teamwebcited",
  },
};

fs.access("./download", (err) => {
  // Check if downloads folder exists
  if (err) {
    const errHandler = (err) => {
      if (err) console.log(err);
    };
    fs.mkdir("./download/sites", { recursive: true }, errHandler); // If it doesn't, create them
    fs.mkdir("./download/zips", { recursive: true }, errHandler);
  }
});

app.use(express.static("public")); // Serve static assets from public directory
app.use(morgan("combined"));

app.post("/", urlencodedParser, (req, res) => {
  // HTTP POST at /

  let reCaptchaResult;
  reCaptchaVerify(reCaptchaConfig, req.body["g-recaptcha-response"]).then(
    (x) => {
      reCaptchaResult = x;
    }
  );

  console.log(reCaptchaResult);
  scraper(req, res); // Call scraper function
  
  
});

app.listen(4000);
