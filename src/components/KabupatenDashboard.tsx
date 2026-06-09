import React, { useState } from 'react';
import { 
  FileText, UploadCloud, CheckCircle2, AlertTriangle, 
  ChevronRight, Save, Send, Award, Activity, 
  HelpCircle, ClipboardList, Info, Trash2, X, ChevronDown, ChevronUp, User, Loader2
} from 'lucide-react';
import { KabupatenProposal, TatananAssessment, INITIAL_TATANAN_STRUCTURE } from '../types';
import { getProposalStats } from '../utils';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

interface KabupatenDashboardProps {
  proposal: KabupatenProposal;
  onUpdateProposal: (updated: KabupatenProposal) => void;
  isLockedByDeadline: boolean;
  activeMenu?: string;
}

export function KabupatenDashboard({ 
  proposal, 
  onUpdateProposal, 
  isLockedByDeadline,
  activeMenu = 'dashboard'
}: KabupatenDashboardProps) {
  
  const stats = getProposalStats(proposal);

  // Identity edit states so the user can label the app as their own Kabupaten/Kota
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [identityName, setIdentityName] = useState(proposal.name);
  const [identityProvinsi, setIdentityProvinsi] = useState(proposal.provinsi);
  const [identityAwardTarget, setIdentityAwardTarget] = useState<any>(proposal.awardTarget);

  const handleSaveIdentity = () => {
    onUpdateProposal({
      ...proposal,
      name: identityName,
      provinsi: identityProvinsi,
      awardTarget: identityAwardTarget
    });
    setIsEditingIdentity(false);
  };

  // States for Document upload forms
  const [editingDocType, setEditingDocType] = useState<'skTim' | 'skForum' | 'renja' | null>(null);
  const [docNomor, setDocNomor] = useState('');
  const [docTanggal, setDocTanggal] = useState('');
  const [docUrl, setDocUrl] = useState('');

  // Tatanan edit states
  const activeTatanan = activeMenu.startsWith('tatanan-') 
    ? (proposal.tatanan || []).find(t => t.id === activeMenu.replace('tatanan-', ''))
    : null;
  const selectedTatananId = activeTatanan ? activeTatanan.id : null;

  const [indicatorScores, setIndicatorScores] = useState<Record<string, number>>({});
  const [indicatorLinks, setIndicatorLinks] = useState<Record<string, string>>({});
  
  // SIPANTAS Specific detailed states
  const [capaian2024, setCapaian2024] = useState<Record<string, string>>({});
  const [capaian2025, setCapaian2025] = useState<Record<string, string>>({});
  const [evidenceLink2024, setEvidenceLink2024] = useState<Record<string, string>>({});
  const [penjelasan, setPenjelasan] = useState<Record<string, string>>({});
  const [editingIndicatorId, setEditingIndicatorId] = useState<string | null>(null);
  const [isIndicatorInfoOpen, setIsIndicatorInfoOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadingIndicatorFiles, setUploadingIndicatorFiles] = useState<Record<string, boolean>>({});

  const handleIndicatorFileUpload = async (indicatorId: string, year: '2024' | '2025', file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Gagal mengunggah: Ukuran file melebihi batas maksimal 5 MB!");
      return;
    }
    
    const uploadKey = `${indicatorId}-${year}`;
    setUploadingIndicatorFiles(prev => ({ ...prev, [uploadKey]: true }));
    
    try {
      const tatananId = activeTatanan?.id || 'unknown';
      const storageRef = ref(storage, `proposals/${proposal.id}/${tatananId}/${indicatorId}/${year}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      if (year === '2024') {
        setEvidenceLink2024(prev => ({ ...prev, [indicatorId]: downloadURL }));
      } else {
        setIndicatorLinks(prev => ({ ...prev, [indicatorId]: downloadURL }));
      }
      
      alert(`File ${year} berhasil diunggah! Link telah tersimpan.`);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Gagal mengunggah file ${year}. Pastikan File berukuran di bawah 5MB dan aturan Firebase Storage sudah diset.`);
    } finally {
      setUploadingIndicatorFiles(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  // Trigger editing a legal aspect
  const startEditDoc = (type: 'skTim' | 'skForum' | 'renja') => {
    const docField = type === 'skTim' ? proposal.skTimPembina 
                   : type === 'skForum' ? proposal.skForumPokja 
                   : proposal.renja;
                   
    setEditingDocType(type);
    setDocNomor(docField.nomor || '');
    setDocTanggal(docField.tanggal || '');
    setDocUrl(docField.fileUrl || '');
  };

  const saveDocField = () => {
    if (!editingDocType) return;
    
    const updated = { ...proposal };
    const fieldData = {
      nomor: docNomor,
      tanggal: docTanggal,
      fileUrl: docUrl,
      status: 'Pending' as const // Moves back to pending validation upon upload/edit
    };

    if (editingDocType === 'skTim') updated.skTimPembina = fieldData;
    else if (editingDocType === 'skForum') updated.skForumPokja = fieldData;
    else updated.renja = fieldData;

    updated.lastUpdated = new Date().toISOString();
    onUpdateProposal(updated);
    setEditingDocType(null);
  };

  // Open assessment modal/panel for a tatanan (Populate fields via useEffect)
  React.useEffect(() => {
    if (activeTatanan) {
      setEditingIndicatorId(null);
      setCurrentPage(1);
      
      const scores: Record<string, number> = {};
      const links: Record<string, string> = {};
      const cap24: Record<string, string> = {};
      const cap25: Record<string, string> = {};
      const ev24: Record<string, string> = {};
      const penjel: Record<string, string> = {};
      
      activeTatanan.indicators.forEach(ind => {
        scores[ind.id] = ind.score.capaian || 0;
        links[ind.id] = ind.score.evidenceLink || '';
        cap24[ind.id] = ind.score.capaian2024 || '';
        cap25[ind.id] = ind.score.capaian2025 || '';
        ev24[ind.id] = ind.score.evidenceLink2024 || '';
        penjel[ind.id] = ind.score.penjelasan || '';
      });
      
      setIndicatorScores(scores);
      setIndicatorLinks(links);
      setCapaian2024(cap24);
      setCapaian2025(cap25);
      setEvidenceLink2024(ev24);
      setPenjelasan(penjel);
    }
  }, [activeTatanan?.id]);

  const saveTatananAssess = () => {
    if (!selectedTatananId) return;

    const updated = { ...proposal };
    updated.tatanan = updated.tatanan.map(t => {
      if (t.id === selectedTatananId) {
        return {
          ...t,
          status: 'Ditinjau' as const, // Changes to under-evaluation
          indicators: t.indicators.map(ind => ({
            ...ind,
            score: {
              ...ind.score,
              capaian: indicatorScores[ind.id] !== undefined ? indicatorScores[ind.id] : 0,
              evidenceLink: indicatorLinks[ind.id] || '',
              capaian2024: capaian2024[ind.id] || '',
              capaian2025: capaian2025[ind.id] || '',
              evidenceLink2024: evidenceLink2024[ind.id] || '',
              penjelasan: penjelasan[ind.id] || ''
            }
          }))
        };
      }
      return t;
    });

    updated.lastUpdated = new Date().toISOString();
    onUpdateProposal(updated);
    setEditingIndicatorId(null);
  };

  const submitToProvinsi = () => {
    // Confirm minimum readiness first
    const updated = { ...proposal };
    updated.status = 'Menunggu Verifikasi Provinsi';
    updated.lastUpdated = new Date().toISOString();
    onUpdateProposal(updated);
  };

  // Status Badge styling helper
  const getBadgeClass = (status: string) => {
    switch(status) {
      case 'Draft': return 'bg-[#DCFCE7] text-[#166534]';
      case 'Menunggu Verifikasi Provinsi': return 'bg-amber-100/80 text-amber-800 border border-amber-200';
      case 'Revisi Provinsi': return 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse';
      case 'Disetujui Provinsi/Menunggu Pusat': return 'bg-[#16A34A] text-white';
      case 'Verifikasi Pusat': return 'bg-[#166534] text-white';
      case 'Selesai': return 'bg-[#86EFAC] text-[#166534] font-semibold';
      default: return 'bg-[#DCFCE7] text-[#166534]';
    }
  };

  // Is editing forms disabled due to submission status or global timelock
  const isFormDisabled = isLockedByDeadline || 
    (proposal.status !== 'Draft' && proposal.status !== 'Revisi Provinsi');

  // If a Tatanan is selected, render ONLY the Tatanan view (Full page)
  if (activeTatanan) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm w-full p-6 space-y-6 text-left animate-fadeIn">
        {/* Drawer Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-1 rounded uppercase tracking-wider font-mono">
              SIPANTAS KKS • Instrumen Penilaian Mandiri
            </span>
            <h3 className="text-lg font-bold text-[#166534] mt-2 leading-snug">
              {activeTatanan.name}
            </h3>
          </div>
        </div>

        {/* Instruction Callout */}
        <div className="flex items-start gap-2.5 p-3.5 bg-[#DCFCE7]/50 border border-[#86EFAC]/30 rounded-xl text-xs text-[#166534]">
          <Info className="w-5 h-5 shrink-0 text-[#16A34A] mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Panduan Pengisian Indikator:</p>
            <p className="leading-relaxed opacity-90">
              Untuk setiap indikator di bawah ini, berikan penilaian angka mandiri (0–100), isi besaran capaian tahun 2024 & 2025, lampirkan link folder dokumen bukti fisik dari OPD pengampu, serta tulis penjelasan deskriptif singkat. Klik tombol <span className="font-semibold text-[#16A34A]">✎ Edit</span> pada kolom Aksi untuk mengisi data masing-masing indikator.
            </p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex justify-between items-center mb-4 text-sm text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select className="border border-slate-300 rounded px-2 py-1 outline-none focus:border-blue-400 bg-white">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input type="text" className="border border-slate-300 rounded px-2 py-1 outline-none focus:border-blue-400 w-48" />
          </div>
        </div>

        {/* SIPANTAS Real-Style Indicators Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#166534] text-white border-b border-slate-200">
                <th scope="col" className="p-3 font-semibold text-center text-[10px] uppercase align-middle cursor-pointer group border-r border-[#BBF7D0]/15 font-mono">NO <span className="text-[10px] opacity-40 ml-1 group-hover:opacity-100">⇅</span></th>
                <th scope="col" className="p-3 font-semibold text-center text-[10px] uppercase align-middle cursor-pointer group border-r border-[#BBF7D0]/15">INDIKATOR <span className="text-[10px] opacity-40 ml-1 group-hover:opacity-100">⇅</span></th>
                <th scope="col" className="p-3 font-semibold text-center text-[10px] uppercase align-middle cursor-pointer group leading-snug border-r border-[#BBF7D0]/15">CAPAIAN SEHAT MANDIRI<br/>SAMPAI DENGAN TAHUN<br/>2024 <span className="text-[10px] opacity-40 ml-1 group-hover:opacity-100">⇅</span></th>
                <th scope="col" className="p-3 font-semibold text-center text-[10px] uppercase align-middle cursor-pointer group leading-snug border-r border-[#BBF7D0]/15">CAPAIAN SEHAT MANDIRI<br/>SAMPAI DENGAN TAHUN<br/>2025 <span className="text-[10px] opacity-40 ml-1 group-hover:opacity-100">⇅</span></th>
                <th scope="col" className="p-3 font-semibold text-center text-[10px] uppercase align-middle cursor-pointer group leading-snug border-r border-[#BBF7D0]/15">NILAI<br/>MANDIRI <span className="text-[10px] opacity-40 ml-1 group-hover:opacity-100">⇅</span></th>
                <th scope="col" className="p-3 font-semibold text-center text-[10px] uppercase align-middle cursor-pointer group leading-snug border-r border-[#BBF7D0]/15">FILE SEHAT<br/>MANDIRI 2024 <span className="text-[10px] opacity-40 ml-1 group-hover:opacity-100">⇅</span></th>
                <th scope="col" className="p-3 font-semibold text-center text-[10px] uppercase align-middle cursor-pointer group leading-snug border-r border-[#BBF7D0]/15">FILE SEHAT<br/>MANDIRI 2025 <span className="text-[10px] opacity-40 ml-1 group-hover:opacity-100">⇅</span></th>
                <th scope="col" className="p-3 font-semibold text-center text-[10px] uppercase align-middle cursor-pointer group leading-snug border-r border-[#BBF7D0]/15">PENJELASAN<br/>OPD <span className="text-[10px] opacity-40 ml-1 group-hover:opacity-100">⇅</span></th>
                <th scope="col" className="p-3 font-semibold text-center text-[10px] uppercase align-middle cursor-pointer group leading-snug border-r border-[#BBF7D0]/15">VERIFIKASI<br/>KABUPATEN <span className="text-[10px] opacity-40 ml-1 group-hover:opacity-100">⇅</span></th>
                <th scope="col" className="p-3 font-semibold text-center text-[10px] uppercase align-middle cursor-pointer group leading-snug border-r border-[#BBF7D0]/15">STATUS <span className="text-[10px] opacity-40 ml-1 group-hover:opacity-100">⇅</span></th>
                <th scope="col" className="p-3 font-semibold text-center text-[10px] uppercase align-middle cursor-pointer group">AKSI <span className="text-[10px] opacity-40 ml-1 group-hover:opacity-100">⇅</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {activeTatanan.indicators.slice((currentPage - 1) * 10, currentPage * 10).map((ind, mapIndex) => {
                const i = (currentPage - 1) * 10 + mapIndex;
                const score = indicatorScores[ind.id] || 0;
                const c2024 = capaian2024[ind.id] || '';
                const c2025 = capaian2025[ind.id] || '';
                const link2024 = evidenceLink2024[ind.id] || '';
                const link2025 = indicatorLinks[ind.id] || '';
                const explanation = penjelasan[ind.id] || '';
                const statusProv = ind.score.statusProvinsi || 'Draft';
                const feedbackProv = ind.score.penjelasanProvinsi || '-';

                return (
                  <tr key={ind.id} className={i % 2 === 0 ? "bg-white" : "bg-[#F8F9FA]"}>
                    <td className="p-3 text-center border-b border-slate-100 text-xs text-slate-700">{i + 1}</td>
                    <td className="p-3 text-center border-b border-slate-100 text-xs text-slate-700 max-w-[280px]">
                      {ind.question}
                    </td>
                    <td className="p-3 text-center border-b border-slate-100 text-xs text-slate-700">
                      {c2024 || '-'}
                    </td>
                    <td className="p-3 text-center border-b border-slate-100 text-xs text-slate-700">
                      {c2025 || '-'}
                    </td>
                    <td className="p-3 text-center border-b border-slate-100 text-xs text-slate-700">
                      {score === 0 ? '-' : score}
                    </td>
                    <td className="p-3 text-center border-b border-slate-100 text-xs text-slate-700">
                      {link2024 ? 'Ada' : '-'}
                    </td>
                    <td className="p-3 text-center border-b border-slate-100 text-xs text-slate-700">
                      {link2025 ? 'Ada' : '-'}
                    </td>
                    <td className="p-3 text-center border-b border-slate-100 text-xs text-slate-700">
                      {explanation || '-'}
                    </td>
                    <td className="p-3 text-center border-b border-slate-100 text-xs text-slate-700">
                      {statusProv === 'Draft' ? '-' : statusProv} | {feedbackProv}
                    </td>
                    <td className="p-3 text-center border-b border-slate-100 text-xs">
                      {score === 0 && !c2024 && !c2025 ? (
                        <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide">
                          Kosong
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center border-b border-slate-100">
                      <button
                        type="button"
                        disabled={isFormDisabled}
                        onClick={() => setEditingIndicatorId(ind.id)}
                        className={`px-3 py-1.5 rounded text-[11px] font-bold transition flex items-center gap-1 mx-auto ${
                          isFormDisabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#F6AD55] hover:bg-[#DD6B20] text-white cursor-pointer'
                        }`}
                      >
                        <FileText className="w-3 h-3" /> Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border border-t-0 border-slate-200 rounded-b-xl -mt-6">
          <div className="text-sm text-slate-500 font-medium">
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, activeTatanan.indicators.length)} of {activeTatanan.indicators.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm bg-slate-100 text-slate-400 rounded disabled:opacity-50 hover:bg-slate-200 cursor-pointer"
            >
              &lt;
            </button>
            {Array.from({ length: Math.ceil(activeTatanan.indicators.length / 10) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3.5 py-1.5 text-sm rounded font-medium cursor-pointer transition ${
                  currentPage === idx + 1 
                    ? 'bg-[#7066E0] text-white' 
                    : 'bg-transparent text-slate-600 hover:bg-slate-100'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(activeTatanan.indicators.length / 10), p + 1))}
              disabled={currentPage === Math.ceil(activeTatanan.indicators.length / 10)}
              className="px-3 py-1.5 text-sm bg-slate-100 text-slate-400 rounded disabled:opacity-50 hover:bg-slate-200 cursor-pointer"
            >
              &gt;
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-100">
          <button
            onClick={saveTatananAssess}
            disabled={isFormDisabled}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-sm ${
              isFormDisabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#16A34A] hover:bg-[#166534] text-white cursor-pointer active:scale-95'
            }`}
          >
            <Save className="w-4 h-4" /> Simpan Data
          </button>
        </div>

        {/* Inner Overlaid Editing Form for Specific Selected Indicator */}
        {editingIndicatorId && (() => {
          const ind = activeTatanan.indicators.find(i => i.id === editingIndicatorId);
          return (
            <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden text-left">
                
                {/* Header */}
                <div className="border-b border-slate-200 px-5 py-4 flex justify-between items-center text-slate-800">
                  <h3 className="font-medium text-sm text-slate-700">
                    Input Data Indikator {ind?.question}
                  </h3>
                  <button onClick={() => setEditingIndicatorId(null)} className="text-slate-400 hover:text-slate-600 transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* Collapsible Info */}
                  <div className="border border-[#16A34A] rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setIsIndicatorInfoOpen(!isIndicatorInfoOpen)}
                      className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white px-4 py-3 flex items-center justify-between transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <FileText className="w-4 h-4" /> Keterangan Indikator
                      </div>
                      {isIndicatorInfoOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    
                    {isIndicatorInfoOpen && (() => {
                      const referenceTatanan = INITIAL_TATANAN_STRUCTURE.find(t => t.id === selectedTatananId);
                      const referenceInd = referenceTatanan?.indicators.find(i => i.id === ind?.id);
                      
                      return (
                      <div className="p-4 bg-white text-[13px] text-slate-700">
                        <table className="w-full text-left border-collapse">
                          <tbody>
                            <tr className="border-b border-slate-100 last:border-0">
                              <td className="py-3 pr-4 font-medium align-top w-1/4">Definisi Operasional</td>
                              <td className="py-3 px-2 align-top w-4 text-center">:</td>
                              <td className="py-3 pl-2 align-top">
                                {referenceInd?.definisiOperasional || ind?.definisiOperasional || '-'}
                              </td>
                            </tr>
                            <tr className="border-b border-slate-100 last:border-0 bg-slate-50">
                              <td className="py-3 pr-4 font-medium align-top w-1/4">Sumber Data</td>
                              <td className="py-3 px-2 align-top w-4 text-center">:</td>
                              <td className="py-3 pl-2 align-top">
                                {referenceInd?.sumberData || ind?.sumberData || '-'}
                              </td>
                            </tr>
                            <tr className="border-b border-slate-100 last:border-0">
                              <td className="py-3 pr-4 font-medium align-top w-1/4">Bukti Dukung</td>
                              <td className="py-3 px-2 align-top w-4 text-center">:</td>
                              <td className="py-3 pl-2 align-top">
                                {referenceInd?.buktiDukung || ind?.buktiDukung || '-'}
                              </td>
                            </tr>
                            <tr className="last:border-0">
                              <td className="py-3 pr-4 font-medium align-top w-1/4">Skala/Kategori Penilaian</td>
                              <td className="py-3 px-2 align-top w-4 text-center">:</td>
                              <td className="py-3 pl-2 align-top">
                                <ul className="space-y-1">
                                  {(referenceInd?.skala || ind?.skala)?.map((s, idx) => (
                                    <li key={idx}>{idx + 1}. Nilai {s.nilai} jika {s.deskripsi.replace(/^[a-z]\.\s*/, '')}</li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      );
                    })()}
                  </div>

                  {/* Grid Forms */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    
                    {/* Left Col */}
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700">Capaian 2024 <span className="text-red-500">*</span></label>
                        <input 
                          type="text"
                          value={capaian2024[editingIndicatorId] || ''}
                          onChange={(e) => setCapaian2024({ ...capaian2024, [editingIndicatorId]: e.target.value })}
                          placeholder="Capaian 2024"
                          className="w-full text-sm p-2.5 border border-slate-300 rounded focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] outline-none transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700">Capaian 2025 <span className="text-red-500">*</span></label>
                        <input 
                          type="text"
                          value={capaian2025[editingIndicatorId] || ''}
                          onChange={(e) => setCapaian2025({ ...capaian2025, [editingIndicatorId]: e.target.value })}
                          placeholder="Capaian 2025"
                          className="w-full text-sm p-2.5 border border-slate-300 rounded focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] outline-none transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700">Nilai Mandiri <span className="text-red-500">*</span></label>
                        <select
                          value={indicatorScores[editingIndicatorId] === undefined ? '' : indicatorScores[editingIndicatorId]}
                          onChange={(e) => setIndicatorScores({ ...indicatorScores, [editingIndicatorId]: Number(e.target.value) })}
                          className="w-full text-sm p-2.5 border border-slate-300 rounded focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] outline-none transition bg-white"
                        >
                          <option value="" disabled>Pilih Skala Penilaian</option>
                          {ind?.skala?.map((s, idx) => (
                            <option key={idx} value={s.nilai}>Nilai {s.nilai}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Right Col */}
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700">File 2024 <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input 
                            type="file"
                            onChange={(e) => handleIndicatorFileUpload(editingIndicatorId, '2024', e.target.files?.[0] || null)}
                            disabled={uploadingIndicatorFiles[`${editingIndicatorId}-2024`]}
                            className="w-full text-sm border border-slate-300 p-1.5 rounded bg-white file:mr-4 file:py-1 file:px-3 file:rounded file:border file:border-slate-300 file:bg-slate-100 file:text-sm hover:file:bg-slate-200 cursor-pointer disabled:opacity-50"
                          />
                          {uploadingIndicatorFiles[`${editingIndicatorId}-2024`] && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Loader2 className="w-4 h-4 animate-spin text-[#16A34A]" />
                            </div>
                          )}
                        </div>
                        {evidenceLink2024[editingIndicatorId] && (
                          <a href={evidenceLink2024[editingIndicatorId]} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline block mt-1">
                            Lihat File 2024 yang Tersimpan
                          </a>
                        )}
                        <p className="text-[11px] text-red-500 mt-1">Maksimal Ukuran file 5 MB dan Ekstensi file .pdf, .docx, .doc, .xls, .xlsx</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700">File 2025 <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input 
                            type="file"
                            onChange={(e) => handleIndicatorFileUpload(editingIndicatorId, '2025', e.target.files?.[0] || null)}
                            disabled={uploadingIndicatorFiles[`${editingIndicatorId}-2025`]}
                            className="w-full text-sm border border-slate-300 p-1.5 rounded bg-white file:mr-4 file:py-1 file:px-3 file:rounded file:border file:border-slate-300 file:bg-slate-100 file:text-sm hover:file:bg-slate-200 cursor-pointer disabled:opacity-50"
                          />
                          {uploadingIndicatorFiles[`${editingIndicatorId}-2025`] && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Loader2 className="w-4 h-4 animate-spin text-[#16A34A]" />
                            </div>
                          )}
                        </div>
                        {indicatorLinks[editingIndicatorId] && (
                          <a href={indicatorLinks[editingIndicatorId]} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline block mt-1">
                            Lihat File 2025 yang Tersimpan
                          </a>
                        )}
                        <p className="text-[11px] text-red-500 mt-1">Maksimal Ukuran file 5 MB dan Ekstensi file .pdf, .docx, .doc, .xls, .xlsx</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700">Penjelasan OPD <span className="text-red-500">*</span></label>
                        <textarea 
                          rows={2}
                          value={penjelasan[editingIndicatorId] || ''}
                          onChange={(e) => setPenjelasan({ ...penjelasan, [editingIndicatorId]: e.target.value })}
                          placeholder="Penjelasan"
                          className="w-full text-sm p-2.5 border border-slate-300 rounded focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] outline-none transition resize-none"
                        />
                      </div>
                    </div>

                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-white">
                  <button
                    onClick={() => setEditingIndicatorId(null)}
                    className="px-6 py-2 rounded text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={saveTatananAssess}
                    className="px-6 py-2 rounded text-sm font-medium text-white bg-[#5C6BC0] hover:bg-[#3F51B5] transition shadow-sm cursor-pointer"
                  >
                    Simpan
                  </button>
                </div>

              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  return (
    <div className="space-y-8" id="kabupaten-dashboard-container">
      {/* Top Welcome Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-[#BBF7D0] shadow-md text-left">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold font-display text-[#166534]">
              Portal e-Monev {proposal.name}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeClass(proposal.status)}`}>
              {proposal.status}
            </span>
            <button
              onClick={() => setIsEditingIdentity(!isEditingIdentity)}
              className="text-xs text-[#16A34A] hover:text-[#166534] font-bold bg-[#DCFCE7] px-2.5 py-1 rounded-lg hover:underline cursor-pointer"
            >
              ⚙ Edit Identitas Daerah
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Wilayah Administrasi: <span className="font-semibold text-slate-700">{proposal.provinsi}</span> • Sasaran KKS: <span className="font-semibold text-[#16A34A]">{proposal.awardTarget}</span>
          </p>
        </div>
        
        {/* Usulan Submit Trigger */}
        <div className="flex items-center gap-3">
          {proposal.status === 'Revisi Provinsi' && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg font-medium border border-rose-100">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Ada catatan revisi dari Provinsi!
            </div>
          )}

          <button
            onClick={submitToProvinsi}
            disabled={isFormDisabled || !stats.isCoreAspectsValid || stats.filledCount < 5}
            id="btn-kirim-provinsi"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
              (isFormDisabled || !stats.isCoreAspectsValid || stats.filledCount < 5)
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-[#16A34A] hover:bg-[#166534] text-white shadow-md shadow-[#16A34A]/20 active:scale-95'
            }`}
          >
            <Send className="w-4 h-4" />
            Kirim Pengusulan KKS
          </button>
        </div>
      </div>

      {/* Collapsible Identity Editor */}
      {isEditingIdentity && (
        <div className="bg-white border border-[#BBF7D0] shadow-md rounded-2xl p-6 text-left space-y-4 animate-scaleUp">
          <div className="border-b border-[#BBF7D0] pb-2.5">
            <h3 className="text-sm font-bold text-[#166534] uppercase tracking-wider font-mono">⚙ Pengaturan Kategori & Identitas Daerah Pengusul</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Nama Kabupaten / Kota</label>
              <input
                type="text"
                value={identityName}
                onChange={(e) => setIdentityName(e.target.value)}
                placeholder="Contoh: Kabupaten Kuningan"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-[#16A34A]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Provinsi</label>
              <input
                type="text"
                value={identityProvinsi}
                onChange={(e) => setIdentityProvinsi(e.target.value)}
                placeholder="Contoh: Jawa Barat"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-[#16A34A]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Target Swasti Saba</label>
              <select
                value={identityAwardTarget}
                onChange={(e) => setIdentityAwardTarget(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-[#16A34A]"
              >
                <option value="Padapa">Padapa (Min. 5 Tatanan)</option>
                <option value="Wiwerda">Wiwerda (Min. 7 Tatanan)</option>
                <option value="Wistara">Wistara (9 Tatanan Lengkap)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setIdentityName(proposal.name);
                setIdentityProvinsi(proposal.provinsi);
                setIdentityAwardTarget(proposal.awardTarget);
                setIsEditingIdentity(false);
              }}
              className="px-4 py-2 text-xs font-semibold hover:bg-slate-100 text-slate-600 rounded-lg"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSaveIdentity}
              className="px-5 py-2 text-xs font-bold bg-[#16A34A] hover:bg-[#166534] text-white rounded-lg transition"
            >
              Simpan Perubahan ✔
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Left Side Data Input, Right Side Swasti Saba Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (Col Span 2) - Input Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 9 Tatanan KKS Assessment Matrix */}
          <div className="bg-white rounded-2xl border border-[#BBF7D0] shadow-md p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#BBF7D0] pb-4">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-[#16A34A]" />
                <h2 className="text-lg font-bold font-display text-[#166534]">Capaian Indikator (9 Tatanan KKS)</h2>
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                Pilih Tatanan untuk melengkapi instrumen self-assessment
              </span>
            </div>

            {/* Grid of 9 Tatanan cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proposal.tatanan.map((t, index) => {
                const totalIndicators = t.indicators.length;
                const filledIndicators = t.indicators.filter(ind => {
                  const s = ind.score;
                  const isFilled = (val: string | undefined) => val && val.trim() !== '' && val !== 'not set' && val !== '-';
                  return s.capaian > 0 && 
                         isFilled(s.capaian2024) && 
                         isFilled(s.capaian2025) && 
                         isFilled(s.evidenceLink2024) && 
                         isFilled(s.evidenceLink) && 
                         isFilled(s.penjelasan);
                }).length;
                const progressPercent = totalIndicators > 0 ? Math.round((filledIndicators / totalIndicators) * 100) : 0;
                const isTatananCompleted = filledIndicators > 0;

                return (
                  <div 
                    key={t.id}
                    onClick={() => openTatananAssess(t)}
                    className={`border rounded-xl p-4 transition-all duration-200 text-left hover:shadow-sm group cursor-pointer flex flex-col justify-between ${
                      selectedTatananId === t.id 
                        ? 'border-[#166534] bg-[#DCFCE7]/50 ring-1 ring-[#166534]' 
                        : isTatananCompleted 
                          ? 'border-[#86EFAC]/40 bg-[#F0FDF4]/30 hover:border-[#86EFAC]' 
                          : 'border-[#BBF7D0] hover:border-[#86EFAC] bg-[#F0FDF4]/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#16A34A] tracking-wide uppercase font-mono">Tatanan {index + 1}</span>
                        <h4 className="text-xs font-bold text-[#166534] group-hover:text-[#16A34A] leading-snug line-clamp-2">
                          {t.name}
                        </h4>
                      </div>
                      
                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm font-mono ${
                          progressPercent === 100 
                            ? 'text-emerald-800 bg-emerald-100' 
                            : progressPercent > 0 
                              ? 'text-amber-800 bg-amber-100' 
                              : 'text-slate-500 bg-slate-100'
                        }`}>
                          {progressPercent}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Progress Pengisian</span>
                        <span className="font-medium text-slate-700">{filledIndicators} / {totalIndicators} Indikator</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-500 ${progressPercent === 100 ? 'bg-[#16A34A]' : 'bg-amber-500'}`}
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Dynamic Swasti Saba Requirements Tracker */}
        <div className="space-y-8">
          
          {/* Assessment Progress Stats Compass */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold font-display text-slate-800 uppercase tracking-wide">
                Analisis Kelayakan Swasti Saba
              </h3>
            </div>

            {/* Visual Gauge of current award tier */}
            <div className="flex flex-col items-center justify-center py-4 bg-slate-50/60 rounded-xl border border-slate-100 relative">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-[2px]">Tingkatan Saat Ini</span>
              
              <div className="flex items-center gap-2 mt-2">
                <Award className={`w-8 h-8 ${
                  stats.calculatedAward === 'Wistara' ? 'text-amber-500' :
                  stats.calculatedAward === 'Wiwerda' ? 'text-slate-400' :
                  stats.calculatedAward === 'Padapa' ? 'text-amber-700' : 'text-slate-300'
                }`} />
                <span className="text-2xl font-black font-display text-slate-800">
                  {stats.calculatedAward === 'Tidak Lolos' ? 'BELUM LAYAK' : stats.calculatedAward}
                </span>
              </div>
              
              <p className="text-[11px] text-slate-400 mt-2 text-center px-4 leading-normal">
                {stats.calculatedAward === 'Tidak Lolos' 
                  ? 'Dokumen dasar harus valid dan minimal 5 tatanan terisi untuk lolos Padapa.'
                  : `Telah memenuhi kriteria kelulusan teknis tingkat Swasti Saba ${stats.calculatedAward}!`}
              </p>
            </div>

            {/* Key Progress Measures */}
            <div className="space-y-4">
              {/* Measure 1: Basic documents */}
              <div className="flex items-start justify-between bg-slate-50 p-2.5 rounded-lg text-xs">
                <div>
                  <h5 className="font-semibold text-slate-700">Aspek Legalitas Daerah</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">SK Pembina, SK Forum KKS, Renja</p>
                </div>
                <div className="text-right">
                  {stats.isCoreAspectsValid ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-sm">LENGKAP</span>
                  ) : (
                    <span className="text-rose-700 font-bold bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-sm">BELUM VALID</span>
                  )}
                </div>
              </div>

              {/* Measure 2: Tatanan Count */}
              <div className="flex items-start justify-between bg-slate-50 p-2.5 rounded-lg text-xs">
                <div>
                  <h5 className="font-semibold text-slate-700">Tatanan Terpenuhi (Terisi)</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">Komitmen tatanan KKS</p>
                </div>
                <div className="text-right font-mono font-bold text-slate-800">
                  {stats.filledCount} / 9 Tatanan
                </div>
              </div>

              {/* Measure 3: Average score */}
              <div className="flex items-start justify-between bg-slate-50 p-2.5 rounded-lg text-xs">
                <div>
                  <h5 className="font-semibold text-slate-700">Rataan Capaian Nasional</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">Ambang batas passing grade</p>
                </div>
                <div className="text-right font-mono font-bold text-teal-800">
                  {stats.totalAverage.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Passing grade checklist guidelines helpful for officers */}
            <div className="space-y-3 pt-2 text-xs border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Acuan Swasti Saba KKS</span>
              
              <div className="flex items-center justify-between pl-1">
                <span className="text-slate-500 font-medium">1. PADAPA (Perunggu)</span>
                <span className="text-[11px] font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded font-medium">≥ 5 Tatanan (71-80%)</span>
              </div>
              <div className="flex items-center justify-between pl-1 border-b border-dashed border-slate-50 pb-1.5">
                <span className="text-slate-500 font-medium">2. WIWERDA (Perak)</span>
                <span className="text-[11px] font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded font-medium">≥ 7 Tatanan (81-90%)</span>
              </div>
              <div className="flex items-center justify-between pl-1">
                <span className="text-teal-800 font-semibold">3. WISTARA (Emas)</span>
                <span className="text-[11px] font-mono text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded font-bold">9 Tatanan (&ge; 91%)</span>
              </div>
            </div>

            {/* Fail reasons list notifications */}
            {stats.checkFailures.length > 0 && (
              <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-rose-800 font-semibold text-xs border-b border-rose-100 pb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Prasyarat Kurang:
                </div>
                <ul className="list-disc list-inside text-[10px] text-rose-700 space-y-1 leading-relaxed pl-0.5">
                  {stats.checkFailures.map((fail, i) => (
                    <li key={i}>{fail}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Feedback & Sanggah Panel */}
          {(proposal.feedbackProvinsi || proposal.feedbackPusat) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catatan Verifikator & Feedback</h4>
              
              {proposal.feedbackProvinsi && (
                <div className="p-3.5 bg-rose-50/70 border border-slate-100 rounded-lg text-xs space-y-1 text-left">
                  <div className="flex items-center justify-between text-[10px] font-bold text-rose-800 uppercase tracking-wide border-b border-rose-100 pb-1">
                    <span>Provinsi Jawa Barat</span>
                    <span>TINJAUAN I</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed pt-1.5">
                    "{proposal.feedbackProvinsi}"
                  </p>
                </div>
              )}

              {proposal.feedbackPusat && (
                <div className="p-3.5 bg-indigo-50/40 border border-slate-100 rounded-lg text-xs space-y-1 text-left">
                  <div className="flex items-center justify-between text-[10px] font-bold text-indigo-800 uppercase tracking-wide border-b border-indigo-100 pb-1">
                    <span>Pusat (Kemenkes)</span>
                    <span>PLENO AKHIR</span>
                  </div>
                  <p className="text-[11px] text-indigo-900 leading-relaxed pt-1.5">
                    "{proposal.feedbackPusat}"
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
