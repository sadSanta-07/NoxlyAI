const fs = require('fs');
const https = require('https');

const env = fs.readFileSync('.env', 'utf8');
const apiKeyMatch = env.match(/GEMINI_API_KEY=(.*)/);
if (!apiKeyMatch) {
    console.error('GEMINI_API_KEY not found in .env');
    process.exit(1);
}
const apiKey = apiKeyMatch[1].trim();

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const models = json.models.filter(m => m.name.includes('flash') || m.name.includes('pro'));
            console.log(models.map(m => m.name));
        } catch (e) {
            console.error('Failed to parse response:', data);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
