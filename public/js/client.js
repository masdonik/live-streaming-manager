// Fungsi untuk memformat waktu
function formatDateTime(date) {
    return new Date(date).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Update statistik sistem
function updateSystemStats() {
    fetch('/system-stats')
        .then(response => response.json())
        .then(stats => {
            document.getElementById('cpu-usage').textContent = `${stats.cpu.usage}%`;
            document.getElementById('memory-usage').textContent = `${stats.memory.usagePercent}% (${stats.memory.used}/${stats.memory.total})`;
            document.getElementById('disk-usage').textContent = `${stats.disk.usagePercent}% (${stats.disk.used}/${stats.disk.total})`;
        })
        .catch(error => console.error('Error updating system stats:', error));
}

// Update daftar streaming aktif
function updateActiveStreams() {
    fetch('/stream/active')
        .then(response => response.json())
        .then(streams => {
            const tableBody = document.getElementById('active-streams-body');
            if (!tableBody) return;

            tableBody.innerHTML = streams.map(stream => `
                <tr>
                    <td>${stream.videoName}</td>
                    <td>${stream.platform}</td>
                    <td>${formatDateTime(stream.startTime)}</td>
                    <td>
                        <form action="/stream/stop" method="POST" style="display: inline;">
                            <input type="hidden" name="streamId" value="${stream.streamId}">
                            <button type="submit" class="btn btn-danger">Stop</button>
                        </form>
                    </td>
                </tr>
            `).join('');
        })
        .catch(error => console.error('Error updating active streams:', error));
}

// Fungsi untuk menangani rename video
function handleRename(fileName) {
    const newName = prompt('Masukkan nama baru untuk video:', fileName);
    if (!newName) return;

    fetch('/download/rename', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: fileName,
            newName: newName
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.reload();
        } else {
            alert('Gagal mengubah nama video: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat mengubah nama video');
    });
}

// Fungsi untuk menangani delete video
function handleDelete(fileName) {
    if (!confirm('Apakah Anda yakin ingin menghapus video ini?')) return;

    fetch('/download/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fileName: fileName
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.reload();
        } else {
            alert('Gagal menghapus video: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat menghapus video');
    });
}

// Validasi form streaming
function validateStreamingForm() {
    const videoPath = document.getElementById('videoPath').value;
    const platform = document.getElementById('platform').value;
    const streamKey = document.getElementById('streamKey').value;

    if (!videoPath || !platform || !streamKey) {
        alert('Mohon isi semua field yang diperlukan');
        return false;
    }
    return true;
}

// Validasi form download
function validateDownloadForm() {
    const url = document.getElementById('driveUrl').value;
    if (!url) {
        alert('Mohon masukkan URL Google Drive');
        return false;
    }
    return true;
}

// Update sistem stats setiap 5 detik
setInterval(updateSystemStats, 5000);

// Update daftar streaming aktif setiap 10 detik
setInterval(updateActiveStreams, 10000);

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    updateSystemStats();
    updateActiveStreams();
});