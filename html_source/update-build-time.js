const fs = require('fs');

const buildTime = new Date().toISOString();
console.log('Build time:', buildTime);

const mainFilePath = 'src/main.ts';
let mainFileContent = fs.readFileSync(mainFilePath, 'utf8');

mainFileContent = mainFileContent.replace(/const buildTime = .*/, `const buildTime = '${buildTime}';`);

fs.writeFileSync(mainFilePath, mainFileContent);
