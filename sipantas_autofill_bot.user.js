// ==UserScript==
// @name         SIPANTAS Pusat Autofill Bot
// @namespace    http://tampermonkey.net/
// @version      2.8
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
    console.log("🤖 [SIPANTAS Bot] Versi 2.8 Aktif!");

    // Global native event logging on document level to diagnose unblocked events
    document.addEventListener('change', (e) => {
        console.log("🔥 [SIPANTAS Bot Debug] Native Change reached Document! Target:", e.target, "Path:", e.composedPath().map(el => el.tagName + (el.className ? '.' + el.className.split(' ').join('.') : '')));
    }, { capture: true });

    document.addEventListener('input', (e) => {
        console.log("🔥 [SIPANTAS Bot Debug] Native Input reached Document! Target:", e.target, "Path:", e.composedPath().map(el => el.tagName + (el.className ? '.' + el.className.split(' ').join('.') : '')));
    }, { capture: true });

    // Also jQuery event logging if jQuery reaches document
    const pagejQuery = typeof unsafeWindow !== 'undefined' ? (unsafeWindow.jQuery || window.jQuery) : window.jQuery;
    if (pagejQuery) {
        pagejQuery(document).on('change change.select2 input', (e) => {
            console.log("🔥 [SIPANTAS Bot Debug] jQuery Event reached Document! Target:", e.target);
        });
    }

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

    // Restore posisi panel jika tersimpan di localStorage
    const savedLeft = localStorage.getItem('sipantas_bot_ui_left');
    const savedTop = localStorage.getItem('sipantas_bot_ui_top');
    if (savedLeft && savedTop) {
        container.style.bottom = 'auto';
        container.style.right = 'auto';
        container.style.left = savedLeft;
        container.style.top = savedTop;
    }

    const title = document.createElement('div');
    title.innerText = '🤖 SIPANTAS Auto-Bot (Drag me)';
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

    const resetBtn = document.createElement('button');
    resetBtn.innerText = 'Reset/Hapus Data';
    resetBtn.style.width = '100%';
    resetBtn.style.padding = '5px';
    resetBtn.style.marginTop = '8px';
    resetBtn.style.backgroundColor = '#ef4444';
    resetBtn.style.color = 'white';
    resetBtn.style.border = 'none';
    resetBtn.style.borderRadius = '5px';
    resetBtn.style.cursor = 'pointer';
    resetBtn.style.fontWeight = 'bold';
    resetBtn.style.fontSize = '11px';
    container.appendChild(resetBtn);

    document.body.appendChild(container);

    // Buat Panel Draggable (Bisa digeser)
    let isDragging = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;

    title.style.cursor = 'move';
    title.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        const rect = container.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        
        container.style.bottom = 'auto';
        container.style.right = 'auto';
        container.style.left = startLeft + 'px';
        container.style.top = startTop + 'px';
        
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        container.style.left = (startLeft + dx) + 'px';
        container.style.top = (startTop + dy) + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            localStorage.setItem('sipantas_bot_ui_left', container.style.left);
            localStorage.setItem('sipantas_bot_ui_top', container.style.top);
        }
    });

    let importedData = null;
    let lastFilledIndicator = null;

    // Load from localStorage if exists
    try {
        const savedData = localStorage.getItem('sipantas_bot_imported_data');
        if (savedData) {
            importedData = JSON.parse(savedData);
            statusText.innerText = `✅ Tersimpan: ${importedData.length} data`;
            statusText.style.color = '#4ade80';
        }
    } catch (e) {
        console.error("Gagal membaca data tersimpan dari localStorage:", e);
    }

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
                
                // Simpan ke localStorage agar tidak hilang saat reload halaman
                localStorage.setItem('sipantas_bot_imported_data', JSON.stringify(importedData));
                
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

    // Reset data
    resetBtn.addEventListener('click', () => {
        if (confirm("Hapus data JSON yang tersimpan di bot?")) {
            localStorage.removeItem('sipantas_bot_imported_data');
            importedData = null;
            lastFilledIndicator = null;
            fileInput.value = '';
            statusText.innerText = '🤖 Silakan upload file JSON';
            statusText.style.color = '#facc15';
            alert("Data bot berhasil dihapus!");
        }
    });

    // Helper untuk mendownload file bukti via GM_xmlhttpRequest dan menyematkannya ke form upload
    function uploadFile(fileInput, fileUrl, defaultName) {
        if (!fileInput || !fileUrl) return;

        // Resolve relative URL to localhost if it's not absolute
        let resolvedUrl = fileUrl;
        if (fileUrl !== '-' && !fileUrl.startsWith('http://') && !fileUrl.startsWith('https://')) {
            const cleanPath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
            resolvedUrl = `http://localhost:5173/${cleanPath}`;
        }
        
        if (resolvedUrl === '-' || !resolvedUrl) {
            console.log("🤖 [SIPANTAS Bot] URL file bukti kosong atau strip (-). Lewati download.");
            return;
        }

        console.log(`Mengunduh file bukti via GM_xmlhttpRequest: ${resolvedUrl}`);
        statusText.innerText = `⏳ Mengunduh dokumen...`;
        statusText.style.color = '#facc15';

        GM_xmlhttpRequest({
            method: "GET",
            url: resolvedUrl,
            responseType: "blob",
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const blob = response.response;
                    
                    // Ekstrak ekstensi asli dari URL secara dinamis
                    let ext = '.pdf';
                    try {
                        const decodedUrl = decodeURIComponent(resolvedUrl);
                        const urlPath = decodedUrl.split('?')[0];
                        const lastDotIndex = urlPath.lastIndexOf('.');
                        if (lastDotIndex !== -1) {
                            const suspectedExt = urlPath.substring(lastDotIndex).toLowerCase();
                            // Pastikan ekstensinya standar (3-5 karakter, misal .pdf, .xlsx, .png, .jpg)
                            if (suspectedExt.match(/^\.[a-z0-9]{3,5}$/)) {
                                ext = suspectedExt;
                            }
                        }
                    } catch (err) {
                        console.warn("🤖 [SIPANTAS Bot] Gagal mengekstrak ekstensi:", err);
                    }
                    
                    const file = new File([blob], defaultName + ext, { type: blob.type || "application/octet-stream" });
                    
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInput.files = dataTransfer.files;
                    
                    const $ = typeof unsafeWindow !== 'undefined' ? (unsafeWindow.jQuery || window.jQuery) : window.jQuery;
                    fileInput.dispatchEvent(new Event('input', { bubbles: true }));
                    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                    if ($) {
                        console.log("🤖 [SIPANTAS Bot] Memicu event change jQuery pada fileInput");
                        $(fileInput).trigger('change');
                    }
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

        console.log("🤖 [SIPANTAS Bot] Mendeteksi modal terbuka untuk:", indicatorName);

        // GUNAKAN PARENT DARI PARENT JUDUL SEBAGAI CONTAINER BOX MODAL (Sangat Aman & Terisolasi)
        const modalContainer = titleEl.parentElement.parentElement || titleEl.closest('.modal-content') || document;
        console.log("🤖 [SIPANTAS Bot] modalContainer yang digunakan:", modalContainer);

        // Batasi pencarian hanya di dalam area BODY modal (.modal-body) untuk keamanan maksimal
        const modalBody = modalContainer.querySelector('.modal-body, div[class*="body"]') || modalContainer;
        console.log("🤖 [SIPANTAS Bot] modalBody yang digunakan:", modalBody);

        const $ = typeof unsafeWindow !== 'undefined' ? (unsafeWindow.jQuery || window.jQuery) : window.jQuery;

        // Hentikan penyebaran event change/input dari dalam modal di tingkat kontainer modalBody
        if (modalBody && !modalBody.dataset.botEventsBlocked) {
            modalBody.dataset.botEventsBlocked = "true";
            
            // Block native events in bubble phase (allows internal handlers to run, but blocks them from escaping)
            modalBody.addEventListener('change', (e) => {
                if (e.target && e.target.type === 'file') return; // Biarkan file input untuk proses upload
                console.log("🤖 [SIPANTAS Bot] Mencegah propagasi native change keluar modal. Target:", e.target);
                e.stopPropagation();
            });
            modalBody.addEventListener('input', (e) => {
                if (e.target && e.target.type === 'file') return; // Biarkan file input untuk proses upload
                console.log("🤖 [SIPANTAS Bot] Mencegah propagasi native input keluar modal. Target:", e.target);
                e.stopPropagation();
            });

            // Block jQuery events
            if ($) {
                $(modalBody).on('change change.select2 input', (e) => {
                    if (e.target && e.target.type === 'file') return; // Biarkan file input untuk proses upload
                    console.log("🤖 [SIPANTAS Bot] Mencegah propagasi jQuery change keluar modal. Target:", e.target);
                    e.stopPropagation();
                });
            }
        }

        // Deteksi tahun aktif dari modal atau filter halaman
        let activeYear = '2025';
        const modalText = modalContainer.innerText || '';
        if (modalText.includes('2024')) {
            activeYear = '2024';
        } else if (modalText.includes('2025')) {
            activeYear = '2025';
        } else {
            const globalYearSelect = document.querySelector('select[name="global_year"], select[id*="year"], select[class*="year"]');
            if (globalYearSelect && globalYearSelect.value) {
                activeYear = globalYearSelect.value;
            }
        }
        console.log("🤖 [SIPANTAS Bot] Tahun aktif terdeteksi:", activeYear);

        // Deteksi Tatanan aktif dari baris tabel di halaman
        let activeTatananName = '';
        const rows = Array.from(document.querySelectorAll('tr'));
        const cleanModalInd = indicatorName.toLowerCase().replace(/[^a-z0-9]/g, '');
        for (const row of rows) {
            const cells = Array.from(row.querySelectorAll('td'));
            if (cells.length >= 2) {
                // Cari cell yang paling cocok dengan nama indikator di modal
                const matchingCellIndex = cells.findIndex(cell => {
                    const cleanCellText = cell.innerText.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return cleanCellText !== '' && (cleanCellText === cleanModalInd || cleanCellText.includes(cleanModalInd) || cleanModalInd.includes(cleanCellText));
                });
                
                if (matchingCellIndex !== -1) {
                    // Cari cell lain di baris yang sama yang mengandung keyword Tatanan
                    const tatananCell = cells.find(cell => {
                        const text = cell.innerText.toLowerCase();
                        return text.includes('sehat') || text.includes('pendidikan') || text.includes('pasar') || text.includes('perkantoran') || 
                               text.includes('pariwisata') || text.includes('lalu lintas') || text.includes('sosial') || text.includes('bencana') ||
                               text.includes('pangan') || text.includes('mandiri');
                    });
                    if (tatananCell) {
                        activeTatananName = tatananCell.innerText.trim();
                        console.log("🤖 [SIPANTAS Bot] Deteksi Tatanan aktif dari baris tabel:", activeTatananName);
                        break;
                    }
                }
            }
        }

        // Filter data JSON yang berada di dalam satu Tatanan saja
        let filteredImportedData = importedData;
        if (activeTatananName) {
            const cleanActiveTatanan = activeTatananName.toLowerCase().replace(/[^a-z0-9]/g, '').replace('tatanan', '');
            const temp = importedData.filter(item => {
                const cleanItemTatanan = item.tatananName.toLowerCase().replace(/[^a-z0-9]/g, '').replace('tatanan', '');
                return cleanItemTatanan.includes(cleanActiveTatanan) || cleanActiveTatanan.includes(cleanItemTatanan);
            });
            if (temp.length > 0) {
                filteredImportedData = temp;
                console.log(`🤖 [SIPANTAS Bot] Membatasi pencarian ke ${temp.length} indikator di dalam Tatanan: ${activeTatananName}`);
            }
        }

        // 2. Cari data indikator yang cocok di JSON secara berjenjang (Exact -> Substring -> Loose)
        const cleanNameB = indicatorName.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // TAHAP 1: Cocok persis
        let match = filteredImportedData.find(item => {
            const cleanNameA = item.indicatorText.toLowerCase().replace(/[^a-z0-9]/g, '');
            return cleanNameA === cleanNameB;
        });

        // TAHAP 2: Cocok sebagian (substring)
        if (!match) {
            match = filteredImportedData.find(item => {
                const cleanNameA = item.indicatorText.toLowerCase().replace(/[^a-z0-9]/g, '');
                return cleanNameA.includes(cleanNameB) || cleanNameB.includes(cleanNameA);
            });
        }

        // TAHAP 3: Cocok parsial (loose fallback)
        if (!match) {
            match = filteredImportedData.find(item => {
                const cleanNameA = item.indicatorText.toLowerCase().replace(/[^a-z0-9]/g, '');
                return cleanNameA.substring(0, 30).includes(cleanNameB.substring(0, 15)) ||
                       cleanNameB.substring(0, 30).includes(cleanNameA.substring(0, 15));
            });
        }

        if (!match) {
            console.warn("🤖 [SIPANTAS Bot] Tidak menemukan data JSON yang cocok untuk:", indicatorName);
            statusText.innerText = `⚠️ Tidak cocok: ${indicatorName.substring(0, 15)}...`;
            statusText.style.color = '#facc15';
            return;
        }

        console.log("🤖 [SIPANTAS Bot] Menemukan kecocokan data JSON:", match);
        statusText.innerText = `⏳ Mengisi data...`;

        // 3. Cari input di DALAM kontainer modalBody saja
        let input2024 = modalBody.querySelector('input[placeholder*="2024"], input[name*="2024"], input[name*="capaian_2024"]');
        let input2025 = modalBody.querySelector('input[placeholder*="2025"], input[name*="2025"], input[name*="capaian_2025"]');
        
        // Fallback jika form hanya mengedit satu tahun secara dinamis
        if (!input2024 && !input2025) {
            const genericInput = modalBody.querySelector('input[name="capaian"], input[id="capaian"], input[placeholder*="Capaian"], input[placeholder*="capaian"], input[name*="nilai_capaian"]');
            if (genericInput) {
                console.log("🤖 [SIPANTAS Bot] Menemukan input capaian generik, dipetakan ke tahun:", activeYear);
                if (activeYear === '2024') {
                    input2024 = genericInput;
                } else {
                    input2025 = genericInput;
                }
            }
        }
        
        // Cari select dropdown atau input biasa untuk Nilai Mandiri (HAPUS 'capaian' agar tidak menyentuh pemilih tahun)
        const inputNilai = modalBody.querySelector('select[name*="nilai"], select[name*="skala"], select[id*="nilai"], select[name*="mandiri"], select[id*="mandiri"], select[class*="nilai"], select[class*="skala"], input[placeholder*="Mandiri"], input[placeholder*="mandiri"], input[name*="nilai"], input[name*="capaian_mandiri"]');
        console.log("🤖 [SIPANTAS Bot] Elemen inputNilai ditemukan:", inputNilai);
        
        const inputPenjelasan = modalBody.querySelector('textarea, textarea[name*="penjelasan"], textarea[id*="penjelasan"]');

        // Cari file input (biasanya input[type="file"]) di dalam modal
        const fileInputs = Array.from(modalContainer.querySelectorAll('input[type="file"]'));
        console.log(`🤖 [SIPANTAS Bot] Ditemukan ${fileInputs.length} input file di dalam modal.`);
        let fileInput2024 = null;
        let fileInput2025 = null;

        if (fileInputs.length === 1) {
            console.log(`🤖 [SIPANTAS Bot] Memetakan single file input ke tahun aktif: ${activeYear}`);
            if (activeYear === '2024') {
                fileInput2024 = fileInputs[0];
            } else {
                fileInput2025 = fileInputs[0];
            }
        } else if (fileInputs.length >= 2) {
            fileInput2024 = fileInputs.find(i => i.name.includes('2024') || i.id.includes('2024'));
            fileInput2025 = fileInputs.find(i => i.name.includes('2025') || i.id.includes('2025'));
            
            // Fallback berdasarkan urutan jika tidak ketemu berdasarkan nama
            if (!fileInput2024) fileInput2024 = fileInputs[0];
            if (!fileInput2025) fileInput2025 = fileInputs[1];
        }

        // Cari key capaian secara dinamis jika nama key berbeda
        const key2024 = Object.keys(match).find(k => k.includes('2024')) || 'capaian2024';
        const key2025 = Object.keys(match).find(k => k.includes('2025')) || 'capaian2025';

        // Cari key file bukti (evidence) secara dinamis jika nama key berbeda
        const keyEvidence2024 = Object.keys(match).find(k => k.toLowerCase().includes('evidence') && k.includes('2024')) || 'evidence2024';
        const keyEvidence2025 = Object.keys(match).find(k => k.toLowerCase().includes('evidence') && k.includes('2025')) || 'evidence2025';

        let filledAny = false;

        if (input2024 && match[key2024] !== undefined) {
            console.log("🤖 [SIPANTAS Bot] Mengisi Capaian 2024 dengan:", match[key2024]);
            input2024.value = match[key2024];
            input2024.dispatchEvent(new Event('input', { bubbles: true }));
            input2024.dispatchEvent(new Event('change', { bubbles: true }));
            filledAny = true;
        }

        if (input2025 && match[key2025] !== undefined) {
            console.log("🤖 [SIPANTAS Bot] Mengisi Capaian 2025 dengan:", match[key2025]);
            input2025.value = match[key2025];
            input2025.dispatchEvent(new Event('input', { bubbles: true }));
            input2025.dispatchEvent(new Event('change', { bubbles: true }));
            filledAny = true;
        }

        if (inputNilai) {
            const val = match.nilaiMandiri !== undefined ? match.nilaiMandiri : (match.capaian !== undefined ? match.capaian : '');
            console.log("🤖 [SIPANTAS Bot] Mengisi Nilai Mandiri dengan:", val);

            inputNilai.value = String(val);
            inputNilai.dispatchEvent(new Event('input', { bubbles: true }));
            inputNilai.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Pemicu khusus Select2 (jQuery) agar tampilan pilihan di layar langsung terupdate
            try {
                if ($ && $(inputNilai).data('select2')) {
                    console.log("🤖 [SIPANTAS Bot] Memicu update visual Select2 untuk nilai:", val);
                    $(inputNilai).val(String(val)).trigger('change.select2').trigger('change');
                }
            } catch (e) {
                console.warn("🤖 [SIPANTAS Bot] Gagal memperbarui UI Select2 secara visual:", e);
            }
            
            filledAny = true;
        }

        if (inputPenjelasan && match.penjelasan !== undefined) {
            console.log("🤖 [SIPANTAS Bot] Mengisi Penjelasan dengan:", match.penjelasan);
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
            console.log("🤖 [SIPANTAS Bot] Berhasil mengisi modal untuk:", indicatorName);
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
