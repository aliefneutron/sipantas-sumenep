export interface DocumentField {
  nomor: string;
  tanggal: string;
  fileUrl: string;
  status: 'Draft' | 'Pending' | 'Valid' | 'Revisi';
  catatan?: string;
}

export interface IndicatorScore {
  capaian: number; // 0 to 100 (Nilai Mandiri)
  evidenceLink?: string; // Legacy: File Sehat Mandiri 2025
  capaian2024?: string; // Legacy: Capaian Sehat Mandiri s.d. 2024
  capaian2025?: string; // Legacy: Capaian Sehat Mandiri s.d. 2025
  evidenceLink2024?: string; // Legacy: File Sehat Mandiri 2024
  
  // New Dynamic Fields
  capaianTahun?: Record<string, string>; // e.g. { "2024": "...", "2025": "..." }
  evidenceTahun?: Record<string, string>; // e.g. { "2024": "...", "2025": "..." }

  penjelasan?: string; // Penjelasan Kabupaten/Kota
  statusProvinsi?: string; // Status verifikasi, e.g., "Valid", "Revisi", "not set"
  penjelasanProvinsi?: string; // Catatan verifikator provinsi
  nilaiKabupaten?: number; // Verified score by Admin Bappeda
  statusKabupaten?: 'Draft' | 'Menunggu Verifikasi' | 'Valid' | 'Revisi'; // Status verifikasi tingkat Kabupaten
  catatanKabupaten?: string; // Verification notes from Admin
}

