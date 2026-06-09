const xlsx = require('xlsx');
const fs = require('fs');

try {
  const workbook = xlsx.readFile('Instrumen KKS 2025.xlsx');
  const tatananSheets = [
    'Tatanan 1 Sehat Mandiri',
    'Tatanan 2 Perkim',
    'Tatanan 3  Pendidikan',
    'Tatanan 4 Pasar',
    'Tatanan 5 Perkantoran & Perindu',
    'Tatanan 6 Pariwisata ',
    'Tatanan 7 Lalin',
    'Tatanan 8 Perlindungan Sosial',
    'Tatanan 9 Penanggulangan Bencan'
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
        const penilaianVal = row[5];
        
        // If NO is a number, it's a main indicator
        if (no && !isNaN(parseInt(no)) && textCol1) {
          const cleanText = String(textCol1).replace(/\r?\n|\r/g, ' ').trim();
          currentIndicator = {
            no: parseInt(no),
            name: cleanText,
            definisiOperasional: row[2] ? String(row[2]).replace(/\r?\n|\r/g, ' ').trim() : undefined,
            sumberData: row[3] ? String(row[3]).replace(/\r?\n|\r/g, ' ').trim() : undefined,
            buktiDukung: row[4] ? String(row[4]).replace(/\r?\n|\r/g, ' ').trim() : undefined,
            skala: []
          };
          
          if (penilaianVal) {
            const lines = String(penilaianVal).split('\n');
            lines.forEach(line => {
               line = line.trim();
               if (line.match(/^[0-9]+\./) || line.toLowerCase().includes('nilai')) {
                  let nilaiMatch = line.match(/(?:[nN]ilai)\s*([0-9]+)/);
                  let nilai = 0;
                  if (nilaiMatch && !isNaN(parseInt(nilaiMatch[1]))) {
                     nilai = parseInt(nilaiMatch[1]);
                  } else if (line.match(/^[0-9]\.\s*Nilai\s*([0-9]+)/i)) {
                     nilai = parseInt(line.match(/^[0-9]\.\s*Nilai\s*([0-9]+)/i)[1]);
                  } else if (line.toLowerCase().startsWith('a.')) nilai = 100;
                  else if (line.toLowerCase().startsWith('b.')) nilai = 75;
                  else if (line.toLowerCase().startsWith('c.')) nilai = 50;
                  else if (line.toLowerCase().startsWith('d.')) nilai = 25;
                  
                  if (nilai > 0 || line.toLowerCase().includes('nilai 0')) {
                     currentIndicator.skala.push({
                        nilai: nilai,
                        deskripsi: line.replace(/^[0-9]+\.\s*/, '').trim()
                     });
                  }
               }
            });
          }
          
          indicators.push(currentIndicator);
        }
      }
      
      result.push({
        sheet: sheetName,
        tatanan: String(tatananName).trim(),
        indicators: indicators
      });
    }
  });

  fs.writeFileSync('kriteria_2025_with_scale.json', JSON.stringify(result, null, 2));
  console.log('Successfully wrote kriteria_2025_with_scale.json');
} catch (e) {
  console.error(e);
}
