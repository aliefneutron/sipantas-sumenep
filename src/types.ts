export interface DocumentField {
  nomor: string;
  tanggal: string;
  fileUrl: string;
  status: 'Draft' | 'Pending' | 'Valid' | 'Revisi';
  catatan?: string;
}

export interface IndicatorScore {
  capaian: number; // 0 to 100 (Nilai Mandiri)
  evidenceLink: string; // File Sehat Mandiri 2025
  capaian2024?: string; // Capaian Sehat Mandiri s.d. 2024
  capaian2025?: string; // Capaian Sehat Mandiri s.d. 2025
  evidenceLink2024?: string; // File Sehat Mandiri 2024
  penjelasan?: string; // Penjelasan Kabupaten/Kota
  statusProvinsi?: string; // Status verifikasi, e.g., "Valid", "Revisi", "not set"
  penjelasanProvinsi?: string; // Catatan verifikator provinsi
}

export interface TatananAssessment {
  id: string;
  name: string;
  indicators: {
    id: string;
    question: string;
    skala?: { nilai: number, deskripsi: string }[];
    score: IndicatorScore;
  }[];
  locked: boolean;
  status: 'Draft' | 'Ditinjau' | 'Valid' | 'Revisi';
}

export interface KabupatenProposal {
  id: string;
  name: string;
  provinsi: string;
  lastUpdated: string;
  status: 'Draft' | 'Menunggu Verifikasi Provinsi' | 'Revisi Provinsi' | 'Disetujui Provinsi/Menunggu Pusat' | 'Verifikasi Pusat' | 'Masa Sanggah' | 'Selesai';
  awardTarget: 'Padapa' | 'Wiwerda' | 'Wistara';
  awardResult: 'Belum Dinilai' | 'Tidak Lolos' | 'Padapa' | 'Wiwerda' | 'Wistara';
  
  // Aspek Dasar
  skTimPembina: DocumentField;
  skForumPokja: DocumentField;
  renja: DocumentField;
  
  // 9 Tatanan
  tatanan: TatananAssessment[];
  
  // Feedback
  feedbackProvinsi: string;
  feedbackPusat: string;
}

