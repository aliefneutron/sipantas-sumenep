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
      let currentIndicator = null;
      
      for (let i = headerRowIndex + 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;
        
        const no = row[0];
        const textCol1 = row[1];
        const scaleVal = row[2];
        
        // If NO is a number, it's a main indicator
        if (no && !isNaN(parseInt(no)) && textCol1) {
          const cleanText = String(textCol1).replace(/\r?\n|\r/g, ' ').trim();
          currentIndicator = {
            no: parseInt(no),
            name: cleanText,
            skala: []
          };
          indicators.push(currentIndicator);
        } else if (!no && currentIndicator && textCol1) {
          // This might be a scale option
          const cleanText = String(textCol1).replace(/\r?\n|\r/g, ' ').trim();
          // Often the scale text starts with a letter like "a.", "b.", or just the condition
          // The scale value is in column index 2 (SKALA)
          let parsedScale = parseInt(scaleVal);
          if (!isNaN(parsedScale) && (parsedScale === 100 || parsedScale === 75 || parsedScale === 50 || parsedScale === 25 || parsedScale === 0)) {
             currentIndicator.skala.push({
               nilai: parsedScale,
               deskripsi: cleanText
             });
          } else if (cleanText.match(/^[a-e]\./i)) {
             // fallback if scaleVal is empty but text starts with a., b., c., d., e.
             let inferredVal = 0;
             if (cleanText.toLowerCase().startsWith('a.')) inferredVal = 100;
             else if (cleanText.toLowerCase().startsWith('b.')) inferredVal = 75;
             else if (cleanText.toLowerCase().startsWith('c.')) inferredVal = 50;
             else if (cleanText.toLowerCase().startsWith('d.')) inferredVal = 25;
             else if (cleanText.toLowerCase().startsWith('e.')) inferredVal = 0;
             
             currentIndicator.skala.push({
               nilai: inferredVal,
               deskripsi: cleanText
             });
          }
        }
      }
      
      result.push({
        sheet: sheetName,
        tatanan: String(tatananName).trim(),
        indicators: indicators
      });
    }
  });

  fs.writeFileSync('kriteria_with_scale.json', JSON.stringify(result, null, 2));
  console.log('Successfully wrote kriteria_with_scale.json');
} catch (e) {
  console.error(e);
}
