import fs from 'fs';
try {
    fs.writeFileSync('alive.txt', 'yes');
    console.log('File written');
} catch (e) {
    console.error(e);
}
