const express = require('express');
const router = express.Router();
const ffmpegService = require('../services/ffmpegService');
const googleDriveService = require('../services/googleDriveService');

// Halaman streaming
router.get('/', async (req, res) => {
    try {
        const videos = await googleDriveService.listVideos();
        const activeStreams = ffmpegService.getActiveStreams();
        res.render('streaming', { 
            videos,
            activeStreams,
            error: req.query.error
        });
    } catch (error) {
        console.error('Error pada halaman streaming:', error);
        res.status(500).render('streaming', { 
            videos: [],
            activeStreams: [],
            error: 'Gagal memuat data'
        });
    }
});

// Memulai streaming baru
router.post('/start', async (req, res) => {
    try {
        const { videoPath, platform, streamKey, duration } = req.body;
        
        // Validasi input
        if (!videoPath || !platform || !streamKey) {
            return res.redirect('/stream?error=Semua field harus diisi');
        }

        const streamInfo = ffmpegService.startStreaming({
            videoPath,
            platform,
            streamKey,
            duration: parseInt(duration) || 0
        });

        res.redirect('/stream');
    } catch (error) {
        console.error('Error memulai streaming:', error);
        res.redirect('/stream?error=' + encodeURIComponent(error.message));
    }
});

// Menghentikan streaming
router.post('/stop', (req, res) => {
    try {
        const { streamId } = req.body;
        const success = ffmpegService.stopStreaming(streamId);
        
        if (!success) {
            return res.status(404).json({ error: 'Stream tidak ditemukan' });
        }
        
        res.redirect('/stream');
    } catch (error) {
        console.error('Error menghentikan streaming:', error);
        res.status(500).json({ error: error.message });
    }
});

// Mendapatkan daftar streaming aktif
router.get('/active', (req, res) => {
    try {
        const activeStreams = ffmpegService.getActiveStreams();
        res.json(activeStreams);
    } catch (error) {
        console.error('Error mendapatkan daftar streaming aktif:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;