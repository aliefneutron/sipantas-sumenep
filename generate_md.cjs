const fs = require('fs');

const data = JSON.parse(fs.readFileSync('kriteria_with_scale.json', 'utf8'));

let md = '# Kriteria Indikator dan Skala Penilaian KKS\n\n';
md += 'Berikut adalah daftar lengkap indikator per tatanan beserta skala penilaian (100, 75, 50, 25, 0) berdasarkan ekstraksi dari file `instrumen KKS.xlsx`.\n\n';

data.forEach((sheetData, index) => {
  md += `## ${index + 1}. ${sheetData.tatanan}\n\n`;
  sheetData.indicators.forEach(ind => {
    md += `### ${ind.no}. ${ind.name}\n`;
    if (ind.skala && ind.skala.length > 0) {
      ind.skala.forEach(s => {
        md += `- **Skala ${s.nilai}**: ${s.deskripsi}\n`;
      });
    } else {
      md += `- *(Detail skala belum tercantum)*\n`;
    }
    md += '\n';
  });
});

fs.writeFileSync('kriteria_skala.md', md);
console.log('Successfully wrote kriteria_skala.md. Lines:', md.split('\n').length);
