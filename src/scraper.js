const archiver = require("./archiver");
const exec = require("child_process").exec;
const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  let requrl = req.body.SiteUrlToExport;
  fs.access(`./download/zips/${requrl}.zip`, (err) => {
    if (err) {
      const child = exec(`cd download/sites && wget -mkEpnp ${requrl}`);
      child.stderr.on("close", (response) => {
        archiver(requrl, res);
      });
    } else {
      res.sendFile(path.resolve(`download/zips/${requrl}.zip`));
    }
  });
};
