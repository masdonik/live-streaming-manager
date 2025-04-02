const si = require('systeminformation');

class SystemMonitorService {
    async getSystemStats() {
        try {
            const [cpu, mem, disk] = await Promise.all([
                si.currentLoad(),
                si.mem(),
                si.fsSize()
            ]);

            return {
                cpu: {
                    usage: Math.round(cpu.currentLoad),
                    cores: cpu.cpus.length
                },
                memory: {
                    total: this.formatBytes(mem.total),
                    used: this.formatBytes(mem.used),
                    free: this.formatBytes(mem.free),
                    usagePercent: Math.round((mem.used / mem.total) * 100)
                },
                disk: {
                    total: this.formatBytes(disk[0].size),
                    used: this.formatBytes(disk[0].used),
                    free: this.formatBytes(disk[0].available),
                    usagePercent: Math.round((disk[0].used / disk[0].size) * 100)
                }
            };
        } catch (error) {
            console.error('Error mendapatkan statistik sistem:', error);
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

module.exports = new SystemMonitorService();