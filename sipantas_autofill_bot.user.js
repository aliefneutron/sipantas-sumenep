// ==UserScript==
// @name         SIPANTAS Pusat Autofill Bot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Otomatisasi pengisian data SIPANTAS Pusat dari file JSON Ekspor
// @author       Sistem SIPANTAS Kabupaten
// @match        *://*/*sipantas*/*
// @match        *://sipantas.kemkes.go.id/*
// @match        *://*.sipantas.kemkes.go.id/*
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function() {
    'use strict';
    console.log("🤖 [SIPANTAS Bot] Versi 2.0 Aktif!");

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

    const statusText = document.createElement('div');
    statusText.innerText = '🤖 Silakan upload file JSON';
    statusText.style.fontSize = '11px';
    statusText.style.marginTop = '8px';
    statusText.style.color = '#facc15';
    statusText.style.textAlign = 'center';
    container.appendChild(statusText);

    document.body.appendChild(container);

    let importedData = null;
    let lastFilledIndicator = null;

    // 2. Baca file JSON
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const json = JSON.parse(ev.target.result);
                importedData = json.data;
                lastFilledIndicator = null; // reset
                statusText.innerText = `✅ Berhasil memuat ${importedData.length} data`;
                statusText.style.color = '#4ade80';
                alert(`Berhasil memuat ${importedData.length} indikator dari Kabupaten ${json.kabupaten}!\n\nSekarang Anda cukup mengeklik tombol "Edit" pada salah satu indikator di web ini, dan data akan terisi secara otomatis.`);
            } catch (err) {
                statusText.innerText = '❌ File JSON tidak valid!';
                statusText.style.color = '#f87171';
                alert('File JSON tidak valid!');
            }
        };
        reader.readAsText(file);
    });

    // Helper untuk mendownload file bukti via GM_xmlhttpRequest dan menyematkannya ke form upload
    function uploadFile(fileInput, fileUrl, defaultName) {
        if (!fileInput || !fileUrl) return;
        
        console.log(`Mengunduh file bukti via GM_xmlhttpRequest: ${fileUrl}`);
        statusText.innerText = `⏳ Mengunduh dokumen...`;
        statusText.style.color = '#facc15';

        GM_xmlhttpRequest({
            method: "GET",
            url: fileUrl,
            responseType: "blob",
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const blob = response.response;
                    
                    // Tentukan ekstensi file
                    let ext = '.pdf';
                    const lowerUrl = fileUrl.toLowerCase();
                    if (lowerUrl.includes('.xlsx')) ext = '.xlsx';
                    else if (lowerUrl.includes('.xls')) ext = '.xls';
                    else if (lowerUrl.includes('.docx')) ext = '.docx';
                    else if (lowerUrl.includes('.doc')) ext = '.doc';
                    
                    const file = new File([blob], defaultName + ext, { type: blob.type || "application/pdf" });
                    
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInput.files = dataTransfer.files;
                    
                    fileInput.dispatchEvent(new Event('input', { bubbles: true }));
                    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log(`Berhasil menyematkan file ke input: ${defaultName + ext}`);
                    statusText.innerText = `✅ Berhasil upload file`;
                    statusText.style.color = '#4ade80';
                } else {
                    console.error("Gagal mengunduh file, status:", response.status);
                    statusText.innerText = `❌ Gagal unduh file`;
                    statusText.style.color = '#f87171';
                }
            },
            onerror: function(error) {
                console.error("Gagal mengunduh file karena error jaringan:", error);
                statusText.innerText = `❌ Jaringan error`;
                statusText.style.color = '#f87171';
            }
        });
    }

    // Fungsi Pengisian Modal secara Otomatis
    function fillOpenModal() {
        if (!importedData) return;

        // 1. Cari elemen judul modal yang mengandung "Input Data Indikator" (case-insensitive)
        const titleElCandidates = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, .modal-title, .modal-header, span, p, div')).filter(el => 
            el.innerText && el.innerText.toLowerCase().includes('input data indikator')
        );
        if (titleElCandidates.length === 0) return;
        
        // Pilih kandidat dengan teks terpendek agar paling spesifik (menghindari wrapper besar)
        titleElCandidates.sort((a, b) => a.innerText.length - b.innerText.length);
        const titleEl = titleElCandidates[0];
        const modalTitle = titleEl.innerText.trim();

        // Ambil nama indikator (misal: "Jumlah Kematian Ibu")
        const indicatorName = modalTitle.replace(/input\s+data\s+indikator/gi, '').trim();
        if (!indicatorName) return;

        // Supaya tidak mengisi berulang-ulang pada modal yang sama
        if (lastFilledIndicator === indicatorName) return;

        // GUNAKAN PARENT DARI PARENT JUDUL SEBAGAI CONTAINER BOX MODAL (Sangat Aman & Terisolasi)
        const modalContainer = titleEl.parentElement.parentElement || titleEl.closest('.modal-content') || document;
        
        // Batasi pencarian hanya di dalam area BODY modal (.modal-body) untuk keamanan maksimal
        const modalBody = modalContainer.querySelector('.modal-body, div[class*="body"]') || modalContainer;

        console.log("Mendeteksi modal terbuka untuk indikator:", indicatorName);
        statusText.innerText = `🔍 Mencocokkan: ${indicatorName.substring(0, 15)}...`;
        statusText.style.color = '#facc15';

        // 2. Cari data indikator yang cocok di JSON secara case-insensitive & tanpa spasi/karakter aneh
        const match = importedData.find(item => {
            const textA = item.indicatorText.toLowerCase().replace(/[^a-z0-9]/g, '');
            const textB = indicatorName.toLowerCase().replace(/[^a-z0-9]/g, '');
            return textA.includes(textB) || textB.includes(textA) ||
                   textA.substring(0, 30).includes(textB.substring(0, 15)) ||
                   textB.substring(0, 30).includes(textA.substring(0, 15));
        });

        if (!match) {
            console.warn("Tidak menemukan data JSON yang cocok untuk:", indicatorName);
            statusText.innerText = `⚠️ Tidak cocok: ${indicatorName.substring(0, 15)}...`;
            statusText.style.color = '#facc15';
            return;
        }

        console.log("Menemukan kecocokan data JSON:", match);
        statusText.innerText = `⏳ Mengisi data...`;

        // 3. Cari input di DALAM kontainer modalBody saja
        const input2024 = modalBody.querySelector('input[placeholder*="2024"], input[name*="2024"], input[name*="capaian_2024"]');
        const input2025 = modalBody.querySelector('input[placeholder*="2025"], input[name*="2025"], input[name*="capaian_2025"]');
        
        // Cari select dropdown atau input biasa untuk Nilai Mandiri (HAPUS 'capaian' agar tidak menyentuh pemilih tahun)
        const inputNilai = modalBody.querySelector('select[name*="nilai"], select[name*="skala"], select[id*="nilai"], select[name*="mandiri"], select[id*="mandiri"], select[class*="nilai"], select[class*="skala"], input[placeholder*="Mandiri"], input[placeholder*="mandiri"], input[name*="nilai"], input[name*="capaian_mandiri"]');
        
        const inputPenjelasan = modalBody.querySelector('textarea, textarea[name*="penjelasan"], textarea[id*="penjelasan"]');

        // Cari file input (biasanya input[type="file"]) di dalam modal
        const fileInputs = Array.from(modalBody.querySelectorAll('input[type="file"]'));
        let fileInput2024 = fileInputs.find(i => i.name.includes('2024') || i.id.includes('2024'));
        let fileInput2025 = fileInputs.find(i => i.name.includes('2025') || i.id.includes('2025'));

        // Fallback berdasarkan urutan jika tidak ketemu berdasarkan nama
        if (!fileInput2024 && fileInputs[0]) fileInput2024 = fileInputs[0];
        if (!fileInput2025 && fileInputs[1]) fileInput2025 = fileInputs[1];

        // Cari key capaian secara dinamis jika nama key berbeda
        const key2024 = Object.keys(match).find(k => k.includes('2024')) || 'capaian2024';
        const key2025 = Object.keys(match).find(k => k.includes('2025')) || 'capaian2025';

        // Cari key file bukti (evidence) secara dinamis jika nama key berbeda
        const keyEvidence2024 = Object.keys(match).find(k => k.toLowerCase().includes('evidence') && k.includes('2024')) || 'evidence2024';
        const keyEvidence2025 = Object.keys(match).find(k => k.toLowerCase().includes('evidence') && k.includes('2025')) || 'evidence2025';

        let filledAny = false;

        if (input2024 && match[key2024] !== undefined) {
            input2024.value = match[key2024];
            input2024.dispatchEvent(new Event('input', { bubbles: true }));
            input2024.dispatchEvent(new Event('change', { bubbles: true }));
            filledAny = true;
        }

        if (input2025 && match[key2025] !== undefined) {
            input2025.value = match[key2025];
            input2025.dispatchEvent(new Event('input', { bubbles: true }));
            input2025.dispatchEvent(new Event('change', { bubbles: true }));
            filledAny = true;
        }

        if (inputNilai) {
            const val = match.nilaiMandiri !== undefined ? match.nilaiMandiri : (match.capaian !== undefined ? match.capaian : '');
            inputNilai.value = String(val);
            inputNilai.dispatchEvent(new Event('input', { bubbles: true }));
            inputNilai.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Pemicu khusus Select2 (jQuery) agar tampilan pilihan di layar langsung terupdate
            try {
                if (window.jQuery && window.jQuery(inputNilai).data('select2')) {
                    window.jQuery(inputNilai).val(String(val)).trigger('change.select2').trigger('change');
                }
            } catch (e) {
                console.warn("Gagal memperbarui UI Select2 secara visual:", e);
            }
            
            filledAny = true;
        }

        if (inputPenjelasan && match.penjelasan !== undefined) {
            inputPenjelasan.value = match.penjelasan;
            inputPenjelasan.dispatchEvent(new Event('input', { bubbles: true }));
            inputPenjelasan.dispatchEvent(new Event('change', { bubbles: true }));
            filledAny = true;
        }

        // Panggil pengunggahan file secara paralel
        if (fileInput2024 && match[keyEvidence2024]) {
            const cleanName = `Bukti_2024_${indicatorName.trim().replace(/[^a-zA-Z0-9]/g, '_')}`;
            uploadFile(fileInput2024, match[keyEvidence2024], cleanName);
            filledAny = true;
        }

        if (fileInput2025 && match[keyEvidence2025]) {
            const cleanName = `Bukti_2025_${indicatorName.trim().replace(/[^a-zA-Z0-9]/g, '_')}`;
            uploadFile(fileInput2025, match[keyEvidence2025], cleanName);
            filledAny = true;
        }

        if (filledAny) {
            lastFilledIndicator = indicatorName;
            console.log("Berhasil mengisi modal untuk:", indicatorName);
            statusText.innerText = `✍️ Terisi: ${indicatorName.substring(0, 15)}...`;
            statusText.style.color = '#4ade80';
        }
    }

    // Jalankan pengecekan otomatis setiap 1 detik
    setInterval(fillOpenModal, 1000);

    // 3. Logika Eksekusi Manual (Hanya memicu pengisian modal yang terbuka)
    runBtn.addEventListener('click', () => {
        if (!importedData) {
            alert('Upload file JSON Autofill terlebih dahulu!');
            return;
        }
        fillOpenModal();
        alert('Bot memicu pengisian ulang form modal.');
    });

})();
