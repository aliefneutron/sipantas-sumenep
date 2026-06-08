import React, { useState } from 'react';
import { 
  Award, Clock, Lock, ShieldAlert, Sparkles, FileSpreadsheet, 
  CheckSquare, ArrowDownToLine, Settings, RefreshCw, Layers, AlertCircle
} from 'lucide-react';
import { KabupatenProposal, SystemConfig } from '../types';
import { getProposalStats, simulateDownloadPDF } from '../utils';

interface PusatDashboardProps {
  proposals: KabupatenProposal[];
  onUpdateProposal: (updated: KabupatenProposal) => void;
  systemConfig: SystemConfig;
  onUpdateConfig: (config: SystemConfig) => void;
}

export function PusatDashboard({ 
  proposals, 
  onUpdateProposal,
  systemConfig,
  onUpdateConfig
}: PusatDashboardProps) {

  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
  
  // Gemini API analysis states
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Filter proposals that are pushed to Center
  const centerProposals = proposals.filter(p => 
    p.status === 'Disetujui Provinsi/Menunggu Pusat' || 
    p.status === 'Verifikasi Pusat' || 
    p.status === 'Selesai'
  );

  const activeProposal = proposals.find(p => p.id === selectedPropId);
  const activeStats = activeProposal ? getProposalStats(activeProposal) : null;

  // Triggers server-side secure Gemini review of the Swasti Saba file
  const runAiReview = async (proposal: KabupatenProposal) => {
    setIsAiLoading(true);
    setAiAnalysis(null);
    setAiError(null);

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ proposal })
      });

      if (!response.ok) {
        throw new Error(`Koneksi server gagal dengan status: ${response.status}`);
      }

      const data = await response.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Format respons tidak valid.");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Gagal menghubungi AI Evaluator Kemenkes.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Central committee approves and awards Swasti Saba final decree
  const finalizeAward = (awardType: 'Padapa' | 'Wiwerda' | 'Wistara' | 'Tidak Lolos') => {
    if (!activeProposal) return;

    const updated = { ...activeProposal };
    updated.status = 'Selesai';
    updated.awardResult = awardType === 'Tidak Lolos' ? 'Tidak Lolos' : awardType;
    updated.feedbackPusat = `Ditetapkan secara nasional melalui Pleno Bersama KKS Kemenkes & Kemendagri sebagai peraih Swasti Saba ${awardType}.`;
    updated.lastUpdated = new Date().toISOString();

    onUpdateProposal(updated);
    
    // Clear AI analysis context block
    setAiAnalysis(null);
  };

  // Configuration management
  const toggleTimelock = () => {
    onUpdateConfig({
      ...systemConfig,
      isTimelockActive: !systemConfig.isTimelockActive
    });
  };

  const toggleSanggah = () => {
    onUpdateConfig({
      ...systemConfig,
      isMasaSanggahActive: !systemConfig.isMasaSanggahActive
    });
  };

  const changeDeadline = (dateStr: string) => {
    onUpdateConfig({
      ...systemConfig,
      deadline: dateStr
    });
  };

  return (
    <div className="space-y-8" id="pusat-dashboard-container">
      
      {/* 1. National Level Configuration & Timelock Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#2D3E33] text-white rounded-2xl p-6 shadow-md border border-[#E2E8DF]/10">
        
        {/* Core Timelock Config */}
        <div className="space-y-3 mr-4 text-left border-r border-[#E2E8DF]/15 pr-6">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#A2C3A4]" />
            <h3 className="font-extrabold font-display text-sm tracking-uppercase">Kontrol Sinkronisasi Sistem</h3>
          </div>
          <p className="text-[11px] text-[#F2F5F0]/80 leading-normal">
            Gunakan penguncian waktu masal (Timelock) nasional untuk disiplin jadwal verifikasi berkas e-Monev kabupaten/kota.
          </p>
        </div>

        {/* Action Toggle controls */}
        <div className="grid grid-cols-2 gap-3 items-center">
          {/* Timelock */}
          <button
            onClick={toggleTimelock}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
              systemConfig.isTimelockActive 
                ? 'bg-rose-500/20 border-rose-500 text-rose-300' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
            }`}
          >
            <Lock className="w-4.5 h-4.5 mb-1" />
            <span className="text-[11px] font-bold">Timelock Daerah</span>
            <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5 opacity-80 font-mono">
              {systemConfig.isTimelockActive ? '● AKTIF (Kunci)' : '◯ OFF (Buka)'}
            </span>
          </button>

          {/* Sanggah Period */}
          <button
            onClick={toggleSanggah}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
              systemConfig.isMasaSanggahActive 
                ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                : 'bg-white/10 border-white/20 text-white hover:bg-white/10'
            }`}
          >
            <ShieldAlert className="w-4.5 h-4.5 mb-1" />
            <span className="text-[11px] font-bold">Masa Sanggah</span>
            <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5 opacity-80 font-mono">
              {systemConfig.isMasaSanggahActive ? '● DIBUKA' : '◯ DITUTUP'}
            </span>
          </button>
        </div>

        {/* National deadline date controller */}
        <div className="space-y-1.5 text-left md:col-span-1 flex flex-col justify-center">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-350 font-mono">Tenggat Waktu Penguncian</label>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-300" />
            <input 
              type="date"
              value={systemConfig.deadline}
              onChange={(e) => changeDeadline(e.target.value)}
              className="bg-white/10 text-xs px-2.5 py-1.5 rounded-lg text-white border border-white/20 focus:outline-[#A2C3A4]"
            />
          </div>
        </div>

      </div>

      {/* 2. Main content: Left list of national files waiting for adjudication, Right detailed analysis panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Kabupaten files that passed Province recommendation */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2E8DF] shadow-md p-5 space-y-4">
            <h3 className="text-xs font-bold text-[#2D3E33] uppercase tracking-wider border-b border-[#E2E8DF] pb-2 text-left font-display">
              Usulan Lolos Verifikasi Provinsi
            </h3>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {centerProposals.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Layers className="w-10 h-10 text-[#4B6E5B]/40 mx-auto" />
                  <p className="text-xs">Belum ada komoditas usulan kabupaten sehat yang lolos rekomendasi tingkat provinsi.</p>
                </div>
              ) : (
                centerProposals.map(p => {
                  const isSelected = selectedPropId === p.id;
                  const pStats = getProposalStats(p);

                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPropId(p.id);
                        setAiAnalysis(null);
                        setAiError(null);
                      }}
                      className={`border rounded-xl p-4 text-left transition-all duration-150 cursor-pointer ${
                        isSelected 
                          ? 'border-[#2D3E33] bg-[#E8EDE5]/35 shadow-sm ring-1 ring-[#2D3E33]' 
                          : 'border-[#E2E8DF] hover:border-[#A2C3A4] bg-[#F2F5F0]/10'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] uppercase tracking-wider">
                        <span className="font-bold text-[#4B6E5B] font-mono">{p.provinsi}</span>
                        <span className={`px-1.5 py-0.5 rounded-sm font-bold ${
                          p.awardResult !== 'Belum Dinilai' 
                            ? 'bg-emerald-100 text-emerald-850' 
                            : 'bg-[#E8EDE5] text-[#2D3E33]'
                        }`}>
                          {p.awardResult !== 'Belum Dinilai' ? `Lolos KKS: ${p.awardResult}` : 'Menunggu Pleno'}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#2D3E33] mt-2">{p.name}</h4>

                      <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400 border-t border-[#E2E8DF] pt-2">
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

        {/* Right column: Adjudication review panel */}
        <div className="lg:col-span-2">
          {activeProposal && activeStats ? (
            <div className="bg-white rounded-2xl border border-[#E2E8DF] shadow-md p-6 space-y-6 text-left animate-fadeIn">
              
              {/* Proposal Header */}
              <div className="flex justify-between items-start border-b border-[#E2E8DF] pb-4">
                <div>
                  <h3 className="text-lg font-bold font-display text-[#2D3E33]">
                    Sidang Pleno Akhir: {activeProposal.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Direkomendasikan oleh Provinsi: <strong className="text-[#2D3E33]">{activeProposal.provinsi}</strong> dengan target penghargaan Swasti Saba <strong className="text-[#4B6E5B]">{activeProposal.awardTarget}</strong>.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Rerata Capaian</span>
                  <span className="text-lg font-mono font-black text-[#4B6E5B]">{activeStats.totalAverage.toFixed(1)}%</span>
                </div>
              </div>

              {/* Status Info Alert if already complete */}
              {activeProposal.status === 'Selesai' && (
                <div className="p-4 bg-[#F2F5F0] border border-[#A2C3A4]/35 rounded-xl flex items-center gap-3">
                  <Award className="w-8 h-8 text-[#4B6E5B] shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[#2D3E33]">Swasti Saba Hasil Pleno Selesai</h4>
                    <p className="text-[11px] text-slate-600 leading-normal mt-0.5">
                      Daerah ini telah ditetapkan secara nasional sebagai peraih **Swasti Saba {activeProposal.awardResult}**.
                    </p>
                  </div>
                  <button
                    onClick={() => simulateDownloadPDF(activeProposal.name, activeProposal.awardResult, activeStats)}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#4B6E5B] hover:text-white bg-white hover:bg-[#4B6E5B] border border-[#A2C3A4]/40 rounded-lg cursor-pointer transition"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    Unduh Laporan SK
                  </button>
                </div>
              )}

              {/* Review of core legal documents and comments from Province */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Visual statistics list */}
                <div className="border border-[#E2E8DF] rounded-xl p-4 space-y-3 bg-[#F2F5F0]/20">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4B6E5B] font-mono">Verifikasi Berkas Pendukung</h4>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center bg-white p-2 border border-[#E2E8DF] rounded-lg">
                      <span className="text-slate-500 font-medium">SK Tim Pembina</span>
                      <span className="text-emerald-800 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded-sm">VALID</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 border border-[#E2E8DF] rounded-lg">
                      <span className="text-slate-500 font-medium">SK Forum & Pokja</span>
                      <span className="text-emerald-800 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded-sm">VALID</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 border border-[#E2E8DF] rounded-lg">
                      <span className="text-slate-500 font-medium">Rencana Kerja (Renja)</span>
                      <span className="text-emerald-800 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded-sm">VALID</span>
                    </div>
                  </div>
                </div>

                {/* Province Feedback summary log */}
                <div className="border border-[#E2E8DF] rounded-xl p-4 space-y-3 bg-[#F2F5F0]/20">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4B6E5B] font-mono">Rekomendasi Provinsi</h4>
                  <p className="text-[11px] text-[#2D3E33]/90 leading-relaxed italic">
                    "{activeProposal.feedbackProvinsi || 'Rekomendasi umum: Berkas dinyatakan lengkap untuk lolos ke penilaian pusat.'}"
                  </p>
                </div>

              </div>

              {/* 3. Smart National Evaluator (Gemini API Integration) */}
              <div className="border border-[#A2C3A4]/40 rounded-2xl bg-[#E8EDE5]/30 p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#4B6E5B] shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-[#2D3E33]">National Evaluator AI</h4>
                      <p className="text-[11px] text-[#4B6E5B]/85">Analisis cerdas kriteria passing grade nasional instan menggunakan Gemini</p>
                    </div>
                  </div>

                  <button
                    onClick={() => runAiReview(activeProposal)}
                    disabled={isAiLoading}
                    className="flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold bg-[#4B6E5B] hover:bg-[#2D3E33] text-white rounded-xl shadow-xs transition hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Menganalisis...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Jalankan AI Audit
                      </>
                    )}
                  </button>
                </div>

                {/* AI response print container */}
                {aiAnalysis && (
                  <div className="p-4 bg-white border border-[#E2E8DF] rounded-xl max-h-[300px] overflow-y-auto space-y-2 text-xs text-[#2D3E33]/95 leading-relaxed font-sans shadow-inner animate-fadeIn whitespace-pre-line text-left">
                    {aiAnalysis}
                  </div>
                )}

                {aiError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    <p>{aiError}</p>
                  </div>
                )}
              </div>

              {/* 4. Pleno Decision Board (Actionable parameters for National Committee) */}
              <div className="p-6 bg-[#F2F5F0]/35 border border-[#E2E8DF] rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-[#2D3E33] uppercase tracking-wider text-left font-display">
                  Keputusan Sidang Pleno / Penetapan Swasti Saba
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { type: 'Padapa', label: 'Lolos Padapa (Bronze)', style: 'bg-amber-100 border-amber-200 text-amber-900 hover:bg-amber-150 text-[11px] font-bold' },
                    { type: 'Wiwerda', label: 'Lolos Wiwerda (Silver)', style: 'bg-slate-200 border-slate-300 text-slate-900 hover:bg-slate-250 text-[11px] font-bold' },
                    { type: 'Wistara', label: 'Lolos Wistara (Gold)', style: 'bg-[#4B6E5B] hover:bg-[#2D3E33] text-white text-[11px] font-bold md:col-span-1 shadow-md' },
                    { type: 'Tidak Lolos', label: 'Tangguhkan / Tolak', style: 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 text-[11px] font-bold' }
                  ].map((btn) => (
                    <button
                      key={btn.type}
                      type="button"
                      onClick={() => finalizeAward(btn.type as any)}
                      className={`py-3 px-3 border rounded-xl text-center cursor-pointer transition active:scale-95 ${btn.style}`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E2E8DF] shadow-xs p-12 text-center text-slate-400 space-y-3">
              <Award className="w-12 h-12 text-[#4B6E5B]/40 mx-auto" />
              <p className="text-sm font-medium">Pilih berkas usulan kabupaten/kota di samping kiri untuk mengawasi pleno keputusan nasional.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
