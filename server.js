const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const express = require('express');
const app = express();

// Serve static files (CSS, JS, HTML) from project root
app.use(express.static(path.join(__dirname)));

// Serve main.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

// Preserve viewcount behavior on /count (returns JSON)
app.get('/count', (req, res) => {
    let count = 0;
    try {
        const raw = readFileSync('./viewcount.txt', 'utf8');
        count = parseInt(raw, 10) || 0;
    } catch (err) {
        count = 0;
    }

    const newCount = count + 1;
    writeFileSync('./viewcount.txt', String(newCount));

    res.json({ count: newCount });
});



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));

