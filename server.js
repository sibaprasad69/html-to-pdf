const express = require('express');
const fs = require('fs');
const http = require('http');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

// ✅ Serve only index.html and assets needed for the app (no demo.html, no logo.png)
app.use('/index.html', express.static(path.join(__dirname, 'index.html')));
app.use('/favicon.ico', (req, res) => res.status(404).end());

// Multer setup for file uploads (memory storage, no disk writes)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per file
});

// Serve the upload page at '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// PDF API URL (docker-compose service name)
const PDF_API_URL = process.env.PDF_API_URL || 'http://pdf-api:80';
const PDF_API_RENDER = PDF_API_URL + '/api/render';

app.post('/upload', upload.fields([
    { name: 'htmlFile', maxCount: 1 },
    { name: 'imageFiles', maxCount: 10 },
]), (req, res) => {
    if (!req.files || !req.files['htmlFile'] || req.files['htmlFile'].length === 0) {
        return res.status(400).send('No HTML file uploaded.');
    }
    let html = req.files['htmlFile'][0].buffer.toString('utf8');
    // Build a map of image file names to base64 data URLs
    const images = (req.files['imageFiles'] || []).reduce((acc, file) => {
        const ext = path.extname(file.originalname).slice(1);
        const mime = file.mimetype || `image/${ext}`;
        acc[file.originalname] = `data:${mime};base64,${file.buffer.toString('base64')}`;
        return acc;
    }, {});
    // Replace <img src="filename"> in HTML with data URLs
    html = html.replace(/<img([^>]+)src=["']([^"']+)["']([^>]*)>/gi, (match, pre, src, post) => {
        if (images[src]) {
            return `<img${pre}src="${images[src]}"${post}>`;
        }
        return match;
    });
    // Send modified HTML to PDF API
    const url = PDF_API_RENDER;
    console.log(`[PDF API] Sending request to ${url}`);
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/html' },
        body: html
    })
        .then(async pdfRes => {
            console.log(`[PDF API] Response status: ${pdfRes.status} ${pdfRes.statusText}`);
            if (!pdfRes.ok) {
                let errText = '';
                try { errText = await pdfRes.text(); } catch { }
                console.error(`[PDF API] Error response:`, errText);
                res.status(pdfRes.status).send('❌ Failed to generate PDF');
                return;
            }
            const arrayBuffer = await pdfRes.arrayBuffer();
            const pdfBuffer = Buffer.from(arrayBuffer);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');
            res.setHeader('Content-Length', pdfBuffer.length);
            res.end(pdfBuffer);
            console.log(`[PDF API] PDF sent to client (${pdfBuffer.length} bytes)`);
        })
        .catch(err => {
            console.error('[PDF API] Request failed:', err);
            res.status(500).send('Internal Server Error');
        });
});

// 
app.post('/preview', upload.fields([
    { name: 'htmlFile', maxCount: 1 },
    { name: 'imageFiles', maxCount: 10 },
]), (req, res) => {
    if (!req.files || !req.files['htmlFile'] || req.files['htmlFile'].length === 0) {
        return res.status(400).send('No HTML file uploaded.');
    }
    let html = req.files['htmlFile'][0].buffer.toString('utf8');
    // Build a map of image file names to base64 data URLs
    const images = (req.files['imageFiles'] || []).reduce((acc, file) => {
        const ext = path.extname(file.originalname).slice(1);
        const mime = file.mimetype || `image/${ext}`;
        acc[file.originalname] = `data:${mime};base64,${file.buffer.toString('base64')}`;
        return acc;
    }, {});
    // Replace <img src="filename"> in HTML with data URLs
    html = html.replace(/<img([^>]+)src=["']([^"']+)["']([^>]*)>/gi, (match, pre, src, post) => {
        if (images[src]) {
            return `<img${pre}src="${images[src]}"${post}>`;
        }
        return match;
    });
    // Wrap in a minimal HTML shell for preview
    res.send(`<!DOCTYPE html><html><head><meta charset='utf-8'><title>Preview</title><style>body{background:#f8f9fa;margin:0;padding:0;display:flex;justify-content:center;align-items:center;min-height:100vh;} .a4-preview{background:#fff;border:1px solid #e0e0e0;border-radius:8px;width:210mm;height:297mm;box-shadow:0 0 8px #e0e0e0;overflow:auto;padding:0.5em;} </style></head><body><div class='a4-preview'>${html}</div></body></html>`);
});

// Log project info and credits at startup
function logProjectInfo() {
    console.log('============================================================');
    console.log('HTML to PDF Converter (Dockerized & Open Source)');
    console.log('GitHub: https://github.com/abhisekmohantychinua/html-to-pdf-app');
    console.log('Author: Abhisek Mohanty');
    console.log('Portfolio: https://abhisekmohantychinua.github.io/mohantyabhisek.portfolio');
    console.log('LinkedIn: https://www.linkedin.com/in/abhisek-mohanty');
    console.log('For usage, see README.md in the repo or your local copy.');
    console.log('============================================================');
}

// On startup, check PDF API health before starting server, retry every 10s for up to 1 minute
async function checkPdfApiAndStart() {
    const maxAttempts = 6;
    let attempt = 0;
    while (attempt < maxAttempts) {
        attempt++;
        try {
            console.log(`[Startup] Checking PDF API health (attempt ${attempt}/${maxAttempts})...`);
            const resp = await fetch(PDF_API_URL);
            if (resp.ok || resp.status === 404) {
                console.log(`[Startup] PDF API is reachable. Starting server.`);
                app.listen(PORT, () => {
                    console.log(`🚀 Server running at http://localhost:${PORT}`);
                    console.log(`🌐 App: http://localhost:${PORT}/`);
                });
                return;
            } else {
                console.error(`[Startup] PDF API not healthy: ${resp.status} ${resp.statusText}`);
            }
        } catch (err) {
            console.error(`[Startup] Could not connect to PDF API: ${err.message}`);
        }
        if (attempt < maxAttempts) {
            console.log(`[Startup] Retrying in 10 seconds...`);
            await new Promise(res => setTimeout(res, 10000));
        }
    }
    console.error(`[Startup] ❌ PDF API not reachable after 1 minute. Exiting.`);
    process.exit(1);
}
logProjectInfo();
checkPdfApiAndStart();
