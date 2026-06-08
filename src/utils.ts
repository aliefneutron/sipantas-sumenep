import { KabupatenProposal } from './types';

/**
 * Calculates current analytics and completion statistics for a Kabupaten/Kota proposal
 */
export function getProposalStats(proposal: KabupatenProposal) {
  // Count how many tatanan have at least one indicator with score > 0
  const tatananStats = proposal.tatanan.map(t => {
    const scores = t.indicators.map(i => i.score.capaian);
    const validScores = scores.filter(s => s > 0);
    const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    
    return {
      id: t.id,
      name: t.name,
      isFilled: validScores.length > 0,
      avgScore: avg,
      status: t.status
    };
  });

  const filledTatanan = tatananStats.filter(t => t.isFilled);
  const totalAverage = filledTatanan.length > 0 
    ? (filledTatanan.reduce((acc, curr) => acc + curr.avgScore, 0) / filledTatanan.length)
    : 0;

  // Verify core aspects
  const isSkTimValid = proposal.skTimPembina.status === 'Valid';
  const isSkForumValid = proposal.skForumPokja.status === 'Valid';
  const isRenjaValid = proposal.renja.status === 'Valid';
  const isCoreAspectsValid = isSkTimValid && isSkForumValid && isRenjaValid;

  // Swasti Saba Qualification logic
  // Padapa: Min 5 tatanan, avg >= 71%
  // Wiwerda: Min 7 tatanan, avg >= 81%
  // Wistara: Min 9 tatanan, avg >= 91%
  let calculatedAward: 'Tidak Lolos' | 'Padapa' | 'Wiwerda' | 'Wistara' = 'Tidak Lolos';
  const filledCount = filledTatanan.length;

  if (isCoreAspectsValid) {
    if (filledCount >= 9 && totalAverage >= 91) {
      calculatedAward = 'Wistara';
    } else if (filledCount >= 7 && totalAverage >= 81) {
      calculatedAward = 'Wiwerda';
    } else if (filledCount >= 5 && totalAverage >= 71) {
      calculatedAward = 'Padapa';
    }
  }

  // Determine feedback reasons
  const checkFailures: string[] = [];
  if (!isSkTimValid) checkFailures.push("SK Tim Pembina belum divalidasi.");
  if (!isSkForumValid) checkFailures.push("SK Forum/Pokja belum divalidasi.");
  if (!isRenjaValid) checkFailures.push("Dokumen Rencana Kerja (Renja) belum divalidasi.");
  if (filledCount < 5) checkFailures.push(`Tatanan aktif baru terpenuhi ${filledCount}/5 tatanan minimum.`);
  if (filledCount >= 5 && totalAverage < 71) checkFailures.push(`Rata-rata rata pencapaian baru ${totalAverage.toFixed(1)}% (Min. 71%).`);

  return {
    tatananStats,
    filledCount,
    totalAverage,
    isCoreAspectsValid,
    isSkTimValid,
    isSkForumValid,
    isRenjaValid,
    calculatedAward,
    checkFailures
  };
}

/**
 * Simple file generator simulation to mock download PDF
 */
export function simulateDownloadPDF(proposalName: string, awardType: string, stats: any) {
  const content = `SIPANTAS E-MONEV EXPORT REPORT
----------------------------------------------
KABUPATEN/KOTA: ${proposalName.toUpperCase()}
STATUS: ${awardType}
Rata-Rata Capaian: ${stats.totalAverage.toFixed(2)}%
Aspek Dasar: ${stats.isCoreAspectsValid ? 'VALID' : 'TIDAK VALID'}
Tatanan Terisi: ${stats.filledCount} dari 9 tatanan
----------------------------------------------
Dicetak pada komputer secara otomatis berbasis sistem digital Kementerian Kesehatan RI.`;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Sipantas_Laporan_${proposalName.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
