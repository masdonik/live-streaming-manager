const express = require('express');
const router = express.Router();
const googleDriveService = require('../services/googleDriveService');

// Halaman download
router.get('/', async (req, res) => {
    try {
        const videos = await googleDriveService.listVideos();
        res.render('download', { 
            videos,
            error: req.query.error,
            success: req.query.success
        });
    } catch (error) {
        console.error('Error pada halaman download:', error);
        res.status(500).render('download', { 
            videos: [],
            error: 'Gagal memuat daftar video',
            success: null
        });
    }
});

// Download video baru
router.post('/video', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.redirect('/download?error=URL harus diisi');
        }

        await googleDriveService.downloadVideo(url);
        res.redirect('/download?success=Video berhasil didownload');
    } catch (error) {
        console.error('Error downloading video:', error);
        res.redirect('/download?error=' + encodeURIComponent(error.message));
    }
});

// Rename video
router.post('/rename', async (req, res) => {
    try {
        const { oldName, newName } = req.body;
        
        if (!oldName || !newName) {
            return res.status(400).json({ 
                error: 'Nama lama dan nama baru harus diisi' 
            });
        }

        await googleDriveService.renameVideo(oldName, newName);
        res.json({ success: true });
    } catch (error) {
        console.error('Error renaming video:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete video
router.post('/delete', async (req, res) => {
    try {
        const { fileName } = req.body;
        
        if (!fileName) {
            return res.status(400).json({ 
                error: 'Nama file harus diisi' 
            });
        }

        await googleDriveService.deleteVideo(fileName);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;