export interface TatananAssessment {
  id: string;
  name: string;
  indicators: {
    id: string;
    question: string;
    definisiOperasional?: string;
    sumberData?: string;
    buktiDukung?: string;
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
  assessmentYear?: number; // e.g., 2026
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
    name: "Sehat Mandiri",
    indicators: [
      { 
        id: 't1-i1', 
        question: "Jumlah Kematian Ibu", 
        definisiOperasional: "Jumlah kasus kematian perempuan yang diakibatkan oleh proses yang berhubungan dengan kehamilan, persalinan, abortus, dan masa dalam kurun waktu 42 hari setelah berakhirnya kehamilan tanpa melihat usia gestasi, dan tidak termasuk di dalamnya sebab kematian akibat kecelakaan atau kejadian insidental di suatu wilayah pada kurun waktu tertentu. (sumber : Dokumen Indikator Program Kesehatan Masyarakat dalam RPJMN Kementerian Kesehatan 2020-2024)", 
        sumberData: "Perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian pada Aplikasi MPDN tahun 2023 dan 2024 dari Fasyankes / Dinkes kabupaten/kota dilengkapi dengan tangkapan layar (screenshot) yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika jumlah kematian ibu menurun"},{"nilai":50,"deskripsi":"Nilai 50 jika jumlah kematian ibu tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah kematian ibu meningkat"}] 
      },
      { 
        id: 't1-i2', 
        question: "Jumlah Kematian Neonatus", 
        definisiOperasional: "Jumlah bayi usia 0-11 bulan (termasuk neonatal) yang meninggal di suatu wilayah pada kurun waktu tertentu. (sumber : Dokumen Indikator Program Kesehatan Masyarakat dalam RPJMN Kementerian Kesehatan 2020-2024)", 
        sumberData: "Perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian pada Aplikasi MPDN  tahun 2023 dan 2024 dari Fasyankes / Dinkes kab/kota dilengkapi dengan tangkapan layar (screenshot) yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika  jumlah kematian neonatus menurun"},{"nilai":50,"deskripsi":"Nilai 50 jika jumlah kematian neonatus tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah kematian neonatus meningkat"}] 
      },
      { 
        id: 't1-i3', 
        question: "Angka Harapan Hidup (AHH)", 
        definisiOperasional: "Rata-rata tahunan yang masih akan dijalani seseorang yang telah mencapai usia tertentu, pada tahun tertentu, dalam keadaan mortalitas yang terjadi di lingkungan masyarakatnya (Sumber : BPS, 2022).", 
        sumberData: "Website BPS/ perangkat daerah yang membidangi urusan kependudukan/ sosial", 
        buktiDukung: "Laporan capaian angka harapan hidup (AHH)  tahun 2023 dan 2024 dari website BPS pusat, provinsi dan kab/kota dilengkapi dengan tangkapan layar (screenshoot) yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika angka harapan hidup meningkat dan di atas angka nasional tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika angka harapan hidup menurun namun masih di atas angka nasional tahun 2024 atau angka harapan hidup meningkat namun di bawah angka nasional tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika angka harapan hidup menurun dan di bawah angka nasional tahun 2024"}] 
      },
      { 
        id: 't1-i4', 
        question: "Persentase fasilitas pelayanan kesehatan terdekat", 
        definisiOperasional: "Jumlah fasilitas pelayanan kesehatan berkualitas yang dekat dengan rumah untuk mencegah penyakit yang dapat dihindari (avoidable illness) dan siap menghadapi situasi apa pun rata-rata memiliki waktu tempuh ≤ 30 menit dibagi dengan seluruh jumlah fasilitas pelayanan kesehatan dikali 100.  Fasilitas Pelayanan Kesehatan adalah suatu alat dan/ atau tempat yang digunakan untuk menyelenggarakan upaya pelayanan kesehatan, baik promotif, preventif, kuratif maupun rehabilitatif yang dilakukan oleh pemerintah pusat, pemerintah daerah dan/ atau masyarakat. Fasilitas pelayanan kesehatan yang dimaksud terdiri dari : a. tempat praktik mandiri Tenaga Kesehatan; b. pusat kesehatan masyarakat; c. klinik; d. rumah sakit; e. apotek; f.  fasilitas Pelayanan Kesehatan tradisional. catatan : > 120 menit masuk dalam kategori level 0 (WHO)", 
        sumberData: "Perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Surat pernyataan Kepala Dinas Kesehatan Kabupaten/Kota yang merangkum hasil waktu tempuh  rata-rata dari seluruh desa/kelurahan (dilengkapi dengan rekap data rata-rata waktu tempuh masing-masing desa/kelurahan ke faslitas pelayanan kesehatan dan lampiran minimal 5 surat pernyataan setiap desa/kelurahan yang menyatakan waktu tempuh ke fasilitas pelayanan kesehatan yang disahkan oleh kepala Puskesmas).", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian  ≥ 75% Desa/Kelurahan memiliki fasilitas pelayanan kesehatan dengan rata-rata waktu tempuh ≤ 30 menit"},{"nilai":75,"deskripsi":"Nilai 75 jika capaian ≥ 50% - 74% Desa/Kelurahan memiliki fasilitas pelayanan kesehatan dengan rata-rata waktu tempuh ≤ 30 menit"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian ≥ 25% - 49% Desa/Kelurahan memiliki fasilitas pelayanan kesehatan dengan rata-rata waktu tempuh ≤ 30 menit"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian < 25% Desa/Kelurahan memiliki fasilitas pelayanan kesehatan dengan rata-rata waktu tempuh ≤ 30 menit"}] 
      },
      { 
        id: 't1-i5', 
        question: "Akses terhadap informasi kesehatan", 
        definisiOperasional: "Akses terhadap informasi kesehatan adalah Kabupaten/Kota memiliki platform informasi  terintegrasi   Lintas Sektor/Program untuk mempercepat transformasi informasi yang dimanfaatkan untuk pengambilan keputusan dan dapat diakses oleh seluruh masyarakat dalam meningkatkan status derajat kesehatan. contoh : Sistem Pencegahan Stunting/SIMPATI (Kab. Sumedang),  Aplikasi Sayang Warga/ASW (Kota Surabaya), Sistem Informasi Kesehatan Tulung Agung (SIKESTA)  Tingkat pendidikan memainkan peran penting dalam memberikan kesadaran untuk hidup sehat dan memilih pilihan  lebih sehat di kehidupan sehari-hari. Selain itu, memiliki tingkat literasi yang tinggi juga berkaitan dengan kemampuan membaca label dan informasi terkait kesehatan umum. Literasi kesehatan :menunjukkan status atau ketersediaan pengetahuan pada titik waktu tertentu. Tingkat melek huruf yang tinggi berarti memberikan lebih banyak peluang ekonomi yang secara langsung mengarah pada kesehatan yang lebih baik. Dengan kaitananya terhadap pengetahuan kesehatan, indikator tersebut dapat memberikan informasi yang lebih akurat tentang hasil kesehatan seseorang/individu.", 
        sumberData: "Perangkat daerah yang membidangi urusan komunikasi & informasi/ kesehatan", 
        buktiDukung: "Tabel alamat platform/website informasi kesehatan dilengkapi dengan tangkapan layar / screenshot contoh rilis informasi kesehatan dari masing-masing media yang dilakukan pada tahun 2023 dan 2024  yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika informasi kesehatan tersedia dalam berbagai bentuk media, terupdate dan digunakan dalam berbagai waktu yang berbeda"},{"nilai":50,"deskripsi":"Nilai 50 jika informasi kesehatan tersedia namun hanya dalam satu bentuk media, terupdate dan digunakan dalam berbagai waktu yang berbeda"},{"nilai":25,"deskripsi":"Nilai 25 jika informasi kesehatan hanya tersedia  dalam berbagai bentuk media namun hanya pada periode krisis"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada informasi kesehatan yang tersedia"}] 
      },
      { 
        id: 't1-i6', 
        question: "Prevalensi Stunting pada Balita", 
        definisiOperasional: "Jumlah anak yang berumur di bawah 5 tahun (0 sampai 59 bulan 29 hari) dengan kategori status gizi berdasarkan indeks Panjang Badan menurut Umur (PB/U) atau Tinggi Badan menurut Umur (TB/U) memiliki Z-score kurang dari -2 Standar Deviasi (SD) dibagi jumlah balita diukur panjang atau tinggi badan dikali 100%.", 
        sumberData: "Sigizi Terpadu 1) Survei Kesehatan Indonesia (SKI) Tahun 2023 2) Hasil Survei Status Gizi di Indonesia Th 2024", 
        buktiDukung: "Laporan hasil SKI tahun 2023 dan laporan hasil SSGI tahun 2024 dilengkapi dengan tangkapan layar (screenshot) dan informasi cut off waktu penarikan data yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian prevalensi stunting pada balita menurun dalam 2 tahun terakhir dan di bawah 14% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian prevalensi stunting meningkat dalam 2 tahun terakhir namun masih di bawah 14% atau capaian prevalensi stunting pada balita menurun dalam 2 tahun terakhir namun di atas 14%  pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika  capaian prevalensi stunting meningkat dalam 2 tahun terakhir dan di atas 14%  pada tahun 2024"}] 
      },
      { 
        id: 't1-i7', 
        question: "Cakupan Penemuan Kasus TBC", 
        definisiOperasional: "Jumlah semua kasus tuberkulosis (TBC) yang ditemukan diantara estimasi kasus TBC di wilayah kerja dalam kurun waktu satu tahun dikali 100%.", 
        sumberData: "Sistem Informasi Tuberkulosis  (SITB)  atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan cakupan penemuan kasus TBC tahun 2023 dan 2024 dilengkapi dengan tangkapan layar (screenshot) dari aplikasi SITB dan informasi cut off waktu penarikan data yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian cakupan penemuan kasus TBC meningkat dalam 2 tahun terakhir dan ≥90%  pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian cakupan penemuan kasus TBC meningkat dalam 2 tahun terakhir namun <90% atau cakupan penemuan kasus TBC menurun dalam 2 tahun terakhir namun ≥90% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian cakupan penemuan kasus TBC menurun dalam 2 tahun terakhir dan <90% pada tahun 2024"}] 
      },
      { 
        id: 't1-i8', 
        question: "Persentase orang terduga tuberkulosis yang mendapatkan pelayanan kesehatan sesuai standar", 
        definisiOperasional: "Jumlah orang terduga TBC yang mendapatkan pelayanan TBC sesuai standar di wilayah kerjanya dibagi jumlah seluruh kasus tuberkolosis  dalam kurun waktu satu tahun dikali 100%.", 
        sumberData: "Sistem Informasi Tuberkulosis  (SITB)/ Laporan Capaian SPM/ Web Monitoring SPM  atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan persentase orang terduga tuberkulosis yang mendapatkan pelayanan kesehatan sesuai standar  tahun 2023 dan 2024 dilengkapi dengan tangkapan layar (screenshot) dari aplikasi SITB/ web monitoring SPM dan informasi cut off waktu penarikan data yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase orang terduga tuberkulosis yang mendapatkan pelayanan kesehatan sesuai standar meningkat dalam 2 tahun terakhir dan di atas target nasional tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase orang terduga tuberkulosis yang mendapatkan pelayanan kesehatan sesuai standar menurun dalam 2 tahun terakhir  namun masih di atas target nasional tahun 2024 atau capaian persentase orang terduga tuberkulosis yang mendapatkan pelayanan kesehatan sesuai standar meningkat dalam 2 tahun terakhir  namun di bawah target nasional tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase orang terduga tuberkulosis yang mendapatkan pelayanan kesehatan sesuai standar menurun dalam 2 tahun terakhir dan di bawah target nasional tahun 2024"}] 
      },
      { 
        id: 't1-i9', 
        question: "Persentase merokok penduduk usia 10-18 tahun", 
        definisiOperasional: "Persentase merokok penduduk usia 10 - 18 tahun dinilai dari 2 komponen yaitu capaian persentase skrining merokok dan proporsi merokok penduduk usia 10 - 18 tahun pada tahun berjalan. 1. capaian persentase skrining adalah jumlah penduduk usia 10 - 18 tahun yang diskrining merokok dibagi jumlah penduduk usia 10 - 18 tahun dikali 100%. 2. proporsi merokok penduduk usia 10 - 18 tahun adalah jumlah penduduk usia 10 - 18 tahun yang merokok dibagi  jumlah penduduk usia 10 - 18 tahun yang diskrining merokok dikali 100%. Catatan: target prevalensi merokok penduduk usia 10 - 18 tahun dalam tahun berjalan: tahun 2022 = 8,8; 2023 = 8,8; 2024 = 8,7.", 
        sumberData: "Aplikasi ASIK atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan persentase merokok penduduk usia 10-18 tahun tahun 2023 dan 2024 dilengkapi dengan: a. data jumlah penduduk usia 10-18 tahun pada tahun 2023 dan 2024 b. data jumlah penduduk usia 10-18 tahun yang diskrining merokok pada tahun 2023 dan 2024 c. data jumlah penduduk usia 10-18 tahun yang merokok pada tahun 2023 dan 2024 d. tangkapan layar (screenshot) ASIK dan informasi cut off waktu penarikan data. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase skrining merokok penduduk usia 10-18 tahun meningkat dan proporsi merokok penduduk usia 10-18 tahun di bawah target nasional tahun 2024"},{"nilai":75,"deskripsi":"Nilai 75 jika capaian persentase skrining merokok penduduk usia 10-18 tahun tetap dan/atau menurun dan proporsi merokok penduduk usia 10-18 tahun di  bawah target nasional tahun 2024"},{"nilai":50,"deskripsi":"NIlai 50 jika capaian persentase skrining merokok penduduk usia 10-18 tahun tetap dan/atau menurun  dan proporsi merokok penduduk usia 10-18 tahun di atas target nasional tahun 2024"},{"nilai":25,"deskripsi":"Nilai 25 jika capaian persentase skrining merokok penduduk usia 10-18 tahun menurun dan proporsi merokok penduduk usia 10-18 tahun di bawah target nasional tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase skrining merokok penduduk usia 10-18 tahun menurun dan proporsi merokok penduduk usia 10-18 tahun di atas target nasional tahun 2024"}] 
      },
      { 
        id: 't1-i10', 
        question: "Angka kesakitan Dengue", 
        definisiOperasional: "Angka kesakitan Dengue adalah jumlah kasus dengue di Kabupaten/Kota selama satu tahun pada setiap 100.000 penduduk.", 
        sumberData: "Sistem Aplikasi Arbovirosis atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan angka kesakitan dengue tahun 2023 dan 2024 dilengkapi dengan: a. data angka kasus DBD tahun 2023 dan 2024 b. tangkapan layar (screenshot) pada sistem aplikasi dan informasi cut off waktu penarikan data. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika angka kesakitan dengue menurun dalam 2 tahun terakhir dan ≤10 per 100.000 pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika angka kesakitan dengue menurun dalam 2 tahun terakhir namun >10 per 100.000 pada tahun 2024 atau angka kesakitan dengue meningkat namun ≤10 per 100.000 pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika angka kesakitan dengue meningkat dalam 2 tahun terakhir dan >10 per 100.000 pada tahun 2024"}] 
      },
      { 
        id: 't1-i11', 
        question: "Persentase pangan segar yang memenuhi syarat keamanan pangan", 
        definisiOperasional: "Hasil pengawasan dalam bentuk jumlah sampel/contoh yang memenuhi persyaratan Keamanan Pangan dibagi dengan Jumlah pengawasan dalam bentuk jumlah contoh/sampel yang diambil dikali 100%.  (sumber : laporan kinerja Deputi Penganekaragaman Konsumsi dan Kemananan Pangan, Bapanas)", 
        sumberData: "Perangkat daerah yang membidangi urusan ketahanan pangan/ pangan segar", 
        buktiDukung: "Laporan Pengawasan Keamanan dan Mutu Pangan Segar di kabupaten/kota yang dilengkapi dengan: a. data jumlah sampel pangan yang diperiksa pada tahun 2023 dan 2024; b. data jumlah sampel pangan yang diperiksa dan memenuhi persyaratan keamanan pangan pada tahun 2023 dan 2024; dan c. contoh hasil pemeriksaan (laboratorium). Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase pangan segar yang memenuhi syarat keamanan pangan meningkat dalam 2 tahun terakhir dan mencapai ≥ 85% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika  capaian persentase pangan segar yang memenuhi syarat keamanan pangan meningkat dalam 2 tahun terakhir namun masih < 85% pada tahun 2024 atau capaian persentase pangan segar yang memenuhi syarat keamanan pangan menurun dalam 2 tahun terakhir terakhir namun ≥ 85% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0  capaian persentase pangan segar yang memenuhi syarat keamanan pangan menurun dalam 2 tahun terakhir  dan < 85% pada tahun 2024"}] 
      },
      { 
        id: 't1-i12', 
        question: "Kabupaten/Kota yang menerapkan kebijakan GERMAS", 
        definisiOperasional: "Kabupaten/Kota yang menerapkan kebijakan GERMAS adalah Kabupaten/Kota melaksanakan kegiatan GERMAS minimal 3 kali/tahun dengan melaporkan lebih dari satu kegiatan setiap kluster dan harus tersedianya data aktivitas fisik intensitasi sedang umur 18-64 tahun 100-150 menit/minggu baik melalui survei atau laporan kegiatan. (berdasarkan WHO kluster aktivitas fisik adalah kluster wajib untuk dilaksanakan)  Kabupaten/kota yang menerapkan kebijakan Germas dengan kriteria: Memiliki kebijakan Germas sesuai dengan Inpres No.1 Tahun 2017 (melaksanakan 5 kluster germas) dan atau kebijakan berwawasan kesehatan Melaksanakan penggerakkan masyarakat dalam mendukung 5 kluster Germas minimal 3 kali setahun, dengan melibatkan lintas sektor, pendidikan sekolah), Upaya Kesehatan Bersumberdaya Masyarakat (UKBM) dan atau mitra potensial.  5 Kluster GERMAS : edukasi kesehatan, peningkatan pangan sehat, pencegahan ddan deteksi dini penyakit, peningkatan aktivitas fisik, peningkatan kualitas lingkungan. melaksanakan penggerakan masyarakat dalam mendukung 5 klaster GERMAS minimal 3 kali dalam setahun dengan : 1. peningkatan aktivitas fisik (tersedia data aktivitas fisik intensitasi sedang umur 18-64 tahun 100-150 menit/minggu baik melalui survey atau laporan kegiatan)  2. menampilkan kegiatan edukasi kesehatan (larangan merokok, larangan konsumsi alkohol) 3. penigkatan pangan sehat (makan buah dan sayur, gerakan isi pringku, kantin sehat, pembatasan Gula Garam Lemak) 4. pencegahan dan deteksi dini penyakit (pemeriksaan kesehatan berkala)  5. peningkatan kualitas lingkungan (penerapan STBM 5 pilar, kerja bakti, PSN)", 
        sumberData: "microsite promkes atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan dan dokumentasi kegiatan penggerakan masyarakat yang divalidasi oleh Kepala OPD terkait dengan melampirkan salinan dokumen penganggaran pelaksanaan kegiatan Germas di dokumen anggaran pemerintah daerah dan Peraturan Daerah/ Gubernur/ Bupati/ Walikota, Surat Edaran, SK/kebijakan yang berwawasan Kesehatan.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika Kabupaten/Kota melaksanakan 5 kluster kegiatan GERMAS minimal 3 kali/tahun dengan melaporkan lebih dari satu kegiatan pada setiap kluster"},{"nilai":75,"deskripsi":"Nilai 75 jika Kabupaten/Kota melaksanakan 4 kluster kegiatan GERMAS minimal 3 kali/tahun dengan melaporkan lebih dari satu kegiatan pada setiap kluster (harus tersedianya data aktivitas fisik intensitasi sedang umur 18-64 tahun 100-150 menit/minggu baik melalui survei atau laporan kegiatan)"},{"nilai":50,"deskripsi":"NIlai 50 jika Kabupaten/Kota melaksanakan 3 kluster kegiatan GERMAS minimal 3 kali/tahun dengan melaporkan lebih dari satu kegiatan pada setiap kluster (harus tersedianya data aktivitas fisik intensitasi sedang umur 18-64 tahun 100-150 menit/minggu baik melalui survei atau laporan kegiatan)"},{"nilai":25,"deskripsi":"Nilai 25 jika Kabupaten/Kota melaksanakan 2 kluster kegiatan GERMAS minimal 3 kali/tahun dengan melaporkan lebih dari satu kegiatan pada setiap kluster (harus tersedianya data aktivitas fisik intensitasi sedang umur 18-64 tahun 100-150 menit/minggu baik melalui survey atau laporan kegiatan)"},{"nilai":0,"deskripsi":"Nilai 0 jika Kabupaten/Kota belum melaksanakan kegiatan GERMAS"}] 
      },
      { 
        id: 't1-i13', 
        question: "Persentase penderita Diabetes Melitus yang mendapatkan pelayanan kesehatan sesuai standar", 
        definisiOperasional: "Jumlah penyandang diabetes melitus yang gula darah puasa <126 mg/dl atau gula darah 2 jam pp nya <200 mg/dl sebanyak minimal 3 kali (3 bulan) atau HbA1c <7% minimal 1 kali dalam kurun waktu 1 tahun dibagi jumlah seluruh penyandang diabetes melitus dikali 100%. (sumber: Renstra Kemenkes 2020 - 2024)  Target 2023: 58% Target 2024: 90%", 
        sumberData: "Aplikasi ASIK atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian pelayanan kesehatan sesuai standar terhadap penderita DM tahun 2023 dan 2024 dilengkapi dengan tangkapan layar (screenshot) ASIK dan informasi cut off waktu penarikan data yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase penderita Diabetes Melitus yang mendapatkan pelayanan kesehatan sesuai standar meningkat dalam 2 tahun terakhir dan ≥90% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase penderita Diabetes Melitus yang mendapatkan pelayanan kesehatan sesuai standar meningkat dalam 2 tahun terakhir namun <90% pada tahun 2024 atau capaian persentase penderita Diabetes Melitus yang mendapatkan pelayanan kesehatan sesuai standar menurun dalam 2 tahun terakhir namun ≥90% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase penderita Diabetes Melitus yang mendapatkan pelayanan kesehatan sesuai standar menurun dalam dua tahun terakhir dan <90% pada tahun 2024"}] 
      },
      { 
        id: 't1-i14', 
        question: "Persentase penderita Hipertensi yang mendapatkan pelayanan kesehatan sesuai standar", 
        definisiOperasional: "Jumlah    penderita    hipertensi    usia    15    tahun    keatas    yang    mendapatkan   pelayanan   kesehatan   sesuai   standar minimal ≥ 60%  di   wilayah kerjanya dalam kurun waktu satu tahun yang meliputi : 1. Pengukuran tekanan darah dilakukan minimal satu kali sebulan di fasilitas pelayanan kesehatan 2. Edukasi  perubahan  gaya  hidup   3. Terapi Farmakologi  4. Melakukan rujukan jika diperlukan dibagi seluruh penyandang hipertensi dikali 100%.  (sumber: SPM Kabupaten/Kota)", 
        sumberData: "aplikasi ASIK, eSPM atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian SPM pemerintah daerah kabupaten/kota tahun 2023 dan 2024 dilengkapi dengan tangkapan layar (screenshot) ASIK dan/atau eSPM dan informasi cut off waktu penarikan data yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase penderita Hipertensi yang mendapatkan pelayanan kesehatan sesuai standar meningkat dalam 2 tahun terakhir dan ≥60% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase penderita Hipertensi yang mendapatkan pelayanan kesehatan sesuai standar meningkat dalam 2 tahun terakhir namun masih  <60% pada tahun 2024 atau persentase penderita Hipertensi yang mendapatkan pelayanan kesehatan sesuai standar menurun namun ≥60% pada tahun 2024"},{"nilai":0,"deskripsi":"NIlai 0 jika persentase penderita Hipertensi yang mendapatkan pelayanan kesehatan sesuai standar menurun dan <60% pada tahun 2024"}] 
      },
      { 
        id: 't1-i15', 
        question: "Persentase Orang Dengan Gangguan Jiwa Berat  yang mendapatkan pelayanan sesuai standar dan adanya program penanggulangan pemasungan/ bebas pasung", 
        definisiOperasional: "Persentase penyandang gangguan depresi, ansietas, dan skizofrenia yang memperoleh layanan di fasyankes dengan  kriteria:sesuai dengan Pedoman Penggolongan dan Diagnosis Ganguan Jiwa Edisi III (1981) Nakes (UU No. 36 Tahun 2014 Tentang Tenaga Kesehatan terlatih Membuat pencatatan dan pelaporan. Penyandang gangguan jiwa (depresi/ ansietas/ skizofrenia) yang mendapat layanan dibagi Jumlah estimasi penyandang gangguan jiwa (depresi/ ansietas/ skizofrenia) berdasarkan Riskesdas terbaru dikali 100 (sumber : Renstra Kemenkes 2022-2024).  Penanggulangan pemasungan adalah upaya pencegahan,penanganan, dan rehabilitasi bagi ODGJ dalam rangka penghapusan Pemasungan. Pemasungan adalah segala bentuk pembatasan gerak ODGJ oleh keluarga atau masyarakat yang mengakibatkan hilangnya kebebasan ODGJ, termasuk hilangnya hak atas pelayanan kesehatan untuk membantu pemulihan (sumber : Permenkes 54 Tahun 2017).", 
        sumberData: "Laporan SPM, Aplikasi Sehat Indonesiaku, Komdat Kemenkes atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian Orang Dengan Gangguan Jiwa Berat  yang mendapatkan pelayanan sesuai standar dan dokumen komitmen kepala daerah dalam program penanggulangan pemasungan/ bebas pasung yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika 100% Orang Dengan Gangguan Jiwa Berat  yang mendapatkan pelayanan sesuai standar dan komitmen Kepala Daerah dalam bentuk surat pernyataan bebas pasung dan SK Tim Penggerak Kesehatan Jiwa Masyarakat (TPKJM) Tingkat Kab/Kota"},{"nilai":50,"deskripsi":"Nilai 50 jika 100% Orang Dengan Gangguan Jiwa Berat  yang mendapatkan pelayanan sesuai standar dan komitmen Kepala Daerah dalam bentuk surat pernyataan untuk menuju bebas pasung dan SK Tim Penggerak Kesehatan Jiwa Masyarakat (TPKJM) Tingkat Kab/Kota"},{"nilai":25,"deskripsi":"Nilai 25 jika 100% Orang Dengan Gangguan Jiwa Berat  yang mendapatkan pelayanan sesuai standar"},{"nilai":0,"deskripsi":"NIlai 0 jika < 100% Orang Dengan Gangguan Jiwa Berat  yang mendapatkan pelayanan sesuai standar"}] 
      },
      { 
        id: 't1-i16', 
        question: "Persentase Bayi usia 0-11 bulan yang mendapatkan Imunisasi Lengkap", 
        definisiOperasional: "Jumlah bayi usia 0-11 bulan yang mendapat imunisasi lengkap meliputi 1 dosis Hepatitis B pada usia 0-7 hari, 1 dosis BCG, 4 dosis Polio tetes (bOPV), 1 dosis Polio suntik (IPV),  3 dosis DPT-HB-Hib, serta 1 dosis Campak Rubela (MR) di satu wilayah dalam kurun waktu tertentu dibagi jumlah seluruh bayi selama kurun waktu yang sama) dikali 100%.", 
        sumberData: "aplikasi ASIK atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian imunisasi dilengkapi dengan tangkapan layar (screenshot) ASIK dan/atau laporan rutin disertai dengan bukti pengiriman laporan ke Dinkes Provinsi  pada tahun berjalan yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase Bayi usia 0-11 bulan yang mendapatkan Imunisasi Lengkap meningkat dalam 2 tahun terakhir dan ≥80% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase Bayi usia 0-11 bulan yang mendapatkan Imunisasi Lengkap meningkat dalam 2 tahun terakhir namun <80% pada tahun 2024 atau persentase Bayi usia 0-11 bulan yang mendapatkan Imunisasi Lengkap menurun namun ≥80% pada tahun 2024"},{"nilai":0,"deskripsi":"NIlai 0 jika capaian persentase Bayi usia 0-11 bulan yang mendapatkan Imunisasi Lengkap menurun dalam 2 tahun terakhir dan <80% pada tahun 2024"}] 
      },
      { 
        id: 't1-i17', 
        question: "Pesentase penduduk sesuai kelompok usia yang dilakukan skrining PTM", 
        definisiOperasional: "Rerata persentase yang dihitung dengan cara : menjumlahkan persentase masing-masing skrining dibagi dengan 9. Persentase masing-masing skrining dihitung dengan jumlah sasaran yang mendapatkan skrining (Hipertensi, DM, Obesitas, Stroke, Jantung, PPOK, Kanker Payudara, Kanker Leher Rahim, Kelainan Refraksi, dan/atau Otitis Media Supurative Kronis (OMSK) dalam 1 tahun dibagi jumlah sasaran masing-masing jenis skrining dikali 100. Rerata persentase yang dihitung dengan cara : menjumlahkan persentase masing-masing skrining dibagi dengan 9.", 
        sumberData: "aplikasi ASIK atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian persentase penduduk sesuai kelompok usia yang dilakukan skrining PTM tahun 2023 dan 2024 dilengkapi dengan tangkapan layar (screenshot) ASIK  dan informasi cut off waktu penarikan data yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase penduduk sesuai kelompok usia yang dilakukan skrining PTM meningkat dalam 2 tahun terakhir dan ≥90% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase penduduk sesuai kelompok usia yang dilakukan skrining PTM meningkat dalam 2 tahun terakhir namun masih <90% atau persentase penduduk sesuai kelompok usia yang dilakukan skrining PTM menurun dalam 2 tahun terakhir namun ≥90% pada tahun 2024"},{"nilai":0,"deskripsi":"NIlai 0 jika capaian persentase penduduk sesuai kelompok usia yang dilakukan skrining PTM menurun dalam 2 tahun terakhir dan <90% pada tahun 2024"}] 
      },
      { 
        id: 't1-i18', 
        question: "Kabupaten/Kota yang telah eliminasi malaria", 
        definisiOperasional: "Kabupaten/Kota Eliminasi Malaria adalah memenuhi 3 syarata utama terdiri dari tidak ada penularan setempat atau kasus indigenous selama tiga tahun berturut-turut, Positivity Rate kurang dari 5%, dan API kurang dari 1 Per 1.000 penduduk.", 
        sumberData: "Sistem Informasi Malaria (E-Sismal) atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian eliminasi malaria dilengkapi dengan tangkapan layar (screen shot) E-Sismal dan informasi cut off waktu penarikan data yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memenuhi 3 kriteria syarat utama eliminasi kriteria dan sudah terverifikasi (eliminasi malaria)"},{"nilai":50,"deskripsi":"Nilai 50 jika memenuhi 3 kriteria syarat utama eliminasi kriteria namun belum terverifikasi"},{"nilai":0,"deskripsi":"Nilai 0 jika belum memenuhi 3 kriteria syarat utama eliminasi"}] 
      },
      { 
        id: 't1-i19', 
        question: "Persentase Fasilitas Pelayanan Kesehatan Terakreditasi", 
        definisiOperasional: "Persentase Fasilitas Pelayanan Kesehatan (Rumah Sakit, Puskesmas, dan Klinik) yang memiliki sertifikat terakreditasi yang masih berlaku pada tahun berjalan.", 
        sumberData: "SINAF (Sistem Informasi Nasional Akreditasi Fasyankes) dan SINAR (Sistem Informasi Nasional Akreditasi Rumah Sakit) atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian persentase fasilitas pelayanan kesehatan terakreditasi dilengkapi dengan tangkapan layar (screenshot) SINAF dan SINAR serta informasi cut off waktu penarikan data yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase fasilitas pelayanan kesehatan terakreditasi tercapai 100% sampai tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase fasilitas pelayanan kesehatan terakreditasi ≥80% - <100% sampai tahun 2024"},{"nilai":0,"deskripsi":"NIlai 0 jika capaian persentase fasilitas pelayanan kesehatan terakreditasi  <80% sampai tahun 2024"}] 
      },
      { 
        id: 't1-i20', 
        question: "Rasio ketersediaan tempat tidur rumah sakit terhadap jumlah penduduk yang dilayani", 
        definisiOperasional: "Tingkat ketersediaan tempat tidur rumah sakit dan puskesmas perawatan dibandingkan populasi penduduk yang dilayani dalam tahun berjalan.", 
        sumberData: "SIRS Online atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian Rasio ketersediaan tempat tidur rumah sakit terhadap jumlah penduduk yang dilayani dilengkapi dengan tangkapan layar (screen shot) SIRS online serta informasi cut off waktu penarikan data yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian rasio ketersediaan tempat tidur rumah sakit terhadap jumlah penduduk yang dilayani ≥ 1 tempat tidur per 1.000 penduduk"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian rasio ketersediaan tempat tidur rumah sakit terhadap jumlah penduduk yang dilayani  0,5 - < 1 tempat tidur per 1.000 penduduk"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian rasio ketersediaan tempat tidur rumah sakit terhadap jumlah penduduk yang dilayani < 0,5 tempat tidur per 1.000 penduduk"}] 
      },
      { 
        id: 't1-i21', 
        question: "Persentase ibu hamil KEK", 
        definisiOperasional: "Ibu hamil dengan risiko kurang energi kronis (KEK) yang ditandai dengan ukuran Lingkar Lengan Atas (LiLA) kurang dari 23,5 cm  dibagi jumlah ibu hamil yang ada dikali 100%. (sumber : Renstra Kemenkes 2020-2024)", 
        sumberData: "Aplikasi pemantauan pertumbuhan balita dalam Sigizi Terpadu (e-PPGBM) atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian persentase ibu hamil KEK tahun 2023 dan 2024 dilengkapi dengan tangkapan layar (screenshot) Sigizi dan informasi cut off waktu penarikan data yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase ibu hamil KEK menurun dalam 2 tahun terakhir dan ≤10% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase ibu hamil KEK menurun dalam 2 tahun terakhir namun masih >10% atau persentase ibu hamil KEK meningkat namun ≤10% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase ibu hamil KEK meningkat dan >10% pada tahun 2024"}] 
      },
      { 
        id: 't1-i22', 
        question: "Prevalensi Obesitas pada penduduk usia >18 tahun", 
        definisiOperasional: "Kasus obesitas pada penduduk usia >18 tahun dengan kategori IMT >27  dibagi dengan total penduduk usia >18 tahun dikali 100 (sumber : Renstra Kemenkes 2020-2024, PMK No 13 Tahun 2022) Target tahun 2024: 21,8%", 
        sumberData: "Renstra Kemenkes, data statistik nasional atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian prevalensi obesitas pada penduduk usia >18 tahun 2023 dan 2024 yang setidaknya memuat informasi tentang: a. data jumlah penduduk usia >18 tahun  b. data jumlah penduduk usia >18 tahun yang obesitas. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian prevalensi obesitas  pada penduduk usia >18 tahun menurun dalam 2 tahun terakhir dan ≤21,8% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian prevalensi obesitas  pada penduduk usia >18 tahun menurun dalam 2 tahun terakhir dan >21,8% pada tahun 2024 atau prevalensi obesitas  pada penduduk usia >18 tahun meningkat dalam 2 tahun terakhir dan ≤21,8% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian capaian prevalensi obesitas  pada penduduk usia >18 tahun menurun dalam 2 tahun terakhir dan >21,8% pada tahun 2024"}] 
      },
      { 
        id: 't1-i23', 
        question: "Jumlah Rumah Sakit dan Puskesmas telah mengelola limbah medis sesuai standar", 
        definisiOperasional: "Jumlah Rumah Sakit dan Puskesmas telah mengelola limbah medis sesuai standar adalah jumlah kumulatif rumah sakit dan Puskesmas yang telah melakukan pemilahan, pewadahan, pengangkutan yang memenuhi syarat. (sumber : Renstra Kemenkes 2020-2024)", 
        sumberData: "Aplikasi Sistem Informasi Kelola Limbah Medis (SIKELIM) atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian jumlah Rumah Sakit dan Puskesmas telah mengelola limbah medis sesuai standar tahun 2023 dan 2024 dilengkapi dengan tangkapan layar (screenshot) SIKELIM dan informasi cut off waktu penarikan data yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian jumlah Rumah Sakit dan Puskesmas telah mengelola limbah medis sesuai standar meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian jumlah Rumah Sakit dan Puskesmas telah mengelola limbah medis sesuai standar tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian jumlah Rumah Sakit dan Puskesmas telah mengelola limbah medis sesuai standar menurun"}] 
      },
      { 
        id: 't1-i24', 
        question: "Persentase Puskesmas yang melaksanakan deteksi dini penyalahgunaan Napza", 
        definisiOperasional: "Puskesmas yang melakukan deteksi dini penyalahgunaan Napza menggunakan instrumen ASSIST dibagi jumlah keseluruhan Puskesmas dikali 100%.", 
        sumberData: "Aplikasi SINAPZA atau perangkat daerah yang membidangi urusan kesehatan/ NAPZA", 
        buktiDukung: "Laporan capaian persentase Puskesmas yang melaksanakan deteksi dini penyalahgunaan Napza tahun 2023 dan 2024 dilengkapi dengan tangkapan layar (screenshot) SINAPZA dan informasi cut off waktu penarikan data yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase Puskesmas yang melaksanakan deteksi dini penyalahgunaan Napza meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase Puskesmas yang melaksanakan deteksi dini penyalahgunaan Napza tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase Puskesmas yang melaksanakan deteksi dini penyalahgunaan Napza menurun"}] 
      },
      { 
        id: 't1-i25', 
        question: "Persentase penduduk usia ≥ 15 tahun yang memiliki risiko kesehatan jiwa yang mendapatkan skrining", 
        definisiOperasional: "Penduduk usia ≥ 15 tahun dengan risiko masalah kesehatan jiwa, yang dilakukan skrining dengan menggunakan instrumen SDQ (untuk usia 15-18 tahun) dan/ atau SRQ20 (usia diatas 18 tahun), dan/ atau ASSIST, yang dilakukan oleh tenaga kesehatan dan/ atau guru terlatih.   Penduduk usia ≥ 15 tahun dengan risiko masalah kesehatan jiwa, yang dilakukan skrining dibagi Jumlah proyeksi penduduk ≥ 15 tahun dengan risiko masalah kesehatan jiwa dikali 100. (sumber : RAK Dit. Kesehatan Jiwa 2020-2024)", 
        sumberData: "Aplikasi SIMKESWA atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian jumlah penduduk usia ≥ 15 tahun yang memiliki risiko kesehatan jiwa yang mendapatkan skrining  tahun 2023 dan 2024 dilengkapi dengan tangkapan layar (screenshot) SIMKESWA dan informasi cut off waktu penarikan data yang divalidasi oleh Kepala OPD terkait.  Target 2023: 60% Target 2024: 90%", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian jumlah penduduk usia ≥ 15 tahun yang memiliki risiko kesehatan jiwa yang mendapatkan skrining meningkat dan ≥90% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian jumlah penduduk usia ≥ 15 tahun yang memiliki risiko kesehatan jiwa yang mendapatkan skrining meningkat namun <90% pada tahun 2024 atau jumlah penduduk usia ≥ 15 tahun yang memiliki risiko kesehatan jiwa yang mendapatkan skrining menurun namun  ≥90% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian jumlah penduduk usia ≥ 15 tahun yang memiliki risiko kesehatan jiwa yang mendapatkan skrining menurun dan <90% pada tahun 2024"}] 
      },
      { 
        id: 't1-i26', 
        question: "Persentase posyandu aktif di Kabupaten/Kota", 
        definisiOperasional: "Jumlah Posyandu yang mampu melaksanakan kegiatan utamanya secara rutin setiap bulan (KIA : ibu hamil, ibu nifas, bayi, balita, KB, imunisasi, gizi, pencegahan dan penanggulan diare) dengan cakupan masing-masing lebih dari 60% dibagi dengan jumlah seluruh Posyandu dikali 100%.", 
        sumberData: "microsite promkes atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian persentase Posyandu aktif di Kabupaten/Kota  tahun 2023 dan 2024 dilengkapi dengan tangkapan layar (screen shot) microsite promkes dan informasi cut off waktu penarikan data yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase posyandu aktif meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase posyandu aktif tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase posyandu aktif menurun"}] 
      },
      { 
        id: 't1-i27', 
        question: "Adanya kebijakan Kawasan Tanpa Rokok (KTR) dan menerapkan indikator prinsip 100% kepatuhan KTR", 
        definisiOperasional: "Kabupaten/Kota sudah memiliki kebijakan KTR, Satgas dan telah menerapkan KTR di Tatanan dengan indikator prinsip 100% kepatuhan KTR.  Indikator prinsip 100% kepatuhan KTR yaitu : 1. ada tanda dilarang merokok 2. tidak ditemukan orang merokok di dalam gedung 3. tidak ditemukan ruang merokok di dalam gedung 4. tidak ditemukan puntung rokok 5. tidak ditemukan penjualan rokok 6. tidak ditemukan asbak/korek api 7. tidak ditemukan iklan atau promosi rokok 8. tidak tercium asap rokok", 
        sumberData: "Laporan kegiatan atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian kebijakan Kawasan Tanpa Rokok (KTR) di setiap tatanan Kab/Kota Sehat dan menerapkan indikator prinsip 100% kepatuhan KTR yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki kebijakan KTR pada 7-6 tatanan dan menerapkan indikator 100 % KTR"},{"nilai":75,"deskripsi":"Nilai 75 jika memiliki kebijakan KTR pada 5-4 tatanan dan menerapkan indikator 100 % KTR"},{"nilai":50,"deskripsi":"Nilai 50 jika memiliki kebijakan KTR pada 3 tatanan dan menerapkan indikator 100 % KTR"},{"nilai":0,"deskripsi":"NIlai 0 jika memiliki kebijakan KTR pada ≤ 2 tatanan dan menerapkan indikator 100 % KTR"}] 
      },
      { 
        id: 't1-i28', 
        question: "Persentase Puskesmas yang melakukan surveilans vektor (Angka Bebas Jentik, Indeks Habitat Vektor Malaria atau Filariasis dan Success trap tikus)", 
        definisiOperasional: "Jumlah Puskesmas yang melakukan surveilans vektor dengan capaian Angka Bebas Jentik, Indeks Habitat Vektor Malaria atau Filariasis dan Success trap tikus) dibagi dengan jumlah seluruh Puskesmas dikali 100%.", 
        sumberData: "SILANTOR atyau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian persentase Puskesmas yang melakukan surveilans vektor  tahun 2023 dan 2024 dilengkapi dengan tangkapan layar (screen shot) SILANTOR dan informasi cut off waktu penarikan data yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase Puskesmas yang melakukan surveilans vektor (Angka Bebas Jentik ≥ 95%, Indeks Habitat Vektor Malaria atau Filariasis < 1, dan Success trap tikus <1)  ≥ 80%"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase Puskesmas yang melakukan surveilans vektor (Angka Bebas Jentik ≥ 95%, Indeks Habitat Vektor Malaria atau Filariasis < 1, dan Success trap tikus <1) ≥ 40% -  < 80%"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase Puskesmas yang melakukan surveilans vektor (Angka Bebas Jentik ≥ 95%, Indeks Habitat Vektor Malaria atau Filariasis < 1, dan Success trap tikus <1)  < 40%"}] 
      },
      { 
        id: 't1-i29', 
        question: "Persentase Puskesmas minimal yang melaksanakan pelayanan ramah anak (PRAP)", 
        definisiOperasional: "Puskesmas yang telah menginisiasi pelayanan ramah anak adalah puskesmas yang telah memiliki SK sebagai PRAP dari pemerintah daerah. Upaya atau pelayanan kesehatan di  Puskesmas dilakukan berdasarkan  pemenuhan, perlindungan dan penghargaan  atas hak-hak anak sesuai empat prinsip  hak anak yaitu non diskriminasi,  kepentingan terbaik bagi anak, hak untuk  hidup, kelangsungan dan perkembangan  serta penghargaan terhadap pendapat anak dibagi dengan jumlah seluruh Puskesmas dikali 100%.", 
        sumberData: "perangkat daerah yang membidangi urusan PPPA", 
        buktiDukung: "Laporan capaian persentase Puskesmas yang melaksanakan pelayanan ramah anak (PRAP) tahun 2023 dan 2024 yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase Puskesmas memiliki SK sebagai PRAP meningkat dan minimal ≥ 75% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika  capaian persentase Puskesmas memiliki SK sebagai PRAP menurun namun masih ≥ 75% pada tahun 2024 atau persentase Puskesmas memiliki SK sebagai PRAP meningkat namun < 75% pada tahun 2024"},{"nilai":0,"deskripsi":"NIlai 0 jika capaian persentase Puskesmas memiliki SK sebagai PRAP menurun dan < 75% pada tahun 2024"}] 
      }
    ]
  },
  {
    id: 'tatanan-2',
    name: "Perkim",
    indicators: [
      { 
        id: 't2-i1', 
        question: "Nilai Indeks Kualitas Lingkungan Hidup (IKLH)", 
        definisiOperasional: "Nilai Indeks Kualitas Lingkungan Hidup (IKLH) adalah niilai yang menggambarkan kualitas lingkungan hidup dalam suatu wilayah pada waktu tertentu, yang merupakan nilai komposit dari indeks kualitas air, indeks kualitas udara, indeks kualitas lahan dan indeks kualitas air laut.  IKLH Kabupaten/Kota : 1. menghitung komponen lodeks di kabupaten/kota, yang mellputi IKA, IKU, dan IKL; 2. menghltung IKLH dengan melakukan penjumlahan dari semua komponen indeks (IKA, IKU, dan IKL) yang dikalikan masing-masing bobot dengan menggunaknn rumus perhitungan IKLH kabupaten/kota.   Kategori IKLH :  1. 90 ≤ X ≤ 100 : sangat baik 2. 70 ≤ X < 90 : baik 3. 50 ≤ X < 70 : sedang 4. 25 ≤ X < 50 : kurang 5. 0 ≤ X < 25 : sangat kurang (sumber : Peraturan Menteri LHK Nomor 27 Tahun 2021)", 
        sumberData: "perangkat daerah yang membidangi urusan lingkungan hidup", 
        buktiDukung: "Laporan capaian indeks kualitas lingkungan hidup (IKLH) tahun 2023 dan 2024 yang divalidasi oleh kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika IKLH meningkat dalam 2 tahun terakhir dan mencapai ≥ 70 % pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika IKLH menurun dalam 2 tahun terakhir namun masih ≥ 70 % pada tahun 2024 atau IKLH meningkat dalam 2 tahun terakhir namun <70% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika IKLH menurun dalam 2 tahun terakhir dan <70% pada tahun 2024"}] 
      },
      { 
        id: 't2-i2', 
        question: "Jumlah rumah tangga memiliki akses sanitasi aman", 
        definisiOperasional: "Jumlah rumah tangga memiliki akses sanitasi aman adalah jumlah rumah tangga memiliki fasilitas sanitasi sendiri, dengan bangunan atas dilengkapi kloset dengan leher angsa, dan bangunan bawahnya menggunakan tangki septik yang disedot setidaknya sekali dalam 5 (lima) tahun terakhir dan diolah dalam instalasi pengolahan lumpur tinja (IPLT), atau tersambung ke sistem pengolahan air limbah domestik terpusat (SPALD-T) (Metadata SDGs Tujuan 6.2 Pilar Lingkungan) (sumber : Peraturan Menteri PUPR Nomor 3 Tahun 2024)", 
        sumberData: "Aplikasi SICALMERS/ atau perangkat daerah yang membidangi urusan PUPR", 
        buktiDukung: "Laporan capaian jumlah rumah tangga memiliki akses sanitasi aman tahun 2023 dan 2024 dilengkapi dengan tangkapan layar (screen shot) SICALMERS yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika  jumlah rumah tangga memiliki akses sanitasi aman meningkat dalam 2 tahun terakhir dan mencapai target tahunan kabupaten/kota di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika  jumlah rumah tangga memiliki akses sanitasi aman tetap dalam 2 tahun terakhir dan mencapai target tahunan kabupaten/kota tahun 2024 atau jumlah rumah tangga memiliki akses sanitasi aman menurun dalam 2 tahun terakhir dan mencapai target tahunan kabupaten/kota tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah rumah tangga memiliki akses sanitasi aman menurun dan tidak mencapai target tahunan kabupatebn/kota"}] 
      },
      { 
        id: 't2-i3', 
        question: "Jumlah rumah tangga yang melakukan pengelolaan sampah", 
        definisiOperasional: "Jumlah rumah tangga yang melakukan pengelolaan sampah adalah jumlah rumah tangga melakukan penanganan dan pengurangan sampah.   Pengurangan sampah rumah tangga dan sampah sejenis rumah tangga dilakukan melalui : 1. pembatasan timbulan sampah;  2. pendauran ulang sampah; dan 3. pemanfaatan kembali sampah.  Penanganan sampah meliputi kegiatan: pemilahan, pengumpulan, pengangkutan, pengolahan dan pemrosesan akhir.", 
        sumberData: "BPS/ Aplikasi SIPSN (Sistem Informasi Sampah Nasional) atau perangkat daerah yang membidangi urusan lingkungan hidup/ PUPR", 
        buktiDukung: "Laporan capaian jumah tangga yang melakukan pengelolaan sampah tahun 2023 dan 2024 dilengkapi dengan tangkapan layar (screen shot) SIPSN yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika jumah tangga yang melakukan pengelolaan sampah meningkat dala 2 tahun terakhiir dan mencapai target tahunan kabupaten/kota"},{"nilai":50,"deskripsi":"Nilai 50 jika  jumah tangga yang melakukan pengelolaan sampah tetap dalam 2 tahun terakhir dan mencapai target tahunan kabupaten/kota atau jumlah rumah tangga yang melakukan pengelolaan sampah menurun dalam 2 tahun terakhir dan mencapai target tahunan kabupaten/kota"},{"nilai":0,"deskripsi":"Nilai 0 jika  jumah tangga yang melakukan pengelolaan sampah menurun dan tidak mencapai target tahunan kabupaten/kota"}] 
      },
      { 
        id: 't2-i4', 
        question: "Luas kawasan permukiman kumuh dalam kewenangan pemerintah kota/kabupaten yang tertangani (luasan di bawah 10 hektar)", 
        definisiOperasional: "Permukiman kumuh adalah permukiman yang tidak layak huni karena ketidakteraturan bangunan, tingkat kepadatan bangunan yang tinggi, dan kualitas bangunan serta sarana dan prasarana yang tidak memenuhi syarat.  Kriteria kekumuhan ditinjau dari : 1. bangunan gedung; 2. jalan lingkungan; 3. penyediaan air minum; 4. drainase lingkungan; 5. pengelolaan air limbah;  6. pengelolaan persampahan; dan 7. proteksi kebakaran. (sumber : Peraturan Menteri PUPR Nomor 14 Tahun 2018)", 
        sumberData: "perangkat daerah yang membidangi urusan PUPR/ lingkungan hidup", 
        buktiDukung: "Laporan terdiri dari : 1. SK Kumuh ditetapkan oleh Bupati/Walikota muncul kawasan kumuh (ringan, sedang, berat).  2. data awal dari SK kumuh Kab/kota. 3. capaian tahun 2023 dan 2024 dilihat dari LKj atau dokumen resmi lainnya yg mencantumkan capaian penanganan kawasan kumuh Kab/kota.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika luas kawasan permukiman kumuh menurun"},{"nilai":50,"deskripsi":"Nilai 50 jika luas kawasan permukiman kumuh tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika luas kawasan permukiman kumuh meningkat"}] 
      },
      { 
        id: 't2-i5', 
        question: "Jumlah rumah tangga yang memiliki akses air minum yang layak melalui Sistem Penyediaan Air Minum (SPAM) jaringan perpipaan dan non perpipaan", 
        definisiOperasional: "Air minum layak adalah air minum yang terlindung meliputi air ledeng (keran), keran umum, hydrant umum, terminal air, penampungan air hujan (PAH) atau mata air dan sumur terlindung, sumur bor atau sumur pompa, yang jaraknya minimal 10 m dari pembuangan kotoran, penampungan limbah dan pembuangan sampah. Tidak termasuk air kemasan, air dari penjual keliling, air yang dijual melalui tanki, air sumur dan mata air tidak terlindung.  SPAM Jaringan Perpipaan adalah satu kesatuan sarana dan prasarana penyediaan air minum yang disalurkan kepada pelanggan melalui sistem perpipaan.  SPAM Bukan Jaringan Perpipaan adalah satu kesatuan sarana prasarana penyediaan air minum yang disalurkan atau diakses pelanggan tanpa sistem perpipaan.", 
        sumberData: "Aplikasi SIMSPAM atau perangkat daerah yang membidangi urusan PUPR", 
        buktiDukung: "Laporan capaian jumlah rumah tangga yang memiliki akses air minum yang layak melalui Sistem Penyediaan Air Minum (SPAM) jaringan perpipaan dan non perpipaan tahun 2023 dan 2024 dilengkapi dengan tangkapan layar (screen shot) SIMSPAM yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika jumlah rumah tangga yang memiliki akses air minum yang layak meningkat dalam 2 tahun terakhir dan mencapai target tahunan kabupaten/kota tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika jumlah rumah tangga yang memiliki akses air minum yang layak tetap dalam 2 tahun terakhir dan mencapai taget tahunan kabupaten/kota tahun 2024  atau jumlah rumah tangga yang memikiki akses air menurun dan mencapai target kabupaten/kota tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah rumah tangga yang memiliki akses air minum yang layak menurun dan tidak mencapai target kabupaten/kota tahun 2024"}] 
      },
      { 
        id: 't2-i6', 
        question: "Persentase Tempat Fasilitas Umum (TFU) yang dilakukan inspeksi kesehatan lingkungan", 
        definisiOperasional: "Jumlah Tempat dan Fasilitas Umum yang dilaporkan hasil pengawasannya oleh Kabupaten Kota berdasarkan Inspeksi  Kesehatan Lingkungan minimal 1 kali dalam setahun dibagi jumlah tempat dan fasilitas umum dikali 100%  Tempat dan Fasilitas Umum (pasar, sekolah, Puskesmas) yang dilakukan pengawasan oleh kabupaten/kota dengan cara  melakukan Inspeksi Kesehatan Lingkungan minimal 1 kali dalam kurun waktu setahun.  (sumber : Peraturan Menteri Kesehatan Nomor 13 Tahun 2022, Renstra Kemenkes Tahun 2020-2024)", 
        sumberData: "Aplikasi e-Satu atau perangkat daerah yang membidangi urusan kesehatan", 
        buktiDukung: "Laporan capaian persentase Tempat Fasilitas Umum (TFU) yang dilakukan inspeksi kesehatan lingkungan tahun 2023 dan 2024 dilengkapi dengan tangkapan layar (screen shot) e-Satu yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase Tempat Fasilitas Umum (TFU) meningkat dan di atas angka nasional tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50  jika persentase Tempat Fasilitas Umum (TFU) menurun namun masih di atas angka nasional tahun 2024 atau persentase Tempat Fasilitas Umum (TFU) meningkat namun di bawah angka nasional tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase Tempat Fasilitas Umum (TFU) menurun dan di bawah angka nasional tahun 2024"}] 
      },
      { 
        id: 't2-i7', 
        question: "Adanya implementasi program langit biru", 
        definisiOperasional: "Program Langit Biru adalah program pengendalian pencemaran udara dari sumber bergerak dan tidak bergerak.  a. Sumber bergerak dengan melakukan penetapan kebijaksanaan teknis, koordinasi, bimbingan teknis, evaluasi dari hasil pemantauan dan pemulihan kualitas lingkungan; b. sumber tidak bergerak dengan melakukan penentapan kebijaksanaan teknis, bimbingan teknis, pemeriksaan pemantauan penaatan baku mutu emisi.  (sumber : Keputusan Menteri Lingkungan Hidup Nomor 15 tahun 1996 tentang Program Langit Biru)", 
        sumberData: "Perangkat daerah yang membidangi urusan lingkungan hidup", 
        buktiDukung: "Dokumen Perda/ Perwali/ SE Kepala Daerah tentang program langit biru atau baku mutu uji emisi/ pemantauan udara ambien.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada dokumen regulasi program langit biru berupa Peraturan Daerah"},{"nilai":75,"deskripsi":"Nilai 75 jika ada dokumen regulasi program langit biru berupa Peraturan Kepala Daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika ada dokumen regulasi program langit biru berupa SE Kepala Daerah atau atau dokumen regulasi program langit biru berupa Peraturan Daerah tetapi masih berupa  draft"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada dokumen regulasi program langit biru"}] 
      },
      { 
        id: 't2-i8', 
        question: "Pelaksanaan car free day", 
        definisiOperasional: "Pelaksanaan car free day  adalah kegiatan di tempat dan ruas-ruas jalan tertentu yang dipergunakan untuk kelancaran pelaksanaan kegiatan bebas kendaraan bermotor.", 
        sumberData: "Perangkat daerah yang membidangi urusan lingkungan hidup/ perhubungan", 
        buktiDukung: "Laporan rekapitulasi kegiatan car free day yang dilengkapi dengan dokumen Perda/ Perwali/ SE Kepala Daerah tentang kegiatan car free day. dan dokumentasi pelaksanaan car free day minimal 2 buah foto dengan keterangan lokasi dan waktu pelaksanaan. Foto dokumentasi dapat diambil dari screenshot dari media massa.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika pelaksanaan dilakukan rutin dan melampirkan dokumen  regulasi kegiatan car free day"},{"nilai":50,"deskripsi":"Nilai 50 jika  pelaksanaan dilakukan rutin namun tidak melampirkan dokumen  regulasi kegiatan car free day atau pelaksanaan dilakukan tidak rutin namun melampirkan dokumen  regulasi kegiatan car free day"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada  kegiatan car free day"}] 
      },
      { 
        id: 't2-i9', 
        question: "Adanya keterlibatan masyarakat dalam kegiatan Program Kali Bersih (PROKASIH)", 
        definisiOperasional: "Program Kali Bersih (PROKASIH) adalah program kerja pengendalian pencemaran air sungai dengan tujuan untuk meningkatkan kualitas air sungai agar tetap berfungsi sesuai dengan peruntukannya. (sumber : Keputusan Menteri LH Nomor 35 Tahun 1995 tentang Program Kali Bersih)", 
        sumberData: "Perangkat daerah yang membidangi urusan lingkungan hidup/ PUPR", 
        buktiDukung: "Laporan rekapitulasi kegiatan program kali bersih yang melibatkan masyarakat dan dilengkapi dengan dokumen Perda/ Perwali/ SE Kepala Daerah tentang program kali bersih.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada laporan kegiatan yang melibatkan masyarakat dan melampirkan dokumen regulasi PROKASIH"},{"nilai":50,"deskripsi":"Nilai 50 jika ada laporan kegiatan yang melibatkan masyarakat namun tidak melampirkan dokumen regulasi PROKASIH atau jika hanya melampirkan dokumen regulasi PROKASIH"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada  kegiatan yang melibatkan masyarakat dan tidak ada dokumen regulasi PROKASIH"}] 
      },
      { 
        id: 't2-i10', 
        question: "Adanya Penyelenggara SPAM (BUMD/ UPTD/ BUMDES/ POKMAS/ BUKS/ Swasta) dan memiliki dokumen RISPAM", 
        definisiOperasional: "Penyelenggaraan SPAM adalah serangkaian kegiatan dalam melaksanakan pengembangan dan pengelolaan sarana dan prasarana yang mengikuti proses dasar manajemen untuk penyediaan Air Minum kepada masyarakat.  Rencana Induk Sistem Penyediaan Air Minum (RISPAM) adalah dokumen perencanaan Air Minum jaringan perpipaan dan perencanaan Air Minum bukan jaringan perpipaan berdasarkan proyeksi kebutuhan Air Minum pada satu  periode yang dibagi dalam beberapa tahapan dan memuat komponen utama sistem beserta dimensi-dimensinya. (sumber : PP Nomor 122 Tahun 2015 tentang SPAM)", 
        sumberData: "Aplikasi SIMSPAM atau perangkat daerah yang membidangi urusan PUPR", 
        buktiDukung: "Dokumen penyelenggara SPAM yang terdiri dari (1) SK Kepala Daerah tentang Struktur Organisasi dan Penugasan personil; (2) anggaran biaya OP yang tercantum dalam DIPDA serta melampirkan dokumen RISPAM yang ditetapkan oleh Kepala Daerah.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada penyelenggara SPAM dan memiliki dokumen RISPAM yang sudah ditetapkan oleh Kepala Daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika ada penyelenggaraan SPAM tetapi tidak memliki dokumen RISPAM atau ada dokumen RISPAM tapi dari Kabupaten/Kota Lain"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada penyelenggaraan SPAM dan tidak memiliki dokumen RISPAM"}] 
      },
      { 
        id: 't2-i11', 
        question: "Adanya regulasi terkait Air Limbah Domestik (ALD) dan  Dokumen Perencanaan Sistem Pengelolaan ALD (Strategi Sanitasi Perkotaan dan/atau Rencana Induk Sistem Pengelolaan ALD)", 
        definisiOperasional: "Regulasi terkait Air Limbah Domestik berupa Perda atau Perkada yang bertujuan untuk mengendalikan serta memudahkan terciptanya ketertiban di dalam pengelolaan Air Limbah Domestik di seluruh lapisan masyarakat.", 
        sumberData: "Perangkat daerah yang membidangi urusan PUPR", 
        buktiDukung: "Dokumen regulasi berupa Perda/Perkada terkait pengelolaan Air Limbah Domestik dan dokumen perencanaan sistem pengelolaan ALD (strategi sanitasi perkotaan dan/atau Rencana Induk Sistem Pengelolaan ALD).", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika melampirkan dokumen regulasi terkait pengelolaan Air Limbah Domestik (ALD) dan dokumen perencanaan"},{"nilai":50,"deskripsi":"Nilai 50 jika hanya melampirkan dokumen regulasi terkait pengelolaan Air Limbah Domestik (ALD) atau dokumen perencanaan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada dokumen regulasi terkait pengelolaan Air Limbah Domestik (ALD) dan dokumen perencanaan"}] 
      },
      { 
        id: 't2-i12', 
        question: "Adanya pemisahan peran Operator dan Regulator dalam kelembagaan pengelola persampahan", 
        definisiOperasional: "Pemisahan peran operator dan regulator dalam kelembagaan pengelola persampahan bertujuan untuk mengoptimalkan pelayanan pengelolaan sampah kepada masyarakat, dimana dilakukan pemisahan kewenangan antara pemerintah sebagai regulator dan pengawas dengan badan/unit sebagai penyelenggara. Hal ini sudah diatur dalam Peraturan Pemerintah No. 16 Tahun 2005.", 
        sumberData: "Perangkat daerah yang membidangi urusan PUPR", 
        buktiDukung: "Dokumen Perkada terkait pembentukan kelembagaan pengelola Persampahan", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada  (Pengelola ALD adalah UPTD/BLUD/BUMD) dan beroperasi"},{"nilai":75,"deskripsi":"Nilai 75 jika Pengelola Persampahan adalah Dinas dan beroperasi"},{"nilai":50,"deskripsi":"Nilai 50 jika  ada tetapi tidak beroperasi"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak terdapat tusi pengelolaan persampahan pada OPD"}] 
      },
      { 
        id: 't2-i13', 
        question: "Terdapat Instalasi Pengolahan Lumpur Tinja (IPLT), dengan layanan penyedotan lumpur tinja serta truk tinja yang beroperasi", 
        definisiOperasional: "Layanan penyedotan lumpur tinja adalah layanan penyedotan lumpur tinja dari sub-sistem pengolahan setempat (tangki septik) oleh operator pengelola air limbah domestik (UPTD/BLUD maupun Badan Usaha). Instalasi Pengolahan Lumpur Tinja (IPLT) adalah Instalasi pengolahan air limbah domestik yang dirancang hanya menerima dan mengolah lumpur tinja yang berasal dari Sub Sistem Pengolahan Setempat. Truk tinja beroperasi dan masuk ke IPLT menunjukkan bahwa truk tinja difungsikan untuk menyedot lumpur tinja dari sub-sistem pengolahan setempat (tangki septik), kemudian lumpur tinja tersebut diangkut dan diolah di IPLT sehingga aman untuk dibuang ke badan air permukaan.", 
        sumberData: "Perangkat daerah yang membidangi urusan PUPR", 
        buktiDukung: "Dokumentasi dan laporan kegiatan penyedotan dan pengangkitan lumpur tinja dari operator pengelola limbah domestik, data keberfungsian IPLT", 
        skala: [{"nilai":100,"deskripsi":"NIlai 100 jika adanya layanan penyedotan, truk tinja yang beroperasi dan terdapat instalasi IPLT"},{"nilai":50,"deskripsi":"Nilai 50 jika adanya layanan penyedotan dan truk tinja yang beroperasi"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada layanan penyedotan"}] 
      },
      { 
        id: 't2-i14', 
        question: "Terdapat instalasi pengolahan air limbah domestik (IPALD) serta tersambung ke rumah tangga", 
        definisiOperasional: "Instalasi Pengolahan Air Limbah Domestik (IPALD) adalah bangunan air yang berfungsi untuk mengolah air limbah domestik. IPALD merupakan bagian dari Sistem Pengelolaan Air Limbah Domestik Terpusat (SPALD-T). SPALD-T adalah sistem pengelolaan yang dilakukan dengan mengalirkan air limbah domestik dari sumber secara kolektif ke Sub-sistem Pengolahan Terpusat untuk diolah sebelum dibuang ke badan air permukaaan.", 
        sumberData: "Perangkat daerah yang membidangi urusan PUPR", 
        buktiDukung: "Dokumentasi IPALD dan Data keberfungsian IPALD", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika tersedia dengan idle capacity <50%"},{"nilai":75,"deskripsi":"Nilai 75 jika  tersedia dengan idle capacity 50-85%"},{"nilai":50,"deskripsi":"Nilai 50 jika tersedia dengan idle capacity >85%"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak tersedia IPALD"}] 
      },
      { 
        id: 't2-i15', 
        question: "Adanya regulasi/kebijakan terkait persampahan (Perda atau Perkada) dan Dokumen Perencanaan Sistem Pengelolaan Sampah (Strategi Sanitasi Kabupaten/Kota dan/atau Rencana Induk Sistem Pengelolaan Sampah)", 
        definisiOperasional: "Pelaksanaan pemilahan sampah oleh kelompok masyarakat adalah kegiatan mengelompokkan dan memisahkan sampah sesuai dengan jenis, jumlah dan/atau sifat sampah yang dilakukan secara bersama-sama dalam kelompok masyarakat di tingkat desa/kelurahan. Program pengelolaan sampah tingkat desa adalah kegiatan pengelolaan sampah yang meliputi:  pemrosesan awal di tingkat rumah tangga sebelum diangkut ke TPS (berupa pemilahan sampah di rumah dan menerapkan Reduce, Reuse, Recycle), adanya upaya pengolahan sampah organik menjadi kompos, memfungsikan TPS sebagai tempat daur ulang sampah rumah tangga dan pengangkutan sampah dari TPS ke TPA Sampah secara rutin, dimana hanya sampah residu yang dibawa ke TPA sampah.", 
        sumberData: "Perangkat daerah yang membidangi urusan lingkungan hidup", 
        buktiDukung: "Dokumen Regulasi/Kebijakan terkait pengelolaan persampahan di Kab/Kota", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada regulasi/kebijakan dan dokumen perencanaan serta terimplementasi"},{"nilai":50,"deskripsi":"Nilai 50 jika ada, hanya regulasi/kebijakan atau dokumen perencanaan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada"}] 
      },
      { 
        id: 't2-i16', 
        question: "Adanya  pelaksanaan pemilahan sampah oleh kelompok masyarakat dan program pengelolaan sampah tingkat desa yang meliputi pemrosesan awal di tingkat rumah tangga sebelum diangkut ke TPS, adanya upaya pengolahan sampah organik menjadi kompos, memfungsikan TPS menjadi tempat daur ulang sampah rumah tangga, dan pengangkutan sampah dari TPS ke TPA secara rutin", 
        definisiOperasional: "Pelaksanaan pemilahan sampah oleh kelompok masyarakat adalah kegiatan mengelompokkan dan memisahkan sampah sesuai dengan jenis, jumlah dan/atau sifat sampah yang dilakukan secara bersama-sama dalam kelompok masyarakat di tingkat desa/kelurahan. Program pengelolaan sampah tingkat desa adalah kegiatan pengelolaan sampah yang meliputi:  pemrosesan awal di tingkat rumah tangga sebelum diangkut ke TPS (berupa pemilahan sampah di rumah dan menerapkan Reduce, Reuse, Recycle), adanya upaya pengolahan sampah organik menjadi kompos, memfungsikan TPS sebagai tempat daur ulang sampah rumah tangga dan pengangkutan sampah dari TPS ke TPA Sampah secara rutin, dimana hanya sampah residu yang dibawa ke TPA sampah.", 
        sumberData: "Perangkat daerah yang membidangi urusan lingkungan hidup", 
        buktiDukung: "Laporan pelaksanaan program dan dokumentasinya. Jumlah Desa/Kelurahan yang sudah melaksanakan pengelolaan sampah 3R tingkat desa dibandingkan dengan jumlah desa/kelurahan di kab/kota tersebut dan dihitung dalam persentase SIPSN KLHK,  Susenas MKP BPS per 3 tahunan ini untuk pengurangan dan penanganan", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika  > 80% desa/kelurahan"},{"nilai":75,"deskripsi":"Nilai 75 jika  50 - 80% desa/kelurahan"},{"nilai":50,"deskripsi":"Nilai 50 jika  < 50% desa/kelurahan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak dilakukan pengelolaan sampah"}] 
      },
      { 
        id: 't2-i17', 
        question: "Persentase infrastruktur pengolahan sampah berbasis masyarakat (TPS 3R dan/atau bank sampah) terbangun serta sarana pengangkutan sampah sesuai standar dan beroperasi", 
        definisiOperasional: "Persentase Infrastruktur pengolahan sampah berbasis masyarakat (TPS 3R dan/atau bank sampah) dan sarana/armada pengangkutan sampah adalah jumlah TPS 3R dan/atau Bank Sampah yang beroperasi/berfungsi dengan baik dan jumlah sarana/armada yang sesuai standar serta dalam kondisi layak pakai dan beroperasi", 
        sumberData: "Perangkat daerah yang membidangi urusan lingkungan hidup", 
        buktiDukung: "Laporan jumlah TPS 3R dan/atau bank sampah yang beroperasi. Laporan Jumlah sarana pengangkut sampah sesuai standar & beroperasi, SIPSN KLHK,  Susenas MKP BPS per 3 tahunan ini untuk pengurangan dan penanganan", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase infrastruktur pengolahan sampah serta sarana pengangkutan sampah sesuai standar meningkat dalam 2 tahun terakhir dan mencapai ≥ 70 % pada tahun 2024 dan beroperasi"},{"nilai":50,"deskripsi":"Nilai 50 jika  persentase infrastruktur pengolahan sampah serta sarana pengangkutan menurun dalam 2 tahun terakhir namun masih  ≥ 80 % pada tahun 2024 dan beroperasi  atau persentase infrastruktur pengolahan sampah serta sarana pengangkutan sesuai standar  meningkat dalam 2 tahun terakhir namun < 80 % pada tahun 2024 dan beroperasi"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase infrastruktur pengolahan sampah serta sarana pengangkutan samoah sesuai standar menurun dalam 2 tahun terakhir dan < 80 % pada tahun 2024 dan tidak beroperasi"}] 
      },
      { 
        id: 't2-i18', 
        question: "Persentase korban kebakaran atau terdampak kebakaran yang mendapatkan pelayanan  penyelamatan dan evakuasi kebakaran", 
        definisiOperasional: "Jumlah warga negara yang menjadi korban kebakaran atau terdampak kebakaran yang mendapatkan layanan penyelamatan serta evakuasi sesuai standar.  Jumlah kejadian kebakaran yang mendapatkan pelayanan penyelamatan dan evakuasi kebakaran dibagi jumlah keseluruhan kejadian kebakaran dikalikan 100%/.", 
        sumberData: "Perangkat daerah yang membidangi urusan kebencanaan/ kebakaran", 
        buktiDukung: "Laporan rekapitulasi dari dinas terkait yang telah tervalidasi oleh kepala OPD terkait", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase korban kebakaran atau terdampak kebakaran mendapatkan pelayanan penyelamatan dan evakuasi meningkat dalam 2 tahun terakhir dan mencapai ≥ 90% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase korban kebakaran atau terdampak kebakaran mendapatkan pelayanan penyelamatan dan evakuasi tetap dalam 2 tahun terakhir dan masih ≥ 90% pada tahun 2024 atau  persentase korban kebakaran dan terdampak kebakaran mendapatkan pelayanan penyelamatan dan evakuasi menurun dalam 2 tahun terakhir tetapi masih <90% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada pelayanan penyelamatan kebakaran dan evakuasi"}] 
      },
      { 
        id: 't2-i19', 
        question: "Keberadaan fasilitas dan sarana di kawasan pertamanan yang ramah anak, ramah lansia dan ramah difable", 
        definisiOperasional: "Tersedianya fasilitas dan sarana di kawasan pertamanan yang ramah anak, ramah lansia dan ramah difable di Kabupaten/Kota", 
        sumberData: "SIPSN KLHK atau Perangkat daerah yang membidangi urusan lingkungan hidup", 
        buktiDukung: "Laporan berupa keberadaan fasilitas dan sarana di kawasan pertamanan yang ramah anak, ramah lansia dan ramah difable yang disertai dengan fotio serta keterangan. Laporan divalidasi oleh kepala OPD terkait", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ya, tersedia lengkap dan terpelihara"},{"nilai":50,"deskripsi":"Nilai 50  jika ya, tersedia sebagian dan terpelihara atau  jika ya, tersedia tidak terpelihara"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak tersedia"}] 
      },
      { 
        id: 't2-i20', 
        question: "Implementasi ketersediaan/akses tempat pengumpulan limbah B3 yang memenuhi syarat di tingkat Kabupaten/Kota", 
        definisiOperasional: "- Mengacu pada UU 11 Tahun 2020: pengelolaan limbah B3 wajib mendapat perizinan berusaha, atau persetujuan pemerintah pusat dan pemerintah daerah. - Mengacu pada PermenLHK Nomor 22 Tahun 2021: Limbah Bahan Berbahaya dan Beracun yang selanjutnya disebut Limbah 83 adalah sisa suatu usaha dan/atau kegiatan yang rnengandung B3.", 
        sumberData: "Perangkat daerah yang membidangi urusan lingkungan hidup", 
        buktiDukung: "Laporan pengelolaan limbah B3 dilengkapi dengan dokumentasi yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ya, tersedia akses terhadap depo/tempat pengumpulan limbah B3"},{"nilai":50,"deskripsi":"Nilai 50 jika ada, hanya regulasi/kebijakan atau depo/tempat pengumpulan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada"}] 
      },
      { 
        id: 't2-i21', 
        question: "Akses rumah tangga yang memenuhi kriteria rumah layak huni", 
        definisiOperasional: "Kriteria rumah layak huni mengacu pada Kepmenkimpraswil 403/2002, UU Nomor 28 Tahun 2002, Permen PUPR nomor 5 Tahun 2016 dan kriteria menurut SDG's . Menurut penjelasan pasal 24 UU Nomor 1 Tahun 2011 rumah layak huni adalah rumah yang memenuhi presyaratan keselamatan bangunan dan persyaratan minimum luas bangunan serta kesehatan penghuni. Dalam rangka kesehatan penghuni, rumah perlu dilengkapi dengan indikator pencahayaan 10% dari luas lantai dan penghawaan 5% dari luas lantai", 
        sumberData: "Perangkat daerah yang membidangi urusan PUPR", 
        buktiDukung: "LAKIP, RPJMD, RP3KP Laporan Kinerja Pemerintah Kab/Kota", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika akses rumah tangga terhadap rumah layak huni meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika  akses rumah tangga terhadap rumah layak huni  tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika akses rumah tangga terhadap rumah layak huni  menurun"}] 
      },
      { 
        id: 't2-i22', 
        question: "Persentase penduduk yang memiliki akses listrik (rasio elektrifikasi)", 
        definisiOperasional: "Rasio elektrifikasi adalah perbandingan rumah tangga berlistrik dengan jumlah rumah tangga di tingkat Kabupaten/Kota. DO capaian keberhasilan adalah meningkatnya capaian perbandingan rumah tangga berlistrik dengan jumlah rumah tangga di Kabupaten/Kota pada tahun akhir pembinaan. Kab. A memiliki rasio elektrifikasinya 2023 : 94% 2024 :96% maka hasil penilaian menggunakan tahun 2024. kesimpulannya adalah Kab A memiliki nilai 75", 
        sumberData: "BPS", 
        buktiDukung: "Laporan persentase elektrifikasi dalam 2 tahun terakhir. Jumlah total rumah yang dialiri listrik dibagi jumlah rumah keseluruhan dikalikan 100%. Laooran ditandatangani dan divalidasi", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase penduduk yang memiliki akses listrik  > 98% pada tahun 2024."},{"nilai":75,"deskripsi":"Nilai 75 jika persentase penduduk yang memiliki akses listrik  98% - 94% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase penduduk yang memiliki akses listrik 94% - 90% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase penduduk yang memiliki akses listrik  < 90% pada tahun 2024"}] 
      }
    ]
  },
  {
    id: 'tatanan-3',
    name: "Pendidikan",
    indicators: [
      { 
        id: 't3-i1', 
        question: "Keberadaan regulasi daerah tentang pelaksanaan program Usaha Kesehatan Sekolah/Madrasah (UKS/M)", 
        definisiOperasional: "Pemerintah daerah mengeluarkan Perda/Perbub/Perwali/Kebijakan Kadis  Pendidikan/Kesehatan terkait dengan program Usaha Kesehatan Sekolah/Madrasah (UKS/M).  Usaha Kesehatan Sekolah/Madrasah (UKS/M) merupakan upaya satuan pendidikan dalam menanamkan, menumbuhkan, mengembangkan serta meningkatkan kemampuan hidup sehat, dengan penerapan Perilaku Hidup Bersih dan Sehat (PHBS), serta derajat kesehatan peserta didik melalui pelaksanaan Trias UKS yakni: 1. Pendidikan kesehatan 2. Pelayanan kesehatan 3. Pembinaan lingkungan sekolah sehat", 
        sumberData: "Perangkat daerah yang membidangi  urusan pendidikan/ satuan pendidikan, kesehatan", 
        buktiDukung: "Dokumen Perda/Perbub/Perwali/Kebijakan Kadis Pendidikan/Kesehatan terkait dengan program Usaha Kesehatan Sekolah/Madrasah (UKS/M).", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki regulasi daerah tentang pelaksanaan program Usaha Kesehatan Sekolah/Madrasah (UKS/M)"},{"nilai":50,"deskripsi":"NIlai 50 jika regulasi daerah tentang pelaksanaan program Usaha Kesehatan Sekolah/Madrasah (UKS/M) masih dalam proses/bentuk draft"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak memiliki regulasi daerah tentang pelaksanaan program Usaha Kesehatan Sekolah/Madrasah (UKS/M)"}] 
      },
      { 
        id: 't3-i2', 
        question: "Keberadaan program Usaha Kesehatan Sekolah/Madrasah (UKS/M) dalam  perencanaan daerah (RPJMD, RKPD, Renstra PD dan Renja PD)", 
        definisiOperasional: "Pemerintah daerah mengeluarkan RPJMD/ RKPD/ Renstra PD/ Renja PD untuk mendukung program UKS/M termasuk Gerakan Sekolah Sehat sebagai revitalisasi UKS masuk dalam dokumen perencanaan pembangunan daerah.", 
        sumberData: "SIPD (Sistem Informasi Perencanaan Daerah)  atau perangkat daerah yang membidangi  urusan perencanaan daerah/ pendidikan", 
        buktiDukung: "Dokumen RPJMD, RKPD, Renstra PD atau Renja PD tentang program Usaha Kesehatan Sekolah/Madrasah (UKS/M) termasuk penganggarannya", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika  program Usaha Kesehatan Sekolah/Madrasah (UKS/M) masuk ke dalam perencanaan daerah dan diimplementasikan (dibuktikan dengan dokumen penganggarannya)"},{"nilai":50,"deskripsi":"Nilai 50 jika program Usaha Kesehatan Sekolah/Madrasah (UKSM) masuk ke dalam perencanaan daerah tetapi belum diimplementasikan (dibuktikan dengan dokumen penganggarannya)"},{"nilai":0,"deskripsi":"Nilai 0 jika  program Usaha Kesehatan Sekolah/Madrasah (UKS/M) tidak masuk kedalam perencanaan daerah"}] 
      },
      { 
        id: 't3-i3', 
        question: "Persentase Sekolah/Madrasah/Pondok Pesantren yang menerapkan Satuan Pendidikan Ramah Anak", 
        definisiOperasional: "Jumlah satuan pendidikan yang telah memiliki SK sebagai Satuan Pendidikan Ramah Anak (SRA) dari Kepala Daerah atau Dinas Pendidikan/Dinas PPPA/Kanwil Kemenag, SOP penanganan kasus dan laporan penanganan kasus dibagi jumlah total satuan pendidikan dikali 100%  Jumlah sekolah yang telah memiliki SK TPPKS (Tim Pencegahan dan Penanganan Kekerasan Di Satuan Pendidikan)  dan melakukan  sosialisasi ttg pencegahan dan penanganan kekerasan di satuan pendidikan minimal 1x setahun (SK TPPKS di upload di DAPODIK).", 
        sumberData: "Perangkat daerah yang membidangi  urusan pendidikan/ satuan pendidikan,  perlindungan perempuan dan anak", 
        buktiDukung: "Laporan capaian persentase Sekolah/Madrasah/Pondok Pesantren yang menerapkan Satuan Pendidikan Ramah Anak tahun 2023 dan 2024 yang dilengkapi dengan : 1. SK untuk SRA baik yang\u000bdikeluarkan oleh kepala daerah, Kepala Dinas Pendidikan, Kanwil Kemenag, ataupun oleh Kepala Dinas PPPA. 2. SOP penanganan kasus 3. Laporan pendampingan penanganan kasus   Lapora divalidasi oleh kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase Sekolah/Madrasah/Pondok Pesantren yang menerapkan Satuan Pendidikan Ramah Anak meningkat dalam 2 tahun terakhir dan ≥ 71% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50  jika persentase Sekolah/Madrasah/Pondok Pesantren yang menerapkan Satuan Pendidikan Ramah Anak menurun dalam 2 tahun terakhir namun masih  ≥ 71% pada tahun 2024 atau persentase Sekolah/Madrasah/Pondok Pesantren yang menerapkan Satuan Pendidikan Ramah Anak meningkat dalam 2 tahun terakhir namun < 71% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase Sekolah/Madrasah/Pondok Pesantren yang menerapkan Satuan Pendidikan Ramah Anak menurun dalam 2 tahun terakhir dan < 71% pada tahun 2024"}] 
      },
      { 
        id: 't3-i4', 
        question: "Persentase sekolah/madrasah yang mencapai stratifikasi standar Usaha Kesehatan Sekolah/Madrasah (UKS/M) atau yang mengimplementasikan Gerakan Sekolah Sehat secara berkelanjutan", 
        definisiOperasional: "Jumlah satuan pendidikan yang telah memenuhi kriteria stratifikasi minimal standar minimum UKS/M dalam tahun berjalan atau telah menerapkan kegiatan prioritas Gerakan Sekolah Sehat secara berkelanjutan dibagi dengan jumlah seluruh satuan pendidikan dikali 100%.", 
        sumberData: "Perangkat daerah yang membidangi  urusan pendidikan/ satuan pendidikan, kesehatan", 
        buktiDukung: "Laporan rekapitulasi hasil stratifikasi UKS/M tahun 2023 dan 2024 yang dilengkapi dengan jumlah satuan pendidikan (sekolah dan madrasah) dan jumlah  satuan pendidikan (sekolah dan madrasah). Laporan divalidasi oleh kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"NIlai 100 jika capaian persentase sekolah/madrasah yang  mengimplementasikan Gerakan Sekolah Sehat secara berkelanjutan meningkat dalam 2 tahun terakhir dan  ≥ 50% pada tahun 2024"},{"nilai":50,"deskripsi":"NIlai 50 jika capaian persentase sekolah/madrasah yang  mengimplementasikan Gerakan Sekolah Sehat secara berkelanjutan menurun dalam 2 tahun terakhir namun masih  ≥ 50% pada tahun 2024 atau capaian persentase sekolah/madrasah yang  mengimplementasikan Gerakan Sekolah Sehat secara berkelanjutan meningkat dalam 2 tahun terakhir namun < 50% pada tahun 2024"},{"nilai":0,"deskripsi":"NIlai 0 jika capaian persentase sekolah/madrasah yang  mengimplementasikan Gerakan Sekolah Sehat secara berkelanjutan menurun dalam 2 tahun terakhir dan < 50% pada tahun 2024"}] 
      },
      { 
        id: 't3-i5', 
        question: "Persentase Sekolah/Madrasah yang telah dilakukan Inspeksi Kesehatan Lingkungan (IKL)", 
        definisiOperasional: "Jumlah Sekolah/Madrasah yang telah dilakukan Inspeksi Kesehatan Lingkungan (IKL) dibagi dengan jumlah seluruh Sekolah/Madrasah dikali 100%  Inspeksi Kesehatan Lingkungan adalah kegiatan pemeriksaan dan pengamatan secara langsung terhadap media lingkungan dalam rangka pengawasan berdasarkan standar, norma, dan baku mutu yang berlaku untuk meningkatkan kualitas lingkungan yang sehat. (sumber : Permenkes 13 tahun 2015).", 
        sumberData: "Perangkat daerah yang membidangi  urusan pendidikan/ satuan pendidikan, kesehatan", 
        buktiDukung: "Laporan rekapitulasi hasil IKL pada Sekolah/Madrasah tahun 2023 dan 2024 dilengkapi dengan data jumlah satuan pendidikan (sekolah dan madrasah), jumlah satuan pendidikan (sekolah dan madrasah). Laporan divalidasi oleh kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase Sekolah/Madrasah yang telah dilakukan Inspeksi Kesehatan Lingkungan (IKL) meningkat dalam 2 tahun terakhir dan  ≥ 80% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase Sekolah/Madrasah yang telah dilakukan Inspeksi Kesehatan Lingkungan (IKL) menurun dalam 2 tahun terakhir namun masih ≥ 80% pada tahun 2024 atau capaian persentase Sekolah/Madrasah yang telah dilakukan Inspeksi Kesehatan Lingkungan (IKL) meningkat dalam 2 tahun terakhir namun < 80% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase Sekolah/Madrasah yang telah dilakukan Inspeksi Kesehatan Lingkungan (IKL) menurun dalam 2 tahun terakhir dan < 80% pada tahun 2024"}] 
      },
      { 
        id: 't3-i6', 
        question: "Keberadaan Tim Pembina UKS/M tingkat Kabupaten/Kota dan tingkat Kecamatan", 
        definisiOperasional: "Tim Pembina UKS/M Kabupaten/Kota adalah tim pembina yang dibentuk di tingkat kabupaten/kota ditetapkan oleh bupati/walikota yang memiliki fungsi sebagai pembina, koordinator dan pelaksana program UKS di daerahnya berdasarkan kebijakan yang ditetapkan oleh pusat, provinsi dan kabupaten/kota.   Tim Pembina UKS/M Kecamatan adalah tim pembina yang dibentuk di tingkat kecamatan ditetapkan oleh camat yang memiliki fungsi sebagai pembina, penanggung jawab dan pelaksana program UKS di daerah kerjanya berdasarkan kebijakan yang ditetapkan TP UKS kabupaten/kota.  (sumber : Tata Kelola UKS/M di Sekolah Dasar)", 
        sumberData: "Perangkat daerah yang membidangi  urusan pendidikan/ satuan pendidikan", 
        buktiDukung: "Dokumen SK Tim Pembina tingkat Kabupaten/Kota dan SK Tim Pembina tingkat Kecamatan disertai dengan dokumen rencana kerja dan realisasinya. tahun 2023 dan 2024.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki SK Tim Pembina Kabupaten/Kota, memiliki seluruh SK Tim Pembina Kecamatan dengan melampirkan dokumen rencana kerja dan capaian kegiatannya"},{"nilai":50,"deskripsi":"Nilai 50  jika memiliki SK Tim Pembina Kabupaten/Kota, memiliki seluruh SK Tim Pembina Kecamatan namun tidak melampirkan dokumen rencana kerja dan capaian kegiatannya atau  memiliki SK Tim Pembina Kabupaten/Kota tetapi masih proses draft SK Tim Pembina Kecamatan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak memiliki SK Tim Pembina Kabupaten/Kota"}] 
      },
      { 
        id: 't3-i7', 
        question: "Presentase Sekolah/Madrasah yang memiliki tim pelaksana UKS/M dibuktikan dengan SK", 
        definisiOperasional: "Jumlah sekolah/ madrasah yang memiliki tim pelaksana UKS/M yang dibuktikan dengan SK, dokumen rencana kerja dan capaian kegiatannya dibagi dengan seluruh jumlah sekolah/ madrasah dikali 100%  Tim Pelaksana UKS/M adalah tim yang dibentuk di tingkat satuan pendidikan ditetapkan oleh kepala sekolah yang memiliki fungsi sebagai sebagai penanggungjawab dan pelaksana program UKS di sekolah/ madrasah berdasarkan prioritas kebutuhan dan kebijakan yang ditetapkan oleh TP UKS kabupaten/kota. (sumber : Tata Kelola UKS/M di Sekolah Dasar)", 
        sumberData: "Perangkat daerah yang membidangi  urusan pendidikan/ satuan pendidikan", 
        buktiDukung: "Laporan capaian sekolah/madrasah yang memiliki Tim Pelaksana UKS/M dilengkapi dengan data satuan pendidikan (sekolah dan madrasah), jumlah satuan pendidikan (sekolah dan madrasah) yang telah memiliki SK Tim Pelaksana UKS/M dan masih berlaku di tahun 2024 disertai dengan SK, dokumen rencana kerja dan capaian kegiatannya  tahun 2023 dan 2024. Laporan divalidasi oleh kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika presentase Sekolah/Madrasah yang memiliki tim pelaksana UKS/M meningkat dalam 2 tahun terakhir dan mencapai ≥ 80 % pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika presentase Sekolah/Madrasah yang memiliki tim pelaksana UKS/M menurun dalam 2 tahun terakhir namun masih  ≥ 80 % pada tahun 2024 atau  presentase Sekolah/Madrasah yang memiliki tim pelaksana UKS/M meningkat dalam 2 tahun terakhir namun < 80 % pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika presentase Sekolah/Madrasah yang memiliki tim pelaksana UKS/M menurun dalam 2 tahun terakhir dan < 80 % pada tahun 2024"}] 
      },
      { 
        id: 't3-i8', 
        question: "Persentase sekolah/madrasah yang melakukan pengawasan internal", 
        definisiOperasional: "Jumlah sekolah/ madrasah yang melakukan pengawasan internal dibagi jumlah seluruh sekolah/ madrasah dikali 100%  Pengawasan internal adalah pengawasan yang dilakukan oleh pengelola, penyelenggara atau penanggung jawab minimal 1 (satu) kali dalam setahun terhadap parameter fisik dan kimia. (sumber : Permenkes nomor 2 tahun 2023)", 
        sumberData: "Perangkat daerah yang membidangi  urusan pendidikan/ satuan pendidikan", 
        buktiDukung: "Laporan capaian hasil pengawasan internal di sekolah/madrasah tahun 2023 dan 2024 yang divalidasi oleh kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase sekolah/madrasah yang melakukan pengawasan internal meningkat dalam 2 tahun terakhir dan mencapai ≥80 % pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika  persentase sekolah/madrasah yang melakukan pengawasan internal  menurun dalam 2 tahun terakhir namun masih  ≥80 % pada tahun 2024 atau persentase sekolah/madrasah yang melakukan pengawasan internal  meningkat dalam 2 tahun terakhir namun <80 % pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase sekolah/madrasah yang melakukan pengawasan internal menurun dalam 2 tahun terakhir dan <80 % pada tahun 2024"}] 
      },
      { 
        id: 't3-i9', 
        question: "Persentase sekolah/ madrasah yang menerapkan sekolah Adiwiyata", 
        definisiOperasional: "Jumlah sekolah/madrasah yang telah menerapkan sekolah adiwiyata dibagi jumlah seluruh sekolah/madrasah dikali 100%   Sekolah adiwiyata adalah sekolah yang berhasil melaksanakan gerakan peduli dan berbudaya lingkungan hidup di sekolah/ madrasah. Gerakan  Peduli dan  Berbudaya  Lingkungan  Hidup di sekolah/ madrasah   yang   selanjutnya   disebut Gerakan   PBLHS adalah aksi  kolektif  secara  sadar,  sukarela,  berjejaring, dan  berkelanjutan yang  dilakukan  oleh  sekolah/ madrasah  dalam menerapkan perilaku ramah lingkungan hidup. Kriteria Gerakan PBLHS : 1. kebijakan daerah yang mendukung Gerakan PBLHS; 2. tindak lanjut kebijakan daerah yang mendukung Gerakan PBLHS; 3. jumlah program/kegiatan untuk mendukung Gerakan PBLHS; 4. persentase jumlah anggaran dinas lingkungan hidup yang mendukung Gerakan PBLHS; 5. persentase jumlah sekolah yang telah memperoleh Adiwiyata terhadap jumlah sekolah di daerah setempat; dan 6. pelaksanaan pemantauan, evaluasi, dan pelaporan Gerakan PBLHS dalam 1 (satu) tahun. (sumber : Peraturan Menteri LHK nomor 23 Tahun 2022)", 
        sumberData: "Perangkat daerah yang membidangi  urusan pendidikan/ lingkungan hidup", 
        buktiDukung: "Laporan capaian presentase sekolah/ madrasah yang menerapkan sekolah Adiwiyata tahun 2023 dan 2024 yang divalidasi oleh kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase sekolah/madrasah yang menerapkan sekolah Adiwiyata meningkat dalam 2 tahun terakhir dan mencapai ≥ 80 % pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50  jika persentase sekolah/madrasah yang menerapkan sekolah Adiwiyata menurun dalam 2 tahun terakhir namun masih ≥ 80 % pada tahun 2024 atau persentase sekolah/madrasah yang menerapkan sekolah Adiwiyata meningkat dalam 2 tahun terakhir  terakhir namun < 80 % pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0  jika persentase sekolah/madrasah yang menerapkan sekolah Adiwiyata menurun dalam 2 tahun terakhir  dan < 80 % pada tahun 2024"}] 
      },
      { 
        id: 't3-i10', 
        question: "Persentase sekolah/ madrasah  yang menyelenggarakan  skrining kesehatan", 
        definisiOperasional: "Jumlah sekolah/ madrasah yang menyelenggarakan promosi kesehatan dan skrining kesehatan bekerja sama dengan  FKTP (Fasilitas Kesehatan Tingkat Pertama) yang dilakukan pada seluruh peserta didik dibagi jumlah keseluruhan sekolah/ madrasah dikali 100%.", 
        sumberData: "Perangkat daerah yang membidangi  urusan kesehatan/ pendidikan", 
        buktiDukung: "Laporan capaian persentase sekolah/ madrasah  yang menyelenggarakan  skrining kesehatan tahun 2023 dan 2024 yang divalidasi oleh kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase sekolah/ madrasah  yang menyelenggarakan  skrining kesehatan meningkat dalam 2 tahun terakhir dan mencapai ≥80% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50  jika  persentase sekolah/ madrasah  yang menyelenggarakan  skrining kesehatan menurun dalam 2 tahun terakhir namun masih ≥80% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0  persentase sekolah/ madrasah  yang menyelenggarakan  skrining kesehatan menurun dalam 2 tahun terakhir  dan <80% pada tahun 2024"}] 
      },
      { 
        id: 't3-i11', 
        question: "Persentase anak usia sekolah dasar dan sederajat yang mendapatkan Imunisasi Sekolah Lengkap (ISL)", 
        definisiOperasional: "Jumlah anak kelas 6 yang telah mendapatkan imunisasi MR 1kali, DT 1 kali dan Td 2 kali atau MR 1 dosis dan Td 3 dosis dibagi jumlah seluruh anak kelas 6 di Kabupaten/Kota  dikali 100 dalam tahun berjalan.", 
        sumberData: "ASIK atau perangkat daerah yang membidangi  urusan kesehatan", 
        buktiDukung: "Laporan capaian persentase anak usia sekolah dasar dan sederajat yang mendapatkan Imunisasi Sekolah Lengkap (ISL) tahun 2023 dan 2024 dilengkapi dengan tangkapan layar (screenshot) ASIK yang divalidasi oleh Kepala OPD terkait (Dinas Kesehatan).", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase anak usia sekolah dasar dan sederajat yang mendapatkan Imunisasi Sekolah Lengkap (ISL) meningkat dalam 2 tahun dan ≥90% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50  jika capaian persentase anak usia sekolah dasar dan sederajat yang mendapatkan Imunisasi Sekolah Lengkap (ISL) menurun namun masih ≥90% pada tahun 2024 atau capaian persentase anak usia sekolah dasar dan sederajat yang mendapatkan Imunisasi Sekolah Lengkap (ISL) meningkat namun <90% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase anak usia sekolah dasar dan sederajat yang mendapatkan Imunisasi Sekolah Lengkap (ISL) menurun dan  <90% pada tahun 2024"}] 
      }
    ]
  },
  {
    id: 'tatanan-4',
    name: "Pasar",
    indicators: [
      { 
        id: 't4-i1', 
        question: "Adanya regulasi daerah tentang pasar sehat", 
        definisiOperasional: "Tersedianya regulasi daerah tentang pasar sehat dengan satuan ukur dokumen.  Pasar Sehat adalah kondisi Pasar Rakyat yang bersih, aman, nyaman, dan sehat melalui pemenuhan Standar Baku Mutu Kesehatan Lingkungan, Persyaratan Kesehatan, serta sarana dan prasarana penunjang dengan mengutamakan kemandirian komunitas pasar. (Permenkes No 17 Tahun 2020 tentang Pasar Sehat)", 
        sumberData: "Perangkat daerah yang membidangi  urusan hukum/ kesehatan/ pasar", 
        buktiDukung: "Dokumen Perda/Perbub/Perwali/Kebijakan terkait dengan program pasar sehat", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada Perda/Perbub/Perwali/Kebijakan dan sudah disahkan oleh Kepala Daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika ada Perda/Perbub/Perwali/Kebijakan namun masa berlaku sudah habis atau masih dalam proses penyusunan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada Perda/Perbub/Perwali/Kebijakan"}] 
      },
      { 
        id: 't4-i2', 
        question: "Adanya regulasi penanganan Pedagang Kaki Lima (PKL)", 
        definisiOperasional: "Tersedianya regulasi daerah tentang penanganan PKL dengan satuan ukur dokumen.  Pedagang Kaki Lima yang selanjutnya disingkat PKL adalah pelaku usaha yang melakukan usaha perdagangan dengan menggunakan sarana usaha bergerak maupun tidak bergerak, menggunakan prasarana kota, fasilitas sosial, fasilitas umum, lahan dan bangunan milik pemerintah dan/atau swasta yang bersifat sementara/tidak menetap", 
        sumberData: "Perangkat daerah yang membidangi  urusan hukum/ pasar", 
        buktiDukung: "Dokumen Perda/Perbub/Perwali/Kebijakan terkait dengan program penanganan pedagang kaki lima", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada Perda/Perbub/Perwali/Kebijakan dan sudah disahkan oleh Kepala Daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika ada Perda/Perbub/Perwali/Kebijakan namun masa berlaku sudah habis atau masih dalam proses penyusunan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada Perda/Perbub/Perwali/Kebijakan"}] 
      },
      { 
        id: 't4-i3', 
        question: "Persentase pasar yang menerapkan Kawasan Tanpa Rokok (KTR)", 
        definisiOperasional: "Jumlah pasar yang menerapkan Kawasan Tanpa rokok (KTR) dibagi dengan jumlah total pasar di kabupaten/kota dikali 100%.", 
        sumberData: "Perangkat daerah yang membidangi terkait Pasar", 
        buktiDukung: "Laporan perangkat daerah yang membidangi pasar dilengkapi dengan data jumlah seluruh pasar, jumlah pasar yang menerapkan KTR disertai dengan dokumentasi yang menggambarkan penerapan KTR di pasar sesuai dengan peraturan perundangan yang berlaku. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar yang menerapkan KTR meningkat dan mencapai ≥ 50% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar yang menerapkan KTR meningkat dalam 2 tahun terakhir namun mencapai < 50% di tahun 2024 atau  persentase pasar yang menerapkan KTR menurun dalam 2 tahun terakhir dan mencapai ≥ 50% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar yang menerapkan KTR menurun dalam 2 tahun terakhir namun < 50% di tahun 2024 atau tidak ada pasar yang menerapkan KTR"}] 
      },
      { 
        id: 't4-i4', 
        question: "Persentase pasar yang menerapkan Kesehatan dan Keselamatan Kerja (K3)", 
        definisiOperasional: "Jumlah pasar yang menerapkan  Kesehatan dan Keselamatan Kerja (K3) (minimal memiliki SOP dan penerapannya dilaksanakan) dibagi dengan jumlah total pasar di kabupaten/kota dikali 100%", 
        sumberData: "Perangkat daerah yang membidangi terkait Pasar", 
        buktiDukung: "Laporan perangkat daerah yang membidangi pasar dilengkapi dengan data jumlah seluruh pasar, jumlah pasar yang menerapkan K3 disertai dengan dokumentasi yang menggambarkan penerapan K3 di pasar sesuai dengan peraturan perundangan yang berlaku, misalnya SOP. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar yang menerapkan K3 meningkat dalam 2 tahun terakhir dan mencapai ≥ 70% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar yang menerapkan K3 meningkat dalam 2 tahun terakhir namun mencapai < 70% di tahun 2024 atau persentase pasar yang menerapkan K3 menurun dalam 2 tahun terakhir dan mencapai ≥ 70% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar yang menerapkan K3 menurun  dalam 2 tahun terakhir dan mencapai < 70% di tahun 2024 atau tidak ada pasar yang menerapkan K3"}] 
      },
      { 
        id: 't4-i5', 
        question: "Persentase Pasar menyediakan akses air bersih/air minum yang memenuhi persyaratan", 
        definisiOperasional: "Jumlah pasar yang menerapkan penyediaan air bersih/air minum perlu memenuhi persyaratan sesuai SNI Pasar No 8152:2021 berikut : a. tersedianya air bersih/air minum dengan jumlah yang cukup secara berkesinambungan b. tersedianya instalasai pengolahan air bersih pada area bahan pangan basah c. pemeriksaan kualitas air bersih/air minum dilakukan melalui pengujian secara berkala dibagi jumlah total pasar di kabupaten/kota dikali 100%.", 
        sumberData: "Perangkat daerah yang membidangi terkait Pasar", 
        buktiDukung: "Laporan perangkat daerah yang membidangi pasar dilengkapi dengan data jumlah seluruh pasar, jumlah pasar yang telah menyediakan air minum sesuai dengan persyaratan disertai dengan dokumentasi yang menggambarkan penyediaan air yang memenuhi persyaratan sesuai perundangan yang berlaku, misalnya SOP dan/atau hasil IKL sarana dan pemeriksaan kualitas air di pasar. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar menyediakan air minum yang memenuhi persyaratan meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar menyediakan air minum yang memenuhi persyaratan meningkat dalam 2 tahun terakhir namun mencapai < 80% di tahun 2024 atau persentase pasar menyediakan air minum yang memenuhi persyaratan menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar menyediakan air minum yang memenuhi persyaratan menurun dalam 2 tahun terakhir dan mencapai < 80% di tahun 2024 atau tidak ada pasar menyediakan air minum yang memenuhi persyaratan"}] 
      },
      { 
        id: 't4-i6', 
        question: "Persentase pasar melakukan pengawasan internal terkait kesehatan (contoh : pengawasan bahan pangan berbahaya atau uji kelayakan air bersih)", 
        definisiOperasional: "Jumlah pasar yang melakukan pengawasan internal dibagi dengan jumlah total pasar di kabupaten/kota dikali 100%", 
        sumberData: "Perangkat daerah yang membidangi terkait Pasar", 
        buktiDukung: "Laporan perangkat daerah yang membidangi pasar dilengkapi dengan data jumlah seluruh pasar, jumlah pasar yang telah melakukan pengawasan internal disertai dengan dokumentasi yang menggambarkan penyediaan air yang memenuhi persyaratan sesuai perundangan yang berlaku, misalnya hasil IKL sarana dan pemeriksaan kualitas air di pasar. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar melakukan pengawasan internal meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar melakukan pengawasan internal meningkat dalam 2 tahun terakhir namun mencapai < 80% di tahun 2024 atau persentase pasar melakukan pengawasan internal menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar melakukan pengawasan internal menurun dalam 2 tahun terakhir dan mencapai < 80% di tahun 2024 atau tidak ada pasar melakukan pengawasan internal"}] 
      },
      { 
        id: 't4-i7', 
        question: "Persentase pasar melaksanakan Komunikasi, Informasi dan Edukasi (KIE) kesehatan  masyarakat bekerja sama dengan sektor terkait  kepada masyarakat pasar", 
        definisiOperasional: "Jumlah pasar yang sudah melaksanakan Komunikasi, Informasi dan Edukasi (KIE) kesehatan masyarakat (KTR, CTPS, PHBS, pengukuran kualitas lingkungan, PHAST Pasar dll.) kepada masyarakat pasar dibagi dengan jumlah total pasar di kabupaten/kota dikali 100%kabupaten/kota dikali 100%", 
        sumberData: "Perangkat daerah yang membidangi terkait Pasar", 
        buktiDukung: "Laporan perangkat daerah yang membidangi pasar dilengkapi dengan data jumlah seluruh pasar, jumlah pasar yang telah melaksanakan KIE disertai dengan dokumentasi yang menggambarkan pelaksanaan KIE, misalnya media promosi yang dipasang di pasar, dll. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar melaksanakan KIE meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar melaksanakan KIE meningkat  dalam 2 tahun terakhir namun mencapai < 80% di tahun 2024 atau persentase pasar melaksanakan KIE menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar melaksanakan KIE menurun dalam 2 tahun terakhir dan mencapai < 80% di tahun 2024 atau tidak ada pasar melaksanakan KIE"}] 
      },
      { 
        id: 't4-i8', 
        question: "Persentase pasar memiliki fasilitas ruang ASI", 
        definisiOperasional: "Jumlah  pasar yang memiliki fasilitas ruang ASI dibagi dengan jumlah total pasar di kabupaten/kota dikali 100%.", 
        sumberData: "Perangkat daerah yang membidangi terkait Pasar", 
        buktiDukung: "Laporan perangkat daerah yang membidangi pasar dilengkapi dengan data jumlah seluruh pasar, jumlah pasar yang memilki ruang ASI sesuai dengan standar disertai dengan dokumentasi yang menggambarkan keberadaan fasilitas ruang ASI yang memenuhi standar. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar memilki fasilitas ruang ASI meningkat dalam 2 tahun terakhir dan mencapai ≥ 70% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar memilki fasilitas ruang ASI meningkat dalam 2 tahun terakhir namun mencapai ≥ 70% di tahun 2024 atau persentase pasar memilki fasilitas ruang ASI menurun dalam 2 tahun terakhir dan mencapai ≥ 70% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar memilki fasilitas ruang ASI menurun dalam 2 tahun terakhir dan mencapai < 70% di tahun 2024 atau tidak ada pasar memilki fasilitas ruang ASI"}] 
      },
      { 
        id: 't4-i9', 
        question: "Persentase pasar melakukan pengelolaan sampah dengan prinsip 3 R (reduce, reuse, dan recyle)", 
        definisiOperasional: "Jumlah   pasar yang melakukan pengelolaan sampah dengan prinsip 3 R (reduce, reuse, dan recyle) dibagi dengan jumlah total pasar di kabupaten/kota dikali 100%.", 
        sumberData: "Perangkat daerah yang membidangi terkait Pasar", 
        buktiDukung: "Laporan perangkat daerah yang membidangi pasar dilengkapi dengan data jumlah seluruh pasar, jumlah pasar yang melakukan pengelolaan sampah dengan prinsip 3 R disertai dengan dokumentasi yang menggambarkan pengelolaan sampah dengan prinsip 3 R. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar melakukan pengelolaan sampah dengan prinsip 3 R meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar melakukan pengelolaan sampah dengan prinsip 3 R meningkat dalam 2 tahun terakhir namun mencapai < 80% di tahun 202 atau persentase pasar melakukan pengelolaan sampah dengan prinsip 3 R menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar melakukan pengelolaan sampah dengan prinsip 3 R menurun dalam 2 tahun terakhir dan mencapai < 80% di tahun 2024 atau tidak ada pasar melakukan pengelolaan sampah dengan prinsip 3 R"}] 
      },
      { 
        id: 't4-i10', 
        question: "Persentase pasar melakukan pengelolaan limbah  cair", 
        definisiOperasional: "Jumlah  pasar yang melakukan pengelolaan limbah cair dibagi dengan jumlah total pasar di kabupaten/kota dikali 100%.", 
        sumberData: "Perangkat daerah yang membidangi terkait Pasar", 
        buktiDukung: "Laporan perangkat daerah yang membidangi pasar dilengkapi dengan data jumlah seluruh pasar, jumlah pasar yang melakukan pengelolaan air limbah disertai dengan dokumentasi yang menggambarkan pengelolaan limbah cair. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar melakukan pengelolaan limbah cair meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar melakukan pengelolaan limbah cair meningkat dalam 2 tahun terakhir namun mencapai < 80% di tahun 2024 atau persentase pasar melakukan pengelolaan limbah cair menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar melakukan pengelolaan limbah cair menurun dalam 2 tahun terakhir dan mencapai < 80% di tahun 2024 atau tidak ada pasar melakukan pengelolaan limbah cair"}] 
      },
      { 
        id: 't4-i11', 
        question: "Persentase pasar memiliki fasilitas toilet yang bersih dan memadai", 
        definisiOperasional: "Jumlah pasar yang memiliki fasilitas toilet bersih dan memadai dibagi dengan jumlah total pasar di kabupaten/kota dikali 100%.", 
        sumberData: "Perangkat daerah yang membidangi terkait Pasar", 
        buktiDukung: "Laporan perangkat daerah yang membidangi pasar dilengkapi dengan data jumlah seluruh pasar, jumlah pasar yang memilki fasilitas toilet bersih dan memadai disertai dengan dokumentasi yang menggambarkan kepemilikan fasilitas toilet bersih dan memadai di pasar. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar memiliki fasilitas toilet bersih dan memadai meningkat dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar memiliki fasilitas toilet bersih dan memadai meningkat namun mencapai < 80% di tahun 2024 atau persentase pasar memiliki fasilitas toilet bersih dan memadai menurun dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar memiliki fasilitas toilet bersih dan memadai menurun dan  mencapai < 80% atau tidak ada pasar emiliki fasilitas toilet bersih dan memadai"}] 
      },
      { 
        id: 't4-i12', 
        question: "Persentase pasar memiliki fasilitas pos kesehatan (ruang kesehatan atau fasilitas P3K)", 
        definisiOperasional: "Jumlah pasar yang memiliki fasilitas pos kesehatan (ruang kesehatan atau fasilitas P3K) dibagi dengan jumlah total pasar di kabupaten/kota dikali 100%.", 
        sumberData: "Perangkat daerah yang membidangi terkait Pasar", 
        buktiDukung: "Laporan perangkat daerah yang membidangi pasar dilengkapi dengan data jumlah seluruh pasar, jumlah pasar yang memilki fasilitas pos kesehatan (ruang kesehatan atau fasilitas P3K) disertai dengan dokumentasi yang menggambarkan kepemilikan pos kesehatan (ruang kesehatan atau fasilitas P3K) di pasar. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar memiliki fasilitas pos kesehatan meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar memiliki fasilitas pos kesehatan meningkat dalam 2 tahun terakhir namun mencapai < 80% di tahun 2024 atau  persentase pasar memiliki fasilitas pos kesehatan menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar memiliki fasilitas pos kesehatan menurun dalam 2 tahun terakhir dan mencapai < 80% di tahun 2024 atau tidak ada pasar memiliki fasilitas pos kesehatan"}] 
      },
      { 
        id: 't4-i13', 
        question: "Persentase pasar terdapat pemotongan hewan di dalam pasar", 
        definisiOperasional: "Jumlah pasar yang memiliki yang terdapat pemotongan hewan di dalam pasar dibagi dengan jumlah total pasar di kabupaten/kota dikali 100%.", 
        sumberData: "Perangkat daerah yang membidangi terkait Pasar", 
        buktiDukung: "Laporan perangkat daerah yang membidangi pasar dilengkapi dengan data jumlah seluruh pasar, jumlah pasar yang memilki fasilitas pemotongan hewan dalam pasar disertai dengan dokumentasi yang menggambarkan i fasilitas pemotongan hewan dalam pasar  Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar terdapat pemotongan hewan di dalam pasar menurun dalam 2 tahun terakhir dan mencapai ≤ 30% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar terdapat pemotongan hewan di dalam pasar menurun dalam 2 tahun terakhir namun mencapai > 30% atau persentase pasar terdapat pemotongan hewan di dalam pasar meningkat dalam 2 tahun terakhir dan mencapai ≤ 30% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar terdapat pemotongan hewan di dalam pasar meningkat dalam 2 tahun terakhir dan mencapai > 30% atau seluruh pasar masih terdapat pemotongan hewan di dalam pasar"}] 
      }
    ]
  },
  {
    id: 'tatanan-5',
    name: "Perkantoran Perindustrian",
    indicators: [
      { 
        id: 't5-i1', 
        question: "Persentase industri kecil dan menengah (IKM) memenuhi kewajiban perizinan berusaha pada sektor perindustrian", 
        definisiOperasional: "Persentase industri kecil dan menengah (IKM) memenuhi kewajiban perizinan berusaha pada sektor perindustrian adalah jumlah IKM memenuhi kewajiban perizinan berusaha pada sektor perindustrian dibagi total jumlah industri kecil dan menengah IKM pada sektor perindustrian dikali 100%.  Perizinan Berusaha adalah legalitas yang diberikan kepada Pelaku Usaha untuk memulai dan menjalankan usaha dan/atau kegiatannya. Perizinan Berusaha pada sektor perindustrian meliputi kegiatan usaha: a. penyelenggaraan industri yang mengolah bahan baku dan/atau memanfaatkan sumber daya industri; dan b. kawasan industri.  (sumber : PP Nomor 5 Tahun 2021)  Kegiatan usaha dan/atau standar produk pada penyelenggaraan perizinan berusaha berbasis risiko sektor perindustrian merujuk pada Peraturan Menteri Perindustrian Nomor 9 tahun 2021.", 
        sumberData: "Sistem Informasi Industri Nasional (SIINAS)", 
        buktiDukung: "Laporan perangkat daerah yang membidangi industri kecil dan menengah dilengkapi dengan data jumlah seluruh industri kecil dan menengah, jumlah  industri kecil dan menengah yang memenuhi standar kegiatan usaha. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase IKM memenuhi standar kegiatan usaha meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase IKM memenuhi standar kegiatan usaha meningkat dalam 2 tahun terakhir namun mencapai < 80% di tahun 2024 atau persentase IKM memenuhi standar kegiatan usaha menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase IKM memenuhi standar kegiatan usaha menurun dalam 2 tahun terakhir dan mencapai < 80% atau tida ada IKM memenuhi standar kegiatan usaha"}] 
      },
      { 
        id: 't5-i2', 
        question: "Persentase tempat kerja/ perusahaan yang menerapkan Kawasan Tanpa Rokok (KTR)", 
        definisiOperasional: "Persentase tempat kerja/ perusahaan yang menerapkan Kawasan Tanpa Rokok (KTR) adalah jumlah tempat kerja atau perusahaan yang menerapkan Kawasan Tanpa rokok (KTR) dibagi jumlah total tempat kerja atau perusahaan di Kab/Kota dikali 100%.  Ruang lingkup KTR salah satunya meliputi tempat kerja. Pengaturan pelaksanaan KTR merujuk pada Peraturan Bersama Menteri Kesehatan dan Menteri Dalam Negeri Nomor 188/ MENKES/ PB/ I/ 2011 dan Nomor 7 TAHUN 2011 tentang Pedoman Pelaksanaan KTR.", 
        sumberData: "Perangkat daerah yang membidangi terkait  ketenagakerjaan", 
        buktiDukung: "Laporan perangkat daerah yang membidangi dunia usaha dilengkapi dengan data jumlah seluruh tempat kerja/perusahaan, jumlah  tempat kerja/perusahaan yang menerapkan KTR disertai dengan dokumentasi yang menggambarkan penerapan KTR di  tempat kerja/perusahaansesuai dengan peraturan perundangan yang berlaku. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase tempat kerja/ perusahaan yang menerapkan KTR meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase tempat kerja/ perusahaan yang menerapkan  KTR meningkat dalam 2 tahun terakhir namun mencapai < 80% di tahun 2024 atau persentase tempat kerja/ perusahaan yang menerapkan  KTR menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase  tempat kerja/ perusahaan yang menerapkan KTR menurun dalam 2 tahun terakhir dan mencapai < 80% di tahun 2024 atau tidak ada tempat kerja/ perusahaan yang menerapkan KTR"}] 
      },
      { 
        id: 't5-i3', 
        question: "Jumlah tempat kerja atau perusahaan  memiliki Unit Panitia Pembina Keselamatan dan Kesehatan Kerja (P2K3)", 
        definisiOperasional: "Panitia Pembina Keselamatan dan Kesehatan Kerja yang selanjutnya disebut P2K3 ialah badan pembantu di tempat kerja yang meruakan wadah kerjasama antara pengusaha dan pekerja untuk mengembangkan kerjasama saling pengertian dan partisipasi efektif dalam penerapan keselamatan dan kesehatan kerja. (sumber : Peraturan Menteri Tenaga Kerja Nomor PER.04/MEN/1987)", 
        sumberData: "Perangkat daerah yang membidangi terkait  ketenagakerjaan  di provinsi", 
        buktiDukung: "Laporan perangkat daerah yang membidangi ketenagakerjaan dilengkapi dengan data jumlah seluruh tempat kerja atau perusahaan, jumlah tempat kerja atau perusahaan yang memiliki Unit P2K3. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika jumlah tempat kerja/ perusahaan  memiliki Unit P2K3 meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika jumlah tempat kerja/ perusahaan memiliki Unit P2K3  tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah tempat kerja/ perusahaan memiliki Unit P2K3 menurun"}] 
      },
      { 
        id: 't5-i4', 
        question: "Persentase tempat kerja memfasilitasi pemeriksaan kesehatan berkala (deteksi dini) pada pegawainya minimal 1 tahun sekali", 
        definisiOperasional: "Persentase tempat kerja memfasilitasi pemeriksaan kesehatan berkala (deteksi dini) pada pegawainya minimal 1 tahun sekali adalah jumlah tempat kerja yang telah memfasilitasi pemeriksaan kesehatan pada pegawainya dalam satu tahun dibandingkan dengan jumlah total tempat kerja terdaftar di Kab/kota dikali 100%.", 
        sumberData: "Perangkat daerah yang membidangi terkait  ketenagakerjaan  di provinsi", 
        buktiDukung: "Laporan perangkat daerah yang membidangi ketenagakerjaan dilengkapi dengan data jumlah seluruh tempat kerja atau perusahaan, jumlah tempat kerja atau perusahaan yang memfasilitasi pemeriksaan kesehatan berkala. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase tempat kerja memfasilitasi pemeriksaan kesehatan berkala meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase tempat kerja yang memfasilitasi pemeriksaan kesehatan berkala meningkat dalam 2 tahun terakhir namun mencapai < 80% ditahun 2024 atau persentase tempat kerja yang memfasilitasi pemeriksaan kesehatan berkala menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase tempat kerja yang memfasilitasi pemeriksaan kesehatan berkala menurun dalam 2 tahun terakhir dan mencapai < 80% di tahun 2024 atau tidak ada pasar yang memfasilitasi pemeriksaan kesehatan berkala"}] 
      },
      { 
        id: 't5-i5', 
        question: "Angka kecelakaan kerja di tempat kerja setahun terakhir", 
        definisiOperasional: "Angka kecelakaan kerja di tempat kerja setahun terakhir  adalah jumlah angka kecelakaan kerja di lingkungan tempat kerja dengan kategori  kecelakaan kerja dan penyakit akibat kerja.  Kecelakaan kerja adalah kecelakaan yang terjadi dalam hubungan kerja, termasuk kecelakaan yang terjadi dalam petjalanan dari rumah menuju Tempat Kerja atau sebaliknya dan penyakit yang disebabkan oleh lingkungan kerja.  Penyakit akibat kerja (PAK) adalah penyakit yang diakibatkan oIeh pekerjaan dan/ atau lingkungan kerja. (sumber : Peraturan Menteri Ketenagakerjaan Nomor 5 Tahun 2021)", 
        sumberData: "Perangkat daerah yang membidangi terkait  ketenagakerjaan  di provinsi", 
        buktiDukung: "Laporan perangkat daerah yang membidangi ketenagakerjaan dilengkapi dengan data jumlah seluruh tempat kerja atau perusahaan, jumlah kecelakaan di tempat kerja atau perusahaan. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika angka kecelakaan di tempat kerja menurun"},{"nilai":50,"deskripsi":"Nilai 50 jika angka kecelakaan di tempat kerja tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika angka kecelakaan di tempat kerja meningkat"}] 
      },
      { 
        id: 't5-i6', 
        question: "Jumlah perusahaan mendapatkan penghargaan dibidang kesehatan yang diberikan oleh pemerintah pusat atau daerah", 
        definisiOperasional: "Jumlah tempat kerja yang mendapatkan penghargaan dibidang kesehatan. Contoh :  Penghargaan HIV/AIDS, TBC di tempat kerja, GP2SP, K3 Perkantoran", 
        sumberData: "Perangkat daerah yang membidangi terkait  ketenagakerjaan  di provinsi", 
        buktiDukung: "Laporan perangkat daerah yang membidangi ketenagakerjaan dilengkapi, dilengkapi dengan data perusahaan yang mendapat penghargaan serta dokumentasi Serifikat Penghargaan dalam kurun waktu 2023 dan 2024. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika  jumlah perusahaan mendapatkan penghargaan dibidang kesehatan meningkat dalam 2 tahun terakhir dan mencapai ≥ 10 perusahaan di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika  jumlah perusahaan mendapatkan penghargaan dibidang kesehatan meningkat dalam 2 tahun terakhir namun mencapai <10 perusahaan di tahun 2024 atau jumlah perusahaan mendapatkan penghargaan dibidang kesehatan menurun dalam 2 tahun terakhir dan mencapai ≥ 10 perusahaan di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika  jumlah perusahaan mendapatkan penghargaan dibidang kesehatan menurun dalam 2 tahun terakhir dan mencapai <10 perusahaan atau tidak ada perusahaan mendapatkan penghargaan dibidang kesehatan"}] 
      },
      { 
        id: 't5-i7', 
        question: "Persentase jumlah puskesmas membina Pos UKK", 
        definisiOperasional: "Persentase jumlah puskesmas membina Pos UKK adalah jumlah puskesmas melakukan kegiatan promotif, preventif  kesehatan kerja dan P3K pada Pos UKK di wilayah Kabupaten/ Kota dikali 100%.  Pos UKK adalah wadah untuk UKBM pada pekerja sektor informal yang dikelola dan diselenggarakan dari, oleh, untuk dan bersama masyarakat pekerja melalui pemberian pelayanan kesehatan dengan pendekatan utama promotif dan preventif, disertai kuratif dan rehabilitatif sederhana/terbatas.   Pos UKK Terintegrasi adalah Pos UKK yang dalam pelaksanaan kegiatan dan substansinya dipadukan dengan program atau kegiatan kesehatan lainnya yang terdapat pada kelompok pekerja dan bentuk peran serta masyarakat dalam melakukan kegiatan deteksi dini, pemantauan faktor risiko pada penyakit akibat kerja dan kecelakaan kerja, pengendalian penyakit menular dan tidak menular, pengendalian penyakit bersumber binatang, serta program gizi, kesehatan reproduksi, kesehatan olahraga, kesehatan jiwa, kesehatan lingkungan, dan PHBS yang dilaksanakan secara terpadu, rutin dan periodik.", 
        sumberData: "Aplikasi Komdat Kesmas/ SITKO/Satu Sehat atau Perangkat daerah yang membidangi  urusan kesehatan/ ketenagakerjaan", 
        buktiDukung: "Dokumen kegiatan pelayanan kesehatan/Pos Upaya Kesehatan Kerja (UKK)  diperoleh dari  Dinas Kesehatan melalui Komdat Kesmas Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika presentase jumlah puskesmas yang membina pos UKK meningkat dalam 2 tahun terakhir dan mencapai ≥ 80 % di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika presentase jumlah puskesmas yang membina pos UKK meningkat dalam 2 tahun terakhir namun mencapai < 80 % di tahun 2024 atau presentase jumlah puskesmas yang membina pos UKK menurun dan mencapai ≥ 80 % di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika presentase jumlah puskesmas yang membina pos UKK menurun dalam 2 tahun terakhir dan < 80 % di tahun 2024  atau tidak ada puskesmas ang membina pos UKK"}] 
      },
      { 
        id: 't5-i8', 
        question: "Jumlah  perusahaan menerapkan Gerakan Pekerja Perempuan Sehat Produktif (GP2SP)", 
        definisiOperasional: "Jumlah perusahaan yang menerapkan GP2SP (Gerakan Pekerja Perempuan Sehat Produktif) dengan kategori minimal cukup dari hasil pengisian penilaian mandiri/ pemerintah daerah.", 
        sumberData: "Perangkat daerah yang membidangi  urusan ketenagakerjaan/ kesehatan", 
        buktiDukung: "Laporan dan Dokumentasi dari Dinas Kesehatan Provinsi/Kabupaten/Kota terkait dengan perusahaan yang menerapkan Gerakan Pekerja Perempuan Sehat Produktif (GP2SP)    Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika  jumlah perusahaan menerapkan GP2SP  meningkat dalam 2 tahun terakhir dan mencapai ≥  200 di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika jumlah perusahaan menerapkan GP2SP  meningkat dalam 2 tahun terakhir namun mencapai < 200 di tahun 2024 atau jumlah perusahaan menerapkan GP2SP  menurun dalam 2 tahun terakhir dan mencapai ≥  200 di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah perusahaan menerapkan GP2SP  menurun dalam 2 tahun terakhir dan mencapai < 200 di tahun 2024 atau tidak ada perusahaan menerapkan GP2SP"}] 
      },
      { 
        id: 't5-i9', 
        question: "Jumlah kasus pencemaran lingkungan akibat industri dalam setahun terakhir", 
        definisiOperasional: "Jumlah kasus pencemaran lingkungan akibat industri adalah jumlah kasus pencemaran lingkungan yang diakibatkan oleh aktivitas industri.   Pencemaran Lingkungan adalah masuk atau dimasukkannya makhluk hidup, zat, energi, clan/atau komponen lain ke dalam Lingkungan Hidup oleh kegiatan manusia sehingga melampaui baku muttr Lingkungan Hidup yang telah ditetapkan. (sumber : PP Nomor 22 Tahun 2021)", 
        sumberData: "Perangkat daerah yang membidangi  urusan lingkungan hidup/ perindustrian/ kesehatan", 
        buktiDukung: "Laporan perangkat daerah yang membidangi lingkungan hidup dilengkapi dengan data rekapitulasi data kasus pencemaran lingkungan akibat industri. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika jumlah kasus pencemaran lingkungan akibat industri menurun"},{"nilai":50,"deskripsi":"Nilai 50 jika jumlah kasus pencemaran lingkungan akibat industri tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah kasus pencemaran lingkungan akibat industri meningkat"}] 
      },
      { 
        id: 't5-i10', 
        question: "Persentase perusahaan menyampaikan laporan Rencana Pengelolaan Lingkungan (RKL)/ Rencana Pemantauan Lingkungan (RPL) / Upaya Pengelolaan Lingkungan (UKL)/ Upaya Pemantauan Lingkungan (UPL)  secara berkala 6 bulan sekali", 
        definisiOperasional: "Jumlah perusahaan yang menyampaikan laporan Rencana Pengelolaan Lingkungan (RKL)/ Rencana Pemantauan Lingkungan (RPL)/Upaya Pengelolaan Lingkungan (UKL)/ Upaya Pemantauan Lingkungan (UPL)  secara berkala 6 bulan sekali dibagi jumlah total perusahaan di Kab/Kota dikali 100%.  Rencana Pengelolaan Lingkungan yang selanjutnya disingkat dengan RKL adalah upaya penanganan dampak terhadap lingkungan hidup yang ditimbulkan akibat dari rencana usaha dan/atau kegiatan    Rencana Pemantauan Lingkungan Hidup yang selanjutnya disingkat dengan RPL adalah upaya pemantauan komponen lingkungan hidup yang terkena dampak akibat dari rencana usaha dan/atau kegiatan  (sumber : Peraturan Menteri LHK Nomor 15 Tahun 202 dan Peraturan Menteri Perindustrian Nomor 1 Tahun 2020)", 
        sumberData: "Perangkat daerah yang membidangi  urusan lingkungan hidup", 
        buktiDukung: "Laporan perangkat daerah yang membidangi lingkungan hidup dilengkapi dengan data jumlah perusahaan yang wajib membuat RKL - RPL, dan jumlah perusahaan yang melaporkan RKL-RPL, UKL-UPL setiap 6 bulan sekali. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika presentase laporan perusahaan terkait RKL-RPL/UKL-UPL  meningkat dalam 2 tahun terakhir dan mencapai ≥ 80 % di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika  presentase laporan perusahaan terkait RKL-RPL/UKL-UPL meningkat dalam 2 tahun terakhir namun < 80 % di tahun 2024 atau presentase laporan perusahaan terkait RKL-RPL/UKL-UPL  menurun dalam 2 tahun terakhir dan mencapai ≥ 80 % di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika presentase laporan perusahaan terkait RKL-RPL/UKL-UPL menurun dalam 2 tahun terakhir dan < 80 % di tahun 2024 atau tidak ada perusahaan menyampaikan laporan terkait RKL-RPL/UKL-UPL"}] 
      },
      { 
        id: 't5-i11', 
        question: "Persentase usaha mikro sektor makanan, minuman, industri pengolahan yang memiliki Sertifikat PIRT, MD BPOM/ Izin Edar", 
        definisiOperasional: "Persentase usaha mikro sektor makanan, minuman, industri pengolahan yang memiliki Sertifikat PIRT, MD BPOM/ Izin Edar adalah jumlah usaha mikro sektor makanan, minuman, industri pengolahan yang memiliki Sertifikat PIRT, MD BPOM/ Izin Edar dibagi jumlah total usaha mikro sektor makanan, minuman, industri pengolahan dikali 100%.  Pemerintah Daerah membantu mengurus  dokumen legalitas bagi pelaku UMKM sektor makanan, minuman, industri pengolahan yang memiliki Sertifikat Produksi Pangan Industri Rumah Tangga (SPP-PIRT), MD BPOM/Izin Edar   04102023: Jumlah produk UMKM (makanan dan minuman kemasan) yang sudah dilakukan sertifikasi", 
        sumberData: "Perangkat daerah yang membidangi  urusan UMKM/ kesehatan/ perizinan", 
        buktiDukung: "Laporan perangkat daerah yang membidangi PIRT, MD BPOM/Izin Edar dilengkapi dengan rekap data jumlah usaha mikro sektor makanan, minuman, industri pengolahan dan data usaha mikro sektor makanan, minuman, industri pengolahan yang tersertifikakasi PIRT, MD, dan izin edar. Laporan diivalidasi oleh Kepala OPD terkait", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase usaha mikro sektor makanan, minuman, industri pengolahan yang memiliki Sertifikat PIRT, MD BPOM/Izin Edar meningkat dalam 2 tahun terakhir dan mencapai ≥ 80 % di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika  persentase usaha mikro sektor makanan, minuman, industri pengolahan yang memiliki Sertifikat PIRT, MD BPOM/Izin Edar meningkat dalam 2 tahun terakhir namun < 80 % di tahun 2024 atau persentase usaha mikro sektor makanan, minuman, industri pengolahan yang memiliki Sertifikat PIRT, MD BPOM/Izin Edar menurun dalam 2 tahun terakhir namun masih  ≥ 80 % di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika  persentase usaha mikro sektor makanan, minuman, industri pengolahan yang memiliki Sertifikat PIRT, MD BPOM/Izin Edar menurun dalam 2 tahun terakhir dan mencapai < 80 % di tahun 2024 atau tidak ada usaha mikro sektor makanan, minuman, industri  yang memiliki Sertifikat PIRT, MD BPOM/Izin Edar"}] 
      }
    ]
  },
  {
    id: 'tatanan-6',
    name: "Pariwisata",
    indicators: [
      { 
        id: 't6-i1', 
        question: "Keberadaan regulasi daerah tentang Pariwisata Sehat", 
        definisiOperasional: "Pemerintah daerah menyusun Regulasi terkait Penyelenggaraan Kepariwisataan dalam bentuk Peraturan Daerah, dimana di dalam pasal terdapat substansi yang berupa: pembangunan dan penguatan kepariwisataan ; Destinasi, SDM, dan industri pariwisata yang bertatanan pariwisata sehat, CHSE, berkelanjutan dan ramah wisatawan; sapta pesona;", 
        sumberData: "Perangkat daerah yang membidangi urusan pariwisata dan/atau Bappeda", 
        buktiDukung: "Dokumen Peraturan Daerah (tentang penyelenggaraan Kepariwisataan), Perwali/Perbup. Jika regulasi ditetapkan sebelum 2023 maka wajib disertai dengan laporan penerapannya yang divalidasi oleh Kepala OPD terkait. Jika masih dalam proses penyusunan regulasi maka dilengkapi dengan rancangan regulasi dan penjelasan proses penyusunannya.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika dituangkan dalam Peraturan Daerah"},{"nilai":75,"deskripsi":"Nilai 75 jika dituangkan dalam Peraturan Kepala Daerah (Perwali/ Perbup) atau sedang dalam proses penyusunan Raperda"},{"nilai":50,"deskripsi":"Nilai 50 jika dituangkan dalam Peraturan lainnya"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada regulasi"}] 
      },
      { 
        id: 't6-i2', 
        question: "Rencana Induk Pembangunan Pariwisata Daerah (RIPPARDA) masuk dalam dokumen perencanaan daerah (RPJMD/Renstra/RKPD)", 
        definisiOperasional: "Rencana induk kepariwisataan nasional menjadi acuan bagi pemerintah daerah untuk menyusun Rencana Induk Kepariwisataan Daerah Berdasarkan Pasal 5 Peraturan Pemerintah Nomor 50 Tahun 2011 tentang Rencana Induk Pembangunan Kepariwisataan Nasional Tahun 2010-2025, Pemerintah Daerah mensinergikan penyusunan Rencana Induk Pembangunan Kepariwisataan Provinsi dan Kabupaten/Kota;  Rencana Induk Pembangunan Pariwisata Daerah yang selanjutnya disingkat RIPPARDA adalah rumusan pokok-pokok perencanaan, kebijakan, strategi yang didalamnya mencakup, industri, destinasi, pemasaran dan kelembagaan di bidang Pariwisata.", 
        sumberData: "Perangkat daerah yang membidangi urusan pariwisata dan/atau Bappeda", 
        buktiDukung: "Dokumen Rencana Induk Pembangunan Kepariwisataan Provinsi dan Kabupaten/Kota meliputi: a. landasan pembangunan kepariwisataan; b. muatan materi Rencana Induk Pembangunan Kepariwisataan Provinsi (RIPPAR-PROV) dan Rencana Induk Pembangunan Kepariwisataan Kabupaten/Kota (RIPPAR-KAB/KOTA).  Jika RIPPARDA telah disusun sebelum 2023 maka wajib menyertakan laporan pelaksanaannya yang divalidasi oleh Kepala OPD terkait. Jika masih dalam proses penyusunan RIPPARDA maka dilengkapi dengan rancangan RIPPARDA dan penjelasan proses penyusunannya yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada Rencana Induk Pembangunan Pariwisata Daerah (RIPPARDA) dan masuk dalam dokumen perencanaan daerah"},{"nilai":75,"deskripsi":"Nilai 75 jika ada Rencana Induk Pembangunan Pariwisata Daerah (RIPPARDA) tetapi belum masuk dalam dokumen perencanaan daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika sedang dalam proses penyusunan Rencana Induk Pembangunan Pariwisata Daerah (RIPPARDA)"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada  Rencana Induk Pembangunan Pariwisata Daerah (RIPPARDA)"}] 
      },
      { 
        id: 't6-i3', 
        question: "Persentase sarana akomodasi yang memiliki Sertifikat Laik Sehat (SLS)", 
        definisiOperasional: "SLS Akomodasi mencakup Hotel Bintang, Apartemen Hotel Service, Hotel Melati, Villa, Pondok Wisata, Bumi Perkemahan, Persinggahan karavan dan taman caravan, Penyediaan Akomodasi Lainnya (Asrama sekolah, kos dll) Penyediaan Akomodasi Jangka Pendek Lainnya (Bungalow Guest House, Cottage dan motel dll), Penginapan Remaja (Youth Hotel) (Permenkes No 14 Tahun 2021)   Sertifikat Laik Sehat (SLS) Akomodasi adalah bukti tertulis pemenuhan standar baku mutu kesehatan lingkungan dan peryaratan kesehatan melalui inspeksi kesehatan lingkungan  Akomodasi yang laik sehat adalah sarana akomodasi yang memiliki sertifikat laik sehat", 
        sumberData: "Perangkat daerah yang membidangi urusan penanaman modal, pelayanan perizinan berusaha, dan/atau kesehatan", 
        buktiDukung: "Laporan rekapitulasi sarana akomodasi pariwisata yang sudah memiliki sertifikat laik sehat (SLS) berasal dari perangkat daerah yang membidangi OSS baik DPMPTSP dan Dinas Kesehatan yaitu seluruh sarana akomodasi yang berada di lokasi Daya Tarik Wisata (DTW) yang memiliki SLS dibagi jumlah sarana akomdasi yang berada di lokasi Daya Tarik Wisata dikali 100%.  Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase daya tarik wisata yang sudah memiliki sertifikat laik sehat (SLS) dan meningkat dalam 2 tahun"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase  daya tarik wisata pariwisata yang sudah memiliki sertifikat laik sehat (SLS) dan tetap dalam 2 tahun"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase  daya tarik wisata pariwisata yang sudah memiliki sertifikat laik sehat (SLS) menurun atau 0 dalam 2 tahun"}] 
      },
      { 
        id: 't6-i4', 
        question: "Persentase Daya Tarik Wisata yang memiliki Sertifikat Laik Sehat (SLS)", 
        definisiOperasional: "Jumlah Daya Tarik Wisata (DTW) yang memiliki SLS dibagi jumlah keseluruhan Daya Tarik Wisata dikali 100%.   Berdasarkan Undang-undang Republik Indonesia Nomor 10 Tahun 2009 tentang kepariwisataan bahwa Daya Tarik Wisata bisa dijelaskan sebagai segala sesuatu yang mempunyai keunikan, kemudahan, dan nilai yang berwujud keanekaragaman, kekayaan alam, budaya, dan hasil buatan manusia yang menjadi sasaran atau kunjungan para wisatawan Sertifikat Laik Sehat (SLS) adalah bukti tertulis pemenuhan standar baku mutu kesehatan lingkungan dan peryaratan kesehatan melalui inspeksi kesehatan lingkungan  SLS Tempat hiburan mencakup klab malam dan atau diskotek yang utamanya menyediakan makanan dan minuman, klub malam, karaoke dan disktotek  (Permenkes No 14 Tahun 2021)   SLS Tempat Rekreasi mencakup aktivitas Taman Bertema Atau Taman Rekreasi lainnya, Taman Rekreasi, Usaha Arena Permainan, Kawasan Pariwisata, Aktivitas Spa (Sante Par Aqua)  (Permenkes No 14 Tahun 2021)   SLS Tempat Olahraga mencakup  Fasilitas Gelanggang/Arena (Renang, Bowling), Fasilitas Lapangan (Golf, Bulu Tangkis dan Tennis), Pemandian Alam  (Permenkes No 14 Tahun 2021)", 
        sumberData: "Perangkat daerah yang membidangi urusan penanaman modal dan/atau kesehatan", 
        buktiDukung: "Laporan capaian DTW yang sudah memiliki sertifikat laik sehat (SLS) pada tahun 2023 dan 2024 (memuat informasi jumlah keseluruhan DTW dan DTW yang sudah memiliki SLS). Laporan divalidasi oleh Kepala OPD terkait serta dilengkapi dengan rekapitulasi DTW yang sudah memiliki SLS dan lampiran beberapa contoh SLS yang diterbitkan.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase daya tarik wisata yang sudah memiliki sertifikat laik sehat (SLS) dan meningkat dalam 2 tahun"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase  daya tarik wisata pariwisata yang sudah memiliki sertifikat laik sehat (SLS) dan tetap dalam 2 tahun"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase  daya tarik wisata pariwisata yang sudah memiliki sertifikat laik sehat (SLS) dan menurun dalam 2 tahun"}] 
      },
      { 
        id: 't6-i5', 
        question: "Persentase Tempat Pengolahan Pangan (TPP) Siap Saji yang memiliki Sertifikat Laik Hygiene Sanitasi (SLHS)", 
        definisiOperasional: "Jumlah TPP yang Wajib SLHS: 1. Jasa boga golongan A/B/C 2. Katering  3. Restoran 4. Depot Air Minum 5. TPP Tertentu  (Permenkes No 14 tahun 2021)  yang memiliki SLHS yang masih berlaku minimal hingga tahun 2024 dibagi jumlah seluruh TPP yang Wajib SLHS yang sudah memenuhi syarat pada hasil IKLnya dikali 100%.", 
        sumberData: "Perangkat daerah yang membidangi urusan penanaman modal dan/atau kesehatan", 
        buktiDukung: "Laporan capaian TPP yang Wajib SHLS yang sudah memiliki sertifikat laik sehat (SLHS) dan masih berlaku hingga minimal tahun 2024 pada tahun 2023 dan 2024 (memuat informasi jumlah keseluruhan TPP yang Wajib SHLS dan TPP yang Wajib SHLS yang sudah memiliki SLHS). Laporan divalidasi oleh Kepala OPD terkait serta dilengkapi dengan rekapitulasi TPP yang Wajib SLHS yang sudah memiliki SLHS dan lampiran beberapa contoh SLHS yang diterbitkan. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase TPP yang Wajib SLSH memiliki SLHS meningkat dalam 2 tahun"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase TPP yang Wajib SLSH memiliki SLHS tetap dalam 2 tahun"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase TPP yang Wajib SLSH memiliki SLHS menurun atau 0 dalam 2 tahun"}] 
      },
      { 
        id: 't6-i6', 
        question: "Keberadaan Daya Tarik Wisata (DTW) yang menyediakan fasilitas pelayanan kesehatan atau bekerja sama dengan fasilitas pelayanan kesehatan terdekat", 
        definisiOperasional: "PP. 50 2011 Pasal 25, destinasi mempunyai fasilitas: fasilitas umum diantaranya : fasilitas kesehatan berupa poliklinik 24 (dua puluh empat) jam dan fasilitas  pertolongan pertama pada kecelakaan; dan lain-lain", 
        sumberData: "Perangkat daerah yang membidangi urusan pariwisata dan/atau kesehatan", 
        buktiDukung: "Laporan keberadaan DTW yang menyediakan fasilitas pelayanan kesehatan atau bekerja sama dengan Fasyankes terdekat yang setidaknya memuat informasi tentang: a. jumlah seluruh DTW;  b. jumlah DTW yang menyediakan fasilitas pelayanan kesehatan atau bekerja sama dengan Fasyankes terdekat; c. rekap data DTW yang menyediakan fasilitas pelayanan kesehatan atau bekerja sama dengan Fasyankes  terdekat; d. lampiran dokumentasi Fasyankes di DTW atau dokumen kerja sama DTW dengan Fasyankes. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika seluruh DTW menyediakan fasilitas pelayanan kesehatan"},{"nilai":50,"deskripsi":"Nilai 50 jika sebagian DTW menyediakan fasilitas pelayanan kesehatan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada DTW yang menyediakan fasilitas pelayanan kesehatan"}] 
      },
      { 
        id: 't6-i7', 
        question: "Persentase Daya Tarik Wisata (DTW) yang menerapkan pariwisata inklusif", 
        definisiOperasional: "Pariwisata Inklusif merupakan pengembangan pariwisata yang mampu menjangkau dan memberikan kesempatan yang sama bagi setiap orang, termasuk penyandang disabilitas dalam menikmati kegiatan wisata.  Jumlah Daya Tarik Wisata (DTW) yang memiliki  fasilitas khusus bagi penyandang disabilitas, anak-anak, dan lanjut usia dibagi jumlah seluruh DTW di kabupaten/kota dikali 100%.", 
        sumberData: "Perangkat daerah yang membidangi urusan pariwisata dan/atau kesehatan", 
        buktiDukung: "Laporan DTW yang menerapkan pariwisata inklusif pada tahun 2023 dan 2024 yang setidaknya memuat informasi tentang: a. jumlah seluruh DTW;  b. jumlah DTW yang menerapkan pariwisata inklusif ; c. rekap data DTW yang menerapkan pariwisata inklusif ; d. lampiran dokumentasi DTW yang menerapkan pariwisata inklusif . Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase Daya Tarik Wisata (DTW) yang menerapkan pariwisata inklusif meningkat dalam 2 tahun terakhir dan mencapai ≥ 75 % pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase Daya Tarik Wisata (DTW) yang menerapkan pariwisata inklusif  menurun dalam 2 tahun terakhir namun masih  ≥ 75 % pada tahun 2024 atau capaian persentase Daya Tarik Wisata (DTW) yang menerapkan pariwisata inklusif  meningkat dalam 2 tahun terakhir namun < 75 % pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase Daya Tarik Wisata (DTW) yang menerapkan pariwisata inklusif  menurun dalam 2 tahun terakhir dan < 75 % pada tahun 2024"}] 
      },
      { 
        id: 't6-i8', 
        question: "Daya Tarik Wisata (DTW) menyediakan asuransi keselamatan bagi wisatawan", 
        definisiOperasional: "Jumlah Daya Tarik Wisata (DTW) menyediakan asuransi keselamatan bagi wisatawan   Pasal 26 UU Cipta kerja, butir d dan e, menyebut bahwa  d. memberikan kenyamanan, keramahan, pelindungan keamanan, dan keselamatan wisatawan; e. memberikan pelindungan asuransi pada usaha pariwisata dengan kegiatan yang berisiko tinggi;", 
        sumberData: "Perangkat daerah yang membidangi urusan penanaman modal dan/atau kesehatan", 
        buktiDukung: "Laporan keberadaan DTW yang menyediakan asuransi keselamatan bagi wisatawan setidaknya memuat informasi tentang: a. jumlah seluruh DTW;  b. jumlah DTW yang menyediakan asuransi keselamatan bagi wisatawan; c. rekap data DTW yang menyediakan asuransi keselamatan bagi wisatawan. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika seluruh DTW menyediakan asuransi bagi wisatawan"},{"nilai":50,"deskripsi":"Nilai 50 jika sebagian DTW menyediakan asuransi"},{"nilai":0,"deskripsi":"Nilai 0 jika DTW tidak menyediakan asuransi"}] 
      },
      { 
        id: 't6-i9', 
        question: "Tersedianya Daya Tarik Wisata (DTW) yang kondusif", 
        definisiOperasional: "Tersedianya Daya Tarik Wisata (DTW)  yang memiliki kerja sama antara pengelola Daya Tarik Wisata (DTW) dengan pemangku kepentingan (stakeholder terkait) antara lain : Bhabinkamtibmas/Obvit (POLRI), Babinsa (TNI), atau satuan pengamanan/ kelompok masyarakat", 
        sumberData: "Perangkat daerah yang membidangi urusan pariwsata berkoordinasi dengan pengelola Daya Tarik Wisata (DTW)", 
        buktiDukung: "Laporan keberadaan DTW yang kondusif setidaknya memuat informasi tentang: a. jumlah seluruh DTW;  b. jumlah DTW yang kondusif ; c. rekap data DTW yang kondusif; d. lampiran dokumen kerja sama DTW dengan stakeholder terkait. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika seluruh DTW memiliki kerja sama dengan pemangku kepentingan (stakeholder terkait)"},{"nilai":50,"deskripsi":"Nilai 50 jika sebagian DTW memiliki kerja sama dengan pemangku kepentingan (stakeholder terkait)"},{"nilai":0,"deskripsi":"Nilai 0 jika DTW tidak memiliki kerja sama dengan pemangku kepentingan (stakeholder terkait)"}] 
      },
      { 
        id: 't6-i10', 
        question: "Kabupaten/Kota memiliki Desa/Kampung Wisata", 
        definisiOperasional: "Desa wisata (Kampung, Nagari, Gampong, atau sebutan lainnya) adalah kawasan yang memiliki potensi dan keunikan daya tarik wisata yang khas yaitu merasakan pengalaman keunikan kehidupan dan tradisi masyarakat di perdesaan dengan segala potensinya.", 
        sumberData: "Perangkat daerah yang membidangi urusan pariwsata", 
        buktiDukung: "Laporan keberadaan  Desa/Kampung Wisata setidaknya memuat informasi tentang: a. jumlah Desa/Kampung Wisata; b. rekap data  Desa/Kampung Wisata; d. lampiran SK pembentukan Desa/Kampung Wisata.  Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika kabupaten/kota memiliki Desa/Kampung Wisata dan sudah di SK oleh Kepala Daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika kabupaten/kota memiliki Desa/Kampung Wisata namun belum di SK oleh Kepala Daerah"},{"nilai":0,"deskripsi":"Nilai 0 jika kabupaten/kota tidak memiliki Desa/kampung Wisata"}] 
      },
      { 
        id: 't6-i11', 
        question: "Terdapat Kelompok Sadar Wisata (Pokdarwis) di setiap Desa/Kampung Wisata", 
        definisiOperasional: "Setiap Desa/Kampung Wisata memliki Kelompok Sadar Wisata (Pokdarwis) yang dibuktikan dengan keberadaan SK, rencana kerja, laporan dan implementasi inovasi yang teraplikasi.  Ada : SK  berfungsi : rencana kerja dan laporan berkelanjutan :   implementasi inovasi yang teraplikasi Kampung Wisata : di Kota, SK ditetapkan oleh Lurah 5000 Desa wisata (jejaring desa wisata)", 
        sumberData: "Perangkat daerah yang membidangi urusan pariwsata", 
        buktiDukung: "Laporan perangkat daerah yang membidangi kepariwisataan berupa rekap data pokdarwis. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika semua Desa/Kampung Wisata memiliki Pokdarwis, berfungsi dan berkelanjutan"},{"nilai":50,"deskripsi":"Nilai 50 jika semua Desa/Kampung Wisata memiliki Pokdarwis dan berfungsi"},{"nilai":0,"deskripsi":"Nilai 0 jika semua Desa/Kampung Wisata tidak memiliki Pokdarwis"}] 
      },
      { 
        id: 't6-i12', 
        question: "Persentase Daya Tarik Wisata (DTW) yang memiliki upaya pengelolaan sampah secara mandiri", 
        definisiOperasional: "Jumlah Daya Tarik Wisata yang memiliki Unit Pengelolaan Sampah berupa bank sampah, TPS 3R, Unit Pengelolaan Sampah dibagi jumlah seluruh DTW dikali 100%.  Pengelolaan sampah adalah kegiatan yang sistematis, menyeluruh, dan berkesinambungan yang meliputi pengurangan dan penanganan sampah.", 
        sumberData: "Perangkat daerah yang membidangi urusan pariwsata, kebersihan, lingkungan hidup, dan/atau SIPSN (Sistem Informasi Pengelolaan Sampah Nasiional)", 
        buktiDukung: "Laporan upaya pengelolaan sampah secara mandiri oleh DTW. Laporan divalidasi oleh Kepala OPD terkait dan dilampirkan dokumentasi kegiatan pengelolaan sampah mandiri di DTW.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki upaya pengelolaan sampah secara mandiri dan meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika memiliki upaya pengelolaan sampah secara mandiri dan tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika memiliki upaya pengelolaan sampah secara mandiri dan menurun"}] 
      }
    ]
  },
  {
    id: 'tatanan-7',
    name: "Lalu Lintas",
    indicators: [
      { 
        id: 't7-i1', 
        question: "Adanya regulasi terkait penyediaan layanan transportasi jalan, kawasan tertib lalu lintas, sistem manajemen keselamatan lalu lintas dan angkutan jalan", 
        definisiOperasional: "Regulasi terkait penyediaan layanan transportasi jalan, kawasan tertib lalu lintas, sistem manajemen keselamatan lalu lintas dan angkutan jalan yang terbagi sesuai dengan kewenangan daerah. Berdasarkan UU No. 23 Tahun 2014 dan UU No. 22 Tahun 2009, pembagian kewenangan pembinaan antara pemerintah pusat dan daerah, dimaksudkan agar tugas dan tanggung jawab setiap pembina bidang Lalu Lintas dan Angkutan Jalan terlihat lebih jelas dan transparan sehingga penyelenggaraan Lalu Lintas dan Angkutan Jalan dapat terlaksana dengan selamat, aman, tertib, lancar, dan efisien, serta dapat dipertanggungjawabkan.", 
        sumberData: "Perangkat daerah yang membidangi urusan perhubungan", 
        buktiDukung: "Dokumen Perda/ Perbub/ Perwali tentang transportasi yang didalamnya setidaknya mengakomodir salah satu diantaranya tentang penyelenggaraan transportasi lalu lintas dan angkutan jalan.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki dokumen regulasi terkait penyediaan layanan transportasi jalan kawasan tertib lalu lintas, sistem manajemen keselamatan lalu lintas dan angkutan jalan dan lainnya yang masih berlaku"},{"nilai":50,"deskripsi":"Nilai 50 jika memiliki dokumen regulasi terkait penyediaan layanan transportasi jalan kawasan tertib lalu lintas, sistem manajemen keselamatan lalu lintas dan angkutan jalan dan lainnya namun masih belum disahkan/ proses draft/ masa berlaku habis"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak memiliki dokumen regulasi terkait penyediaan layanan transportasi jalan kawasan tertib lalu lintas, sistem manajemen keselamatan lalu lintas dan angkutan jalan dan lainnya"}] 
      },
      { 
        id: 't7-i2', 
        question: "Persentase kendaraan umum yang laik jalan, minimal ≥ 80%", 
        definisiOperasional: "Jumlah kendaraan yang laik jalan masuk dalam sistem keselamatan jalan dibagi dengan jumlah total kendaraan yang masuk dikali 100%.  Sistem Manajemen Keselamatan Perusahaan Angkutan Umum adalah bagian dari manajemen perusahaan yang berupa suatu tata kelola keselamatan yang dilakukan oleh Perusahaan Angkutan Umum secara komprehensif dan terkoordinasi dalam rangka mewujudkan keselamatan dan mengelola risiko kecelakaan. (sumber : Peraturan Menteri Perhubungan Nomor 85 Tahun 2018)", 
        sumberData: "Perangkat daerah yang membidangi urusan perhubungan", 
        buktiDukung: "Laporan capaian persentase kendaraan umum yang laik jalan pada tahun 2023 dan 2024 yang dilengkapi dengan data jumlah kendaraan umum dan jumlah kendaraan umum yang laik jalan. Laporan divalidasi oleh kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase kendaraan umum yang laik jalan meningkat dalam 2 tahun terakhir dan  ≥ 80% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase kendaraan umum yang laik jalan menurun dalam 2 tahun terakhir namun masih ≥ 80% pada tahun 2024 atau persentase kendaraan umum yang laik jalan meningkat dalam 2 tahun terakhir namun < 80% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase kendaraan umum yang laik jalan menurun dalam 2 tahun terakhir dan < 80% pada tahun 2024"}] 
      },
      { 
        id: 't7-i3', 
        question: "Persentase penurunan tingkat fatalitas akibat kecelakaan dalam tahun berjalan ≤ 65%", 
        definisiOperasional: "Persentase penurunan tingkat fatalitas akibat kecelakaan adalah jumlah korban meninggal dunia akibat kecelakaan jalan dibagi jumlah kejadian kecelakaaan pada tahun berjalan dikali 100.", 
        sumberData: "Perangkat daerah yang membidangi urusan perhubungan atau lalu lintas", 
        buktiDukung: "Laporan capaian persentase penurunan tingkat fatalitas akibat kecelakaan pada tahun 2023 dan 2024 yang divalidasi oleh kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase penurunan tingkat fatalitas akibat kecelakaan menurun dalam 2 tahun terakhir dan ≤ 65% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase penurunan tingkat fatalitas akibat kecelakaan meningkat dalam 2 tahun terakhir namun masih ≤ 65% pada tahun 2024 atau persentase penurunan tingkat fatalitas akibat kecelakaan menurun dalam 2 tahun terakhir namun > 65% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika  capaian persentase penurunan tingkat fatalitas akibat kecelakaan meningkat dalam 2 tahun terakhir dan < 65% pada tahun 2024"}] 
      },
      { 
        id: 't7-i4', 
        question: "Adanya sistem layanan pertolongan kecelakaan yang cepat dan terintegrasi kesiapsiagaan dalam penanganan korban kecelakaan", 
        definisiOperasional: "Sistem aplikasi layanan dalam penanganan korban kecelakaan secara online yang terintegrasi antara satuan perangkat pemerintah yang memiliki tanggung jawab dalam penanganan kecelakaan (misal dinas kesehatan dalam menyediakan ambulance dan pertolongan pertama, dinas perhubungan dalam pengaturan lalu lintas dan lain-lain) dan tersosialisasi di masyarakat serta dapat diakses oleh masyarakat. Sebagai contoh layanan pengaduan kecelakaan.", 
        sumberData: "Perangkat daerah yang membidangi  urusan perhubungan/ komunikasi & informasi/ kesehatan/ Satlantas", 
        buktiDukung: "Dokumen kerja sama/ MoU/ Berita Acara sistem aplikasi layanan dalam penanganan korban kecelakaan yang dilengkapi dengan tangkapan layar (screen shot) aplikasi tersebut yang divalidasi oleh kepala OPD.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki sistem layanan dalam penanganan korban kecelakaan"},{"nilai":50,"deskripsi":"Nilai 50 jika memiliki sistem layanan dalam penanganan korban kecelakaan"},{"nilai":25,"deskripsi":"Nilai 25 jika memiliki sistem layanan dalam penanganan korban kecelakaan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak memiliki sistem layanan dalam penanganan korban kecelakaan"}] 
      },
      { 
        id: 't7-i5', 
        question: "Adanya program pemeriksaan NAPZA atau narkoba terhadap pengemudi", 
        definisiOperasional: "Program pemeriksaan NAPZA atau narkoba terhadap pengemudi adalah program atau kegiatan yang melibatkan partisipasi pengemudi transportasi dan bertujuan untuk melakukan tindakan upaya pencegahan bahaya NAPZA/ narkoba..  Program pemeriksaan NAPZA atau narkoba terhadap pengemudi melalui pelaksanaan Pencegahan dan Pemberantasan Penyalahgunaan dan Peredaran Gelap Narkotika (P4GN). Kegiatan P4GN dilaksanakan melalui kegiatan : a. sosialisasi b. advokasi c. operasi rutin d. operasi khusus e. operasi kontijensi (sumber : Peraturan Menteri Perhubungan Nomor 17 Tahun 2012 tentang Standar Operasional P4GN dan Psikotropika di Sektor Transportasi)", 
        sumberData: "Perangkat daerah yang membidangi urusan perhubungan", 
        buktiDukung: "Laporan kegiatan pemeriksaan NAPZA atau narkoba terhadap pengemudi pada tahun berjalan yang divalidasi oleh kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika adanya program pemeriksaan NAPZA atau narkoba terhadap pengemudi, melampirkan dokumen laporannya dan dilakukan secara berkala"},{"nilai":75,"deskripsi":"Nilai 75 jika adanya program pemeriksaan NAPZA atau narkoba terhadap pengemudi, melampirkan dokumen laporannya namun tidak dilakukan secara berkala"},{"nilai":50,"deskripsi":"Nilai 50 jika adanya program pemeriksaan NAPZA atau narkoba terhadap pengemudi namun tidak melampirkan dokumen laporannya"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada program pemeriksaan NAPZA atau narkoba terhadap pengemudi"}] 
      },
      { 
        id: 't7-i6', 
        question: "Terminal yang memenuhi syarat kesehatan", 
        definisiOperasional: "Terminal yang dilakukan Inspeksi Kesehatan Lingkungan (IKL) dan hasilnya memenuhi syarat.  Terminal sasaran adalah semua terminal (Tipe A, Tipe B, Tipe C) yang berada dalam wilayah kabupaten/kota.  Inspeksi Kesehatan Lingkungan adalah kegiatan pemeriksaan dan pengamatan secara langsung terhadap media lingkungan dalam rangka pengawasan berdasarkan standar, norma, dan baku mutu yang berlaku untuk meningkatkan kualitas lingkungan yang sehat. (sumber : Permenkes 13 tahun 2015).", 
        sumberData: "Dinas Kesehatan", 
        buktiDukung: "Laporan hasil IKL pada semua tipe terminal yang dilakukan selama tahun 2023 dan 2024 dilengkapi dengan dokumentasi. Laporan divalidasi oleh kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika semua tipe terminal dilakukan IKL dan hasilnya semua memenuhi syarat"},{"nilai":75,"deskripsi":"Nilai 75 jika semua tipe terminal dilakukan IKL dan hasilnya  ≥ 80% memenuhi syarat"},{"nilai":50,"deskripsi":"Nilai 50 jika hanya 50% dari semua tipe terminal terminal dilakukan IKL"},{"nilai":0,"deskripsi":"Nilai 0 jika semua tipe terminal tidak dilakukan IKL"}] 
      },
      { 
        id: 't7-i7', 
        question: "Persentase angkutan umum yang memiliki BLUe (Bukti Lulus Uji Elektronik)", 
        definisiOperasional: "Jumlah angkutan umum yang telah dilakukan uji berkala dibuktikan dengan bukti lulus uji elektronik (BLUe) dibagi jumlah total angkutan umum dikali 100%.  Uji Berkala adalah pengujian Kendaraan Bermotor yang dilakukan secara berkala terhadap setiap Kendaraan Bermotor, kereta gandengan, dan kereta tempelan, yang dioperasikan di jalan. (sumber : Peraturan Menteri Perhubungan Nomor 19 Tahun 2021)", 
        sumberData: "Perangkat daerah yang membidangi urusan perhubungan", 
        buktiDukung: "Laporan rekapitulasi persentase angkutan umum yang memiliki BLUe (Bukti Lulus Uji Elektronik) tahun 2023 dan 2024 yang divalidasi oleh kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase angkutan umum yang memiliki BLUe (Bukti Lulus Uji Elektronik)  meningkat dalam 2 tahun terakhir dan  ≥ 80% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50jika capaian persentase angkutan umum yang memiliki BLUe (Bukti Lulus Uji Elektronik)  menurun dalam 2 tahun terakhir namun masih ≥ 80% pada tahun 2024 atau persentase angkutan umum yang memiliki BLUe (Bukti Lulus Uji Elektronik) meningkat dalam 2 tahun terakhir namun < 80% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase angkutan umum yang memiliki BLUe (Bukti Lulus Uji Elektronik)  menurun dalam 2 tahun terakhir dan < 80% pada tahun 2024"}] 
      },
      { 
        id: 't7-i8', 
        question: "Keberadaan fasilitas jalur pejalan kaki (trotoar) bagi masyarakat umum dan penyandang disabilitas", 
        definisiOperasional: "Fasilitas jalur pejalan kaki (trotoar) bagi masyarakat umum dan penyandang disabilitas terdiri dari sarana dan prasarana yang tertuang pada Peraturan Menteri Perhubungan Nomor 98 Tahun 2017 tentang Penyediaan Aksesibiltas pada Pelayanan Jasa Transportasi Publik Bagi Pengguna Jasa Berkebutuhan Khusus.", 
        sumberData: "Perangkat daerah yang membidangi urusan perhubungan dan/atau PUPR", 
        buktiDukung: "Laporan dan dokumentasi fasilitas jalur pejalan kaki (trotoar) bagi masyarakat umum dan penyandang disabilitas yang divalidasi oleh kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki  fasilitas jalur pejalan kaki (trotoar) bagi masyarakat umum dan penyandang disabilitas dan semua berfungsi sesuai peruntukannya"},{"nilai":50,"deskripsi":"Nilai 50 jika memiliki  fasilitas jalur pejalan kaki (trotoar) bagi masyarakat umum dan penyandang disabilitas namun tidak semua berfungsi sesuai peruntukannya (rusak)"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak memiliki  fasilitas jalur pejalan kaki (trotoar) bagi masyarakat umum dan penyandang disabilitas"}] 
      },
      { 
        id: 't7-i9', 
        question: "Jumlah titik fasilitas lajur sepeda", 
        definisiOperasional: "Lajur Sepeda adalah bagian Jalur yang memanjang, dengan atau tanpa marka Jalan, yang memiliki lebar cukup untuk dilewati satu sepeda, selain sepeda motor.  Fasilitas pendukung untuk Sepeda berupa Lajur Sepeda dan/atau Jalur yang disediakan secara khusus untuk pesepeda dan/atau dapat digunakan bersama-sama dengan pejalan kaki.  Lajur Sepeda  dapat berupa : a. berbagi Jalan dengan kendaraan bermotor; b. menggunakan bahu Jalan; c. lajur dan/ atau Jalur khusus yang berada pada\\ badan Jalan; atau d. lajur dan/ atau Jalur khusus terpisah dengan badan Jalan.   Lajur Sepeda  harus memenuhi persyaratan : a. keselamatan; b. kenyamanan dan ruang bebas gerak individu; dan c. kelancaran lalu lintas.  (sumber : Peraturan Menteri Perhubungan Nomor 59 Tahun 2020 tentang Keselamatan Pesepeda di Jalan)", 
        sumberData: "Perangkat daerah yang membidangi urusan perhubungan", 
        buktiDukung: "Laporan dan dokumentasi jumlah titik fasilitas jalur sepeda pada tahun 2023 dan 2024 yang divalidasi oleh kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika jumlah titik fasilitas lajur sepeda meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika jumlah titik fasilitas lajur sepeda tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah titik fasilitas lajur sepeda menurun atau tidak memiliki"}] 
      },
      { 
        id: 't7-i10', 
        question: "Adanya Zona Selamat Sekolah (ZoSS)", 
        definisiOperasional: "Zona Selamat Sekolah (ZoSS) merupakan bagian dari kegiatan manajemen dan rekayasa lalu lintas berupa pengendalian lalu lintas dan penggunaan suatu ruas jalan di lingkungan sekolah yang bertujuan untuk mencegah terjadinya kecelakaan guna menjamin keselamatan anak di sekolah.  Manajemen dan Rekayasa Lalu Lintas adalah serangkaian usaha dan kegiatan yang meliputi perencanaan, pengadaan, pemasangan, pengaturan, dan pemeliharaan fasilitas perlengkapan jalan dalam rangka mewujudkan, mendukung dan memelihara keamanan, keselamatan, ketertiban, dan kelancaran lalu lintas. (sumber : Peraturan Menteri Perhubungan Nomor 96 Tahun 2015 dan Peraturan Dirjen Perhubungan Darat Nomor SK.1304/AJ.403/DJPD/2014 Tahun 2014)", 
        sumberData: "Perangkat daerah yang membidangi urusan perhubungan", 
        buktiDukung: "Laporan dan dokumentasi jumlah Zona Selamat Sekolah (ZoSS) yang minimal memuat informasi tentang jumlah dan sebaran lokasi Zona Selamat Sekolah serta waktu pembuatannya pada tahun 2023 dan 2024 dilengkapi dengan dokumentasi foto atau videonya. Laporan divalidasi oleh kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika jumlah Zona Selamat Sekolah (ZoSS) meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika jumlah Zona Selamat Sekolah (ZoSS) tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah Zona Selamat Sekolah (ZoSS) menurun atau tidak memiliki"}] 
      },
      { 
        id: 't7-i11', 
        question: "Pengawasan dan penindakan terhadap emisi gas buang kendaraan", 
        definisiOperasional: "Pengawasan dan penindakan terhadap emisi gas buang kendaraan dilakukan dengan uji emisi kendaraan. Uji Emisi Kendaraan Bermotor yang selanjutnya disebut Uji Emisi adalah serangkaian kegiatan pengujian emisi terhadap Kendaraan Bermotor yang sudah beroperasi.  Baku Mutu Emisi adalah nilai pencemar udara maksimum yang diperbolehkan masuk atau dimasukkan ke dalam udara ambien.  Pelaksanaan uji kendaraan bermotor berdasarkan pada Peraturan Menteri Perhubungan Nomor 23 Tahun 2021 dan Peraturan Menteri Lingkungan Hidup dan Kehutanan Nomor 8 Tahun 2023)", 
        sumberData: "Perangkat daerah yang membidangi urusan perhubungan", 
        buktiDukung: "Laporan dan dokumentasi pengawasan dan penindakan terhadap emisi gas buang kendaraan yang divalidasi oleh kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki bengkel terakreditasi atau yang ditunjuk sesuai peraturan kegiatan pengawasan dan terdokumentasi"},{"nilai":50,"deskripsi":"Nilai 50 jika memiliki bengkel terakreditasi atau yang ditunjuk sesuai peraturan kegiatan pengawasan namun tidak terdokumentasi"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak memiliki bengkel terakreditasi atau yang ditunjuk sesuai peraturan kegiatan pengawasan"}] 
      }
    ]
  },
  {
    id: 'tatanan-8',
    name: "Perlindungan Sosial",
    indicators: [
      { 
        id: 't8-i1', 
        question: "Adanya peraturan mengenai Penyelenggaraan Kesejahteraan Sosial di daerah", 
        definisiOperasional: "Peraturan yang terkait dengan upaya peningkatan kesejahteraan sosial  bagi Pemerlu Pelayanan Kesejahteraan Sosial yang diinisiasi oleh pemerintah daerah dengan pengaturan mencakup tiga (3) manfaat: pensiun, disabilitas, dan kecacatan, dan survivors.", 
        sumberData: "Perangkat daerah yang membidangi urusan sosial, hukum", 
        buktiDukung: "Dokumen Perda/ Perkada/ peraturan lainnya. Jika masih dalam proses penyusunan maka dilengkapi dengan dokumen pendukung yang menunjukkan prosesnya.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada Perda mencakup tiga manfaat : pensiun, disabilitas, dan kecacatan, dan survivors"},{"nilai":75,"deskripsi":"Nilai 75 jika ada Perkada atau peraturan lainnya mencakup tiga manfaat : pensiun, disabilitas, dan kecacatan, dan survivors atau masih dalam proses penyusunan Raperda"},{"nilai":50,"deskripsi":"Nilai 50 jika ada Perda, Perkada atau Peraturan lainnya namun tidak mencakup tiga manfaat : pensiun, disabilitas, dan kecacatan, dan survivors"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada"}] 
      },
      { 
        id: 't8-i2', 
        question: "Monitoring dan evaluasi program jaminan perlindungan sosial yang dilakukan daerah", 
        definisiOperasional: "Kegiatan monitoring dan evaluasi untuk memastikan pelaksanaan program jaminan sosial untuk Keluarga Penerima Manfaat (KPM) yang mencakup bantuan langsung berkelanjutan dan bantuan sosial lainnya. (dasar: UU 11 Tahun 2009 Tentang Kesejahteraan Sosial)", 
        sumberData: "Perangkat daerah yang membidangi urusan sosial dan/atau Tim Koordinasi Penanggulangan Kemiskinan Daerah (TKPKD)", 
        buktiDukung: "Laporan monitoring dan evaluasi tahun 2023 dan 2024 yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika melakukan monitoring dan evaluasi secara lengkap dan baik"},{"nilai":50,"deskripsi":"Nilai 50 jika melakukan monitoring dan evaluasi dengan beberapa catatan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak melakukan monitoring dan evaluasi"}] 
      },
      { 
        id: 't8-i3', 
        question: "Angka Kriminalitas", 
        definisiOperasional: "Angka kriminalitas merupakan agregat semua jenis kejahatan yang terjadi dalam satu waktu tanpa mempertimbangkan tingkat keseriusannya.", 
        sumberData: "Perangkat daerah yang membidangi urusan kriminalitas, BPS Kabupaten/Kota", 
        buktiDukung: "Laporan angka kriminalitas tahun 2023 dan 2024 (atau waktu yang ditetapkan sebagai periode survei dalam 2 kali survei berturut-turut) yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika angka kriminalitas menurun"},{"nilai":50,"deskripsi":"Nilai 50 jika angka kriminalitas tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika angka kriminalitas meningkat"}] 
      },
      { 
        id: 't8-i4', 
        question: "Persentase pelayanan komprehensif yang diberikan kepada perempuan dan anak korban kekerasan", 
        definisiOperasional: "Jumlah perempuan dan anak yang mengalami kekerasan fisik, psikis, seksual, penelantaran, eksploitasi dan/atau kekerasan lainnya yang mendapatkan pelayanan penanganan kasus secara komprehensif dibagi jumlah keseluruhan kasus sebagaimana dijelaskan dalam standar pelayanan minimal bidang layanan terpadu bagi perempuan dan anak korban kekerasan dikali 100%.", 
        sumberData: "Perangkat daerah yang membidangi urusan sosial perlindungan perempuan dan anak", 
        buktiDukung: "Laporan kasus kekerasan pada anak, laporan monitoring dan evaluasi perlindungan khusus anak tahun 2023 dan 2024, dilengkapi dengan screenshot laporan pada SIMFONI-PPA dengan mencantumkan cut off waktunya. Laporan divalidasi oleh Kepala OPD terkait.  Data pembanding dapat dilihat di SIMFONI-PPA (sistem informasi online perlindungan perempuan dan anak) kekerasan.kemenpppa.go.id", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pelayanan meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pelayanan tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pelayanan menurun"}] 
      },
      { 
        id: 't8-i5', 
        question: "Persentase pemerlu pelayanan kesejahteraan sosial (PPKS) yang memperoleh program perlindungan dan jaminan sosial, rehabilitasi sosial dan pemberdayaan sosial", 
        definisiOperasional: "Jumlah perseorangan, keluarga, kelompok, dan/atau masyarakat  karena suatu hambatan, kesulitan, atau gangguan, tidak dapat melaksanakan fungsi sosialnya, sehingga memerlukan pelayanan sosial untuk memenuhi kebutuhan hidupnya baik jasmani dan rohani maupun sosial secara memadai dan wajar meliputi rehabilitasi sosial,  jaminan sosial, pemberdayaan sosial dan perlindungan sosial yang memperoleh program perlindungan dan jaminan sosial, rehabilitasi sosial dan pemberdayaan sosial dibagi jumlah PPKS dikali 100%.", 
        sumberData: "Perangkat daerah yang membidangi urusan sosial / Data Terpadu Kesejahteraan Sosial", 
        buktiDukung: "Laporan monitoring dan evaluasi per semester tahun 2023 dan 2024 yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase PPKS meningkat dalam 2 tahun dan ≥80% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase PPKS menurun dalam 2 tahun namun  ≥80% pada tahun 2024 atau persentase PPKS meningkat namun <80% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase PPKS menurun dalam 2 tahun dan <80% pada tahun 2024"}] 
      },
      { 
        id: 't8-i6', 
        question: "Adanya layanan pengaduan terkait permasalahan sosial", 
        definisiOperasional: "Layanan pengaduan merupakan sarana untuk menerima dan menindaklanjuti informasi berupa pengaduan, keluhan, dan/atau pertanyaan yang disampaikan oleh masyarakat kepada dinas sosial daerah Kabupaten/Kota dan/atau Pusat Kesejahteraan Sosial mengenai pemenuhan kebutuhan dasar.  (Permensos 9 Tahun 2018 Tentang Standar Teknis Pelayanan Dasar pada Standar Pelayanan Minimal Bidang Sosial di Daerah Provinsi dan Kabupaten/Kota)", 
        sumberData: "Perangkat daerah yang membidangi urusan sosial capaian SPM Kab/Kota, Puskesos atau unit pengaduan lain yang dimiliki daerah", 
        buktiDukung: "Laporan capaian SPM Kab/Kota per triwulan pada tahun 2023 dan 2024 atau Laporan Puskesos/ Laporan Unit Pengaduan yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada dan seluruh pengaduan ditindaklanjuti"},{"nilai":75,"deskripsi":"Nilai 75 jika ada dan sebagian pengaduan ditindaklanjuti"},{"nilai":50,"deskripsi":"Nilai 50 jika ada dan pengaduan tidak ditindaklanjuti"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada unit layanan pengaduan"}] 
      },
      { 
        id: 't8-i7', 
        question: "Adanya kebijakan/program peningkatan kesejahteraan sosial dalam Rencana Pembangunan jangka Menengah Daerah/RPJMD", 
        definisiOperasional: "Terdapat Kebijakan Peningkatan Kesejahteraan Sosial yang mencangkup Rehabilitasi Sosial, Perlindungan dan Jaminan Sosial serta Pemberdayaan Sosial yang terdapat dalam dokumen perencanaan daerah (RPJMD/Renstra).", 
        sumberData: "Perangkat daerah yang membidangi urusan sosial", 
        buktiDukung: "Dokumen RPJMD/ Rencana Strategis dan laporan pelaksanannya yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada dan terealisasi seluruhnya"},{"nilai":75,"deskripsi":"Nilai 75 jika ada namun terealisasi sebagian"},{"nilai":50,"deskripsi":"Nilai 50 jika ada tapi tidak terealisasi"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada"}] 
      },
      { 
        id: 't8-i8', 
        question: "Keberadaan peran Lembaga Kesejahteraan Sosial (LKS) yang memberikan penanganan kepada pemerlu pelayanan kesejahteraan sosial (PPKS) yang berbadan hukum/ terdaftar di dinas sosial", 
        definisiOperasional: "Keberadaan dan kegiatan Lembaga Kesejahateraan Sosial yang terakreditasi yang memberikan pelayanan kesejahteraan sosial di daerah kabupaten/kota.", 
        sumberData: "Perangkat daerah yang membidangi urusan sosial", 
        buktiDukung: "Laporan rekap kegiatan Lembaga Kesejahateraan Sosial yang terakreditasi yang memberikan pelayanan kesejahteraan sosial di daerah kabupaten/kota yang dilengkapi dengan dokumentasi dan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada dan aktif seluruhnya"},{"nilai":75,"deskripsi":"Nilai 75 jika ada namun aktif sebagian"},{"nilai":50,"deskripsi":"Nilai 50 jika ada namun tidak aktif"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada PPKS"}] 
      },
      { 
        id: 't8-i9', 
        question: "Adanya regulasi daerah tentang penanganan kekerasan anak, perempuan dan Lansia", 
        definisiOperasional: "Regulasi daerah yang memuat mekanisme perlindungan anak berupa pencegahan dan respon cepat penanganan kekerasan pada anak.", 
        sumberData: "Perangkat daerah yang membidangi urusan sosial perlindungan perempuan dan anak", 
        buktiDukung: "Dokumen regulasi daerah, SOP atau mekanisme pencegahan dan respon cepat penanganan kekerasan pada anak. Jika regulasi ditetapkan sebelum 2023 maka wajib disertai dengan laporan penerapannya yang divalidasi oleh Kepala OPD terkait. Jika masih dalam proses penyusunan regulasi maka dilengkapi dengan rancangan regulasi dan penjelasan proses penyusunannya.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika dituangkan dalam Peraturan Daerah"},{"nilai":75,"deskripsi":"Nilai 75 jika dituangkan dalam Peraturan Kepala Daerah atau sedang dalam proses penyusunan Raperda"},{"nilai":50,"deskripsi":"Nilai 50 jika dituangkan dalam Peraturan lainnya"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada regulasi"}] 
      },
      { 
        id: 't8-i10', 
        question: "Adanya penyelenggaraan penanganan kekerasan anak, perempuan dan lansia  dalam Rencana Pembangunan Jangka Menengah Daerah/RPJMD", 
        definisiOperasional: "Kegiatan penyelenggaraan penanganan kekerasan anak, perempuan dan Lansia  tercantum dalam Rencana Pembangunan Jangka Menengah Daerah/RPJMD.", 
        sumberData: "Perangkat daerah yang membidangi urusan sosial perlindungan perempuan dan anak", 
        buktiDukung: "Dokumen RPJMD, Realisasi Anggaran, dan Dokumen/ Laporan Pelaksanaan Kegiatan. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada dalam RPJMD dan terealisasi seluruhnya"},{"nilai":75,"deskripsi":"Nilai 75 jika ada dalam RPJMD dan terealisasi sebagian"},{"nilai":50,"deskripsi":"Nilai 50 jika ada dalam RPJMD tapi belum terealisasi"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada dalam RPJMD"}] 
      },
      { 
        id: 't8-i11', 
        question: "Adanya upaya pencegahan untuk menurunkan angka perkawinan pada usia anak", 
        definisiOperasional: "Upaya pencegahan perkawinan anak, antara lain: (min. a, c, f, h) a. Sistem pengaduan dan pendampingan  b. Bantuan pendidikan bagi anak dari keluarga rentan  c. Pelatihan keterampilan untuk semua anak  d. Pencegahan Putus Sekolah/Wajib belajar 12 tahun (termasuk bagi anak yang memerlukan perlindungan khusus)  e. Bantuan modal usaha kepada keluarga rentan  f. Kampanye/sosialisasi/penyuluhan  g. Edukasi Kesehatan Reproduksi   h. Pengasuhan Remaja", 
        sumberData: "Perangkat daerah yang membidangi urusan sosial perlindungan perempuan dan anak dan sosial", 
        buktiDukung: "Laporan kegiatan pelaksanaan upaya pencegahan perkawinan anak dari masing-masing perangkat daerah pada tahun 2023 dan 2024. Data perkawinan anak diperoleh dari data dispensasi kawin di Pengadilan Agama dan data Susenas BPS. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada 4 upaya"},{"nilai":75,"deskripsi":"Nilai 75 jika ada 3 upaya"},{"nilai":50,"deskripsi":"Nilai 50 jika ada 1 - 2 upaya"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada upaya"}] 
      },
      { 
        id: 't8-i12', 
        question: "Adanya penggiat penanganan kekerasan terhadap anak, perempuan, dan Lansia baik secara individu/kelompok", 
        definisiOperasional: "Daerah memiliki penggiat penanganan kasus kekerasan terhadap anak, perempuan dan lansia baik secara individu/kelompok yang berfungsi aktif misal relawan Sahabat Perempuan dan Anak (SAPA).", 
        sumberData: "Perangkat daerah yang membidangi urusan sosial, perlindungan perempuan dan anak", 
        buktiDukung: "Laporan rekap kegiatan penggiat penanganan kekerasan terhadap anak, perempuan dan Lansia pada tahun 2023 dan 2024 yang dilengkapi dengan SK Tim, Rencana Kegiatan. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada penggiat, memiliki rencana kerja dan terealisasi"},{"nilai":75,"deskripsi":"Nilai 75 jika ada penggiat, memiliki rencana kerja namun tidak terealisasi"},{"nilai":50,"deskripsi":"Nilai 50 jika ada penggiat namun tidak memiliki rencana kerja"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada penggiat"}] 
      },
      { 
        id: 't8-i13', 
        question: "Persentase Tingkat Penggangguran Terbuka (TPT)", 
        definisiOperasional: "Jumlah pengangguran terbuka terdiri dari: 1. Mereka yang tak punya pekerjaan dan mencari pekerjaan. 2. Mereka yang tak punya pekerjaan dan mempersiapkan usaha. 3. Mereka yang tak punya pekerjaan dan tidak mencari pekerjaan, karena merasa tidak mungkin mendapatkan pekerjaan. 4. Mereka yang sudah punya pekerjaan, tetapi belum molai bekerja. dibagi jumlah angkatan kerja dikali 100%.", 
        sumberData: "Perangkat daerah yang membidangi urusan sosial, BPS Kabupaten/Kota", 
        buktiDukung: "Hasil survey BPS terkait tingkat penggangguran terbuka.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase TPT menurun dalam 2 tahun terakhir dan ≤4% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase TPT meningkat dalam 2 tahun terakhir namun ≤4% pada tahun 2024 atau capaian persentase TPT menurun dalm 2 tahun namun >4%"},{"nilai":0,"deskripsi":"Nilai 0 jika meningkat dalam 2 tahun dan >4% pada tahun 2024"}] 
      }
    ]
  },
  {
    id: 'tatanan-9',
    name: "Penanggulangan Bencana",
    indicators: [
      { 
        id: 't9-i1', 
        question: "Adanya dokumen Kajian Risiko Bencana (KRB)  yang telah disahkan oleh Kepala Daerah", 
        definisiOperasional: "Kajian Risiko Bencana (KRB) adalah Dokumen wajib yang berisi pedoman umum yang digunakan daerah dalam Penanggulangan Bencana. KRB meliputi: Peta Risiko Bencana yang meliputi Peta Ancaman, Peta Kerentanan, dan Peta Kapasitas sebagai landasan penentuan tingkat risiko bencana dan kebijakan minimum Penanggulangan Bencana daerah yang ditujukan untuk mengurangi jumlah jiwa terpapar, kerugian harta benda dan kerusakan lingkungan. KRB merupakan layanan pokok yang memberikan layanan dasar untuk pelaksanaan Sub Kegiatan Komunikasi, Informasi dan Edukasi Rawan Bencana, Sub Kegiatan Rencana Kontijensi. (catatan: klaster kesehatan)", 
        sumberData: "Perangkat daerah yang membidangi urusan kebencanaan", 
        buktiDukung: "Dokumen KRB atau rancangan dokumen KRB disertai dengan dokumentasi proses penyusunannya.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada KRB dan sudah disahkan oleh Kepala Daerah"},{"nilai":75,"deskripsi":"Nilai 75 jika ada KRB yang masih dalam masa berlaku namun belum disahkan oleh Kepala Daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika ada KRB namun masa berlaku sudah habis"},{"nilai":25,"deskripsi":"Nilai 25 jika sedang dalam proses penyusunan KRB"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada KRB"}] 
      },
      { 
        id: 't9-i2', 
        question: "Adanya dokumen Rencana Penanggulangan Bencana Daerah yang telah disahkan oleh Kepala Daerah", 
        definisiOperasional: "Rencana Penanggulangan Bencana (RPB) adalah dokumen wajib daerah yang berisi perencanaan periode 5 tahun untuk seluruh institusi yang terlibat dalam penanggulangan bencana baik pemerintah maupun non pemerintah. RPB meliputi penetapan kebijakan pembangunan di kawasan yang berisiko timbulnya bencana, rencana kegiatan dan aksi pengurangan risiko bencana, kerangka penanggulangan kedaruratan bencana dan kerangka rehabilitasi dan rekonstruksi pasca bencana. Rencana Penanggulngan Bencana merupakan layanan pokok yang memberikan dasar untuk pelaksanaan Sub Kegiatan Komunikasi, Informasi dan Edukasi Rawan Bencana, Sub Kegiatan Pembuatan Rencana Kontinjensi dan Sub Kegiatan Pelatihan Pencegahan dan Mitigasi. (catatan: klaster kesehatan)", 
        sumberData: "Perangkat daerah yang membidangi urusan kebencanaan", 
        buktiDukung: "Dokumen RPBD atau rancangan dokumen RPBD disertai dengan dokumentasi proses penyusunannya.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada Rencana Penanggulangan Bencana Daerah dan sudah disahkan oleh Kepala Daerah"},{"nilai":75,"deskripsi":"Nilai 75 jika ada Rencana Penanggulangan Bencana Daerah yang masih dalam masa berlaku namun belum disahkan oleh Kepala Daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika ada Rencana Penanggulangan Bencana Daerah namun masa berlaku sudah habis"},{"nilai":25,"deskripsi":"Nilai 25 jika sedang dalam proses penyusunan  Rencana Penanggulangan Bencana Daerah"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada Rencana Penanggulangan Bencana Daerah"}] 
      },
      { 
        id: 't9-i3', 
        question: "Adanya dokumen rencana kontingensi daerah yang telah disahkan oleh Kepala Daerah", 
        definisiOperasional: "Rencana kontingensi adalah dokumen yang disusun melalui proses perencanaan, penanganan situasi bencana, dalam keadaan tidak menentu, dengan skenario tujuan yang disepekati, tindakan teknis dan tindakan manajerial dan pengarahan potensi yang disetujui bersama untuk mencegah, dan atau menanggulangi lebih baik dan ditetapkan secara formal. Gladi lapang kesiapsiagaan adalah latihan koordinasi, komunikasi dan evakuasi dengan melibatkan seluruh pemangku kepentingan (pemerintah dan masyarakat umum). Seluruh pihak yang terlibat mensimulasikan situasi bencana sesungguhnya menggunakan skenario bencana yang dibuat mendekati atau sesuai kondisi nyata.", 
        sumberData: "Perangkat daerah yang membidangi urusan kebencanaan", 
        buktiDukung: "1. Dokumen Rencana Kontingensi Bencana Daerah              2. Laporan Review Rencana Kontingensi Bencana", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki dokumen Rencana Kontingensi yang disahkan kepala daerah dan telah ditindaklanjuti dengan penyelenggaraan gladi"},{"nilai":75,"deskripsi":"Nilai 75 jika dokumen disahkan kepala daerah tetapi tidak dilakukan gladi"},{"nilai":50,"deskripsi":"Nilai 50 jika terdapat dokumen Rencana Kontingensi tetapi belum disahkan kepala daerah"},{"nilai":25,"deskripsi":"Nilai 25 jika sedang dalam proses penyusunan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada dokumen Rencana Kontingensi"}] 
      },
      { 
        id: 't9-i4', 
        question: "Adanya kebijakan dan regulasi penanggulangan bencana di daerah", 
        definisiOperasional: "Pemda mengeluarkan Perda/Perbub/Perwali/SK Kepala Dinas terkait Penyelenggaraan penanggulangan bencana di daerah termasuk di dalamnya adalah pemenuhan standar pelayanan minimal sub urusan bencana (Permendagri 101/2018), kelembagaan penyelenggara penanggulangan bencana, MoU dengan pihak terkait dalam penyelenggaraan penanggulangan bencana (misal: Universitas, LSM, NGO, dll), SOP Mekanisme Koordinasi Penanggulangan Bencana, dll.", 
        sumberData: "Perangkat daerah yang membidangi  urusan hukum/ kebencanaan/ perencanaan daerah", 
        buktiDukung: "Dokumen Perda/Perbub/Perwali/SK Kepala Dinas", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada kebijakan dan regulasi berupa Perda tentang Penanggulangan Bencana"},{"nilai":75,"deskripsi":"Nilai 75 jika ada  kebijakan dan regulasi berupa Perbup/Perwali tentang Penanggulangan Bencana"},{"nilai":50,"deskripsi":"Nilai 50 jika ada kebijakan dan regulasi berupa Keputusan Bupati/Wali Kota tentang Penanggulangan Bencana"},{"nilai":25,"deskripsi":"Nilai 25 jika masih berupa Rancangan Peraturan/regulasi tentang Penanggulangan Bencana"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada kebijakan/regulasi"}] 
      },
      { 
        id: 't9-i5', 
        question: "Adanya integrasi Kajian Risiko Bencana (KRB) dan Rencana Penanggulangan Bencana ke dalam dokumen perencanaan daerah (RPJMD/RKPD/Renstra PD/ Renja PD)", 
        definisiOperasional: "RPJMD/RKPD/Renstra PD/Renja PD yang mendukung penanggulangan bencana meliputi: a. gambaran umum kondisi daerah khususnya dikaitkan dengan penyelenggaraan dan pencapaian Program dan Kegiatan, sub kegiatan Perangkat Daerah dalam pemenuhan Kebutuhan Dasar Warga Negara; b. kerangka ekonomi dan keuangan daerah, khususnya dikaitkan dengan besaran anggaran yang diperuntukkan bagi pemenuhan Kebutuhan Dasar Warga Negara; c. sasaran dan prioritas pembangunan daerah, khususnya untuk memastikan capaian pemenuhan Kebutuhan Dasar Warga Negara dalam rencana kerja tahunan; d. rencana kerja dan pendanaan daerah, khususnya dikaitkan dengan Program, Kegiatan, sub kegiatan dan alokasi dana indikatif dan sumber pendanaan yang disusun dalam pencapaian pemenuhan Kebutuhan Dasar Warga Negara; dan e. kinerja penyelenggaraan Pemerintah Daerah, khususnya dikaitkan dengan Indikator Kinerja daerah dalam pencapaian pemenuhan Kebutuhan Dasar Warga Negara.", 
        sumberData: "Perangkat daerah yang membidangi  urusan bagian hukum/ kebencanaan", 
        buktiDukung: "Dokumen RPJMD/RKPD/Renstra PD/ Renja PD", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika terintegrasi ke dalam dokumen perencanaan daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika sedang dalam proses integrasi ke dalam dokumen perencanaan daerah"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak terintegrasi ke dalam dokumen perencanaan daerah"}] 
      },
      { 
        id: 't9-i6', 
        question: "Adanya sistem peringatan dini yang berfungsi dengan baik sesuai potensi ancaman bencana wilayahnya (EWS longsor, EWS banjir, EWS tsunami, SKDR, EWS Karlahut, EWS Bencana Nuklir, Biologi, Kimia, dll)", 
        definisiOperasional: "Peringatan dini adalah serangkaian kegiatan pemberian peringatan sesegera mungkin kepada masyarakat tentang kemungkinan terjadinya bencana pada suatu tempat oleh lembaga yang berwenang (UU No 24 Tahun 2007).  Contoh:  a. integrasi EWS gempa-tsunami kerjasama BPBD dengan BMKG yang diinformasikan kepada masyarakat secara langsung melalui pengaktifan sirine b. integrasi EWS penyakit/faktor risiko kesehatan lingkungan dengan Labkesmas Tier 4", 
        sumberData: "Perangkat daerah yang membidangi urusan kebencanaan", 
        buktiDukung: "1. Dokumentasi laporan EWS termasuk informasi titik keberadaan EWS 2. Laporan pemantauan kondisi EWS (maintenance) 3. Rekapitulasi RHA  Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika minimal 80% Kawasan Rawan Bencana tersedia Sistem peringatan dini yang berfungsi dengan baik"},{"nilai":75,"deskripsi":"Nilai 75 jika 60-79% Kawasan Rawan Bencana tersedia Sistem peringatan dini yang berfungsi dengan baik"},{"nilai":50,"deskripsi":"Nilai 50 jika 40-59% Kawasan Rawan Bencana tersedia Sistem peringatan dini yang berfungsi dengan baik"},{"nilai":25,"deskripsi":"Nilai 25 jika 20-39% Kawasan Rawan Bencana tersedia Sistem peringatan dini yang berfungsi dengan baik"},{"nilai":0,"deskripsi":"Nilai 0 jika <20% Kawasan Rawan Bencana tersedia Sistem peringatan dini yang berfungsi dengan baik"}] 
      },
      { 
        id: 't9-i7', 
        question: "Adanya Tim Reaksi Cepat (TRC) dengan SK Kepala BPBD", 
        definisiOperasional: "Kesiapsiagaan tim klaster penanggulangan bencana di tingkat kabupaten/kota dalam memberlakukan respon cepat atau kurang dari 1 x 24 jam terhadap kejadian bencana dan atau krisis kesehatan (klaster  kesehatan, klaster pencarian dan penyelamatan, klaster logistik, klaster pengungsian dan perlindungan, klaster pendidikan, klaster sarana dan prasarana, klaster ekonomi dan klaster pemulihan dini).", 
        sumberData: "Perangkat daerah yang membidangi  urusan bagian hukum/ kebencanaan", 
        buktiDukung: "Laporan pelaksanaan kegiatan TRC disertai dengan dokumentasi serta lampiran SK dan Renja.  Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada SK yang masih berlaku dan ada Renja"},{"nilai":75,"deskripsi":"Nilai 75 jika ada SK yang masih berlaku namun tidak ada Renja"},{"nilai":50,"deskripsi":"Nilai 50 jika ada SK namun sudah tidak berlaku atau sedang dalam penyusunan SK"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada SK"}] 
      },
      { 
        id: 't9-i8', 
        question: "Adanya Tim Koordinasi Daerah dalam Pencegahan dan Pengendalian Zoonosis dan Penyakit Infeksius Baru di Daerah dengan SK Bupati/ Walikota", 
        definisiOperasional: "Dalam pelaksanaan pencegahan dan pengendalian Zoonosis dan PIB di daerah, gubernur dan bupati/wali kota membentuk Tim Koordinasi Daerah Pencegahan dan Pengendalian Zoonosis dan Penyakit Infeksius Baru. (sumber: PermenkoPMK Nomor 7 Tahun 2022 tentang Pencegahan dan Pengendalian Zoonosis dan Penyakit Infeksius Baru)", 
        sumberData: "Perangkat daerah yang membidangi  urusan bagian hukum/ kebencanaan", 
        buktiDukung: "Laporan pelaksanaan kegiatan Tim Koordinasi Daerah disertai dengan dokumentasi serta lampiran SK dan Renja.  Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada SK yang masih berlaku dan ada Renja"},{"nilai":75,"deskripsi":"Nilai 75 jika ada SK yang masih berlaku namun tidak ada Renja"},{"nilai":50,"deskripsi":"Nilai 50 jika ada SK namun sudah tidak berlaku atau sedang dalam penyusunan SK"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada SK"}] 
      },
      { 
        id: 't9-i9', 
        question: "Adanya alokasi pendanaan BTT untuk penyediaan logistik kebutuhan dasar yang mencukupi di masing-masing di Kabupaten/Kota dalam kesiapsiagaan bencana", 
        definisiOperasional: "Logistik adalah sesuatu yang berwujud dan dapat digunakan untuk memenuhi kebutuhan dasar hidup manusia yang terdiri dari atas sandang, pangan dan papan atau turunannya. Termasuk dalam kategori logistik adalah barang habis pakai atau dikonsumsi, misalnya sembako (sembilan bahan pokok), obat, pakaian dan kelengkapannya, air, jas tidur dan sebagainya (Perka BNPB 04 tahun 2009). Perka BNPB 23 tahun 2014 tentang Standarisasi Logistik Penanggulangan Bencana ->Persediaan logistik minimal adalah persediaan logistik untuk kebutuhan keadaan darurat bencana pada kurun waktu 72 jam pertama sejak keadaan darurat bencana ditetapkan.  Rumus Perhitungan: Jumlah Penduduk x Prosentase x Hari = Jumlah Persediaan Minimum (Buffer Stock) dengan prosentase 1% (asumsi penduduk korban bencana)", 
        sumberData: "Perangkat daerah yang membidangi urusan kebencanaan", 
        buktiDukung: "Laporan Buffer stock logistik bencana yang divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada buffer stock yang cukup/ memenuhi dalam hal jenis dan jumlahnya sesuai dengan ketentuan yang berlaku"},{"nilai":50,"deskripsi":"Nilai 50 jika ada buffer stock namun jumlah tidak cukup/ memenuhi dalam hal jenis dan/atau jumlahnya sesuai dengan ketentuan yang berlaku"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada buffer stock"}] 
      },
      { 
        id: 't9-i10', 
        question: "Persentase wilayah tangguh bencana (Destana/Kampung Siaga Bencana) yang aktif melakukan upaya pengelolaan risiko bencana di daerah rawan bencana", 
        definisiOperasional: "Jumlah wilayah Destana yang aktif melakukan upaya kesiapsiagaan bencana dibagi dengan Jumlah wilayah Destana di Kabupaten/kota dikali 100% (dibuktikan dengan adanya kegiatan yang terkait dengan mitigasi/kesiapsiagaan bencana).", 
        sumberData: "Aplikasi Katalog Digital Kesiapsiagaan, Perangkat daerah yang membidangi urusan kebencanaan", 
        buktiDukung: "1. Laporan hasil penilaian ketangguhan desa/kelurahan (PKD) 2. RPJMD 3. RPJMDes 4. Laporan kegiatan di BPBD atau Dinas Sosial", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika  ≥ 51% wilayah sudah aktif melaksanakan upaya pengelolaan risiko bencana"},{"nilai":75,"deskripsi":"Nilai 75 jika 25 - 50% wilayah sudah aktif melaksanakan upaya pengelolaan risiko bencana"},{"nilai":50,"deskripsi":"Nilai 50 jika < 25 % wilayah sudah aktif melaksanakan upaya pengelolaan risiko bencana"},{"nilai":0,"deskripsi":"Nilai 0 jika  tidak ada wilayah yang aktif melaksanakan upaya pengelolaan risiko bencana"}] 
      },
      { 
        id: 't9-i11', 
        question: "Adanya Forum Pengurangan Risiko Bencana (FPRB) sebagai upaya pemberdayaan masyarakat dalam penanggulangan bencana di Kawasan Rawan Bencana (KRB)", 
        definisiOperasional: "Kabupaten/Kota yang membentuk Forum Pengurangan Risiko Bencana (FPRB) sebagai upaya pemberdayaan masyarakat dalam penanggulangan bencana di Kawasan Rawan Bencana (KRB).", 
        sumberData: "Perangkat daerah yang membidangi urusan kebencanaan", 
        buktiDukung: "1. SK Bupati/Walikota tentang Pembentukan Forum Pengurangan Risiko Bencana 2. Rencana kerja Forum 3. Laporan kegiatan Forum 4. Berkelanjutan : inovasi teraplikasi", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika  ada, memiliki rencana kerja, terealisasi semua dan berkelanjutan"},{"nilai":75,"deskripsi":"Nilai 75 jika ada, memiliki rencana kerja dan terealisasi sebagian"},{"nilai":50,"deskripsi":"Nilai 50 jika ada, namun tidak memiliki rencana kerja"},{"nilai":0,"deskripsi":"Nilai 0 jika  tidak ada"}] 
      },
      { 
        id: 't9-i12', 
        question: "Adanya kerja sama antar daerah yang berbatasan secara langsung, kerja sama daerah dengan pihak ketiga dalam upaya penanggulangan bencana", 
        definisiOperasional: "Adanya Perjanjian kerja sama dengan pemerintah daerah lain dalam penanggulangan bencana sebagai bentuk penguatan penyelenggaraan upaya penanggulangan bencana secara terpadu, sistematis, cepat, tepat, akurat, terkoordinasi pada tahapan pra bencana, saat bencana, dan pasca bencana, serta adanya rencana kerja/aksi yang terimplementasi.", 
        sumberData: "Perangkat daerah yang membidangi urusan kebencanaan", 
        buktiDukung: "1. Dokumen Perjanjian kerjasama/MoU 2. Dokumen Rencana Aksi 3. Dokumen Laporan kegiatan 4. Jika masih dalam proses penyusunan maka perlu melampirkan dokumen yang menunjukkan proses penyusunan/ pembahasannya", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada, kerja sama antar daerah yang berbatasan secara langsung dan daerah dengan pihak ketiga"},{"nilai":75,"deskripsi":"Nilai 75 jika ada, hanya kerja sama antar daerah yang berbatasan secara langsung"},{"nilai":50,"deskripsi":"Nilai 50 jika  ada, hanya kerja sama daerah dengan pihak ketiga"},{"nilai":25,"deskripsi":"Nilai 25 jika masih dalam proses penyusunan kerja sama"},{"nilai":0,"deskripsi":"Nilai 0 jika belum ada kerja sama"}] 
      },
      { 
        id: 't9-i13', 
        question: "Kabupaten/Kota yang melaksanakan respon terhadap sinyal SKDR kurang dari 24 jam", 
        definisiOperasional: "Kabupaten/Kota yang melaksanakan respon terhadap sinyal SKDR kurang dari 24 jam dilihat dari aplikasi SKDR.", 
        sumberData: "aplikasi SKDR (skdr.surveilans.org),  Perangkat daerah yang membidangi urusan kebencanaan", 
        buktiDukung: "Laporan respons terhadap sinyal SKDR kurang dari 24 jam dilengkapi dengan data sinyal SKDR, respons sinyal SKDR kurang dari 24 jam disertai dengan dokumentasi yang menggambarkan kegiatan responst terhadap sinyal SKDR kurang dari 24 jam. Laporan divalidasi oleh Kepala OPD terkait.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika respon terhadap sinyal SKDR kurang dari 24 jam meningkat dalam 2 tahun terakhir dan ≥80% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika respon terhadap sinyal SKDR kurang dari 24 jam menurun dalam 2 tahun terakhir dan ≥80% pada tahun 2024 atau respon terhadap sinyal SKDR kurang dari 24 jam meningkat dalam 2 tahun terakhir dan <80% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika respon terhadap sinyal SKDR kurang dari 24 jam menurun dalam 2 tahun terakhir dan <80% pada tahun 2024"}] 
      },
      { 
        id: 't9-i14', 
        question: "Kabupaten/Kota memiliki dokumen Rencana Kontingensi penyakit potensi wabah", 
        definisiOperasional: "Kabupaten/Kota memiliki dokumen Rencana Kontingensi penyakit potensi wabah yang disahkan oleh Kepala Daerah atau pejabat yang ditunjuk. 2024 : 111 Kab/Kota yang sudah memiliki dokumen rencana kontingensi", 
        sumberData: "Perangkat daerah yang membidangi urusan kesehatan, kebencanaan", 
        buktiDukung: "Dokumen rencana kontigensi penyakit potensi wabah.  Jka masih dalam proses penyusunan maka perlu melampirkan dokumen yang menunjukkan proses penyusunan/ pembahasannya.", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki dokumen Rencana Kontingensi dan sudah disahkan"},{"nilai":75,"deskripsi":"Nilai 75 jika memiliki dokumen Rencana Kontingensi namun belum disahkan"},{"nilai":50,"deskripsi":"Nilai 50 jika sedang dalam proses penyusunan dokumen Rencana Kontingensi"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak memiliki dokumen Rencana Kontingensi"}] 
      }
    ]
  }
];






