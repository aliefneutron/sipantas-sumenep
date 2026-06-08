import React, { useState } from 'react';
import { 
  Search, CheckCircle, AlertTriangle, FileText, Send, 
  RotateCcw, ShieldCheck, ChevronRight, Filter, ExternalLink, MessageSquare
} from 'lucide-react';
import { KabupatenProposal } from '../types';
import { getProposalStats } from '../utils';

interface ProvinsiDashboardProps {
  proposals: KabupatenProposal[];
  onUpdateProposal: (updated: KabupatenProposal) => void;
  onSelectKabupatenForCoEdit?: (id: string) => void; // Help switch to kabupaten for testing feedback!
}

export function ProvinsiDashboard({ 
  proposals, 
  onUpdateProposal,
  onSelectKabupatenForCoEdit
}: ProvinsiDashboardProps) {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
  
  // Feedback draft state
  const [feedbackInput, setFeedbackInput] = useState('');

  // Selected proposal pointer
  const activeProposal = proposals.find(p => p.id === selectedPropId);
  const activeStats = activeProposal ? getProposalStats(activeProposal) : null;

  // Provincial verification detailing
  const [selectedTatananId, setSelectedTatananId] = useState<string | null>(null);
  const [editingIndicatorId, setEditingIndicatorId] = useState<string | null>(null);
  const [provStatusInput, setProvStatusInput] = useState<string>('Valid');
  const [provFeedbackInput, setProvFeedbackInput] = useState<string>('');

  const handleSaveIndicatorVerification = () => {
    if (!activeProposal || !selectedTatananId || !editingIndicatorId) return;

    const updated = { ...activeProposal };
    updated.tatanan = updated.tatanan.map(t => {
      if (t.id === selectedTatananId) {
        return {
          ...t,
          indicators: t.indicators.map(ind => {
            if (ind.id === editingIndicatorId) {
              return {
                ...ind,
                score: {
                  ...ind.score,
                  statusProvinsi: provStatusInput,
                  penjelasanProvinsi: provFeedbackInput
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
    setEditingIndicatorId(null);
  };

  // Handles changing the validation status of a basic legal document
  const toggleDocStatus = (docType: 'skTim' | 'skForum' | 'renja', currentStatus: string) => {
    if (!activeProposal) return;
    
    // Toggle: Valid -> Revisi -> Pending -> Valid
    let nextStatus: 'Valid' | 'Revisi' | 'Pending' = 'Valid';
    if (currentStatus === 'Valid') nextStatus = 'Revisi';
    else if (currentStatus === 'Revisi') nextStatus = 'Pending';
    
    const updated = { ...activeProposal };
    if (docType === 'skTim') updated.skTimPembina.status = nextStatus;
    else if (docType === 'skForum') updated.skForumPokja.status = nextStatus;
    else updated.renja.status = nextStatus;

    updated.lastUpdated = new Date().toISOString();
    onUpdateProposal(updated);
  };

  // Province rejects/returns proposal for revision
  const handleReturnForRevision = () => {
    if (!activeProposal) return;

    const updated = { ...activeProposal };
    updated.status = 'Revisi Provinsi';
    updated.feedbackProvinsi = feedbackInput || "Mohon lengkapi bukti dokumen dukung tatanan yang masih kosong atau di bawah standar.";
    updated.lastUpdated = new Date().toISOString();
    
    onUpdateProposal(updated);
    setFeedbackInput('');
    setSelectedPropId(null);
  };

  // Province approves and pushes proposal to Central level
  const handleApproveToPusat = () => {
    if (!activeProposal) return;

    const updated = { ...activeProposal };
    updated.status = 'Disetujui Provinsi/Menunggu Pusat';
    updated.feedbackProvinsi = feedbackInput || "Telah diverifikasi tingkat provinsi dan dinyatakan lolos rekomendasi dasar.";
    
    // Automatically approve underlying documents if they weren't checked
    if (updated.skTimPembina.status !== 'Valid') updated.skTimPembina.status = 'Valid';
    if (updated.skForumPokja.status !== 'Valid') updated.skForumPokja.status = 'Valid';
    if (updated.renja.status !== 'Valid') updated.renja.status = 'Valid';

    updated.lastUpdated = new Date().toISOString();
    onUpdateProposal(updated);
    setFeedbackInput('');
    setSelectedPropId(null);
  };

  // Filter & Search logic
  const filteredProposals = proposals.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.provinsi.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'WAITING') return matchesSearch && p.status === 'Menunggu Verifikasi Provinsi';
    if (statusFilter === 'REVISION') return matchesSearch && p.status === 'Revisi Provinsi';
    if (statusFilter === 'APPROVED') return matchesSearch && (p.status === 'Disetujui Provinsi/Menunggu Pusat' || p.status === 'Verifikasi Pusat' || p.status === 'Selesai');
    return matchesSearch;
  });

  return (
    <div className="space-y-8" id="provinsi-dashboard-container">
      {/* Overview stats header banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Usulan Masuk", val: proposals.length, color: "border-[#E2E8DF] text-[#2D3E33]" },
          { label: "Menunggu Verifikasi", val: proposals.filter(p => p.status === 'Menunggu Verifikasi Provinsi').length, color: "border-amber-200 bg-amber-50/50 text-amber-800" },
          { label: "Butuh Revisi Daerah", val: proposals.filter(p => p.status === 'Revisi Provinsi').length, color: "border-rose-150 bg-rose-50/20 text-rose-800" },
          { label: "Lolos Ke Pusat", val: proposals.filter(p => p.status === 'Disetujui Provinsi/Menunggu Pusat' || p.status === 'Verifikasi Pusat' || p.status === 'Selesai').length, color: "border-[#A2C3A4]/45 bg-[#F2F5F0]/65 text-[#2D3E33]" }
        ].map((stat, i) => (
          <div key={i} className={`p-4 bg-white border rounded-xl text-left shadow-xs ${stat.color}`}>
            <span className="text-xs font-semibold text-[#4B6E5B]">{stat.label}</span>
            <p className="text-2xl font-bold font-display mt-1">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Main Section: Left list of Kabupatens, Right Details and reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Proposal Lists */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2E8DF] shadow-md p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#2D3E33] uppercase tracking-wide border-b border-[#E2E8DF] pb-2 font-display">
              Daftar Usulan Kabupaten / Kota
            </h3>

            {/* In-app search and filters */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-[#4B6E5B] absolute left-3 top-3" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari daerah atau provinsi..."
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-[#E2E8DF] rounded-lg focus:outline-[#4B6E5B] bg-white text-[#2D3E33]" 
                />
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1">
                {[
                  { tag: 'ALL', label: 'Semua' },
                  { tag: 'WAITING', label: 'Menunggu' },
                  { tag: 'REVISION', label: 'Revisi' },
                  { tag: 'APPROVED', label: 'Lolos' }
                ].map((f) => (
                  <button
                    key={f.tag}
                    onClick={() => setStatusFilter(f.tag)}
                    className={`px-3 py-1 rounded text-[10px] font-bold tracking-wide uppercase transition-all cursor-pointer ${
                      statusFilter === f.tag 
                        ? 'bg-[#4B6E5B] text-white' 
                        : 'bg-[#F2F5F0] hover:bg-[#E8EDE5] text-[#2D3E33]/80'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List entries */}
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {filteredProposals.length === 0 ? (
                <p className="text-xs text-slate-401 py-6 text-center">Tidak ada daerah usulan yang cocok.</p>
              ) : (
                filteredProposals.map(p => {
                  const isSelected = selectedPropId === p.id;
                  const pStats = getProposalStats(p);
                  
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPropId(p.id);
                        setFeedbackInput(p.feedbackProvinsi || '');
                      }}
                      className={`border rounded-xl p-3.5 text-left transition-all duration-150 cursor-pointer ${
                        isSelected 
                          ? 'border-[#2D3E33] bg-[#E8EDE5]/30 shadow-sm ring-1 ring-[#2D3E33]' 
                          : 'border-[#E2E8DF] hover:border-[#A2C3A4] bg-[#F2F5F0]/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#4B6E5B] font-mono">{p.provinsi}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase ${
                          p.status === 'Draft' ? 'bg-slate-100 text-slate-600' :
                          p.status === 'Menunggu Verifikasi Provinsi' ? 'bg-amber-100 text-amber-800 font-medium' :
                          p.status === 'Revisi Provinsi' ? 'bg-rose-50 text-rose-800' :
                          'bg-[#E8EDE5]/90 text-[#2D3E33]'
                        }`}>
                          {p.status === 'Menunggu Verifikasi Provinsi' ? 'Butuh Tinjauan' : p.status.split('/')[0]}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#2D3E33] mt-1.5 leading-tight">{p.name}</h4>
                      
                      <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400">
                        <span>Target: Swasti Saba <strong className="text-[#2D3E33]">{p.awardTarget}</strong></span>
                        <span className="font-mono bg-white border border-[#E2E8DF] px-1.5 py-0.5 rounded font-bold text-[#4B6E5B]">
                          {pStats.totalAverage.toFixed(1)}% ({pStats.filledCount} tatanan)
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Review Canvas */}
        <div className="lg:col-span-2">
          {activeProposal && activeStats ? (
            <div className="bg-white rounded-2xl border border-[#E2E8DF] shadow-md p-6 space-y-6 text-left animate-fadeIn">
              
              {/* Review Header Detail */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#E2E8DF] pb-4 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold font-display text-[#2D3E33]">{activeProposal.name}</h2>
                    <span className="text-[11px] font-bold bg-[#F2F5F0] text-[#4B6E5B] border border-[#E2E8DF] px-2.5 py-0.5 rounded-full font-mono">
                      {activeProposal.provinsi}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Target Pengusulan: Swasti Saba <strong className="text-[#4B6E5B]">{activeProposal.awardTarget}</strong>
                  </p>
                </div>

                {onSelectKabupatenForCoEdit && activeProposal.id === 'kab-kuningan' && (
                  <button
                    onClick={() => onSelectKabupatenForCoEdit(activeProposal.id)}
                    className="text-[11px] font-bold text-[#4B6E5B] bg-[#E8EDE5] border border-[#A2C3A4]/40 px-3 py-1.5 rounded-lg hover:bg-[#A2C3A4]/20 hover:border-[#A2C3A4] transition cursor-pointer"
                  >
                    Simulasikan Inputter Daerah (Ubah Angka) ✎
                  </button>
                )}
              </div>

              {/* Legal Document Review (Step 1) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-[#4B6E5B] tracking-wide font-mono">Review Kelengkapan Aspek Dasar</h4>
                  <span className="text-[11px] text-slate-400">Klik status dokumen untuk melakukan koreksi</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'SK Tim Pembina', key: 'skTim', doc: activeProposal.skTimPembina },
                    { label: 'SK Forum & Pokja', key: 'skForum', doc: activeProposal.skForumPokja },
                    { label: 'Rencana Kerja (Renja)', key: 'renja', doc: activeProposal.renja }
                  ].map((field) => (
                    <div key={field.key} className="border border-[#E2E8DF] rounded-xl p-3.5 bg-[#F2F5F0]/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#4B6E5B] tracking-wide uppercase font-mono">{field.label}</span>
                        <button
                          type="button"
                          onClick={() => toggleDocStatus(field.key as any, field.doc.status)}
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded cursor-pointer uppercase ${
                            field.doc.status === 'Valid' ? 'bg-emerald-100 text-emerald-850' :
                            field.doc.status === 'Revisi' ? 'bg-rose-100 text-rose-855' :
                            'bg-amber-100 text-amber-855'
                          }`}
                        >
                          {field.doc.status} ⇄
                        </button>
                      </div>

                      <div className="space-y-1 bg-white p-2 border border-[#E2E8DF]/60 rounded-md">
                        <p className="text-xs text-slate-700 font-bold line-clamp-1">No: {field.doc.nomor || 'Belum diisi'}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Tgl: {field.doc.tanggal || 'N/A'}</p>
                      </div>

                      {field.doc.fileUrl ? (
                        <a 
                          href={field.doc.fileUrl}
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10.5px] font-medium text-[#2D3E33] bg-[#E8EDE5]/30 hover:underline flex items-center gap-1 border border-[#E2E8DF] px-2 py-1 rounded"
                        >
                          <FileText className="w-3 h-3 text-[#4B6E5B]" />
                          Lihat PDF Evidence <ExternalLink className="w-2.5 h-2.5 ml-auto text-slate-400" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic block">Link bukti berkas kosong</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tatanan Compliance Audit (Step 2) */}
              <div className="space-y-4 pt-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase text-[#4B6E5B] tracking-wide font-mono">Analisis Passing Grade 9 Tatanan</h4>
                  <div className="text-right text-xs">
                    Rata-rata: <strong className="text-[#2D3E33] font-mono">{activeStats.totalAverage.toFixed(1)}%</strong>
                  </div>
                </div>

                <div className="border border-[#E2E8DF] rounded-xl divide-y divide-[#E2E8DF] overflow-hidden bg-white">
                  {activeProposal.tatanan.map((t, idx) => {
                    const isFilled = t.indicators.some(i => i.score.capaian > 0);
                    const scores = t.indicators.map(i => i.score.capaian);
                    const avg = scores.length ? (scores.reduce((a,b)=>a+b, 0)/scores.length) : 0;
                    
                    return (
                      <div 
                        key={t.id} 
                        onClick={() => {
                          if (isFilled) {
                            setSelectedTatananId(t.id);
                          }
                        }}
                        className={`p-3 flex items-center justify-between text-xs gap-4 bg-white hover:bg-[#F2F5F0]/30 transition ${isFilled ? 'cursor-pointer hover:border-[#4B6E5B] border border-transparent' : ''}`}
                      >
                        <div className="min-w-0 text-left">
                          <p className="font-semibold text-slate-705 line-clamp-1">{idx+1}. {t.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-400">
                              {isFilled ? `${t.indicators.length} Indikator terintegrasi` : 'Belum diisi/Kosong'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isFilled ? (
                            <>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                                avg >= 91 ? 'bg-emerald-55 text-emerald-805' :
                                avg >= 81 ? 'bg-teal-55 text-teal-855' :
                                avg >= 71 ? 'bg-amber-55 text-amber-855' : 'bg-red-55 text-red-855'
                              }`}>
                                Avg: {avg.toFixed(0)}%
                              </span>
                              
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTatananId(t.id);
                                }}
                                className="px-2 py-1 text-[10px] font-bold text-[#4B6E5B] bg-[#E8EDE5] hover:bg-[#A2C3A4]/20 rounded transition font-mono border border-[#A2C3A4]/40"
                              >
                                Detail Indikator ➔
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-350 italic">Kosong</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Verification Verdict Feedback (Step 3) */}
              <div className="p-5.5 bg-[#F2F5F0]/30 border border-[#E2E8DF] rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4.5 h-4.5 text-[#4B6E5B]" />
                  <h4 className="text-xs font-bold text-[#2D3E33] uppercase tracking-wide">Draft Feedback & Rekomendasi Provinsi</h4>
                </div>

                <textarea
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Masukkan umpan balik verifikasi, catatan perbaikan dokumen legalitas, atau poin koreksi indikator teknis tatanan..."
                  className="w-full text-xs p-3.5 border border-[#E2E8DF] rounded-xl focus:outline-[#4B6E5B] min-h-[80px] bg-white text-slate-700"
                />

                <div className="flex flex-col md:flex-row justify-end gap-3 pt-1 border-t border-slate-100">
                  {/* Action 1: Reject back to regional for correction */}
                  <button
                    type="button"
                    onClick={handleReturnForRevision}
                    className="flex items-center justify-center gap-1.5 px-4.5 py-2 text-xs font-bold text-rose-700 hover:text-white bg-white hover:bg-rose-700 border border-rose-200 hover:border-rose-700 rounded-lg transition cursor-pointer"
                  >
                    <RotateCcw className="w-4.5 h-4.5" />
                    Kembalikan (Butuh Revisi Daerah)
                  </button>

                  {/* Action 2: Approve and recommend up to Kemenkes Center */}
                  <button
                    type="button"
                    onClick={handleApproveToPusat}
                    className="flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#4B6E5B] hover:bg-[#2D3E33] rounded-lg transition shadow-md cursor-pointer"
                  >
                    <ShieldCheck className="w-4.5 h-4.5" />
                    Setujui & Kirim ke Pusat
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E2E8DF] shadow-xs p-12 text-center text-slate-400 space-y-3">
              <FileText className="w-12 h-12 text-[#4B6E5B]/40 mx-auto" />
              <p className="text-sm font-medium">Pilih salah satu usulan kabupaten/kota sehat di sebelah kiri untuk meninjau kualifikasi e-Monev secara digital.</p>
            </div>
          )}
        </div>

      </div>

      {/* Provincial Indicators Inspector Modal */}
      {selectedTatananId && activeProposal && (
        (() => {
          const activeTatananReview = activeProposal.tatanan.find(t => t.id === selectedTatananId);
          if (!activeTatananReview) return null;

          return (
            <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn overflow-y-auto">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-7xl w-full p-6 space-y-6 my-8 animate-scaleUp text-left">
                
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#4B6E5B] bg-[#E8EDE5] px-2.5 py-1 rounded uppercase tracking-wider font-mono">
                      Verifikasi Lapangan / Dokumen • Provinsi Jawa Barat
                    </span>
                    <h3 className="text-lg font-bold text-[#2D3E33] mt-2 leading-snug">
                      Tinjau {activeTatananReview.name} — {activeProposal.name}
                    </h3>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedTatananId(null);
                      setEditingIndicatorId(null);
                    }}
                    className="text-slate-400 hover:text-slate-600 focus:ring-2 focus:ring-slate-100 p-2 rounded-lg cursor-pointer text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Main Table */}
                <div className="overflow-x-auto border border-slate-150 rounded-xl bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase tracking-wider border-b border-slate-150">
                        <th className="p-3 font-bold text-center w-12 border-r border-slate-150">NO</th>
                        <th className="p-3 font-bold border-r border-slate-150">Indikator Utama & Pertanyaan KKS</th>
                        <th className="p-3 font-bold text-center w-28 border-r border-slate-150">Capaian 2024</th>
                        <th className="p-3 font-bold text-center w-28 border-r border-slate-150">Capaian 2025</th>
                        <th className="p-3 font-bold text-center w-20 border-r border-slate-150">Nilai</th>
                        <th className="p-3 font-bold w-48 border-r border-slate-150">Berkas Bukti Dukung (G-Drive)</th>
                        <th className="p-3 font-bold w-52 border-r border-slate-150">Penjelasan Daerah</th>
                        <th className="p-3 font-bold w-56 border-r border-slate-150">Status Verifikasi Provinsi</th>
                        <th className="p-3 font-bold text-center w-24">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeTatananReview.indicators.map((ind, i) => {
                        const score = ind.score.capaian || 0;
                        const c2024 = ind.score.capaian2024 || 'not set';
                        const c2025 = ind.score.capaian2025 || 'not set';
                        const link2024 = ind.score.evidenceLink2024 || '';
                        const link2025 = ind.score.evidenceLink || '';
                        const explanation = ind.score.penjelasan || 'not set';
                        const statusProv = ind.score.statusProvinsi || 'Draft';
                        const feedbackProv = ind.score.penjelasanProvinsi || 'Belum ada catatan';

                        return (
                          <tr key={ind.id} className="hover:bg-slate-50/70 transition-colors text-[11px]">
                            <td className="p-3 text-center border-r border-slate-100 font-mono text-slate-400 font-bold">{i + 1}</td>
                            <td className="p-3 border-r border-slate-100 font-medium text-slate-800 leading-normal max-w-[280px]">
                              {ind.question}
                            </td>
                            <td className="p-3 text-center border-r border-slate-100 font-mono text-slate-700">
                              <span className="px-2 py-0.5 rounded text-[11px] bg-slate-105 font-semibold">{c2024}</span>
                            </td>
                            <td className="p-3 text-center border-r border-slate-100 font-mono text-slate-700">
                              <span className="px-2 py-0.5 rounded text-[11px] bg-slate-105 font-semibold">{c2025}</span>
                            </td>
                            <td className="p-3 text-center border-r border-slate-100">
                              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                                score >= 90 ? 'bg-emerald-50 text-emerald-800' :
                                score >= 80 ? 'bg-teal-50 text-teal-800' :
                                'bg-amber-50 text-amber-800'
                              }`}>{score}%</span>
                            </td>
                            <td className="p-3 border-r border-slate-100 text-[10px] space-y-1 max-w-[180px]">
                              {link2024 && (
                                <a href={link2024} target="_blank" rel="noreferrer" className="text-[#4B6E5B] hover:underline font-bold block">
                                  📁 Evidence 2024 [Drive]
                                </a>
                              )}
                              {link2025 && (
                                <a href={link2025} target="_blank" rel="noreferrer" className="text-[#4B6E5B] hover:underline font-bold block">
                                  📁 Evidence 2025 [Drive]
                                </a>
                              )}
                              {!link2024 && !link2025 && <span className="text-amber-700 font-bold text-[10px]">Belum disematkan</span>}
                            </td>
                            <td className="p-3 border-r border-slate-100 max-w-[200px] whitespace-normal break-words leading-relaxed text-slate-600">
                              {explanation === '' ? 'not set' : explanation}
                            </td>
                            <td className="p-3 border-r border-slate-100 max-w-[200px]">
                              <div className="space-y-1">
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  statusProv === 'Valid' ? 'bg-emerald-100 text-emerald-850' :
                                  statusProv === 'Revisi' ? 'bg-rose-105 text-rose-855 font-black animate-pulse' :
                                  'bg-amber-100 text-amber-855'
                                }`}>
                                  {statusProv === 'Draft' ? 'Belum Diperiksa' : statusProv}
                                </span>
                                <p className="text-[10px] text-[#4B6E5B] italic font-semibold line-clamp-2">"{feedbackProv}"</p>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingIndicatorId(ind.id);
                                  setProvStatusInput(statusProv);
                                  setProvFeedbackInput(feedbackProv === 'Belum ada catatan' ? '' : feedbackProv);
                                }}
                                className="px-2.5 py-1.5 bg-[#E8EDE5] hover:bg-[#A2C3A4]/25 border border-[#A2C3A4]/40 text-[#4B6E5B] font-bold rounded text-[10px] transition cursor-pointer"
                              >
                                ✍ Koreksi
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Sub-form for editing indicator status */}
                {editingIndicatorId && (
                  <div className="p-5 bg-[#F2F5F0]/65 border border-[#E2E8DF] rounded-2xl space-y-4 animate-scaleUp">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                      <h4 className="text-xs font-bold text-[#2D3E33]">✍ Panel Koreksi & Verifikasi Indikator</h4>
                      <button type="button" onClick={() => setEditingIndicatorId(null)} className="text-xs text-slate-400 hover:text-slate-600 font-bold font-mono">Tutup ✕</button>
                    </div>

                    <div className="p-3 bg-white border border-[#E2E8DF] rounded-xl text-xs text-left">
                      <span className="text-[9px] uppercase font-mono font-bold bg-[#4B6E5B] text-white px-1.5 py-0.5 rounded">PERTANYAAN DIREAKTIFKAN</span>
                      <p className="font-bold text-slate-700 mt-1.5">{activeTatananReview.indicators.find(ind => ind.id === editingIndicatorId)?.question}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end text-left">
                      <div>
                        <label className="block text-[11px] font-bold text-[#2D3E33] uppercase mb-1.5 font-mono">Keputusan Verifikator</label>
                        <select
                          value={provStatusInput}
                          onChange={(e) => setProvStatusInput(e.target.value)}
                          className="w-full text-xs p-2.5 border border-[#E2E8DF] rounded-lg bg-white font-bold text-slate-750 focus:outline-[#4B6E5B]"
                        >
                          <option value="Valid">✔️ VALID (Dapat Direkomendasi)</option>
                          <option value="Revisi">❌ REVISI (Butuh Berkas Ulang)</option>
                          <option value="Pending">⚠️ PENDING (Perlu Rapat Tim)</option>
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-[#2D3E33] uppercase mb-1.5 font-mono">Catatan / Uraian Masukan Koreksi Prov</label>
                        <input
                          type="text"
                          value={provFeedbackInput}
                          onChange={(e) => setProvFeedbackInput(e.target.value)}
                          placeholder="Tuliskan alasan ketidakcocokan data, misal: 'Tautan Google Drive berkas 2024 belum valid'"
                          className="w-full text-xs p-2.5 border border-[#E2E8DF] rounded-lg bg-white focus:outline-[#4B6E5B] text-slate-700"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setEditingIndicatorId(null)}
                        className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveIndicatorVerification}
                        className="px-5 py-1.5 text-xs font-bold text-white bg-[#4B6E5B] hover:bg-[#2D3E33] rounded-lg transition"
                      >
                        Pasang Hasil Verifikasi ✔️
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Action */}
                <div className="flex justify-end pt-2 border-t border-slate-150">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTatananId(null);
                      setEditingIndicatorId(null);
                    }}
                    className="px-5 py-2.5 bg-[#2D3E33] text-white text-xs font-bold rounded-xl hover:bg-[#1E2A22] transition cursor-pointer"
                  >
                    Tutup & Simpan Draft Verifikasi ✔
                  </button>
                </div>

              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}
