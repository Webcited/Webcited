const archiver = require("./archiver");
const exec = require("child_process").exec;
const fs = require("fs");
const path = require("path");
const sheets = require("./sheets");

/**
 * This function implements the web scraper feature
 * @param {*} req
 * @param {*} res
 */
module.exports = (req, res) => {
  let requrl = req.body.SiteUrlToExport;
  sheets(req).catch((e) => console.log(e));

  fs.access(`./download/zips/${requrl}.zip`, (err) => {
    // Check if zip of the requested site already exists, if it does send the existing one
    if (err) {
      const child = exec(`cd download/sites && wget -mkEpnpH ${requrl}`); // Download the site files to download/sites/example.com
      child.stderr.on("close", () => {
        const copy = exec(`cp ThankYou.pdf download/sites/${requrl}`);
        copy.stderr.on(
          "close",
          () => archiver(requrl, res) // Called archiver function to make zip file
        );
      });
    } else {
      res.sendFile(path.resolve(`download/zips/${requrl}.zip`));
    }
  });
};
