// ==UserScript==
// @name         SIPANTAS Pusat Autofill Bot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Otomatisasi pengisian data SIPANTAS Pusat dari file JSON Ekspor
// @author       Sistem SIPANTAS Kabupaten
// @match        *://*/*sipantas*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 1. Buat UI Tombol Import di pojok kanan bawah
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '999999';
    container.style.backgroundColor = '#166534';
    container.style.color = 'white';
    container.style.padding = '15px';
    container.style.borderRadius = '10px';
    container.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    container.style.fontFamily = 'sans-serif';
    container.style.width = '250px';

    const title = document.createElement('div');
    title.innerText = '🤖 SIPANTAS Auto-Bot';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '10px';
    container.appendChild(title);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'block';
    fileInput.style.marginBottom = '10px';
    fileInput.style.fontSize = '12px';
    container.appendChild(fileInput);

    const runBtn = document.createElement('button');
    runBtn.innerText = 'Jalankan Autofill';
    runBtn.style.width = '100%';
    runBtn.style.padding = '8px';
    runBtn.style.backgroundColor = '#22c55e';
    runBtn.style.color = 'white';
    runBtn.style.border = 'none';
    runBtn.style.borderRadius = '5px';
    runBtn.style.cursor = 'pointer';
    runBtn.style.fontWeight = 'bold';
    container.appendChild(runBtn);

    document.body.appendChild(container);

    let importedData = null;

    // 2. Baca file JSON
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const json = JSON.parse(ev.target.result);
                importedData = json.data;
                alert(`Berhasil memuat ${importedData.length} indikator dari Kabupaten ${json.kabupaten}!`);
            } catch (err) {
                alert('File JSON tidak valid!');
            }
        };
        reader.readAsText(file);
    });

    // 3. Logika Eksekusi Autofill
    runBtn.addEventListener('click', async () => {
        if (!importedData) {
            alert('Upload file JSON Autofill terlebih dahulu!');
            return;
        }

        alert('Bot mulai berjalan. Jangan sentuh keyboard/mouse...');
        runBtn.innerText = 'Mengeksekusi...';
        runBtn.disabled = true;

        for (const item of importedData) {
            try {
                // Asumsi: Elemen di web SIPANTAS pusat bisa dicari berdasarkan teks indikator atau id
                // CONTOH LOGIKA (Perlu disesuaikan dengan struktur HTML asli web SIPANTAS Pusat):
                
                // 1. Cari elemen baris indikator
                // const row = Array.from(document.querySelectorAll('tr')).find(el => el.innerText.includes(item.indicatorText.substring(0, 20)));
                // if (!row) continue;

                // 2. Isi Input Capaian 2024
                // const input2024 = row.querySelector('input[name*="capaian_2024"]');
                // if (input2024) { input2024.value = item.capaian2024; input2024.dispatchEvent(new Event('change')); }

                // 3. Isi Input Capaian 2025
                // const input2025 = row.querySelector('input[name*="capaian_2025"]');
                // if (input2025) { input2025.value = item.capaian2025; input2025.dispatchEvent(new Event('change')); }

                // 4. Isi Penjelasan
                // const inputPenjelasan = row.querySelector('textarea');
                // if (inputPenjelasan) { inputPenjelasan.value = item.penjelasan; inputPenjelasan.dispatchEvent(new Event('change')); }

                // 5. Delay sedikit agar terlihat natural
                await new Promise(r => setTimeout(r, 100));

            } catch (err) {
                console.error("Gagal mengisi:", item.indicatorText, err);
            }
        }

        runBtn.innerText = 'Selesai!';
        alert('Autofill selesai! Silakan periksa kembali dan upload file PDF secara manual jika bot gagal upload.');
    });

})();
