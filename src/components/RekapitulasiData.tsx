import React, { useState, useMemo } from 'react';
import { KabupatenProposal } from '../types';
import { Download, Edit, Trash2, FileText, Search, X, Check, Archive, Code } from 'lucide-react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface RekapitulasiDataProps {
  proposal: KabupatenProposal;
  onUpdateProposal: (updated: KabupatenProposal) => void;
  assessmentYear?: number;
}

export function RekapitulasiData({ proposal, onUpdateProposal, assessmentYear = 2026 }: RekapitulasiDataProps) {
  
  const year1 = assessmentYear - 2;
  const year2 = assessmentYear - 1;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTatananId, setFilterTatananId] = useState('all');
  
  // States for Editing
  const [editingRow, setEditingRow] = useState<any>(null);
  const [capaianYear1, setCapaianYear1] = useState('');
  const [capaianYear2, setCapaianYear2] = useState('');
  const [evidenceYear1, setEvidenceYear1] = useState('');
  const [evidenceYear22025, setEvidenceYear22025] = useState(''); // assuming this field is used for 2025 evidence, wait, the type is just evidenceYear2.
  // Actually, evidenceYear2 is for 2025, evidenceYear1 is for 2024.
  const [evidenceYear2, setEvidenceYear2] = useState('');
  
  // Aggregate all filled indicators
  const allData = useMemo(() => {
    let data: any[] = [];
    proposal.tatanan?.forEach(t => {
      t.indicators.forEach(ind => {
        // Only include if there is some data filled in
        if (ind.score.capaianYear1 || ind.score.capaianYear2 || ind.score.evidenceYear2 || ind.score.evidenceYear1) {
          data.push({
            tatananId: t.id,
            tatananName: t.name,
            indicatorId: ind.id,
            indicatorText: ind.question,
            ...ind.score
          });
        }
      });
    });
    return data;
  }, [proposal]);

  // Filter based on search term and tatanan
  const filteredData = allData.filter(d => {
    const matchesSearch = d.indicatorText.toLowerCase().includes(searchTerm.toLowerCase()) || d.tatananName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTatanan = filterTatananId === 'all' || d.tatananId === filterTatananId;
    return matchesSearch && matchesTatanan;
  });

  const handleBackup = (year: number) => {
    // Prepare data for export
    const exportData = filteredData.map((d, index) => {
      if (year === year1) {
        return {
          'No': index + 1,
          'Tatanan': d.tatananName.replace('Tatanan ', ''),
          'Indikator': d.indicatorText,
          ['Capaian ' + year1]: d.capaianYear1 || '-',
          ['Link Bukti (' + year1 + ')']: d.evidenceYear1 || '-'
        };
      } else {
        return {
          'No': index + 1,
          'Tatanan': d.tatananName.replace('Tatanan ', ''),
          'Indikator': d.indicatorText,
          ['Capaian ' + year2]: d.capaianYear2 || '-',
          ['Link Bukti (' + year2 + ')']: d.evidenceYear2 || '-'
        };
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Rekap ${year}`);
    
    // Auto-size columns slightly
    worksheet['!cols'] = [
      { wch: 5 }, { wch: 25 }, { wch: 50 }, { wch: 20 }, { wch: 40 }
    ];

    XLSX.writeFile(workbook, `Rekap-SIPANTAS-${proposal.name}-${year}.xlsx`);
  };

  const handleExportZip = async () => {
    try {
      // 1. Initialize ZIP
      const zip = new JSZip();
      
      // 2. Add Excel Summary
      const exportData = filteredData.map((d, index) => ({
        'No': index + 1,
        'Tatanan': d.tatananName.replace('Tatanan ', ''),
        'Indikator': d.indicatorText,
        'Nilai Mandiri': d.capaian,
        ['Capaian ' + year1]: d.capaianYear1 || '-',
        ['Capaian ' + year2]: d.capaianYear2 || '-',
        'Penjelasan': d.penjelasan || '-'
      }));
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `Rekap Keseluruhan`);
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      zip.file(`Rekap_Lengkap_SIPANTAS_${proposal.name.replace(/\s+/g, '_')}.xlsx`, excelBuffer);

      // 3. Download and Add PDFs
      alert("Proses pembuatan ZIP sedang berjalan. Bergantung pada jumlah file dan kecepatan internet, ini mungkin memakan waktu beberapa menit. Jangan tutup halaman ini.");
      
      for (const row of filteredData) {
        const tatananFolder = zip.folder(row.tatananName.replace(/[\\/:*?"<>|]/g, ""));
        if (!tatananFolder) continue;

        // Simplify indicator folder name
        const cleanIndicator = row.indicatorText.substring(0, 50).replace(/[\\/:*?"<>|]/g, "");
        const indFolder = tatananFolder.folder(cleanIndicator);
        if (!indFolder) continue;

        // Helper to fetch and add file
        const addFileToZip = async (url: string, filename: string) => {
          if (!url) return;
          try {
            const response = await fetch(url);
            if (response.ok) {
              const blob = await response.blob();
              indFolder.file(filename, blob);
            }
          } catch (error) {
            console.error("Gagal mendownload:", url, error);
          }
        };

        if (row.evidenceYear1) await addFileToZip(row.evidenceYear1, `[${year1}] Bukti Fisik.pdf`);
        if (row.evidenceYear2) await addFileToZip(row.evidenceYear2, `[${year2}] Bukti Fisik.pdf`);
      }

      // 4. Generate and download
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `Paket_Pusat_SIPANTAS_${proposal.name.replace(/\s+/g, '_')}.zip`);
      
    } catch (error) {
      alert("Terjadi kesalahan saat membuat paket ZIP: " + error);
    }
  };

  const handleExportAutofill = () => {
    const autofillData = {
      kabupaten: proposal.name,
      timestamp: new Date().toISOString(),
      data: filteredData.map(d => ({
        tatananId: d.tatananId,
        tatananName: d.tatananName,
        indicatorId: d.indicatorId,
        indicatorText: d.indicatorText,
        nilaiMandiri: d.capaian || 0,
        ['capaian' + year1]: d.capaianYear1 || '',
        ['capaian' + year2]: d.capaianYear2 || '',
        penjelasan: d.penjelasan || ''
      }))
    };

    const blob = new Blob([JSON.stringify(autofillData, null, 2)], { type: "application/json" });
    saveAs(blob, `Autofill_SIPANTAS_${proposal.name.replace(/\s+/g, '_')}.json`);
    
    alert(`File Autofill JSON berhasil diunduh!\n\nUntuk menggunakan ini di web SIPANTAS Pusat, Anda perlu meng-install ekstensi Tampermonkey di Chrome, lalu memasukkan skrip bot yang telah kami sediakan.`);
  };

  const startEdit = (row: any) => {
    setEditingRow(row);
    setCapaianYear1(row.capaianYear1 || '');
    setCapaianYear2(row.capaianYear2 || '');
    setEvidenceYear1(row.evidenceYear1 || '');
    setEvidenceYear2(row.evidenceYear2 || '');
  };

  const saveEdit = () => {
    if (!editingRow) return;

    const updated = { ...proposal };
    updated.tatanan = updated.tatanan.map(t => {
      if (t.id === editingRow.tatananId) {
        return {
          ...t,
          indicators: t.indicators.map(ind => {
            if (ind.id === editingRow.indicatorId) {
              return {
                ...ind,
                score: {
                  ...ind.score,
                  capaianYear1,
                  capaianYear2,
                  evidenceYear1,
                  evidenceYear2
                }
              };
            }
            return ind;
          })
        };
      }
      return t;
    });

    updated.lastUpdated = new Date().toISOString();
    onUpdateProposal(updated);
    setEditingRow(null);
  };

  const deleteData = (tatananId: string, indicatorId: string) => {
    if (!window.confirm("Yakin ingin mengosongkan data pada indikator ini?")) return;

    const updated = { ...proposal };
    updated.tatanan = updated.tatanan.map(t => {
      if (t.id === tatananId) {
        return {
          ...t,
          indicators: t.indicators.map(ind => {
            if (ind.id === indicatorId) {
              return {
                ...ind,
                score: {
                  ...ind.score,
                  ['capaian' + year1]: '',
                  ['capaian' + year2]: '',
                  evidenceYear1: '',
                  evidenceYear2: '',
                  capaian: 0,
                  penjelasan: '',
                  statusProvinsi: 'Draft',
                  penjelasanProvinsi: '',
                  nilaiKabupaten: 0,
                  statusKabupaten: 'Draft',
                  catatanKabupaten: ''
                }
              };
            }
            return ind;
          })
        };
      }
      return t;
    });

    updated.lastUpdated = new Date().toISOString();
    onUpdateProposal(updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm w-full p-6 space-y-6 text-left animate-fadeIn">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-1 rounded uppercase tracking-wider font-mono">
            Menu Admin
          </span>
          <h3 className="text-xl font-bold text-[#166534] mt-2">
            Rekapitulasi & Backup Data
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Lihat, edit, hapus, dan unduh backup data indikator yang telah diisi.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end max-w-[60%]">
          <button 
            onClick={() => handleBackup(year1)}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition"
          >
            <Download className="w-4 h-4" /> Excel {year1}
          </button>
          <button 
            onClick={() => handleBackup(year2)}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition"
          >
            <Download className="w-4 h-4" /> Excel {year2}
          </button>
          <div className="w-full h-px bg-slate-200 my-1 hidden md:block"></div>
          <button 
            onClick={handleExportZip}
            className="flex items-center gap-2 px-3 py-2 bg-[#16A34A] text-white hover:bg-[#15803D] rounded-lg text-xs font-semibold transition shadow-sm"
          >
            <Archive className="w-4 h-4" /> Unduh Paket Pusat (ZIP)
          </button>
          <button 
            onClick={handleExportAutofill}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-white hover:bg-slate-900 rounded-lg text-xs font-semibold transition shadow-sm"
          >
            <Code className="w-4 h-4" /> Data Autofill (JSON)
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input 
            type="text" 
            placeholder="Cari indikator atau tatanan..." 
            className="bg-transparent text-sm w-full outline-none text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 md:w-64">
          <select 
            value={filterTatananId}
            onChange={(e) => setFilterTatananId(e.target.value)}
            className="bg-transparent text-sm w-full outline-none text-slate-700 cursor-pointer"
          >
            <option value="all">Semua Tatanan</option>
            {proposal.tatanan.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-bold uppercase tracking-wider">
              <th className="p-4 w-[20%]">Tatanan</th>
              <th className="p-4 w-[35%]">Indikator</th>
              <th className="p-4 w-[15%]">Capaian (24/25)</th>
              <th className="p-4 w-[15%]">Link File</th>
              <th className="p-4 w-[15%] text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="w-10 h-10 mb-2 opacity-20" />
                    Belum ada data indikator yang diisi atau dicari.
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => (
                <tr key={`${row.tatananId}-${row.indicatorId}`} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <span className="text-xs font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-1 rounded">
                      {row.tatananName.replace('Tatanan ', '')}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-slate-700 text-xs leading-relaxed line-clamp-3" title={row.indicatorText}>
                      {row.indicatorText}
                    </p>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                        <span className="text-slate-400">{year1}:</span>
                        <span className="font-medium text-slate-700">{row.capaianYear1 || '-'}</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-400">{year2}:</span>
                        <span className="font-medium text-slate-700">{row.capaianYear2 || '-'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="flex flex-col gap-2">
                      {row.evidenceYear1 ? (
                        <a href={row.evidenceYear1} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                          File {year1}
                        </a>
                      ) : <span className="text-slate-300 italic">No File {year1}</span>}
                      {row.evidenceYear2 ? (
                        <a href={row.evidenceYear2} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                          File {year2}
                        </a>
                      ) : <span className="text-slate-300 italic">No File {year2}</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => startEdit(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition" title="Edit Data">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteData(row.tatananId, row.indicatorId)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition" title="Hapus Data">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Editing Modal */}
      {editingRow && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl animate-scaleUp">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center z-10">
              <h4 className="font-bold text-[#166534]">Edit Data Indikator</h4>
              <button onClick={() => setEditingRow(null)} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer text-slate-500"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-500 font-semibold uppercase mb-1">{editingRow.tatananName}</p>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">{editingRow.indicatorText}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 2024 Data */}
                <div className="space-y-4">
                  <div className="bg-[#DCFCE7] text-[#166534] px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-center">Data {year1}</div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Capaian {year1}</label>
                    <input 
                      type="text" 
                      value={capaianYear1} 
                      onChange={(e) => setCapaianYear1(e.target.value)}
                      className="w-full text-sm border-2 border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-green-50 transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Link Bukti {year1} (URL)</label>
                    <input 
                      type="text" 
                      value={evidenceYear1} 
                      onChange={(e) => setEvidenceYear1(e.target.value)}
                      className="w-full text-sm border-2 border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-green-50 transition" 
                    />
                  </div>
                </div>

                {/* 2025 Data */}
                <div className="space-y-4">
                  <div className="bg-[#166534] text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-center">Data {year2}</div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Capaian {year2}</label>
                    <input 
                      type="text" 
                      value={capaianYear2} 
                      onChange={(e) => setCapaianYear2(e.target.value)}
                      className="w-full text-sm border-2 border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-green-50 transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Link Bukti {year2} (URL)</label>
                    <input 
                      type="text" 
                      value={evidenceYear2} 
                      onChange={(e) => setEvidenceYear2(e.target.value)}
                      className="w-full text-sm border-2 border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-green-50 transition" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 flex justify-end gap-3 rounded-b-2xl">
              <button 
                onClick={() => setEditingRow(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Batal
              </button>
              <button 
                onClick={saveEdit}
                className="flex items-center gap-2 px-5 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg text-sm font-semibold transition shadow-sm"
              >
                <Check className="w-4 h-4" /> Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
