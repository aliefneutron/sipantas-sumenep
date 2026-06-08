const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('kriteria_with_scale.json', 'utf8'));

  let tsContent = 'export const INITIAL_TATANAN_STRUCTURE = [\n';

  data.forEach((sheetData, index) => {
    tsContent += `  {\n`;
    tsContent += `    id: 'tatanan-${index + 1}',\n`;
    tsContent += `    name: ${JSON.stringify(sheetData.tatanan)},\n`;
    tsContent += `    indicators: [\n`;
    
    sheetData.indicators.forEach((ind, iIndex) => {
      tsContent += `      { id: 't${index + 1}-i${iIndex + 1}', question: ${JSON.stringify(ind.name)} }${iIndex === sheetData.indicators.length - 1 ? '' : ','}\n`;
    });
    
    tsContent += `    ]\n`;
    tsContent += `  }${index === data.length - 1 ? '' : ','}\n`;
  });

  tsContent += '];\n';

  let typesFile = fs.readFileSync('src/types.ts', 'utf8');
  
  // Replace the block from export const INITIAL_TATANAN_STRUCTURE = [ ... ];
  const regex = /export const INITIAL_TATANAN_STRUCTURE = \[\s*\{[\s\S]*\}\s*\];/;
  typesFile = typesFile.replace(regex, tsContent);
  
  fs.writeFileSync('src/types.ts', typesFile);
  console.log('Successfully updated src/types.ts');
} catch(e) {
  console.error(e);
}
