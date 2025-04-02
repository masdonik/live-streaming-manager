const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const systemMonitor = require('./services/systemMonitorService');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Routes
app.use('/stream', require('./routes/streaming'));
app.use('/download', require('./routes/download'));

// System stats endpoint
app.get('/system-stats', async (req, res) => {
    try {
        const stats = await systemMonitor.getSystemStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mendapatkan statistik sistem' });
    }
});

// Root route
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Live Streaming Manager',
        path: '/',
        error: null,
        success: null
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});