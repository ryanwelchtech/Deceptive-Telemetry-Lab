const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 8083;
const collectorUrl = process.env.COLLECTOR_URL || 'http://localhost:8084/ingest';

app.use(bodyParser.json());

app.get('/health', (req, res) => res.sendStatus(200));

// Example honeypot endpoint that forwards interaction to collector
app.post('/hit', async(req, res) => {
    const event = {
        timestamp: new Date().toISOString(),
        path: req.body.path || req.path,
        ua: req.body.ua || req.headers['user-agent'] || 'unknown',
        src_ip: req.ip
    };

    // write local copy
    fs.appendFileSync('artifacts/honeypot_events.log', JSON.stringify(event) + '\n');

    try {
        await axios.post(collectorUrl, event, { timeout: 2000 });
    } catch (err) {
        // Collector may be down in dev, ignore
    }

    res.json({ status: 'recorded', event });
});

app.listen(port, () => console.log(`Honeypot listening on ${port}`));