import { KabupatenProposal, INITIAL_TATANAN_STRUCTURE, SystemConfig } from './types';

export const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  assessmentYear: 2026,
  deadline: '2026-07-31',
  isTimelockActive: false,
  isMasaSanggahActive: true,
  passingGrades: {
    Padapa: 71,   // Min tatanan complete: 5
    Wiwerda: 81,  // Min tatanan complete: 7
    Wistara: 91,  // Min tatanan complete: 9
  }
};

export const createMockProposal = (
  kabupatenId: string,
  assessmentYear: number,
  name: string,
  provinsi: string,
  status: KabupatenProposal['status'],
  awardTarget: KabupatenProposal['awardTarget'],
  options: {
    skTimStatus?: 'Draft' | 'Pending' | 'Valid' | 'Revisi';
    skForumStatus?: 'Draft' | 'Pending' | 'Valid' | 'Revisi';
    renjaStatus?: 'Draft' | 'Pending' | 'Valid' | 'Revisi';
    baseScore?: number;
    feedbackProv?: string;
    feedbackPus?: string;
  } = {}
): KabupatenProposal => {
  const baseScore = options.baseScore ?? 75;
  const tatananList = INITIAL_TATANAN_STRUCTURE.map((t, idx) => {
    // Some districts don't fill out references for all 9 tatanan based on target
    const isActive = awardTarget === 'Wistara' || (awardTarget === 'Wiwerda' && idx < 7) || (awardTarget === 'Padapa' && idx < 5);
    
    return {
      id: t.id,
      name: t.name,
      locked: false,
      status: (status === 'Draft' ? 'Draft' : (status === 'Menunggu Verifikasi Provinsi' ? 'Ditinjau' : 'Valid')) as any,
      indicators: t.indicators.map(ind => {
        return {
          id: ind.id,
          question: ind.question,
          skala: (ind as any).skala,
          score: {
            capaian: 0,
            evidenceLink: '',
            capaian2024: '',
            capaian2025: '',
            evidenceLink2024: '',
            penjelasan: '',
            statusProvinsi: 'Draft',
            penjelasanProvinsi: ''
          }
        };
      })
    };
  });

  const id = `${kabupatenId}-${assessmentYear}`;
  return {
    id,
    kabupatenId,
    assessmentYear,
    name,
    provinsi,
    lastUpdated: '2026-06-07T08:30:00Z',
    status,
    awardTarget,
    awardResult: status === 'Selesai' ? awardTarget : 'Belum Dinilai',
    skTimPembina: {
      nomor: `188.45/SK/KKS-${id}/2026`,
      tanggal: '2026-02-10',
      fileUrl: `https://sipantas.kemkes.go.id/docs/sk_tim_pembina_${id}.pdf`,
      status: options.skTimStatus ?? 'Valid'
    },
    skForumPokja: {
      nomor: `SK-FORUM/PJK-${id}/II/2026`,
      tanggal: '2026-02-15',
      fileUrl: `https://sipantas.kemkes.go.id/docs/sk_forum_pokja_${id}.pdf`,
      status: options.skForumStatus ?? 'Valid'
    },
    renja: {
      nomor: `RENJA-KKS/${id}-2026`,
      tanggal: '2026-02-28',
      fileUrl: `https://sipantas.kemkes.go.id/docs/renja_${id}.pdf`,
      status: options.renjaStatus ?? 'Valid'
    },
    tatanan: tatananList,
    feedbackProvinsi: options.feedbackProv ?? '',
    feedbackPusat: options.feedbackPus ?? ''
  };
};

export const INITIAL_PROPOSALS: KabupatenProposal[] = [
  // User's own Kabupaten (Can be fully edited in Kabupaten level)
  createMockProposal('kab-sumenep', 2026, 'Kabupaten Sumenep', 'Jawa Timur', 'Draft', 'Wistara', {
    skTimStatus: 'Draft',
    skForumStatus: 'Draft',
    renjaStatus: 'Draft',
    baseScore: 65
  }),
  
  // High quality candidate waiting for Provincial Verification
  createMockProposal('kab-sidoarjo', 2026, 'Kabupaten Sidoarjo', 'Jawa Timur', 'Menunggu Verifikasi Provinsi', 'Wiwerda', {
    skTimStatus: 'Pending',
    skForumStatus: 'Pending',
    renjaStatus: 'Pending',
    baseScore: 83
  }),

  // Approved by Province, waiting for Central Decision (Great for AI review!)
  createMockProposal('kota-bandung', 2026, 'Kota Bandung', 'Jawa Barat', 'Disetujui Provinsi/Menunggu Pusat', 'Wistara', {
    skTimStatus: 'Valid',
    skForumStatus: 'Valid',
    renjaStatus: 'Valid',
    baseScore: 93,
    feedbackProv: 'Dokumen lengkap dan terverifikasi di tim penilai provinsi Jawa Barat. Lokus objek wisata diperiksa patuh CHSE.'
  }),

  // Returned proposal needs local revisions (Shows feedback loop!)
  createMockProposal('kab-sumba-barat', 2026, 'Kabupaten Sumba Barat', 'Nusa Tenggara Timur', 'Revisi Provinsi', 'Padapa', {
    skTimStatus: 'Revisi',
    skForumStatus: 'Valid',
    renjaStatus: 'Valid',
    baseScore: 72,
    feedbackProv: 'SK Tim Pembina KKS belum dilampirkan halaman tanda tangan Bupati secara utuh. Mohon diunggah ulang.'
  }),

  // Completed awarded city
  {
    ...createMockProposal('kota-surabaya', 2026, 'Kota Surabaya', 'Jawa Timur', 'Selesai', 'Wistara', {
      skTimStatus: 'Valid',
      skForumStatus: 'Valid',
      renjaStatus: 'Valid',
      baseScore: 97
    }),
    awardResult: 'Wistara'
  }
];

export const NOTIFICATIONS_MOCK = [
  {
    id: 'n-1',
    sender: 'Sekretariat Provinsi Jawa Timur',
    message: 'Hasil penilaian sementara Kabupaten Sumenep masih berada di status Draft. Segera lengkapi SK dan Rencana Kerja sebelum tenggat waktu penguncian sistem.',
    timestamp: '2026-06-07T10:00:00Z',
    read: false
  },
  {
    id: 'n-2',
    sender: 'Sistem Pusat (Kemenkes)',
    message: 'Masa Sanggah Swasti Saba 2026 telah dibuka. Kabupaten yang menerima status revisi dapat berkoordinasi dengan pendamping daerah masing-masing.',
    timestamp: '2026-06-05T09:00:00Z',
    read: true
  },
  {
    id: 'n-3',
    sender: 'Sekretariat Provinsi Jawa Barat',
    message: 'REVISI DOKUMEN: Kabupaten Sumba Barat diperingatkan untuk mengganti scan halaman tanda tangan bupati di SK Tim Pembina.',
    timestamp: '2026-06-04T12:30:00Z',
    read: false
  }
];

export const createEmptyProposal = (kabupatenId: string, assessmentYear: number, name: string = 'Kabupaten Sumenep', provinsi: string = 'Jawa Timur'): KabupatenProposal => {
  return createMockProposal(kabupatenId, assessmentYear, name, provinsi, 'Draft', 'Wistara', {
    skTimStatus: 'Draft',
    skForumStatus: 'Draft',
    renjaStatus: 'Draft',
    baseScore: 0
  });
};
