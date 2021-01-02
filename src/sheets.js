const { GoogleSpreadsheet } = require("google-spreadsheet");
const path = require("path");
const fs = require("fs");

const spreadsheetId = process.env.SHEET;

const doc = new GoogleSpreadsheet(spreadsheetId);
let firstSheet;
(async function () {
  await doc.useServiceAccountAuth(process.env.CREDS);
  await doc.loadInfo();
  firstSheet = doc.sheetsByIndex[0];
})();

module.exports = async (req) => {
  const { name, EMAIL, SiteUrlToExport, Status } = req.body;

  await firstSheet.addRow({
    Name: name,
    Email: `=HYPERLINK("mailto:${EMAIL}","${EMAIL}")`,
    Website: SiteUrlToExport,
    ExportedAt: "=NOW()",
    Status: Status,
  });
};
