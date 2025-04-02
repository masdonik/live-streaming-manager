const { spawn } = require('child_process');
const path = require('path');

class FFmpegService {
    constructor() {
        this.activeStreams = new Map(); // Menyimpan proses streaming yang aktif
    }

    startStreaming(options) {
        const {
            videoPath,
            platform,
            streamKey,
            duration = 0 // 0 berarti streaming tanpa batas/loop
        } = options;

        // Validasi input
        if (!videoPath || !platform || !streamKey) {
            throw new Error('Video path, platform, dan stream key harus diisi');
        }

        const streamUrl = this.getStreamUrl(platform, streamKey);
        const fullVideoPath = path.join(__dirname, '..', 'videos', videoPath);
        
        // Command FFmpeg untuk streaming tanpa encoding
        const ffmpegArgs = [
            '-re',                // Read input at native frame rate
            '-stream_loop', '-1', // Loop video jika duration tidak diset
            '-i', fullVideoPath,  // Input file
            '-c', 'copy',         // Copy codec (no re-encoding)
            '-f', 'flv',          // Format output
            streamUrl             // Output URL
        ];

        // Spawn proses FFmpeg
        const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);
        const streamId = Date.now().toString();

        // Simpan informasi stream
        const streamInfo = {
            process: ffmpegProcess,
            startTime: new Date(),
            videoName: path.basename(videoPath),
            platform,
            duration
        };

        this.activeStreams.set(streamId, streamInfo);

        // Handle stdout & stderr
        ffmpegProcess.stdout.on('data', (data) => {
            console.log(`FFmpeg stdout: ${data}`);
        });

        ffmpegProcess.stderr.on('data', (data) => {
            console.error(`FFmpeg stderr: ${data}`);
        });

        // Handle process exit
        ffmpegProcess.on('close', (code) => {
            console.log(`FFmpeg process exited with code ${code}`);
            this.activeStreams.delete(streamId);
        });

        // Jika duration diset, hentikan streaming setelah waktu yang ditentukan
        if (duration > 0) {
            setTimeout(() => {
                this.stopStreaming(streamId);
            }, duration * 60 * 1000); // Konversi menit ke milidetik
        }

        return {
            streamId,
            startTime: streamInfo.startTime,
            videoName: streamInfo.videoName,
            platform
        };
    }

    stopStreaming(streamId) {
        const streamInfo = this.activeStreams.get(streamId);
        if (streamInfo) {
            streamInfo.process.kill('SIGTERM');
            this.activeStreams.delete(streamId);
            return true;
        }
        return false;
    }

    getActiveStreams() {
        const streams = [];
        for (const [streamId, info] of this.activeStreams) {
            streams.push({
                streamId,
                videoName: info.videoName,
                platform: info.platform,
                startTime: info.startTime
            });
        }
        return streams;
    }

    getStreamUrl(platform, streamKey) {
        switch (platform.toLowerCase()) {
            case 'facebook':
                return `rtmps://live-api-s.facebook.com:443/rtmp/${streamKey}`;
            case 'youtube':
                return `rtmp://a.rtmp.youtube.com/live2/${streamKey}`;
            default:
                throw new Error('Platform tidak didukung');
        }
    }
}

module.exports = new FFmpegService();