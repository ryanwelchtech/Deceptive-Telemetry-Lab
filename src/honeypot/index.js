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

    let forwardErr = null;
    try {
        await axios.post(collectorUrl, event, { timeout: 2000 });
    } catch (err) {
        forwardErr = err;
        // record forwarding error for diagnostics
        fs.appendFileSync('artifacts/honeypot_forward_errors.log', new Date().toISOString() + ' ' + (err && err.toString()) + '\n');
    }

    // If forwarding failed, return 502 so callers (tests/CI) can detect and retry
    if (forwardErr) {
        return res.status(502).json({ status: 'recorded', event, forward: 'failed', error: String(forwardErr) });
    }

    res.json({ status: 'recorded', event });
});

app.listen(port, () => console.log(`Honeypot listening on ${port}`));