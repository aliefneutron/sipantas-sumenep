const xlsx = require('xlsx');
const fs = require('fs');

try {
  const workbook = xlsx.readFile('instrumen KKS.xlsx');
  const tatananSheets = [
    '1 Sehat Mandiri',
    '2 Perkim dan Fasum',
    '3 Satuan Pendidikan',
    '4 Pasar',
    '5 Perkantoran dan Perindustrian',
    '6 Pariwisata',
    '7 Transportasi dan Tertib Lalin',
    '8 Sosial',
    '9 Penanggulangan Bencana'
  ];

  const result = [];

  tatananSheets.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return;
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
    // Find the header row
    let headerRowIndex = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i] && data[i][0] === 'NO') {
        headerRowIndex = i;
        break;
      }
    }

    if (headerRowIndex !== -1) {
      const tatananName = data[headerRowIndex][1];
      const indicators = [];
      
      for (let i = headerRowIndex + 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;
        
        const no = row[0];
        const indicatorText = row[1];
        
        // If NO is a number, it's a main indicator
        if (no && !isNaN(parseInt(no)) && indicatorText) {
          // Remove newlines and trim
          const cleanText = String(indicatorText).replace(/\r?\n|\r/g, ' ').trim();
          indicators.push({
            no: parseInt(no),
            name: cleanText
          });
        }
      }
      
      result.push({
        sheet: sheetName,
        tatanan: String(tatananName).trim(),
        indicators: indicators
      });
    }
  });

  fs.writeFileSync('kriteria.json', JSON.stringify(result, null, 2));
  console.log('Successfully wrote kriteria.json');
} catch (e) {
  console.error(e);
}
