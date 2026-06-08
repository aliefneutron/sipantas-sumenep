import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3002;

  app.use(express.json());

  // Initialize server-side Gemini client securely
  const geminiApiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  
  if (geminiApiKey && geminiApiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Secure Gemini client initialized successfully on server-side.");
  } else {
    console.warn("WARNING: GEMINI_API_KEY is not configured or still a placeholder. AI Evaluation will run in simulation mode.");
  }

  // API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", aiConfigured: !!ai });
  });

  // AI-guided Swasti Saba e-Monev Review Endpoint
  app.post("/api/review", async (req, res) => {
    const { proposal } = req.body;
    if (!proposal) {
      return res.status(400).json({ error: "Proposal data is required." });
    }

    try {
      if (!ai) {
        // High fidelity simulated response when Gemini key is not configured yet
        const simulatedText = `### 📋 ANALISIS EVALUATOR NASIONAL (Simulasi AI)
Analisis kelayakan nasional untuk **${proposal.name}** (Target Penghargaan: **Swasti Saba ${proposal.awardTarget}**):

1. **Kelayakan Aspek Dasar (Administrasi):**
   - SK Tim Pembina KKS: **${proposal.skTimPembina.status === 'Valid' ? 'MEMENUHI SYARAT' : 'PERLU PERBAIKAN'}** (Nomor: ${proposal.skTimPembina.nomor})
   - SK Forum KKS & Pokja: **${proposal.skForumPokja.status === 'Valid' ? 'MEMENUHI SYARAT' : 'PERLU PERBAIKAN'}** 
   - Dokumen Rencana Kerja (Renja): **${proposal.renja.status === 'Valid' ? 'MEMENUHI SYARAT' : 'PERLU PERBAIKAN'}**
   ${(proposal.skTimPembina.status === 'Valid' && proposal.skForumPokja.status === 'Valid' && proposal.renja.status === 'Valid') ? '✓ Kelayakan Aspek Dasar terpenuhi secara administratif.' : '⚠️ Terdapat dokumen aspek dasar/legalitas yang belum tervalidasi atau memerlukan re-upload.'}

2. **Capaian Indikator 9 Tatanan:**
   - Jumlah Tatanan yang diisi: **${proposal.tatanan.filter((t: any) => t.indicators.some((ind: any) => ind.score.capaian > 0)).length} / 9**
   - Rata-rata Capaian Aktif: **${calculateAverageScore(proposal.tatanan)}%**
   - Ambang Batas Kelulusan Swasti Saba **${proposal.awardTarget}**: Minimal capaian rata-rata adalah **${proposal.awardTarget === 'Wistara' ? '91%' : proposal.awardTarget === 'Wiwerda' ? '81%' : '71%'}**.
   - Status Kelulusan Teknis: **${checkPassingGrade(proposal, proposal.awardTarget) ? 'LAYAK' : 'BELUM LAYAK (Ada tatanan kritis yang belum mencapai target)'}**

3. **Rekomendasi Tindakan Strategis (Prioritas):**
   - *Tatanan Pendidikan:* Optimalkan penerapan UKS (Unit Kesehatan Sekolah) aktif pada sekolah dasar terpencil dan terbitkan Instruksi Bupati terkait Kawasan Tanpa Rokok (KTR) di seluruh instansi pendidikan.
   - *Tatanan Transportasi:* Tingkatkan ketersediaan ramah disabilitas di halte sentral dan percepat regulasi uji emisi gas buang berkala.
   - *Tatanan Lingkungan:* Segera selesaikan re-upload scan SK Tim Pembina yang tertinggal lembar tanda tangannya agar verifikasi pusat tidak terkunci.

*Rekomendasi ini dihasilkan oleh sistem e-Monev SIPANTAS AI evaluator.*`;
        return res.json({ analysis: simulatedText, isSimulated: true });
      }

      // Generate robust prompt based on real submitted attributes
      const prompt = `Anda adalah Tim Pembina Pusat Kabupaten/Kota Sehat (KKS) nasional dari Kementerian Kesehatan RI dan Kementerian Dalam Negeri RI.
Lakukan analisis mendalam, obyektif, dan berikan evaluasi taktis mengenai pengusulan penghargaan Swasti Saba bagi kabupaten/kota berikut:

Detail Pengusulan:
- Nama Daerah: ${proposal.name}
- Provinsi: ${proposal.provinsi}
- Target Penghargaan: Swasti Saba ${proposal.awardTarget}

Aspek Dasar / Dokumen Legalitas:
- SK Tim Pembina: Status ${proposal.skTimPembina.status} (Nomor: ${proposal.skTimPembina.nomor})
- SK Forum KKS & Pokja: Status ${proposal.skForumPokja.status} (Nomor: ${proposal.skForumPokja.nomor})
- Rencana Kerja (Renja): Status ${proposal.renja.status} (Nomor: ${proposal.renja.nomor})

Metrik Capaian 9 Tatanan Kabupaten Kabupaten/Kota Sehat:
${proposal.tatanan.map((t: any) => {
  const activeScores = t.indicators.map((ind: any) => ind.score.capaian);
  const avg = activeScores.length ? (activeScores.reduce((a: any, b: any) => a + b, 0) / activeScores.length).toFixed(1) : "0";
  return `- ${t.name}: Rata-rata capaian ${avg}% dengan dokumen dukung drive folder: [${t.indicators[0]?.score.evidenceLink || 'Kosong'}]`;
}).join("\n")}

Aturan Passing Grade Kelulusan Nasional:
1. Padapa: Mengisi minimal 5 Tatanan dengan rata-rata nilai tatanan di kisaran 71% - 80%
2. Wiwerda: Mengisi minimal 7 Tatanan dengan rata-rata nilai tatanan di kisaran 81% - 90%
3. Wistara: Mengisi seluruh 9 Tatanan dengan rata-rata nilai tatanan >= 91%
4. Semua Aspek Dasar (SK Tim Pembina, SK Forum KKS, Renja) wajib berstatus 'Valid' agar pengusulan dapat dinyatakan Lolos Verifikasi Akhir.

Berikan output evaluatif dalam format Markdown bahasa Indonesia yang bergaya resmi kementerian, terstruktur rapi, elegan, berwibawa, dan dingin/objektif. Isi analisis harus mencakup:
1. **ASPEK DASAR & LEGALITAS ADMINISTRASI**: Nilai kepatuhan administrasi daerah. Berikan verifikasi tegas apakah SK-SK tersebut valid atau ada catatan.
2. **ANALISIS METRIK 9 TATANAN & PASSING GRADE**: Bandingkan rata-rata capaian tatanan riil daerah tersebut dengan passing grade target Swasti Saba mereka (${proposal.awardTarget}). Sebutkan dengan tepat apakah target realistis atau terlalu ambisius/kurang berdasarkan nilai tatanan terkini.
3. **REKOMENDASI PERBAIKAN SEKTOR TEKNIS (ACTIONABLE RECS)**: Berikan rekomendasi taktis spesifik untuk instansi / OPD penanggung jawab (misalnya Dinas Kesehatan, Dinas Lingkungan Hidup, Dinas Pendidikan, dll) berdasarkan tatanan yang nilainya paling rendah atau bukti fisik yang kurang menunjang.
4. **REKOMENDASI PUTUSAN TIM VERIFIKATOR PUSAT**: Berikan draf kesimpulan singkat rekomendasi pleno pusat (Lolos Verifikasi / Perlu Revisi / Ditangguhkan).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Anda adalah pakar e-Monev kesehatan lingkungan nasional yang bertugas menganalisis kelayakan Swasti Saba (KKS). Berikan rekomendasi yang berorientasi solusi, pragmatis, profesional, dan akurat.",
          temperature: 0.7,
        }
      });

      const analysis = response.text || "Tidak ada analisis yang dihasilkan.";
      res.json({ analysis, isSimulated: false });

    } catch (apiError: any) {
      console.error("Gemini API Call error, reverting to high-fidelity simulation:", apiError);
      res.status(500).json({ error: "Failed to generate AI evaluation: " + apiError.message });
    }
  });

  // Serve static UI assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static production build from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SIPANTAS Full-Stack Server running on port ${PORT}`);
  });
}

