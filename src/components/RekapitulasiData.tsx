import React, { useState, useMemo } from 'react';
import { KabupatenProposal } from '../types';
import { Download, Edit, Trash2, FileText, Search, X, Check } from 'lucide-react';
import * as XLSX from 'xlsx';

interface RekapitulasiDataProps {
  proposal: KabupatenProposal;
  onUpdateProposal: (updated: KabupatenProposal) => void;
}

export function RekapitulasiData({ proposal, onUpdateProposal }: RekapitulasiDataProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // States for Editing
  const [editingRow, setEditingRow] = useState<any>(null);
  const [capaian2024, setCapaian2024] = useState('');
  const [capaian2025, setCapaian2025] = useState('');
  const [evidenceLink2024, setEvidenceLink2024] = useState('');
  const [evidenceLink2025, setEvidenceLink2025] = useState(''); // assuming this field is used for 2025 evidence, wait, the type is just evidenceLink.
  // Actually, evidenceLink is for 2025, evidenceLink2024 is for 2024.
  const [evidenceLink, setEvidenceLink] = useState('');
  
  // Aggregate all filled indicators
  const allData = useMemo(() => {
    let data: any[] = [];
    proposal.tatanan?.forEach(t => {
      t.indicators.forEach(ind => {
        // Only include if there is some data filled in
        if (ind.score.capaian2024 || ind.score.capaian2025 || ind.score.evidenceLink || ind.score.evidenceLink2024) {
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

  // Filter based on search term
  const filteredData = allData.filter(d => 
    d.indicatorText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.tatananName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBackup = (year: '2024' | '2025') => {
    // Prepare data for export
    const exportData = filteredData.map((d, index) => {
      if (year === '2024') {
        return {
          'No': index + 1,
          'Tatanan': d.tatananName.replace('Tatanan ', ''),
          'Indikator': d.indicatorText,
          'Capaian 2024': d.capaian2024 || '-',
          'Link Bukti (2024)': d.evidenceLink2024 || '-'
        };
      } else {
        return {
          'No': index + 1,
          'Tatanan': d.tatananName.replace('Tatanan ', ''),
          'Indikator': d.indicatorText,
          'Capaian 2025': d.capaian2025 || '-',
          'Link Bukti (2025)': d.evidenceLink || '-'
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

  const startEdit = (row: any) => {
    setEditingRow(row);
    setCapaian2024(row.capaian2024 || '');
    setCapaian2025(row.capaian2025 || '');
    setEvidenceLink2024(row.evidenceLink2024 || '');
    setEvidenceLink(row.evidenceLink || '');
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
                  capaian2024,
                  capaian2025,
                  evidenceLink2024,
                  evidenceLink
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
                  capaian2024: '',
                  capaian2025: '',
                  evidenceLink2024: '',
                  evidenceLink: '',
                  capaian: 0
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
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleBackup('2024')}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition"
          >
            <Download className="w-4 h-4" /> Backup Excel 2024
          </button>
          <button 
            onClick={() => handleBackup('2025')}
            className="flex items-center gap-2 px-3 py-2 bg-[#166534] text-white hover:bg-[#15803D] rounded-lg text-xs font-semibold transition shadow-sm"
          >
            <Download className="w-4 h-4" /> Backup Excel 2025
          </button>
        </div>
      </div>

      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input 
          type="text" 
          placeholder="Cari indikator atau tatanan..." 
          className="bg-transparent text-sm w-full outline-none text-slate-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
                        <span className="text-slate-400">2024:</span>
                        <span className="font-medium text-slate-700">{row.capaian2024 || '-'}</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-400">2025:</span>
                        <span className="font-medium text-slate-700">{row.capaian2025 || '-'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="flex flex-col gap-2">
                      {row.evidenceLink2024 ? (
                        <a href={row.evidenceLink2024} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                          File 2024
                        </a>
                      ) : <span className="text-slate-300 italic">No File 2024</span>}
                      {row.evidenceLink ? (
                        <a href={row.evidenceLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                          File 2025
                        </a>
                      ) : <span className="text-slate-300 italic">No File 2025</span>}
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
                  <div className="bg-[#DCFCE7] text-[#166534] px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-center">Data 2024</div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Capaian 2024</label>
                    <input 
                      type="text" 
                      value={capaian2024} 
                      onChange={(e) => setCapaian2024(e.target.value)}
                      className="w-full text-sm border-2 border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-green-50 transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Link Bukti 2024 (URL)</label>
                    <input 
                      type="text" 
                      value={evidenceLink2024} 
                      onChange={(e) => setEvidenceLink2024(e.target.value)}
                      className="w-full text-sm border-2 border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-green-50 transition" 
                    />
                  </div>
                </div>

                {/* 2025 Data */}
                <div className="space-y-4">
                  <div className="bg-[#166534] text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-center">Data 2025</div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Capaian 2025</label>
                    <input 
                      type="text" 
                      value={capaian2025} 
                      onChange={(e) => setCapaian2025(e.target.value)}
                      className="w-full text-sm border-2 border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-green-50 transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Link Bukti 2025 (URL)</label>
                    <input 
                      type="text" 
                      value={evidenceLink} 
                      onChange={(e) => setEvidenceLink(e.target.value)}
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
