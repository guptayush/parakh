/**
 * Parakh — Sign-up data → Google Sheet
 *
 * Setup:
 * 1. Open the target Google Sheet, copy its ID from the URL
 *    (https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit) into SHEET_ID below.
 * 2. Rename the first tab to "Signups" (or keep this name aligned with SHEET_NAME).
 * 3. Extensions → Apps Script. Replace the default code with this file. Save.
 * 4. In the function dropdown, pick `authorize` and click Run once — accept the
 *    permissions dialog. A "auth-test" row should land in the sheet.
 * 5. Deploy → New deployment → Type: Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Copy the Web app URL.
 * 6. In Parakh Mobile.html: <script>window.PARAKH_SHEET_URL = '...';</script>
 */

const SHEET_ID = '1Ftyimdl10bcpogGqXaYpwHBTNQ7ygsDK9Smud2JDbP4';
const SHEET_NAME = 'Signups';

function getSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Name', 'Country', 'Phone', 'Dial code']);
  }
  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    getSheet_().appendRow([
      new Date(),
      String(data.name || '').trim(),
      String(data.country || '').trim(),
      String(data.phone || '').replace(/\D/g, ''),
      String(data.dial || '').trim(),
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'Parakh signup endpoint live' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run this once from the editor to grant SpreadsheetApp permissions
// and verify the script can write to the sheet.
function authorize() {
  getSheet_().appendRow([new Date(), 'auth-test', '', '', '']);
}
