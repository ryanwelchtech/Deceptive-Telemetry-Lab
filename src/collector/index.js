const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const port = 8084;
app.use(bodyParser.json());

const artifactsDir = 'artifacts';
if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir);

app.get('/health', (req, res) => res.sendStatus(200));

// Ingest events from honeypot
app.post('/ingest', (req, res) => {
    const event = req.body;
    event.received_at = new Date().toISOString();
    event.id = Math.random().toString(36).substring(2, 10);

    // Apply simple rules
    event.severity = evaluateSeverity(event);

    // Append to events log
    fs.appendFileSync(`${artifactsDir}/events.log`, JSON.stringify(event) + '\n');

    // Generate/append report CSV
    const csvWriter = createCsvWriter({
        path: `${artifactsDir}/report.csv`,
        header: [
            { id: 'id', title: 'id' },
            { id: 'path', title: 'path' },
            { id: 'ua', title: 'ua' },
            { id: 'severity', title: 'severity' },
            { id: 'received_at', title: 'received_at' }
        ],
        append: fs.existsSync(`${artifactsDir}/report.csv`)
    });

    csvWriter.writeRecords([event]).then(() => {
        // no-op
    });

    res.json({ status: 'ingested', id: event.id, severity: event.severity });
});

app.get('/reports', (req, res) => {
    const log = fs.existsSync(`${artifactsDir}/events.log`) ? fs.readFileSync(`${artifactsDir}/events.log`, 'utf8') : '';
    res.type('application/json');
    res.send('[' + log.split('\n').filter(Boolean).join(',') + ']');
});

function evaluateSeverity(event) {
    // deterministic heuristics (example):
    const pathRisk = ['/admin', '/wp-login.php', '/phpinfo.php'].includes(event.path) ? 2 : 0;
    const uaRisk = /scanner|nmap|nessus|curl/i.test(event.ua) ? 2 : 0;
    const score = pathRisk + uaRisk;
    if (score >= 3) return 'HIGH';
    if (score === 2) return 'MEDIUM';
    return 'LOW';
}

app.listen(port, () => console.log(`Collector listening on ${port}`));

// Export functions for unit tests
module.exports = { evaluateSeverity };