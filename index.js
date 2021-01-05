/**
 * Starting point of application.
 * Creates the expressjs instance
 * Defines the HTTP API routes
 */

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");

const scraper = require("./src/scraper");

const app = express();

/**
 * Object for reCaptcha configuration
 * @type {Object}
 */
const reCaptchaConfig = {
  secret: "6LftxQkaAAAAAORw98jHn24SCHt_eiWsrZvtoM5d",
};

const urlencodedParser = bodyParser.urlencoded({ extended: false });

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

app.use(cors());
app.use(express.static("public")); // Serve static assets from public directory
app.use(morgan("combined"));

app.post("/", urlencodedParser, (req, res) => {
  // HTTP POST at /
  const url = new URL(req.body.SiteUrlToExport);
  req.body.SiteUrlToExport = url.hostname;
  scraper(req, res); // Call scraper function
});

app.post("/ext", urlencodedParser, (req, res)=>{
  const url = new URL(req.body.SiteUrlToExport);
  req.body.SiteUrlToExport = url.hostname;
  req.isExt=true;
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${req.body.SiteUrlToExport}.zip`
  );
  scraper(req, res); // Call scraper function
})

app.get("/redirect", (req, res) => {
  const { url } = req.query;
  console.log(url);
  res.redirect(url);
});

app.get("/download/:file", (req, res) => {
  const { file } = req.params;
  fs.access(path.join(__dirname, `download/zips/${file}`), (err) => {
    if (err) return res.status(404).sendFile(path.join(__dirname, "public/404.html"));
  });
  res.setHeader("Content-Disposition", `attachment; filename=${file}`);
  res.sendFile(path.join(__dirname, `download/zips/${file}`));
});


app.use((_, res) => res.status(404).sendFile(path.resolve("public/404.html")));

app.listen(process.env.PORT || 4000);