export interface NotificationMsg {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface SystemConfig {
  deadline: string; // ISO string or simple date
  isTimelockActive: boolean;
  isMasaSanggahActive: boolean;
  passingGrades: {
    Padapa: number; // e.g. 71
    Wiwerda: number; // e.g. 81
    Wistara: number; // e.g. 91
  };
}

export const INITIAL_TATANAN_STRUCTURE = [
  {
    id: 'tatanan-1',
    name: "TATANAN  KEHIDUPAN MASYARAKAT SEHAT MANDIRI",
    indicators: [
      { 
        id: 't1-i1', 
        question: "Jumlah Kematian Ibu", 
        skala: [{"nilai":100,"deskripsi":"a. jumlah kematian menurun dari tahun sebelumnya"},{"nilai":0,"deskripsi":"b. tetap atau meningkat"}] 
      },
      { 
        id: 't1-i2', 
        question: "Jumlah Kematian Neonatus", 
        skala: [{"nilai":100,"deskripsi":"a. jumlah kematian menurun dari tahun sebelumnya"},{"nilai":0,"deskripsi":"b. tetap atau meningkat"}] 
      },
      { 
        id: 't1-i3', 
        question: "Prevalensi Stunting pada Balita", 
        skala: [{"nilai":100,"deskripsi":"a. Prevalensi stunting pada balita mencapai target"},{"nilai":0,"deskripsi":"b. Prevalensi stunting pada balita tidak mencapai target"}] 
      },
      { 
        id: 't1-i4', 
        question: "Cakupan Penemuan Kasus TBC mencapai 90%", 
        skala: [{"nilai":100,"deskripsi":"a. mencapai target 90% atau menurun dari tahun sebelumnya"},{"nilai":0,"deskripsi":"b. tidak mencapai target 90% atau meningkat dari tahun sebelumnya"}] 
      },
      { 
        id: 't1-i5', 
        question: "Persentase orang terduga tuberkulosis yang mendapatkan pelayanan kesehatan sesuai standar", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 71%"},{"nilai":0,"deskripsi":"b. < 71%"}] 
      },
      { 
        id: 't1-i6', 
        question: "Persentase merokok penduduk usia 10-18 tahun (Indikator RPJMN)", 
        skala: [{"nilai":100,"deskripsi":"a. persentase skrining lebih dari 50% dan proporsi merokok lebih kecil dari  target prevalensi tahun berjalan"},{"nilai":0,"deskripsi":"b. persentase skrining kurang dari 50% dan proporsi merokok lebih besar dari target prevalensi tahun berjalan"}] 
      },
      { 
        id: 't1-i7', 
        question: "Angka kesakitan Dengue", 
        skala: [{"nilai":100,"deskripsi":"a. menurun dari tahun sebelumnya"},{"nilai":0,"deskripsi":"b. tetap atau meningkat dari tahun sebelumnya"}] 
      },
      { 
        id: 't1-i8', 
        question: "Persentase pangan segar yang memenuhi syarat keamanan pangan", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 85%"},{"nilai":0,"deskripsi":"b. < 85%"}] 
      },
      { 
        id: 't1-i9', 
        question: "Kabupaten/Kota yang menerapkan kebijakan GERMAS dengan kriteria : memiliki kebijakan GERMAS dan melaksanakan penggerakan masyarakat dalam mendukung 5 klaster GERMAS minimal 3 kali dalam setahun", 
        skala: [{"nilai":100,"deskripsi":"a. Ya"},{"nilai":0,"deskripsi":"b. Tidak"}] 
      },
      { 
        id: 't1-i10', 
        question: "Persentase penderita Diabetes Melitus yang mendapatkan pelayanan kesehatan sesuai standar", 
        skala: [{"nilai":100,"deskripsi":"a. Mencapai target capaian penyandang diabetes terkendali tiap tahunnya"},{"nilai":0,"deskripsi":"b. Tidak mencapai target capaian penyandang diabetes terkendali tiap tahunnya"}] 
      },
      { 
        id: 't1-i11', 
        question: "Persentase penderita Hipertensi yang mendapatkan pelayanan kesehatan sesuai standar", 
        skala: [] 
      },
      { 
        id: 't1-i12', 
        question: "Persentase Orang Dengan Gangguan Jiwa Berat  yang mendapatkan pelayanan sesuai standar dan eliminasi pasung", 
        skala: [{"nilai":100,"deskripsi":"a. 100% Orang Dengan Gangguan Jiwa Berat  yang mendapatkan pelayanan sesuai standar dan komitmen Kepala Daerah dalam bentuk surat pernyataan tidak ada pasung dan SK Tim Penggerak Kesehatan Jiwa Masyarakat (TPKJM) Tingkat Kab/Kota"},{"nilai":50,"deskripsi":"b. 100% Orang Dengan Gangguan Jiwa Berat  yang mendapatkan pelayanan sesuai standar dan komitmen Kepala Daerah dalam bentuk surat pernyataan untuk menuju eliminasi pasung dan SK Tim Penggerak Kesehatan Jiwa Masyarakat (TPKJM) Tingkat Kab/Kota"},{"nilai":25,"deskripsi":"c. 100% Orang Dengan Gangguan Jiwa Berat  yang mendapatkan pelayanan sesuai standar"},{"nilai":0,"deskripsi":"d. < 100% Orang Dengan Gangguan Jiwa Berat  yang mendapatkan pelayanan sesuai standar"}] 
      },
      { 
        id: 't1-i13', 
        question: "Persentase Bayi usia 0-11 bulan yang mendapatkan Imunisasi Lengkap", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 80%"},{"nilai":75,"deskripsi":"b. 70% - 79%"},{"nilai":50,"deskripsi":"c. 60% - 69%"},{"nilai":0,"deskripsi":"d. < 60%"}] 
      },
      { 
        id: 't1-i14', 
        question: "Pesentase penduduk sesuai kelompok usia yang dilakukan skrining PTM", 
        skala: [{"nilai":100,"deskripsi":"a.  ≥ 70%"},{"nilai":50,"deskripsi":"b. 50% - 70%"},{"nilai":0,"deskripsi":"c. < 50%"}] 
      },
      { 
        id: 't1-i15', 
        question: "Persentase orang dengan HIV (ODHIV ) baru ditemukan yang mendapatkan pengobatan ARV", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 90%"},{"nilai":50,"deskripsi":"b. 80% - 90 %"},{"nilai":0,"deskripsi":"c. < 80%"}] 
      },
      { 
        id: 't1-i16', 
        question: "Kabupaten/Kota yang telah eliminasi malaria", 
        skala: [{"nilai":100,"deskripsi":"a. memenuhi 3 kriteria syarat utama elminasi kriteria dan sudah terverivikasi (eliminasi malaria)"},{"nilai":50,"deskripsi":"b. memenuhi 3 kriteria syarat utama elminasi kriteria namun belum terverivikasi"},{"nilai":0,"deskripsi":"b. belum memenuhi"}] 
      },
      { 
        id: 't1-i17', 
        question: "Persentase Fasilitas Pelayanan Kesehatan Terakreditasi", 
        skala: [{"nilai":100,"deskripsi":"a. Tercapai 100%"},{"nilai":50,"deskripsi":"b. Tercapai 80 - <100%"},{"nilai":0,"deskripsi":"c. < 80 %"}] 
      },
      { 
        id: 't1-i18', 
        question: "Rasio ketersediaan tempat tidur rumah sakit terhadap jumlah penduduk yang dilayani", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 1 tempat tidur per 1.000 penduduk"},{"nilai":50,"deskripsi":"b. 0,5 - < 1 tempat tidur per 1.000 penduduk"},{"nilai":0,"deskripsi":"c. < 0,5 tempat tidur per 1.000 penduduk"}] 
      },
      { 
        id: 't1-i19', 
        question: "Persentase Puskesmas yang menyelenggarakan pelayanan kesehatan remaja", 
        skala: [{"nilai":100,"deskripsi":"a. > 60%"},{"nilai":50,"deskripsi":"b. 50 - 59.99%"},{"nilai":25,"deskripsi":"c. 40 - 49.99%"},{"nilai":0,"deskripsi":"d. < 40%"}] 
      },
      { 
        id: 't1-i20', 
        question: "Persentase puskesmas yang menyelenggarakan pelayanan kesehatan SANTUN LANSIA (UPL)", 
        skala: [{"nilai":100,"deskripsi":"a. > 40%"},{"nilai":50,"deskripsi":"b. 30 - 40%"},{"nilai":25,"deskripsi":"c. 20 - 29.99%"},{"nilai":0,"deskripsi":"d. < 20%"}] 
      },
      { 
        id: 't1-i21', 
        question: "Persentase ibu hamil KEK (Gizi KIA)", 
        skala: [{"nilai":100,"deskripsi":"a. <13%"},{"nilai":75,"deskripsi":"b. >13%-23 %"},{"nilai":50,"deskripsi":"c. >23%-33 %"},{"nilai":0,"deskripsi":"d. > 33%"}] 
      },
      { 
        id: 't1-i22', 
        question: "Prevalensi Obesitas pada  Anak Usia Sekolah", 
        skala: [{"nilai":100,"deskripsi":"a. < 8%"},{"nilai":50,"deskripsi":"b. 8 - 10%"},{"nilai":0,"deskripsi":"c. > 10%"}] 
      },
      { 
        id: 't1-i23', 
        question: "Persentase Puskesmas yang melaksanakan pelayanan kesehatan lingkungan dan ditindaklanjuti", 
        skala: [{"nilai":100,"deskripsi":"a. > 80%"},{"nilai":50,"deskripsi":"b. 60 - 80%"},{"nilai":25,"deskripsi":"c. 40 - 59.99%"},{"nilai":0,"deskripsi":"d. < 40%"}] 
      },
      { 
        id: 't1-i24', 
        question: "Rumah Sakit dan Puskesmas telah mengelola limbah medis sesuai standar", 
        skala: [{"nilai":100,"deskripsi":"a.Ya, ≥ 80%"},{"nilai":75,"deskripsi":"b.Ya, 60% - 79%"},{"nilai":50,"deskripsi":"c.Ya, 40% - 59%"},{"nilai":25,"deskripsi":"d. Ya, <40%"}] 
      },
      { 
        id: 't1-i25', 
        question: "Prevalensi Diare pada balita dalam 2 tahun terakhir", 
        skala: [{"nilai":100,"deskripsi":"a. Turun dari tahun sebelumnya"},{"nilai":50,"deskripsi":"b. Tetap"},{"nilai":0,"deskripsi":"c. Meningkat dari tahun sebelumnya"}] 
      },
      { 
        id: 't1-i26', 
        question: "Persentase Puskesmas yang melaksanakan deteksi dini penyalahgunaan Napza", 
        skala: [{"nilai":100,"deskripsi":"a. > 90% Puskesmas"},{"nilai":50,"deskripsi":"b. 70% - 90% Puskesmas"},{"nilai":0,"deskripsi":"c. < 70% Puskesmas"}] 
      },
      { 
        id: 't1-i27', 
        question: "Jumlah Penduduk usia ≥ 15 tahun yang memiliki risiko kesehatan jiwa yang mendapatkan skrining", 
        skala: [{"nilai":100,"deskripsi":"a. Mencapai target"},{"nilai":50,"deskripsi":"b. 50% mencapai target"},{"nilai":0,"deskripsi":"c. Tidak mencapai target"}] 
      },
      { 
        id: 't1-i28', 
        question: "Persentase posyandu aktif di Kabupaten/Kota", 
        skala: [{"nilai":100,"deskripsi":"a. > 50%"},{"nilai":50,"deskripsi":"b. 20% - 50%"},{"nilai":0,"deskripsi":"c. < 20%"}] 
      },
      { 
        id: 't1-i29', 
        question: "Adanya kebijakan Kawasan Tanpa Rokok (KTR) di setiap tatanan Kab/Kota Sehat dan menerapkan indikator prinsip 100% kepatuhan KTR", 
        skala: [{"nilai":100,"deskripsi":"a. memiliki kebijakan KTR pada 7-6 tatanan dan menerapkan indikator 100 % KTR"},{"nilai":50,"deskripsi":"b. memiliki kebijakan KTR pada 5-4 tatanan dan menerapkan indikator 100 % KTR"},{"nilai":25,"deskripsi":"c. memiliki kebijakan KTR pada 3 tatanan dan menerapkan indikator 100 % KTR"},{"nilai":0,"deskripsi":"d. memiliki kebijakan KTR pada ≤ 2 tatanan dan menerapkan indikator 100 % KTR"}] 
      },
      { 
        id: 't1-i30', 
        question: "Angka Bebas Jentik", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 95%"},{"nilai":0,"deskripsi":"b. < 95%"}] 
      },
      { 
        id: 't1-i31', 
        question: "Indeks Habitat Vektor Malaria atau Filariasis", 
        skala: [{"nilai":100,"deskripsi":"a. < 1"},{"nilai":0,"deskripsi":"b. > 1"}] 
      },
      { 
        id: 't1-i32', 
        question: "Success trap tikus", 
        skala: [{"nilai":100,"deskripsi":"a. < 1"},{"nilai":0,"deskripsi":"b. > 1"}] 
      },
      { 
        id: 't1-i33', 
        question: "Persentase Puskesmas yang melaksanakan pelayanan ramah anak (PRAP)", 
        skala: [{"nilai":100,"deskripsi":"a. >75% puskesmas memiliki SK sebagai PRAP"},{"nilai":50,"deskripsi":"b. 25 - 75% puskesmas memiliki SK sebagai PRAP"},{"nilai":0,"deskripsi":"c. < 25% puskesmas  memiliki SK sebagai PRAP"}] 
      }
    ]
  },
  {
    id: 'tatanan-2',
    name: "TATANAN PERMUKIMAN DAN FASILITAS UMUM",
    indicators: [
      { 
        id: 't2-i1', 
        question: "Nilai Indeks Kualitas Lingkungan Hidup (IKLH)", 
        skala: [{"nilai":100,"deskripsi":"a. 100 - 50"},{"nilai":0,"deskripsi":"b. < 50"}] 
      },
      { 
        id: 't2-i2', 
        question: "Akses Air Minum Aman di Kabupaten/Kota", 
        skala: [{"nilai":100,"deskripsi":"a. Tercapai (Mencapai Target Tahunan Kab/Kota)"},{"nilai":0,"deskripsi":"b. Tidak tercapai (Tidak Mencapai Target Tahunan Kab/Kota)"}] 
      },
      { 
        id: 't2-i3', 
        question: "Rumah tangga memiliki akses sanitasi aman", 
        skala: [{"nilai":100,"deskripsi":"a. Tercapai (Mencapai Target Tahunan Kab/Kota)"},{"nilai":0,"deskripsi":"b. Tidak tercapai (Tidak Mencapai Target Tahunan Kab/Kota)"}] 
      },
      { 
        id: 't2-i4', 
        question: "Rumah tangga yang melakukan pengelolaan sampah berupa pengurangan dan penanganan sampah", 
        skala: [{"nilai":100,"deskripsi":"a. Tercapai (Mencapai Target Tahunan Kab/Kota)"},{"nilai":0,"deskripsi":"b. Tidak tercapai (Tidak Mencapai Target Tahunan Kab/Kota)"}] 
      },
      { 
        id: 't2-i5', 
        question: "Luas kawasan permukiman kumuh kewenangan pemerintah kota/kabupaten yang tertangani (luasan di bawah 10 hektar):", 
        skala: [{"nilai":100,"deskripsi":"a. Terjadi penurunan luasan kumuh"},{"nilai":0,"deskripsi":"b. Tidak terjadi penurunan luasan kumuh, bahkan meningkat"}] 
      },
      { 
        id: 't2-i6', 
        question: "Persentase rumah ibadat yang menerapkan Kawasan Tanpa Rokok (KTR)", 
        skala: [{"nilai":100,"deskripsi":"a.  ≥ 71%"},{"nilai":0,"deskripsi":"d. < 71%"}] 
      },
      { 
        id: 't2-i7', 
        question: "Persentase taman bermain yang menerapkan Kawasan Tanpa Rokok (KTR)", 
        skala: [{"nilai":100,"deskripsi":"a.  ≥ 71%"},{"nilai":0,"deskripsi":"d. < 71%"}] 
      },
      { 
        id: 't2-i8', 
        question: "Akses terhadap air minum yang layak melalui Sistem Penyediaan Air Minum (SPAM) jaringan perpipaan dan non perpipaan", 
        skala: [{"nilai":100,"deskripsi":"a. Tercapai"},{"nilai":0,"deskripsi":"b. Tidak Tercapai"}] 
      },
      { 
        id: 't2-i9', 
        question: "Persentase Tempat Fasilitas Umum (TFU) yang dilakukan inspeksi kesehatan lingkungan", 
        skala: [{"nilai":100,"deskripsi":"a. >80%"},{"nilai":50,"deskripsi":"b. 39%-79%"},{"nilai":25,"deskripsi":"c. <39%"}] 
      },
      { 
        id: 't2-i10', 
        question: "Adanya implementasi program langit biru", 
        skala: [{"nilai":100,"deskripsi":"a. Ada, diatur melalui Perda"},{"nilai":50,"deskripsi":"b. Ada, diatur melalui Perkada"},{"nilai":25,"deskripsi":"c. Ada, diatur melalui SE Kepala Daerah"},{"nilai":0,"deskripsi":"d. Tidak ada"}] 
      },
      { 
        id: 't2-i11', 
        question: "Pelaksanaan car free day", 
        skala: [{"nilai":100,"deskripsi":"a. Pelaksanaan rutin"},{"nilai":50,"deskripsi":"b. Tidak rutin dilaksanakan"},{"nilai":0,"deskripsi":"c. Tidak ada CFD"}] 
      },
      { 
        id: 't2-i12', 
        question: "Peningkatan pengelolaan sungai dan keterlibatan masyarakat melalui Program Kali Bersih (PROKASIH)", 
        skala: [{"nilai":100,"deskripsi":"a. Adanya regulasi/kebijakan dan keterlibatan masyarakat"},{"nilai":50,"deskripsi":"b. Ada, hanya regulasi/kebijakan atau keterlibatan masyarakat"},{"nilai":0,"deskripsi":"c. Tidak ada"}] 
      },
      { 
        id: 't2-i13', 
        question: "Adanya Tim Koordinasi yang menangani Pengelolaan Sumber Daya Air di tingkat Kabupaten/Kota", 
        skala: [{"nilai":100,"deskripsi":"a. Ada dan Aktif, Rencana Kerjanya terimplementasi"},{"nilai":50,"deskripsi":"b. Ada  dan Aktif namun Rencana Kerjanya terimplementasi"},{"nilai":0,"deskripsi":"c. Tidak ada"},{"nilai":0,"deskripsi":"e. Masyarakat tidak terlibat dalam  pengelolaan sungai"}] 
      },
      { 
        id: 't2-i14', 
        question: "Adanya Penyelenggara SPAM (BUMD/UPTD/BUMDES/POKMAS/BUKS/Swasta)  dan memiliki dokumen RISPAM", 
        skala: [{"nilai":100,"deskripsi":"a. Ada dan dilengkapi dokumen RISPAM yang ditetapkan oleh kepala daerah"},{"nilai":50,"deskripsi":"b. Ada penyelenggara SPAM namun tidak dilengkapi dokumen RISPAM atau ada dokumen namun disediakan oleh Kab/Kota lain"},{"nilai":0,"deskripsi":"c. Belum memiliki"}] 
      },
      { 
        id: 't2-i15', 
        question: "Adanya regulasi/kebijakan terkait Air Limbah Domestik (ALD) (Perda dan/atau Perkada terkait Pengelolaan ALD ) dan  Dokumen Perencanaan Sistem Pengelolaan ALD (Strategi Sanitasi Perkotaan dan/atau Rencana Induk Sistem Pengelolaan ALD)", 
        skala: [{"nilai":100,"deskripsi":"a. Adanya regulasi/kebijakan dan dokumen perencanaan"},{"nilai":50,"deskripsi":"b. Ada, hanya regulasi/kebijakan atau dokumen perencanaan"},{"nilai":0,"deskripsi":"c. Tidak ada"}] 
      },
      { 
        id: 't2-i16', 
        question: "Adanya Pemisahan Peran Operator dan Regulator dalam Kelembagaan Pengelola Persampahan", 
        skala: [{"nilai":100,"deskripsi":"a. Ada  (Pengelola ALD adalah UPTD/BLUD/BUMD) dan beroperasi"},{"nilai":50,"deskripsi":"b. Pengelola Persampahan adalah Dinas dan beroperasi"},{"nilai":25,"deskripsi":"c. Ada tetapi tidak beroperasi"},{"nilai":0,"deskripsi":"d. Tidak terdapat tusi pengelolaan persampahan pada OPD"}] 
      },
      { 
        id: 't2-i17', 
        question: "Terdapat Instalasi Pengolahan Lumpur Tinja (IPLT), dengan layanan penyedotan lumpur tinja serta truk tinja yang beroperasi", 
        skala: [{"nilai":100,"deskripsi":"a. Adanya layanan penyedotan, truk tinja yang beroperasi dan instalasi IPLT"},{"nilai":50,"deskripsi":"b. Adanya layanan penyedotan dan truk tinja yang beroperasi"},{"nilai":0,"deskripsi":"c. Tidak ada layanan"}] 
      },
      { 
        id: 't2-i18', 
        question: "Terdapat instalasi pengolahan air limbah domestik (IPALD) serta tersambung ke rumah tangga", 
        skala: [{"nilai":100,"deskripsi":"a. Tersedia dengan idle capacity <50%"},{"nilai":50,"deskripsi":"b. Tersedia dengan idle capacity 50-85%"},{"nilai":25,"deskripsi":"c. Tersedia dengan idle capacity >85%"},{"nilai":0,"deskripsi":"d. Tidak tersedia IPALD"}] 
      },
      { 
        id: 't2-i19', 
        question: "Adanya regulasi/kebijakan terkait persampahan (Perda atau Perkada) dan Dokumen Perencanaan Sistem Pengelolaan Sampah (Strategi Sanitasi Kabupaten/Kota dan/atau Rencana Induk Sistem Pengelolaan Sampah)", 
        skala: [{"nilai":100,"deskripsi":"a. Adanya regulasi/kebijakan dan dokumen perencanaan"},{"nilai":50,"deskripsi":"b. Ada, hanya regulasi/kebijakan atau dokumen perencanaan"},{"nilai":0,"deskripsi":"d. Tidak ada"}] 
      },
      { 
        id: 't2-i20', 
        question: "Adanya  pelaksanaan pemilahan sampah oleh kelompok masyarakat dan program pengelolaan sampah tingkat desa yang meliputi pemrosesan awal di tingkat rumah tangga sebelum diangkut ke TPS, adanya upaya pengolahan sampah organik menjadi kompos, memfungsikan TPS menjadi tempat daur ulang sampah rumah tangga, dan pengangkutan sampah dari TPS ke TPA secara rutin", 
        skala: [{"nilai":100,"deskripsi":"a. > 80% desa/kelurahan"},{"nilai":50,"deskripsi":"b. 50 - 80% desa/kelurahan"},{"nilai":25,"deskripsi":"c. < 50% desa/kelurahan"},{"nilai":0,"deskripsi":"d. Tidak dilakukan pengelolaan sampah"}] 
      },
      { 
        id: 't2-i21', 
        question: "Persentase infrastruktur pengolahan sampah berbasis masyarakat (TPS 3R dan/atau bank sampah) terbangun serta sarana pengangkutan sampah sesuai standar dan beroperasi", 
        skala: [{"nilai":100,"deskripsi":"a. > 70% infrastruktur pengolahan sampah serta sarana pengangkutan sampah sesuai standar beroperasi"},{"nilai":50,"deskripsi":"b. 30% ≤ x ≤ 70% infrastruktur pengolahan sampah serta sarana pengangkutan sampah sesuai standar beroperasi"},{"nilai":25,"deskripsi":"c. < 30% infrastruktur pengolahan sampah serta sarana pengangkutan sampah sesuai standar beroperasi"},{"nilai":0,"deskripsi":"d. Tidak beroperasi"}] 
      },
      { 
        id: 't2-i22', 
        question: "Adanya penutupan sampah secara berkala dan tempat pemrosesan akhir  sampah (TPA) dilengkapi dengan Instalasi Pengolahan Lindi (IPL) di TPA", 
        skala: [{"nilai":100,"deskripsi":"a. Ada dan dilengkapi Instalasi Pengolahan Lindi (IPL), beroperasi setiap hari"},{"nilai":50,"deskripsi":"b. Ada namun tidak dilengkapi Instalasi Pengolahan Lindi (IPL), beroperasi tidak setiap hari"},{"nilai":25,"deskripsi":"c. Ada, hanya ditutup atau diproses"},{"nilai":0,"deskripsi":"d. Tidak ada"}] 
      },
      { 
        id: 't2-i23', 
        question: "Persentase korban kebakaran atau terdampak kebakaran yang mendapatkan pelayanan  penyelamatan dan evakuasi kebakaran", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 90%"},{"nilai":75,"deskripsi":"b. 90% - 50%"},{"nilai":50,"deskripsi":"c. < 50%"},{"nilai":25,"deskripsi":"d.Tidak ada"}] 
      },
      { 
        id: 't2-i24', 
        question: "Keberadaan fasilitas dan sarana di kawasan pertamanan yang ramah anak, ramah lansia dan ramah difable", 
        skala: [{"nilai":100,"deskripsi":"a.Ya, tersedia lengkap dan terpelihara"},{"nilai":50,"deskripsi":"b.Ya, tersedia sebagian dan terpelihara"},{"nilai":25,"deskripsi":"c. Ya, tersedia tidak terpelihara"},{"nilai":0,"deskripsi":"d. Tidak tersedia"}] 
      },
      { 
        id: 't2-i25', 
        question: "Implementasi ketersediaan/akses tempat pengumpulan limbah B3 yang memenuhi syarat di tingkat Kabupaten/Kota", 
        skala: [{"nilai":100,"deskripsi":"a. Tersedianya akses terhadap depo/tempat pengumpulan limbah B3  dan ]"},{"nilai":50,"deskripsi":"b. Ada, hanya regulasi/kebijakan atau depo/tempat pengumpulan  limbah B3 sebagian berfungsi"},{"nilai":25,"deskripsi":"c. Ada, hanya regulasi/kebijakan atau depo/tempat pengumpulan  limbah B3 berfungsi sebagian"},{"nilai":0,"deskripsi":"d. Tidak ada"}] 
      },
      { 
        id: 't2-i26', 
        question: "Akses rumah tangga yang memenuhi kriteria rumah layak huni", 
        skala: [{"nilai":100,"deskripsi":"a. Terjadi peningkatan persentase rumah layak huni"},{"nilai":0,"deskripsi":"b. Tetap atau tidak meningkat persentase rumah layak huni"}] 
      }
    ]
  },
  {
    id: 'tatanan-3',
    name: "TATANAN SATUAN PENDIDIKAN",
    indicators: [
      { 
        id: 't3-i1', 
        question: "Keberadaan regulasi daerah tentang pelaksanaan program Usaha Kesehatan Sekolah/Madrasah (UKS/M)", 
        skala: [{"nilai":100,"deskripsi":"a. Ada"},{"nilai":0,"deskripsi":"b. Tidak"}] 
      },
      { 
        id: 't3-i2', 
        question: "Keberadaan program Usaha Kesehatan Sekolah/Madrasah (UKS/M) dalam  perencanaan daerah (RPJMD, RKPD, Renstra PD dan Renja PD)", 
        skala: [{"nilai":100,"deskripsi":"a. Masuk dalam dokumen perencanaan daerah"},{"nilai":0,"deskripsi":"b. Tidak ada"}] 
      },
      { 
        id: 't3-i3', 
        question: "Persentase Sekolah/Madrasah/Pondok Pesantren yang menerapkan Satuan Pendidikan Ramah Anak", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 71%"},{"nilai":0,"deskripsi":"b. < 71%"}] 
      },
      { 
        id: 't3-i4', 
        question: "Persentase sekolah/madrasah yang minimal mencapai stratifikasi standar Usaha Kesehatan Sekolah/Madrasah (UKS/M) atau yg mengimplementasikan Gerakan Sekolah Sehat secara berkelanjutan.", 
        skala: [{"nilai":100,"deskripsi":"a.  > 50%"},{"nilai":75,"deskripsi":"b. 30%-50%"},{"nilai":0,"deskripsi":"c. < 30%"}] 
      },
      { 
        id: 't3-i5', 
        question: "Adanya penerapan Kawasan Tanpa Rokok di satuan pendidikan usia dini, dasar dan menengah pertama atau sederajat", 
        skala: [{"nilai":100,"deskripsi":"a. Seluruh satuan pendidikan atau sederajat"},{"nilai":0,"deskripsi":"b. Sebagian satuan  pendidikan atau sederajat"}] 
      },
      { 
        id: 't3-i6', 
        question: "Persentase Sekolah/Madrasah yang telah dilakukan Inspeksi Kesehatan Lingkungan (IKL)", 
        skala: [{"nilai":100,"deskripsi":"a.  ≥ 80%"},{"nilai":50,"deskripsi":"b. 50 - 80%"},{"nilai":0,"deskripsi":"c. < 50%"}] 
      },
      { 
        id: 't3-i7', 
        question: "Keberadaan Tim Pembina UKS/M tingkat Kabupaten/Kota dan tingkat Kecamatan", 
        skala: [{"nilai":100,"deskripsi":"a. Ada"},{"nilai":0,"deskripsi":"b. Tidak ada"}] 
      },
      { 
        id: 't3-i8', 
        question: "Presentase Sekolah/Madrasah yang memiliki tim pelaksana UKS/M dibuktikan dengan SK, Rencana Kerja dan Realisasi", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 80 %"},{"nilai":50,"deskripsi":"b. 60 - 79%"},{"nilai":25,"deskripsi":"c. 40 - 59%"},{"nilai":0,"deskripsi":"d. < 40%"}] 
      },
      { 
        id: 't3-i9', 
        question: "Persentase sekolah/madrasah yang melakukan pengawasan internal", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 80 %"},{"nilai":50,"deskripsi":"b. 60 - 79%"},{"nilai":25,"deskripsi":"c. 40 - 59%"},{"nilai":0,"deskripsi":"d. < 40%"}] 
      },
      { 
        id: 't3-i10', 
        question: "Presentase Sekolah/Madrasah yang menerapkan dan mengajukan konsep sekolah Adiwiyata secara berkelanjutan.", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 80 %"},{"nilai":50,"deskripsi":"b. 60 - 79%"},{"nilai":25,"deskripsi":"c. 40 - 59%"},{"nilai":0,"deskripsi":"d. < 40%"}] 
      },
      { 
        id: 't3-i11', 
        question: "Presentase Sekolah/Madrasah  yang menyelenggarakan  skrining kesehatan siswa SD dan SMP.", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 80 %"},{"nilai":50,"deskripsi":"b. 60 - 79%"},{"nilai":25,"deskripsi":"c. 40 - 59%"},{"nilai":0,"deskripsi":"d. < 40%"}] 
      },
      { 
        id: 't3-i12', 
        question: "Persentase anak usia sekolah dasar dan sederajat yang mendapatkan Imunisasi Sekolah Lengkap (ISL)", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 80%"},{"nilai":75,"deskripsi":"b. 70% - 79%"},{"nilai":50,"deskripsi":"c. 60% - 69%"},{"nilai":0,"deskripsi":"d. < 60%"}] 
      }
    ]
  },
  {
    id: 'tatanan-4',
    name: "TATANAN PASAR",
    indicators: [
      { 
        id: 't4-i1', 
        question: "Adanya regulasi daerah tentang pasar sehat", 
        skala: [{"nilai":100,"deskripsi":"a. Ada"},{"nilai":0,"deskripsi":"b. Tidak"}] 
      },
      { 
        id: 't4-i2', 
        question: "Adanya regulasi penanganan Pedagang Kaki Lima (PKL)", 
        skala: [{"nilai":100,"deskripsi":"a. Ada"},{"nilai":0,"deskripsi":"b. Tidak"}] 
      },
      { 
        id: 't4-i3', 
        question: "Adanya penerapan Kawasan Tanpa Rokok", 
        skala: [{"nilai":100,"deskripsi":"a. Ada"},{"nilai":0,"deskripsi":"b. Tidak ada"}] 
      },
      { 
        id: 't4-i4', 
        question: "Persentase pasar yang menerapkan Kesehatan dan Keselamatan Kerja (K3)", 
        skala: [{"nilai":100,"deskripsi":"a. > 80%"},{"nilai":50,"deskripsi":"b. 60% - 80%"},{"nilai":25,"deskripsi":"c. 30% - 59%"},{"nilai":0,"deskripsi":"d. < 30%"}] 
      },
      { 
        id: 't4-i5', 
        question: "Persentase Pasar yang menyediakan air bersih/air minum", 
        skala: [{"nilai":100,"deskripsi":"a. > 80%"},{"nilai":50,"deskripsi":"b. 60% - 80%"},{"nilai":25,"deskripsi":"c. 30% - 59%"},{"nilai":0,"deskripsi":"d. < 30%"}] 
      },
      { 
        id: 't4-i6', 
        question: "Persentase pasar yang melakukan pengawasan internal dan memenuhi syarat", 
        skala: [{"nilai":100,"deskripsi":"a. > 80% pasar telah melakukan pengawasan internal"},{"nilai":50,"deskripsi":"b. 60% - 80% pasar telah melakukan pengawasan internal"},{"nilai":25,"deskripsi":"c. 30% - 59% pasar telah melakukan pengawasan internal"},{"nilai":0,"deskripsi":"d. < 30% pasar telah melakukan pengawasan internal"}] 
      },
      { 
        id: 't4-i7', 
        question: "Persentase pasar yang melaksanakan Komunikasi, Informasi dan Edukasi (KIE) kesehatan  masyarakat bekerjasama dengan sektor terkait  kepada masyarakat pasar", 
        skala: [{"nilai":100,"deskripsi":"a. > 80%"},{"nilai":50,"deskripsi":"b. 60% - 80%"},{"nilai":25,"deskripsi":"c. 30% - 59%"},{"nilai":0,"deskripsi":"d. < 30%"}] 
      },
      { 
        id: 't4-i8', 
        question: "Persentase pasar yang memiliki fasilitas ruang ASI", 
        skala: [{"nilai":100,"deskripsi":"a. > 80%"},{"nilai":50,"deskripsi":"b. 60% - 80%"},{"nilai":25,"deskripsi":"c. 30% - 59%"},{"nilai":0,"deskripsi":"d. < 30%"}] 
      },
      { 
        id: 't4-i9', 
        question: "Persentase pasar  yang menjual daging berasal dari RPH/distributor yang memiliki Nomor Kontrol Veteriner (NKV) dan bersertifikat Halal", 
        skala: [{"nilai":100,"deskripsi":"a. > 80%"},{"nilai":50,"deskripsi":"b. 60% - 80%"},{"nilai":25,"deskripsi":"c. 30% - 59%"},{"nilai":0,"deskripsi":"d. < 30%"}] 
      },
      { 
        id: 't4-i10', 
        question: "Persentase pasar  yang menjual daging unggas berasal dari Rumah Potong Ayam (RPA)/ Rumah Potong Unggas (RPU) yang memiliki Nomor Kontrol Veteriner (NKV) dan bersertifikat Halal", 
        skala: [{"nilai":100,"deskripsi":"a. > 80%"},{"nilai":50,"deskripsi":"b. 60% - 80%"},{"nilai":25,"deskripsi":"c. 30% - 59%"},{"nilai":0,"deskripsi":"d. < 30%"}] 
      },
      { 
        id: 't4-i11', 
        question: "Persentase pasar yang melakukan pengelolaan sampah dengan prinsip 3 R (reduce, reuse, dan recyle)", 
        skala: [{"nilai":100,"deskripsi":"a. > 80%"},{"nilai":50,"deskripsi":"b. 60% - 80%"},{"nilai":25,"deskripsi":"c. 30% - 59%"},{"nilai":0,"deskripsi":"d. < 30%"}] 
      },
      { 
        id: 't4-i12', 
        question: "Persentase pasar yang melakukan pengelolaan air limbah", 
        skala: [{"nilai":100,"deskripsi":"a. > 80%"},{"nilai":50,"deskripsi":"b. 60% - 80%"},{"nilai":25,"deskripsi":"c. 30% - 59%"},{"nilai":0,"deskripsi":"d. < 30%"}] 
      }
    ]
  },
  {
    id: 'tatanan-5',
    name: "TATANAN  PERKANTORAN DAN PERINDUSTRIAN",
    indicators: [
      { 
        id: 't5-i1', 
        question: "Persentase industri kecil dan menengah yang memenuhi standar kegiatan usaha dan/atau standar produk sesuai persyaratan dan/atau kewajiban perizinan berusaha pada sektor perindustrian", 
        skala: [{"nilai":100,"deskripsi":"a. > 80%"},{"nilai":50,"deskripsi":"b. > 60 sd < 80%"},{"nilai":25,"deskripsi":"c. > 30 sd < 60%"},{"nilai":0,"deskripsi":"d. <30%"}] 
      },
      { 
        id: 't5-i2', 
        question: "Persentase tempat kerja/ perusahaan yang menerapkan Kawasan Tanpa Rokok (KTR)", 
        skala: [{"nilai":100,"deskripsi":"a.  > 80%"},{"nilai":0,"deskripsi":"b. < 80% (Tidak tersedia data/NA)"}] 
      },
      { 
        id: 't5-i3', 
        question: "Jumlah/Persentase tempat kerja atau perusahaan yang memiliki unit (Panitia Pembina Keselamatan dan Kesehatan Kerja (P2K3)", 
        skala: [{"nilai":100,"deskripsi":"a.  ≥ 80% tempat kerja telah memiliki unit P2K3"},{"nilai":0,"deskripsi":"b. < 80% tempat kerja telah memiliki unit P2K3"}] 
      },
      { 
        id: 't5-i4', 
        question: "Persentase tempat kerja yang telah memfasilitasi pemeriksaan kesehatan berkala (deteksi dini) pada pegawainya minimal 1 tahun sekali", 
        skala: [{"nilai":100,"deskripsi":"a.  > 80%"},{"nilai":50,"deskripsi":"b. > 50 sd < 80%"},{"nilai":25,"deskripsi":"c. < 50%"},{"nilai":0,"deskripsi":"d. Tidak ada (Tidak tersedia data/NA)"}] 
      },
      { 
        id: 't5-i5', 
        question: "Angka kecelakaan kerja di tempat kerja setahun terakhir", 
        skala: [{"nilai":100,"deskripsi":"a. Menurun"},{"nilai":50,"deskripsi":"b. Tetap"},{"nilai":25,"deskripsi":"c. Meningkat"},{"nilai":0,"deskripsi":"d. (Tidak tersedia data/NA)"}] 
      },
      { 
        id: 't5-i6', 
        question: "Jumlah perusahaan yang mendapatkan penghargaan dibidang kesehatan yang diberikan oleh pemerintah pusat atau daerah, seperti:                                                       Penghargaan HIV/AIDS, TBC di tempat kerja, GP2SP, K3 Perkantoran", 
        skala: [{"nilai":100,"deskripsi":"a. Jumlah perusahaan yang mendapatkan penghargaan dibidang kesehatan > 10 perusahaan"},{"nilai":75,"deskripsi":"b. 6 - 9 perusahaan"},{"nilai":50,"deskripsi":"c. 4 - 6 perusahaan"},{"nilai":25,"deskripsi":"c. 1 - 3  perusahaan"},{"nilai":0,"deskripsi":"d. 0"}] 
      },
      { 
        id: 't5-i7', 
        question: "Persentase jumlah puskesmas membina Pos UKK", 
        skala: [{"nilai":100,"deskripsi":"a.  > 80%"},{"nilai":75,"deskripsi":"b.  > 50 sd < 80%"},{"nilai":50,"deskripsi":"≥ 25 % -  ≤ 50%"},{"nilai":25,"deskripsi":"c. > 0 sampai < 25%"},{"nilai":0,"deskripsi":"d. Tidak ada (Tidak tersedia data/NA)"}] 
      },
      { 
        id: 't5-i8', 
        question: "Jumlah  perusahaan menerapkan Gerakan Pekerja Perempuan Sehat Produktif (GP2SP)", 
        skala: [{"nilai":100,"deskripsi":"a. > 200"},{"nilai":50,"deskripsi":"b. > 100 - 200"},{"nilai":25,"deskripsi":"c. Jumlah 1 - 100 perusahaan diisi sesuai angka capaian GP2SP (isian terbuka range 1 - 100)"},{"nilai":0,"deskripsi":"d. Tidak ada (Tidak tersedia data/NA)"}] 
      },
      { 
        id: 't5-i9', 
        question: "Adanya kasus pencemaran lingkungan akibat industri dalam setahun terakhir", 
        skala: [{"nilai":100,"deskripsi":"a. Tidak ada pencemaran lingkungan"},{"nilai":50,"deskripsi":"b. Ada pencemaran lingkungan dan ditindaklanjuti seluruhnya"},{"nilai":25,"deskripsi":"c. Ada pencemaran lingkungan dan ditindaklanjuti sebagian"},{"nilai":0,"deskripsi":"d. Ada pencemaran lingkungan namun tidak ditindaklanjuti (Tidak tersedia data/NA)"}] 
      },
      { 
        id: 't5-i10', 
        question: "Persentase perusahaan menyampaikan laporan Rencana Pengelolaan Lingkungan (RKL)/ Rencana Pemantauan Lingkungan (RPL) / Upaya Pengelolaan Lingkungan (UKL)/ Upaya Pemantauan Lingkungan (UPL)  secara berkala 6 bulan sekali", 
        skala: [{"nilai":100,"deskripsi":"a.  > 80%"},{"nilai":50,"deskripsi":"b. > 50 sd < 80%"},{"nilai":25,"deskripsi":"c. < 50%"},{"nilai":0,"deskripsi":"d. Tidak ada (Tidak tersedia data/NA)"}] 
      },
      { 
        id: 't5-i11', 
        question: "Persentase usaha mikro sektor makanan, minuman, industri pengolahan yang memiliki Sertifikat PIRT, MD BPOM/Izin Edar", 
        skala: [{"nilai":100,"deskripsi":"a.  > 80%"},{"nilai":50,"deskripsi":"b. > 50 sd < 80%"},{"nilai":25,"deskripsi":"c. < 50%"},{"nilai":0,"deskripsi":"d. Tidak ada (Tidak tersedia data/NA)"}] 
      }
    ]
  },
  {
    id: 'tatanan-6',
    name: "TATANAN PARIWISATA",
    indicators: [
      { 
        id: 't6-i1', 
        question: "Keberadaan regulasi daerah tentang Pariwisata Sehat", 
        skala: [{"nilai":100,"deskripsi":"a. Ada"},{"nilai":0,"deskripsi":"b. Tidak"}] 
      },
      { 
        id: 't6-i2', 
        question: "Rencana Induk Pembangunan Pariwisata Daerah (RIPPARDA) masuk dalam dokumen perencanaan daerah (RPJMD/Renstra/RKPD)", 
        skala: [{"nilai":100,"deskripsi":"a. Masuk dalam dokumen perencanaan daerah"},{"nilai":0,"deskripsi":"b. Tidak ada"}] 
      },
      { 
        id: 't6-i3', 
        question: "Jumlah Usaha Daya Tarik Wisata  yang mengimplementasi kawasan tanpa rokok (KTR)", 
        skala: [{"nilai":100,"deskripsi":"a. Semua DTW mengimplementasikan KTR"},{"nilai":0,"deskripsi":"b. Sebagian DTW mengimplementasikan KTR"}] 
      },
      { 
        id: 't6-i4', 
        question: "Persentase sarana akomodasi pariwisata yang laik sehat", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 71%"},{"nilai":0,"deskripsi":"b. < 71%"}] 
      },
      { 
        id: 't6-i5', 
        question: "Persentase restoran yang memiliki sertifikat laik hygiene sanitasi (SLHS)", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 65%"},{"nilai":0,"deskripsi":"b. < 65%"}] 
      },
      { 
        id: 't6-i6', 
        question: "Keberadaan Daya Tarik Wisata (DTW) yang menyediakan fasilitas pelayanan kesehatan atau bekerjasama dengan fasilitas pelayanan kesehatan terdekat", 
        skala: [{"nilai":100,"deskripsi":"a. Seluruh DTW menyediakan fasilitas pelayanan kesehatan"},{"nilai":0,"deskripsi":"b. Sebagian DTW menyediakan fasilitas pelayanan kesehatan"}] 
      },
      { 
        id: 't6-i7', 
        question: "Jumlah Daya Tarik Wisata (DTW) yang memiliki sertifikat laik sehat (SLS)", 
        skala: [{"nilai":100,"deskripsi":"a. Meningkat dari tahun sebelumnya"},{"nilai":0,"deskripsi":"b. Tidak ada peningkatan dari tahun sebelumnya"}] 
      },
      { 
        id: 't6-i8', 
        question: "Persentase Daya Tarik Wisata (DTW) yang menerapkan pariwisata inklusif", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 75%"},{"nilai":50,"deskripsi":"b. 50-75%"},{"nilai":25,"deskripsi":"c. < 50%"},{"nilai":0,"deskripsi":"d. Tidak ada"}] 
      },
      { 
        id: 't6-i9', 
        question: "Daya Tarik Wisata (DTW) menyediakan asuransi keselamatan bagi wisatawan", 
        skala: [{"nilai":100,"deskripsi":"a.   Seluruh DTW menyediakan asuransi bagi wisatawan"},{"nilai":50,"deskripsi":"b.   Tidak semua DTW menyediakan asuransi"},{"nilai":0,"deskripsi":"c.   Tidak ada"}] 
      },
      { 
        id: 't6-i10', 
        question: "Tersedianya Daya Tarik Wisata (DTW) yang kondusif", 
        skala: [{"nilai":100,"deskripsi":"a. Ya, pada semua daya tarik wisata"},{"nilai":50,"deskripsi":"b. Ya, namun belum di semua daya tarik wisata"},{"nilai":0,"deskripsi":"c. Tidak ada"}] 
      },
      { 
        id: 't6-i11', 
        question: "Kabupaten/Kota memiliki Desa/Kampung Wisata", 
        skala: [{"nilai":100,"deskripsi":"a. Ada"},{"nilai":0,"deskripsi":"b. Tidak ada"}] 
      },
      { 
        id: 't6-i12', 
        question: "Tedapat Kelompok Sadar Wisata (Pokdarwis) di setiap Desa/Kampung Wisata", 
        skala: [{"nilai":100,"deskripsi":"a.   Ada, berfungsi dan berkelanjutan"},{"nilai":50,"deskripsi":"b.   Ada, berfungsi"},{"nilai":0,"deskripsi":"c.   Tidak ada"}] 
      },
      { 
        id: 't6-i13', 
        question: "Persentase Tempat Pengolahan Pangan (TPP) Sertifikat dan Non Sertifikat Laik higiene Sanitasi (SLHS) yang dilakukan pembinaan/pengawasan dengan pemberian label", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 71% TPP SLHS dan ≥ 71% TPP Non SLHS"},{"nilai":50,"deskripsi":"b. 51 - 70% TPP SLHS dan 51 - 70% TPP Non SLHS"},{"nilai":25,"deskripsi":"c. 31 - 50 % TPP SLHS dan 31 - 50 % TPP Non SLHS"},{"nilai":0,"deskripsi":"d. < 30% TPP SLHS dan < 30% TPP Non SLHS"}] 
      },
      { 
        id: 't6-i14', 
        question: "Persentase Usaha Daya Tarik Wisata yang memiliki upaya pengelolaan sampah secara mandiri", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 75%"},{"nilai":50,"deskripsi":"b. 50-75%"},{"nilai":25,"deskripsi":"c. < 50%"},{"nilai":0,"deskripsi":"d. Tidak ada"}] 
      }
    ]
  },
  {
    id: 'tatanan-7',
    name: "TATANAN TRANSPORTASI DAN  TERTIB LALU LINTAS JALAN",
    indicators: [
      { 
        id: 't7-i1', 
        question: "Adanya regulasi terkait penyediaan layanan transportasi jalan, kawasan tertib lalu lintas, sistem manajemen keselamatan lalu lintas dan angkutan jalan", 
        skala: [{"nilai":100,"deskripsi":"a. Ada"},{"nilai":0,"deskripsi":"b. Tidak"}] 
      },
      { 
        id: 't7-i2', 
        question: "Persentase kendaraan umum yang laik jalan", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 80% dari jumlah kendaraan"},{"nilai":0,"deskripsi":"b. < 80% dari jumlah kendaraan"}] 
      },
      { 
        id: 't7-i3', 
        question: "Persentase penurunan tingkat fatalitas akibat kecelakaan dalam tahun berjalan", 
        skala: [{"nilai":100,"deskripsi":"a. Kurang atau sama dengan minimal per tahun 62-65%"},{"nilai":0,"deskripsi":"b. Meningkat atau tidak ada penurunan"}] 
      },
      { 
        id: 't7-i4', 
        question: "Adanya penerapan Kawasan Tanpa Rokok di Terminal", 
        skala: [{"nilai":100,"deskripsi":"a. Ada"},{"nilai":0,"deskripsi":"b. Tidak ada"}] 
      },
      { 
        id: 't7-i5', 
        question: "Keberadaan sistem layanan pertolongan kecelakaan yang cepat dan terintegrasi Kesiapsiagaan dalam penanganan korban kecelakaan", 
        skala: [{"nilai":100,"deskripsi":"a. Tersedianya sistem layanan dalam penanganan korban kecelakaan  sudah terintegrasi dan tersosialisasi di masyarakat"},{"nilai":50,"deskripsi":"b. Tersedianya sistem layanan dalam penanganan korban kecelakaan dan tersosialisasi di masyarakat"},{"nilai":25,"deskripsi":"c. Tersedianya sistem layanan dalam penanganan korban kecelakaan"},{"nilai":0,"deskripsi":"d. Tidak tersedianya sistem layanan dalam penanganan korban kecelakaan"}] 
      },
      { 
        id: 't7-i6', 
        question: "Adanya program atau kegiatan pemeriksaan NAPZA atau narkoba terhadap pengemudi yang dilakukan", 
        skala: [{"nilai":100,"deskripsi":"a. Ada, berkala dan dilengkapi dengan dokumen"},{"nilai":50,"deskripsi":"b. Ada, tidak berkala namun dilengkapi dokumen"},{"nilai":25,"deskripsi":"c. Ada, tidak berkala dan tidak dilengkapi dokumen"},{"nilai":0,"deskripsi":"d. Tidak ada sama sekali"}] 
      },
      { 
        id: 't7-i7', 
        question: "Terminal yang memenuhi syarat kesehatan", 
        skala: [{"nilai":100,"deskripsi":"a. Dilaksanakan inspeksi kesehatan lingkungan  dan memenuhi syarat kesehatan"},{"nilai":50,"deskripsi":"b. Dilaksanakan inspeksi kesehatan lingkungan namun belum memenuhi syarat kesehatan"},{"nilai":0,"deskripsi":"c. Tidak dilaksanakan"}] 
      },
      { 
        id: 't7-i8', 
        question: "Persentase angkutan umum yang memiliki BLUe (Bukti Lulus Uji Elektronik)", 
        skala: [{"nilai":100,"deskripsi":"a. > 80% dari jumlah kendaraan"},{"nilai":50,"deskripsi":"b. 50 - 80% dari jumlah kendaraan"},{"nilai":25,"deskripsi":"c. < 50% dari jumlah kendaraan"},{"nilai":0,"deskripsi":"d. Tidak menerapkan BLUe"}] 
      },
      { 
        id: 't7-i9', 
        question: "Keberadaan fasilitas jalur pejalan kaki (trotoar) bagi masyarakat umum dan penyandang disabilitas", 
        skala: [{"nilai":100,"deskripsi":"a. Ada dan berfungsi sesuai peruntukannya"},{"nilai":0,"deskripsi":"b. Ada tapi tidak berfungsi sesuai peruntukkannya dan tidak ada"}] 
      },
      { 
        id: 't7-i10', 
        question: "Jumlah titik fasilitas jalur sepeda", 
        skala: [{"nilai":100,"deskripsi":"a. Meningkat"},{"nilai":50,"deskripsi":"b. Tetap"},{"nilai":0,"deskripsi":"c. Menurun"}] 
      },
      { 
        id: 't7-i11', 
        question: "Adanya zona selamat sekolah", 
        skala: [{"nilai":100,"deskripsi":"a. Meningkat"},{"nilai":50,"deskripsi":"b. Tetap"},{"nilai":0,"deskripsi":"c. Menurun"}] 
      },
      { 
        id: 't7-i12', 
        question: "Pengawasan dan penindakan terhadap emisi gas buang kendaraan", 
        skala: [{"nilai":100,"deskripsi":"a. Ada bengkel yang terakreditasi atau yang ditunjuk sesuai peraturan dan kegiatan pengawasan serta penindakan terdokumentasi"},{"nilai":50,"deskripsi":"b. Ada bengkel yang terakreditasi  atau ditunjuk sesuai peraturan yang ada dan kegiatan pengawasan serta penindakan tidak terdokumentasi"},{"nilai":25,"deskripsi":"c. Tidak ada bengkel dan kegiatan pengawasan serta penindakan terdokumentasi"},{"nilai":0,"deskripsi":"d. Tidak ada bengkel dan tidak ada kegiatan pengawasan serta penindakan"}] 
      }
    ]
  },
  {
    id: 'tatanan-8',
    name: "TATANAN PERLINDUNGAN SOSIAL",
    indicators: [
      { 
        id: 't8-i1', 
        question: "Penerima Pelayanan Dasar yang diberikan layanan SPM Bidang Sosial", 
        skala: [{"nilai":100,"deskripsi":"a. Memenuhi capaian SPM Bidang Sosial bernilai 100"},{"nilai":0,"deskripsi":"b. Tidak memenuhi capaian SPM"}] 
      },
      { 
        id: 't8-i2', 
        question: "Tersedianya data DTKS yang terverifikasi dan tervalidisasi", 
        skala: [{"nilai":100,"deskripsi":"a. Ya"},{"nilai":0,"deskripsi":"d. Tidak"}] 
      },
      { 
        id: 't8-i3', 
        question: "Monitoring dan evaluasi program jaminan perlindungan sosial yang dilakukan daerah", 
        skala: [{"nilai":100,"deskripsi":"a. Melakukan monitoring dan evaluasi"},{"nilai":0,"deskripsi":"b. Tidak melakukan monitoring dan evaluasi"}] 
      },
      { 
        id: 't8-i4', 
        question: "Persentase pelayanan komprehensif yang diberikan kepada perempuan dan anak korban kekerasan", 
        skala: [{"nilai":100,"deskripsi":"a. meningkat dari tahun sebelumnya"},{"nilai":0,"deskripsi":"b. tetap dari tahun sebelumnya"}] 
      },
      { 
        id: 't8-i5', 
        question: "Persentase pemerlu pelayanan kesejahteraan sosial (PPKS) yang memperoleh program perlindungan dan jaminan sosial, rehabilitasi sosial dan pemberdayaan sosial", 
        skala: [{"nilai":100,"deskripsi":"a. minimal 80%"},{"nilai":0,"deskripsi":"b. kurang dari 80%"}] 
      },
      { 
        id: 't8-i6', 
        question: "Adanya peraturan mengenai Penyelenggaraan Kesejahteraan Sosial di daerah", 
        skala: [{"nilai":100,"deskripsi":"a. Perda"},{"nilai":50,"deskripsi":"b. Perkada"},{"nilai":25,"deskripsi":"c. Peraturan lainnya"},{"nilai":0,"deskripsi":"d. Tidak ada"}] 
      },
      { 
        id: 't8-i7', 
        question: "Adanya layanan pengaduan terkait permasalahan sosial", 
        skala: [{"nilai":100,"deskripsi":"a. Ada dan seluruh pengaduan ditindak lanjuti"},{"nilai":50,"deskripsi":"b. Ada dan sebagian pengaduan ditindak lanjuti"},{"nilai":25,"deskripsi":"c. Ada dan pengaduan tidak ditindak lanjuti"},{"nilai":0,"deskripsi":"d. Tidak ada unit layanan pengaduan"}] 
      },
      { 
        id: 't8-i8', 
        question: "Adanya kebijakan/program peningkatan kesejahteraan sosial dalam Rencana Pembangunan jangka Menengah Daerah/RPJMD", 
        skala: [{"nilai":100,"deskripsi":"a. Ada, terealisasi seluruhnya"},{"nilai":50,"deskripsi":"b. Ada, terealisasi sebagian"},{"nilai":25,"deskripsi":"c. Ada, tidak terealisasi"},{"nilai":0,"deskripsi":"d. Tidak ada"}] 
      },
      { 
        id: 't8-i9', 
        question: "Keberadaan peran Lembaga Kesejahteraan Sosial (LKS) yang memberikan penanganan kepada pemerlu pelayanan kesejahteraan sosial (PPKS) yang berbadan hukum/ terdaftar di dinas sosial", 
        skala: [{"nilai":100,"deskripsi":"a. Ada, aktif seluruhnya"},{"nilai":50,"deskripsi":"b. Ada, aktif sebagian"},{"nilai":25,"deskripsi":"c. Ada, tidak aktif"},{"nilai":0,"deskripsi":"d. Tidak ada  PPKS"}] 
      },
      { 
        id: 't8-i10', 
        question: "Adanya regulasi daerah tentang penanganan kekerasan anak, perempuan dan lansia", 
        skala: [{"nilai":100,"deskripsi":"a. Dituangkan dalam Peraturan Daerah"},{"nilai":50,"deskripsi":"b. Dituangkan dalam Peraturan Kepala Daerah"},{"nilai":25,"deskripsi":"c. Dituangkan dalam Peraturan lainnya"},{"nilai":0,"deskripsi":"d. Tidak ada regulasi"}] 
      },
      { 
        id: 't8-i11', 
        question: "Adanya penyelenggaraan penanganan kekerasan anak, perempuan dan lansia  dalam Rencana Pembangunan Jangka Menengah Daerah/RPJMD", 
        skala: [{"nilai":100,"deskripsi":"a. Ada dalam RPJMD dan terealisasi seluruhnya"},{"nilai":50,"deskripsi":"b. Ada dalam RPJMD dan terealisasi sebagian"},{"nilai":25,"deskripsi":"c. Ada dalam RPJMD tapi belum terealisasi"},{"nilai":0,"deskripsi":"d. Tidak ada dalam RPJMD"}] 
      },
      { 
        id: 't8-i12', 
        question: "Adanya upaya pencegahan untuk menurunkan angka perkawinan pada usia anak", 
        skala: [{"nilai":100,"deskripsi":"a. Ada 4 upaya"},{"nilai":50,"deskripsi":"b. Ada 3 upaya"},{"nilai":25,"deskripsi":"c. Ada 1 - 2 upaya"},{"nilai":0,"deskripsi":"d. Tidak ada upaya"}] 
      },
      { 
        id: 't8-i13', 
        question: "Adanya penggiat penanganan kekerasan terhadap anak, perempuan dan lansia baik secara individu/kelompok", 
        skala: [{"nilai":100,"deskripsi":"a. Ada penggiat, memiliki rencana kerja dan terealisasi"},{"nilai":50,"deskripsi":"b. Ada penggiat, memiliki rencana kerja namun tidak terealisasi"},{"nilai":25,"deskripsi":"c. Ada penggiat namun tidak memiliki rencana kerja"},{"nilai":0,"deskripsi":"d. Tidak ada penggiat"}] 
      }
    ]
  },
  {
    id: 'tatanan-9',
    name: "TATANAN  PENANGGULANGAN BENCANA",
    indicators: [
      { 
        id: 't9-i1', 
        question: "Adanya dokumen Kajian Risiko Bencana (KRB)  yang telah disahkan oleh Kepala Daerah", 
        skala: [{"nilai":100,"deskripsi":"a. Ada KRB dan sudah disahkan oleh Kepala Daerah"},{"nilai":75,"deskripsi":"b. Ada KRB yang masih berlaku namun belum disahkan oleh Kepala Daerah"},{"nilai":50,"deskripsi":"c. Ada KRB namun masa berlaku sudah habis"},{"nilai":25,"deskripsi":"d. Sedang dalam proses penyusunan KRB"},{"nilai":0,"deskripsi":"e. Tidak ada KRB"}] 
      },
      { 
        id: 't9-i2', 
        question: "Adanya dokumen Rencana Penanggulangan Bencana Daerah yang telah disahkan oleh Kepala Daerah", 
        skala: [{"nilai":100,"deskripsi":"a. Ada  Rencana Penanggulangan Bencana Daerah dan sudah disahkan oleh Kepala Daerah"},{"nilai":75,"deskripsi":"b. Ada  Rencana Penanggulangan Bencana Daerah yang masih berlaku namun belum disahkan oleh Kepala Daerah"},{"nilai":50,"deskripsi":"c. Ada  Rencana Penanggulangan Bencana Daerah namun masa berlaku sudah habis"},{"nilai":25,"deskripsi":"d. Sedang dalam proses penyusunan  Rencana Penanggulangan Bencana Daerah"},{"nilai":0,"deskripsi":"e. Tidak ada Rencana Penanggulangan Bencana Daerah"}] 
      },
      { 
        id: 't9-i3', 
        question: "Adanya dokumen rencana kontingensi daerah yang telah disahkan oleh Kepala Daerah", 
        skala: [{"nilai":100,"deskripsi":"a. Memiliki dokumen Rencana Kontingensi yang disahkan kepala daerah dan telah ditindaklanjuti dengan penyelenggaraan gladi"},{"nilai":75,"deskripsi":"b. Dokumen disahkan kepala daerah tetapi tidak dilakukan gladi"},{"nilai":50,"deskripsi":"c. Terdapat dokumen Rencana Kontingensi tetapi belum disahkan kepala daerah"},{"nilai":25,"deskripsi":"d. Sedang dalam proses penyusunan"},{"nilai":0,"deskripsi":"e. Tidak ada dokumen Rencana Kontingensi"}] 
      },
      { 
        id: 't9-i4', 
        question: "Adanya kebijakan dan regulasi penanggulangan bencana di daerah", 
        skala: [{"nilai":100,"deskripsi":"a. Ada kebijakan dan regulasi berupa Perda tentang Penanggulangan Bencana"},{"nilai":75,"deskripsi":"b. Ada kebijakan dan regulasi berupa Perbup/Perwali tentang Penanggulangan Bencana"},{"nilai":50,"deskripsi":"c. Ada kebijakan dan regulasi berupa Keputusan Bupati/Wali Kota tentang Penanggulangan Bencana"},{"nilai":25,"deskripsi":"d. Masih berupa Rancangan Peraturan/regulasi tentang Penanggulangan Bencana"},{"nilai":0,"deskripsi":"e. Tidak ada kebijakan/regulasi"}] 
      },
      { 
        id: 't9-i5', 
        question: "Adanya integrasi Kajian Resiko Bencana (KRB) dan Rencana Penanggulangan Bencana ke dalam dokumen perencanaan daerah ((RPJMD/RKPD/Renstra PD/ Renja PD)", 
        skala: [{"nilai":100,"deskripsi":"a. Terintegrasi ke dalam dokumen perencanaan daerah"},{"nilai":0,"deskripsi":"b. Tidak terintegrasi ke dalam dokumen perencanaan daerah"}] 
      },
      { 
        id: 't9-i6', 
        question: "Adanya sistem peringatan dini yang berfungsi dengan baik sesuai potensi ancaman bencana wilayahnya (EWS longsor, EWS banjir, EWS tsunami, SKDR, EWS Karlahut, EWS Bencana Nuklir, Biologi, Kimia, dll).", 
        skala: [{"nilai":100,"deskripsi":"a. Minimal 80% Kawasan Rawan Bencana tersedia Sistem peringatan dini yang berfungsi dengan baik"},{"nilai":75,"deskripsi":"b. 60-79% Kawasan Rawan Bencana tersedia Sistem peringatan dini yang berfungsi dengan baik"},{"nilai":50,"deskripsi":"c. 40-59% Kawasan Rawan Bencana tersedia Sistem peringatan dini yang berfungsi dengan baik"},{"nilai":25,"deskripsi":"d. 20-39% Kawasan Rawan Bencana tersedia Sistem peringatan dini yang berfungsi dengan baik"},{"nilai":0,"deskripsi":"e. <20% Kawasan Rawan Bencana tersedia Sistem peringatan dini yang berfungsi dengan baik"}] 
      },
      { 
        id: 't9-i7', 
        question: "Adanya Tim Reaksi Cepat (TRC) dengan SK Kepala BPBD", 
        skala: [{"nilai":100,"deskripsi":"a. Ada SK, ada Renja"},{"nilai":50,"deskripsi":"b. Ada SK, tidak ada Renja"},{"nilai":25,"deskripsi":"c. Sedang dalam penyusunan SK"},{"nilai":0,"deskripsi":"d. Tidak ada SK"}] 
      },
      { 
        id: 't9-i8', 
        question: "Adanya Tim Koordinasi Daerah dalam Pencegahan dan Pengendalian Zoonosis dan Penyakit Infeksius Baru di Daerah", 
        skala: [{"nilai":100,"deskripsi":"a. Ada SK, ada Renja"},{"nilai":50,"deskripsi":"b. Ada SK, tidak ada Renja"},{"nilai":25,"deskripsi":"c. Sedang dalam penyusunan SK"},{"nilai":0,"deskripsi":"d. Tidak ada SK"}] 
      },
      { 
        id: 't9-i9', 
        question: "Adanya alokasi pendanaan BTT untuk penyediaan logistik kebutuhan dasar yang mencukupi di masing-masing di Kabupaten/Kota dalam kesiapsiagaan bencana", 
        skala: [{"nilai":100,"deskripsi":"a. Ada"},{"nilai":0,"deskripsi":"b. Tidak ada"}] 
      },
      { 
        id: 't9-i10', 
        question: "Persentase wilayah tangguh bencana (Destana/Kampung Siaga Bencana) yang aktif melakukan upaya pengelolaan risiko bencana di daerah rawan bencana.", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 51% wilayah sudah aktif melaksanakan upaya pengelolaan risiko bencana"},{"nilai":50,"deskripsi":"b. 25 - 50% wilayah sudah aktif melaksanakan upaya pengelolaan risiko bencana"},{"nilai":25,"deskripsi":"c. < 25 % wilayah sudah aktif melaksanakan upaya pengelolaan risiko bencana"},{"nilai":0,"deskripsi":"d. tidak ada wilayah yang aktif melaksanakan upaya pengelolaan risiko bencana"}] 
      },
      { 
        id: 't9-i11', 
        question: "Adanya Forum Pengurangan Risiko Bencana (FPRB) sebagai upaya pemberdayaan masyarakat dalam penanggulangan bencana di Kawasan Rawan Bencana (KRB)", 
        skala: [{"nilai":100,"deskripsi":"a. Ada, memiliki rencana kerja, terealisasi semua dan berkelanjutan"},{"nilai":50,"deskripsi":"b. Ada, memiliki rencana kerja dan terealisasi sebagian"},{"nilai":25,"deskripsi":"c. Ada, namun tidak memiliki rencana kerja"},{"nilai":0,"deskripsi":"d. Tidak ada"}] 
      },
      { 
        id: 't9-i12', 
        question: "Adanya kerjasama antar daerah yang berbatasan secara langsung, kerjasama daerah dengan pihak ketiga dalam upaya penanggulangan bencana", 
        skala: [{"nilai":100,"deskripsi":"a. Ada, kerjasama antar daerah yang berbatasan secara langsung dan daerah dengan pihak ketiga"},{"nilai":75,"deskripsi":"b. Ada, hanya kerjasama antar daerah yang berbatasan secara langsung"},{"nilai":50,"deskripsi":"c. Ada, hanya kerjasama daerah dengan pihak ketiga"},{"nilai":25,"deskripsi":"d. Masih dalam proses"},{"nilai":0,"deskripsi":"e. Belum ada kerjasama"}] 
      },
      { 
        id: 't9-i13', 
        question: "Kabupaten/Kota yang melaksanakan respon terhadap sinyal SKDR kurang dari 24 jam", 
        skala: [{"nilai":100,"deskripsi":"a. ≥ 80% dari sinyal yang muncul"},{"nilai":0,"deskripsi":"b. < 80% dari sinyal yang muncul"}] 
      },
      { 
        id: 't9-i14', 
        question: "Kabupaten/Kota memiliki dokumen Rencana Kontingensi penyakit potensi wabah", 
        skala: [{"nilai":100,"deskripsi":"a. Memiliki dokumen Rencana Kontingensi dan sudah disahkan"},{"nilai":50,"deskripsi":"b. Memiliki dokumen Rencana Kontingensi namun belum disahkan"},{"nilai":0,"deskripsi":"c. Tidak memiliki dokumen Rencana Kontingensi"}] 
      }
    ]
  }
];


