import React, { useMemo } from 'react';
import { Download, AlertTriangle, FileText } from 'lucide-react';
import { KabupatenProposal } from '../types';
import { formatDynamicYearText } from '../utils';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface RekapBelumTerisiProps {
  proposal: KabupatenProposal;
  assessmentYear: number;
}

export function RekapBelumTerisi({ proposal, assessmentYear }: RekapBelumTerisiProps) {
  const year1 = assessmentYear - 2;
  const year2 = assessmentYear - 1;

  const isFilled = (val: string | undefined | null) => val && String(val).trim() !== '' && val !== 'not set' && val !== '-';

  // Calculate unfilled indicators
  const unfilledData = useMemo(() => {
    const data: any[] = [];
    
    proposal.tatanan.forEach(tatanan => {
      tatanan.indicators.forEach(ind => {
        const s = ind.score;
        const cY1 = s.capaianTahun?.[year1] || (s as any).capaian2024 || (s as any).capaianYear1;
        const cY2 = s.capaianTahun?.[year2] || (s as any).capaian2025 || (s as any).capaianYear2;
        const eY1 = s.evidenceTahun?.[year1] || (s as any).evidenceLink2024 || (s as any).evidenceYear1;
        const eY2 = s.evidenceTahun?.[year2] || s.evidenceLink || (s as any).evidenceYear2;

        const missingFields = [];
        
        if (!s.capaian || s.capaian <= 0) missingFields.push('Nilai Mandiri');
        if (!isFilled(cY1)) missingFields.push(`Capaian ${year1}`);
        if (!isFilled(cY2)) missingFields.push(`Capaian ${year2}`);
        if (!isFilled(eY1)) missingFields.push(`File ${year1}`);
        if (!isFilled(eY2)) missingFields.push(`File ${year2}`);
        if (!isFilled(s.penjelasan)) missingFields.push('Penjelasan OPD');

        if (missingFields.length > 0) {
          data.push({
            tatananName: tatanan.name,
            question: ind.question,
            missingFields,
            missingCount: missingFields.length
          });
        }
      });
    });

    return data;
  }, [proposal, year1, year2]);

  const handleExportExcel = () => {
    if (unfilledData.length === 0) {
      alert("Semua indikator telah terisi lengkap!");
      return;
    }

    const excelData = unfilledData.map((item, index) => ({
      'No': index + 1,
      'Tatanan': item.tatananName,
      'Indikator': formatDynamicYearText(item.question, assessmentYear),
      'Kekurangan Pengisian': item.missingFields.join(', '),
      'Jumlah Kosong': item.missingCount
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Belum Terisi");
    
    // Auto-size columns slightly
    const columnWidths = [
      { wch: 5 }, // No
      { wch: 40 }, // Tatanan
      { wch: 60 }, // Indikator
      { wch: 50 }, // Kekurangan Pengisian
      { wch: 15 }, // Jumlah Kosong
    ];
    worksheet['!cols'] = columnWidths;

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(dataBlob, `Rekap_Indikator_Belum_Terisi_${proposal.name}_${assessmentYear}.xlsx`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm w-full p-6 space-y-6 text-left animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded uppercase tracking-wider font-mono flex items-center gap-1.5 w-fit">
            <AlertTriangle className="w-3.5 h-3.5" /> Action Required
          </span>
          <h3 className="text-lg font-bold text-slate-800 mt-2 leading-snug">
            Rekapitulasi Indikator Belum Lengkap
          </h3>
          <p className="text-xs text-slate-500">
            Daftar indikator yang belum diisi secara penuh (membutuhkan 6 elemen: 2 Capaian, 2 File, Nilai Mandiri, dan Penjelasan).
          </p>
        </div>
        
        <button
          onClick={handleExportExcel}
          disabled={unfilledData.length === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            unfilledData.length === 0 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-[#16A34A] hover:bg-[#15803D] text-white cursor-pointer hover:shadow-md'
          }`}
        >
          <Download className="w-4 h-4" /> Export Excel
        </button>
      </div>

      {/* Stats Summary */}
      <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-xl flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-800">
            Total {unfilledData.length} Indikator Belum Lengkap
          </h4>
          <p className="text-[11px] text-amber-700/80 mt-0.5">
            Silakan lengkapi bagian yang kosong pada masing-masing tatanan agar dapat memenuhi passing grade.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <th className="p-3 font-semibold text-center w-12">No</th>
              <th className="p-3 font-semibold">Tatanan</th>
              <th className="p-3 font-semibold">Pertanyaan Indikator</th>
              <th className="p-3 font-semibold">Elemen yang Kosong</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {unfilledData.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-2">
                      <span className="text-green-500 text-2xl">🎉</span>
                    </div>
                    <p className="font-bold text-slate-700">Luar Biasa!</p>
                    <p className="text-slate-500">Semua indikator pada seluruh tatanan telah diisi dengan lengkap.</p>
                  </div>
                </td>
              </tr>
            ) : (
              unfilledData.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 text-center text-slate-500 font-medium align-top">{index + 1}</td>
                  <td className="p-3 font-medium text-slate-700 align-top">
                    {item.tatananName}
                  </td>
                  <td className="p-3 text-slate-600 align-top max-w-md">
                    {formatDynamicYearText(item.question, assessmentYear)}
                  </td>
                  <td className="p-3 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {item.missingFields.map((field: string, idx: number) => (
                        <span 
                          key={idx} 
                          className="px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded text-[10px] font-semibold whitespace-nowrap"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
