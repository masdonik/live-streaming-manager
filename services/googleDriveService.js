const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');
const stat = promisify(fs.stat);

class GoogleDriveService {
    constructor() {
        this.videosDir = path.join(__dirname, '..', 'videos');
        // Pastikan direktori videos ada
        if (!fs.existsSync(this.videosDir)) {
            fs.mkdirSync(this.videosDir, { recursive: true });
        }
    }

    async downloadVideo(url) {
        try {
            // Extract file ID dari URL Google Drive
            const fileId = this.extractFileId(url);
            if (!fileId) {
                throw new Error('URL Google Drive tidak valid');
            }

            // Buat URL download langsung
            const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
            
            // Generate nama file unik
            const fileName = `video_${Date.now()}.mp4`;
            const filePath = path.join(this.videosDir, fileName);

            // Download file
            await this.downloadFile(downloadUrl, filePath);

            // Dapatkan informasi file
            const stats = await stat(filePath);

            return {
                name: fileName,
                size: this.formatBytes(stats.size),
                path: filePath,
                downloadDate: new Date()
            };
        } catch (error) {
            console.error('Error downloading video:', error);
            throw error;
        }
    }

    extractFileId(url) {
        const pattern = /[-\w]{25,}/;
        const match = url.match(pattern);
        return match ? match[0] : null;
    }

    downloadFile(url, destination) {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(destination);

            https.get(url, (response) => {
                if (response.statusCode === 302 || response.statusCode === 301) {
                    // Handle redirect
                    this.downloadFile(response.headers.location, destination)
                        .then(resolve)
                        .catch(reject);
                    return;
                }

                response.pipe(file);

                file.on('finish', () => {
                    file.close();
                    resolve();
                });

                file.on('error', (err) => {
                    fs.unlink(destination, () => reject(err));
                });
            }).on('error', (err) => {
                fs.unlink(destination, () => reject(err));
            });
        });
    }

    async listVideos() {
        try {
            const files = await fs.promises.readdir(this.videosDir);
            const videosList = await Promise.all(
                files.map(async (file) => {
                    const filePath = path.join(this.videosDir, file);
                    const stats = await stat(filePath);
                    return {
                        name: file,
                        size: this.formatBytes(stats.size),
                        downloadDate: stats.mtime
                    };
                })
            );
            return videosList;
        } catch (error) {
            console.error('Error listing videos:', error);
            throw error;
        }
    }

    async renameVideo(oldName, newName) {
        try {
            const oldPath = path.join(this.videosDir, oldName);
            const newPath = path.join(this.videosDir, newName);

            if (!fs.existsSync(oldPath)) {
                throw new Error('File video tidak ditemukan');
            }

            await fs.promises.rename(oldPath, newPath);
            return true;
        } catch (error) {
            console.error('Error renaming video:', error);
            throw error;
        }
    }

    async deleteVideo(fileName) {
        try {
            const filePath = path.join(this.videosDir, fileName);
            
            if (!fs.existsSync(filePath)) {
                throw new Error('File video tidak ditemukan');
            }

            await fs.promises.unlink(filePath);
            return true;
        } catch (error) {
            console.error('Error deleting video:', error);
            throw error;
        }
    }

    formatBytes(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
    }
}

module.exports = new GoogleDriveService();