// Helpers for simulated response
function calculateAverageScore(tatanan: any[]) {
  let total = 0;
  let count = 0;
  tatanan.forEach(t => {
    t.indicators.forEach((ind: any) => {
      if (ind.score.capaian > 0) {
        total += ind.score.capaian;
        count++;
      }
    });
  });
  return count > 0 ? (total / count).toFixed(1) : "0";
}

function checkPassingGrade(proposal: any, target: string) {
  let filledCount = 0;
  let totalScore = 0;
  let countScores = 0;
  proposal.tatanan.forEach((t: any) => {
    let hasScore = false;
    let tTotal = 0;
    t.indicators.forEach((ind: any) => {
      if (ind.score.capaian > 0) {
        hasScore = true;
        tTotal += ind.score.capaian;
        countScores++;
      }
    });
    if (hasScore) {
      filledCount++;
      totalScore += (tTotal / t.indicators.length);
    }
  });

  const avg = filledCount > 0 ? (totalScore / filledCount) : 0;
  
  if (target === 'Padapa') {
    return filledCount >= 5 && avg >= 71;
  } else if (target === 'Wiwerda') {
    return filledCount >= 7 && avg >= 81;
  } else if (target === 'Wistara') {
    return filledCount >= 9 && avg >= 91;
  }
  return false;
}

startServer();
