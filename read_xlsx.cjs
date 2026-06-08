const xlsx = require('xlsx');
const fs = require('fs');

try {
  const workbook = xlsx.readFile('instrumen KKS.xlsx');
  let output = '';
  workbook.SheetNames.forEach(sheetName => {
    output += `\n=== Sheet: ${sheetName} ===\n`;
    const sheet = workbook.Sheets[sheetName];
    output += xlsx.utils.sheet_to_csv(sheet).substring(0, 1000) + '\n';
  });
  fs.writeFileSync('xlsx_output.txt', output);
  console.log('Successfully read xlsx and wrote to xlsx_output.txt');
} catch (e) {
  console.error(e);
}
