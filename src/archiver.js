const archiver = require("archiver");
const path = require("path");
const fs = require("fs");
const email = require("./email");

/**
 * This function implements the archival
 * @param {string} SiteUrlToExport
 * @param {*} res
 */
module.exports = (req, res) => {
  const { name, EMAIL, SiteUrlToExport } = req.body;
  var output = fs.createWriteStream(
    path.join(__dirname, `../download/zips/${SiteUrlToExport}.zip`)
  );
  var archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });

  output.on("close", function () {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "archiver has been finalized and the output file descriptor has closed."
    );
    email(
      name,
      EMAIL,
      `${SiteUrlToExport}.zip`,
      path.join(__dirname, `../download/zips/${SiteUrlToExport}.zip`)
    );
    res.redirect("/thanks.html");
  });

  output.on("end", function () {
    console.log("Data has been drained");
  });

  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      console.log(err);
    } else {
      console.log(err);
    }
  });
  archive.on("error", function (err) {
    console.log(err);
    res.status(500);
  });

  archive.pipe(output);

  archive.directory(
    path.join(__dirname, `../download/sites/${SiteUrlToExport}`),
    false
  );
  archive.file("ThankYou.pdf");
  archive.finalize();
};
