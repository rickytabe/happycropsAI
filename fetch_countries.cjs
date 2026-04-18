const https = require('https');
const fs = require('fs');

https.get('https://restcountries.com/v3.1/all?fields=name,cca2', (res) => {
    let data = '';
    res.on('data', (d) => { data += d; });
    res.on('end', () => {
        let parsed = JSON.parse(data);
        let sorted = parsed.map(c => ({ name: c.name.common, code: c.cca2 })).sort((a,b) => a.name.localeCompare(b.name));
        fs.writeFileSync('src/lib/countries.ts', 'export const countries = ' + JSON.stringify(sorted, null, 2) + ';\n');
        console.log("Countries written!");
    });
});
