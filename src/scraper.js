const archiver = require("./archiver");
const exec = require("child_process").exec;
const fs = require("fs");
const path = require("path");
const sheets = require("./sheets");
const email = require("./email");

/**
 * This function implements the web scraper feature
 * @param {*} req
 * @param {*} res
 */
module.exports = (req, res) => {
  const { name, EMAIL, SiteUrlToExport } = req.body;
  sheets(req).catch((e) => console.log(e));

  fs.access(
    path.join(__dirname, `../download/zips/${SiteUrlToExport}.zip`),
    (err) => {
      // Check if zip of the requested site already exists, if it does send the existing one
      if (err) {
        const child = exec(
          `cd download/sites && wget -D uploads-ssl.webflow.com -HrmkEpnp  ${SiteUrlToExport}`
        ); // Download the site files to download/sites/example.com
        child.stderr.on("close", () => {
          archiver(req, res);
        });
      } else {
        email(
          name,
          EMAIL,
          `${SiteUrlToExport}.zip`,
          path.join(__dirname, `../download/zips/${SiteUrlToExport}.zip`)
        );
        res.redirect("/thanks.html");
      }
    }
  );
};
