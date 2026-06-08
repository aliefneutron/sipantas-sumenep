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
    name: "INDIKATOR",
    indicators: [
      { 
        id: 't1-i1', 
        question: "Jumlah Kematian Ibu", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika jumlah kematian ibu menurun"},{"nilai":50,"deskripsi":"Nilai 50 jika jumlah kematian ibu tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah kematian ibu meningkat"}] 
      },
      { 
        id: 't1-i2', 
        question: "Jumlah Kematian Neonatus", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika  jumlah kematian neonatus menurun"},{"nilai":50,"deskripsi":"Nilai 50 jika jumlah kematian neonatus tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah kematian neonatus meningkat"}] 
      },
      { 
        id: 't1-i3', 
        question: "Angka Harapan Hidup (AHH)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika angka harapan hidup meningkat dan di atas angka nasional tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika angka harapan hidup menurun namun masih di atas angka nasional tahun 2024 atau angka harapan hidup meningkat namun di bawah angka nasional tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika angka harapan hidup menurun dan di bawah angka nasional tahun 2024"}] 
      },
      { 
        id: 't1-i4', 
        question: "Persentase fasilitas pelayanan kesehatan terdekat", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian  ≥ 75% Desa/Kelurahan memiliki fasilitas pelayanan kesehatan dengan rata-rata waktu tempuh ≤ 30 menit"},{"nilai":75,"deskripsi":"Nilai 75 jika capaian ≥ 50% - 74% Desa/Kelurahan memiliki fasilitas pelayanan kesehatan dengan rata-rata waktu tempuh ≤ 30 menit"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian ≥ 25% - 49% Desa/Kelurahan memiliki fasilitas pelayanan kesehatan dengan rata-rata waktu tempuh ≤ 30 menit"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian < 25% Desa/Kelurahan memiliki fasilitas pelayanan kesehatan dengan rata-rata waktu tempuh ≤ 30 menit"}] 
      },
      { 
        id: 't1-i5', 
        question: "Akses terhadap informasi kesehatan", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika informasi kesehatan tersedia dalam berbagai bentuk media, terupdate dan digunakan dalam berbagai waktu yang berbeda"},{"nilai":50,"deskripsi":"Nilai 50 jika informasi kesehatan tersedia namun hanya dalam satu bentuk media, terupdate dan digunakan dalam berbagai waktu yang berbeda"},{"nilai":25,"deskripsi":"Nilai 25 jika informasi kesehatan hanya tersedia  dalam berbagai bentuk media namun hanya pada periode krisis"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada informasi kesehatan yang tersedia"}] 
      },
      { 
        id: 't1-i6', 
        question: "Prevalensi Stunting pada Balita", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian prevalensi stunting pada balita menurun dalam 2 tahun terakhir dan di bawah 14% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian prevalensi stunting meningkat dalam 2 tahun terakhir namun masih di bawah 14% atau capaian prevalensi stunting pada balita menurun dalam 2 tahun terakhir namun di atas 14%  pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika  capaian prevalensi stunting meningkat dalam 2 tahun terakhir dan di atas 14%  pada tahun 2024"}] 
      },
      { 
        id: 't1-i7', 
        question: "Cakupan Penemuan Kasus TBC", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian cakupan penemuan kasus TBC meningkat dalam 2 tahun terakhir dan ≥90%  pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian cakupan penemuan kasus TBC meningkat dalam 2 tahun terakhir namun <90% atau cakupan penemuan kasus TBC menurun dalam 2 tahun terakhir namun ≥90% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian cakupan penemuan kasus TBC menurun dalam 2 tahun terakhir dan <90% pada tahun 2024"}] 
      },
      { 
        id: 't1-i8', 
        question: "Persentase orang terduga tuberkulosis yang mendapatkan pelayanan kesehatan sesuai standar", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase orang terduga tuberkulosis yang mendapatkan pelayanan kesehatan sesuai standar meningkat dalam 2 tahun terakhir dan di atas target nasional tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase orang terduga tuberkulosis yang mendapatkan pelayanan kesehatan sesuai standar menurun dalam 2 tahun terakhir  namun masih di atas target nasional tahun 2024 atau capaian persentase orang terduga tuberkulosis yang mendapatkan pelayanan kesehatan sesuai standar meningkat dalam 2 tahun terakhir  namun di bawah target nasional tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase orang terduga tuberkulosis yang mendapatkan pelayanan kesehatan sesuai standar menurun dalam 2 tahun terakhir dan di bawah target nasional tahun 2024"}] 
      },
      { 
        id: 't1-i9', 
        question: "Persentase merokok penduduk usia 10-18 tahun", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase skrining merokok penduduk usia 10-18 tahun meningkat dan proporsi merokok penduduk usia 10-18 tahun di bawah target nasional tahun 2024"},{"nilai":75,"deskripsi":"Nilai 75 jika capaian persentase skrining merokok penduduk usia 10-18 tahun tetap dan/atau menurun dan proporsi merokok penduduk usia 10-18 tahun di  bawah target nasional tahun 2024"},{"nilai":50,"deskripsi":"NIlai 50 jika capaian persentase skrining merokok penduduk usia 10-18 tahun tetap dan/atau menurun  dan proporsi merokok penduduk usia 10-18 tahun di atas target nasional tahun 2024"},{"nilai":25,"deskripsi":"Nilai 25 jika capaian persentase skrining merokok penduduk usia 10-18 tahun menurun dan proporsi merokok penduduk usia 10-18 tahun di bawah target nasional tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase skrining merokok penduduk usia 10-18 tahun menurun dan proporsi merokok penduduk usia 10-18 tahun di atas target nasional tahun 2024"}] 
      },
      { 
        id: 't1-i10', 
        question: "Angka kesakitan Dengue", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika angka kesakitan dengue menurun dalam 2 tahun terakhir dan ≤10 per 100.000 pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika angka kesakitan dengue menurun dalam 2 tahun terakhir namun >10 per 100.000 pada tahun 2024 atau angka kesakitan dengue meningkat namun ≤10 per 100.000 pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika angka kesakitan dengue meningkat dalam 2 tahun terakhir dan >10 per 100.000 pada tahun 2024"}] 
      },
      { 
        id: 't1-i11', 
        question: "Persentase pangan segar yang memenuhi syarat keamanan pangan", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase pangan segar yang memenuhi syarat keamanan pangan meningkat dalam 2 tahun terakhir dan mencapai ≥ 85% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika  capaian persentase pangan segar yang memenuhi syarat keamanan pangan meningkat dalam 2 tahun terakhir namun masih < 85% pada tahun 2024 atau capaian persentase pangan segar yang memenuhi syarat keamanan pangan menurun dalam 2 tahun terakhir terakhir namun ≥ 85% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0  capaian persentase pangan segar yang memenuhi syarat keamanan pangan menurun dalam 2 tahun terakhir  dan < 85% pada tahun 2024"}] 
      },
      { 
        id: 't1-i12', 
        question: "Kabupaten/Kota yang menerapkan kebijakan GERMAS", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika Kabupaten/Kota melaksanakan 5 kluster kegiatan GERMAS minimal 3 kali/tahun dengan melaporkan lebih dari satu kegiatan pada setiap kluster"},{"nilai":75,"deskripsi":"Nilai 75 jika Kabupaten/Kota melaksanakan 4 kluster kegiatan GERMAS minimal 3 kali/tahun dengan melaporkan lebih dari satu kegiatan pada setiap kluster (harus tersedianya data aktivitas fisik intensitasi sedang umur 18-64 tahun 100-150 menit/minggu baik melalui survei atau laporan kegiatan)"},{"nilai":50,"deskripsi":"NIlai 50 jika Kabupaten/Kota melaksanakan 3 kluster kegiatan GERMAS minimal 3 kali/tahun dengan melaporkan lebih dari satu kegiatan pada setiap kluster (harus tersedianya data aktivitas fisik intensitasi sedang umur 18-64 tahun 100-150 menit/minggu baik melalui survei atau laporan kegiatan)"},{"nilai":25,"deskripsi":"Nilai 25 jika Kabupaten/Kota melaksanakan 2 kluster kegiatan GERMAS minimal 3 kali/tahun dengan melaporkan lebih dari satu kegiatan pada setiap kluster (harus tersedianya data aktivitas fisik intensitasi sedang umur 18-64 tahun 100-150 menit/minggu baik melalui survey atau laporan kegiatan)"},{"nilai":0,"deskripsi":"Nilai 0 jika Kabupaten/Kota belum melaksanakan kegiatan GERMAS"}] 
      },
      { 
        id: 't1-i13', 
        question: "Persentase penderita Diabetes Melitus yang mendapatkan pelayanan kesehatan sesuai standar", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase penderita Diabetes Melitus yang mendapatkan pelayanan kesehatan sesuai standar meningkat dalam 2 tahun terakhir dan ≥90% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase penderita Diabetes Melitus yang mendapatkan pelayanan kesehatan sesuai standar meningkat dalam 2 tahun terakhir namun <90% pada tahun 2024 atau capaian persentase penderita Diabetes Melitus yang mendapatkan pelayanan kesehatan sesuai standar menurun dalam 2 tahun terakhir namun ≥90% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase penderita Diabetes Melitus yang mendapatkan pelayanan kesehatan sesuai standar menurun dalam dua tahun terakhir dan <90% pada tahun 2024"}] 
      },
      { 
        id: 't1-i14', 
        question: "Persentase penderita Hipertensi yang mendapatkan pelayanan kesehatan sesuai standar", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase penderita Hipertensi yang mendapatkan pelayanan kesehatan sesuai standar meningkat dalam 2 tahun terakhir dan ≥60% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase penderita Hipertensi yang mendapatkan pelayanan kesehatan sesuai standar meningkat dalam 2 tahun terakhir namun masih  <60% pada tahun 2024 atau persentase penderita Hipertensi yang mendapatkan pelayanan kesehatan sesuai standar menurun namun ≥60% pada tahun 2024"},{"nilai":0,"deskripsi":"NIlai 0 jika persentase penderita Hipertensi yang mendapatkan pelayanan kesehatan sesuai standar menurun dan <60% pada tahun 2024"}] 
      },
      { 
        id: 't1-i15', 
        question: "Persentase Orang Dengan Gangguan Jiwa Berat  yang mendapatkan pelayanan sesuai standar dan adanya program penanggulangan pemasungan/ bebas pasung", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika 100% Orang Dengan Gangguan Jiwa Berat  yang mendapatkan pelayanan sesuai standar dan komitmen Kepala Daerah dalam bentuk surat pernyataan bebas pasung dan SK Tim Penggerak Kesehatan Jiwa Masyarakat (TPKJM) Tingkat Kab/Kota"},{"nilai":50,"deskripsi":"Nilai 50 jika 100% Orang Dengan Gangguan Jiwa Berat  yang mendapatkan pelayanan sesuai standar dan komitmen Kepala Daerah dalam bentuk surat pernyataan untuk menuju bebas pasung dan SK Tim Penggerak Kesehatan Jiwa Masyarakat (TPKJM) Tingkat Kab/Kota"},{"nilai":25,"deskripsi":"Nilai 25 jika 100% Orang Dengan Gangguan Jiwa Berat  yang mendapatkan pelayanan sesuai standar"},{"nilai":0,"deskripsi":"NIlai 0 jika < 100% Orang Dengan Gangguan Jiwa Berat  yang mendapatkan pelayanan sesuai standar"}] 
      },
      { 
        id: 't1-i16', 
        question: "Persentase Bayi usia 0-11 bulan yang mendapatkan Imunisasi Lengkap", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase Bayi usia 0-11 bulan yang mendapatkan Imunisasi Lengkap meningkat dalam 2 tahun terakhir dan ≥80% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase Bayi usia 0-11 bulan yang mendapatkan Imunisasi Lengkap meningkat dalam 2 tahun terakhir namun <80% pada tahun 2024 atau persentase Bayi usia 0-11 bulan yang mendapatkan Imunisasi Lengkap menurun namun ≥80% pada tahun 2024"},{"nilai":0,"deskripsi":"NIlai 0 jika capaian persentase Bayi usia 0-11 bulan yang mendapatkan Imunisasi Lengkap menurun dalam 2 tahun terakhir dan <80% pada tahun 2024"}] 
      },
      { 
        id: 't1-i17', 
        question: "Pesentase penduduk sesuai kelompok usia yang dilakukan skrining PTM", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase penduduk sesuai kelompok usia yang dilakukan skrining PTM meningkat dalam 2 tahun terakhir dan ≥90% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase penduduk sesuai kelompok usia yang dilakukan skrining PTM meningkat dalam 2 tahun terakhir namun masih <90% atau persentase penduduk sesuai kelompok usia yang dilakukan skrining PTM menurun dalam 2 tahun terakhir namun ≥90% pada tahun 2024"},{"nilai":0,"deskripsi":"NIlai 0 jika capaian persentase penduduk sesuai kelompok usia yang dilakukan skrining PTM menurun dalam 2 tahun terakhir dan <90% pada tahun 2024"}] 
      },
      { 
        id: 't1-i18', 
        question: "Kabupaten/Kota yang telah eliminasi malaria", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memenuhi 3 kriteria syarat utama eliminasi kriteria dan sudah terverifikasi (eliminasi malaria)"},{"nilai":50,"deskripsi":"Nilai 50 jika memenuhi 3 kriteria syarat utama eliminasi kriteria namun belum terverifikasi"},{"nilai":0,"deskripsi":"Nilai 0 jika belum memenuhi 3 kriteria syarat utama eliminasi"}] 
      },
      { 
        id: 't1-i19', 
        question: "Persentase Fasilitas Pelayanan Kesehatan Terakreditasi", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase fasilitas pelayanan kesehatan terakreditasi tercapai 100% sampai tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase fasilitas pelayanan kesehatan terakreditasi ≥80% - <100% sampai tahun 2024"},{"nilai":0,"deskripsi":"NIlai 0 jika capaian persentase fasilitas pelayanan kesehatan terakreditasi  <80% sampai tahun 2024"}] 
      },
      { 
        id: 't1-i20', 
        question: "Rasio ketersediaan tempat tidur rumah sakit terhadap jumlah penduduk yang dilayani", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian rasio ketersediaan tempat tidur rumah sakit terhadap jumlah penduduk yang dilayani ≥ 1 tempat tidur per 1.000 penduduk"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian rasio ketersediaan tempat tidur rumah sakit terhadap jumlah penduduk yang dilayani  0,5 - < 1 tempat tidur per 1.000 penduduk"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian rasio ketersediaan tempat tidur rumah sakit terhadap jumlah penduduk yang dilayani < 0,5 tempat tidur per 1.000 penduduk"}] 
      },
      { 
        id: 't1-i21', 
        question: "Persentase ibu hamil KEK", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase ibu hamil KEK menurun dalam 2 tahun terakhir dan ≤10% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase ibu hamil KEK menurun dalam 2 tahun terakhir namun masih >10% atau persentase ibu hamil KEK meningkat namun ≤10% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase ibu hamil KEK meningkat dan >10% pada tahun 2024"}] 
      },
      { 
        id: 't1-i22', 
        question: "Prevalensi Obesitas pada penduduk usia >18 tahun", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian prevalensi obesitas  pada penduduk usia >18 tahun menurun dalam 2 tahun terakhir dan ≤21,8% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian prevalensi obesitas  pada penduduk usia >18 tahun menurun dalam 2 tahun terakhir dan >21,8% pada tahun 2024 atau prevalensi obesitas  pada penduduk usia >18 tahun meningkat dalam 2 tahun terakhir dan ≤21,8% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian capaian prevalensi obesitas  pada penduduk usia >18 tahun menurun dalam 2 tahun terakhir dan >21,8% pada tahun 2024"}] 
      },
      { 
        id: 't1-i23', 
        question: "Jumlah Rumah Sakit dan Puskesmas telah mengelola limbah medis sesuai standar", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian jumlah Rumah Sakit dan Puskesmas telah mengelola limbah medis sesuai standar meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian jumlah Rumah Sakit dan Puskesmas telah mengelola limbah medis sesuai standar tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian jumlah Rumah Sakit dan Puskesmas telah mengelola limbah medis sesuai standar menurun"}] 
      },
      { 
        id: 't1-i24', 
        question: "Persentase Puskesmas yang melaksanakan deteksi dini penyalahgunaan Napza", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase Puskesmas yang melaksanakan deteksi dini penyalahgunaan Napza meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase Puskesmas yang melaksanakan deteksi dini penyalahgunaan Napza tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase Puskesmas yang melaksanakan deteksi dini penyalahgunaan Napza menurun"}] 
      },
      { 
        id: 't1-i25', 
        question: "Persentase penduduk usia ≥ 15 tahun yang memiliki risiko kesehatan jiwa yang mendapatkan skrining", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian jumlah penduduk usia ≥ 15 tahun yang memiliki risiko kesehatan jiwa yang mendapatkan skrining meningkat dan ≥90% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian jumlah penduduk usia ≥ 15 tahun yang memiliki risiko kesehatan jiwa yang mendapatkan skrining meningkat namun <90% pada tahun 2024 atau jumlah penduduk usia ≥ 15 tahun yang memiliki risiko kesehatan jiwa yang mendapatkan skrining menurun namun  ≥90% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian jumlah penduduk usia ≥ 15 tahun yang memiliki risiko kesehatan jiwa yang mendapatkan skrining menurun dan <90% pada tahun 2024"}] 
      },
      { 
        id: 't1-i26', 
        question: "Persentase posyandu aktif di Kabupaten/Kota", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase posyandu aktif meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase posyandu aktif tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase posyandu aktif menurun"}] 
      },
      { 
        id: 't1-i27', 
        question: "Adanya kebijakan Kawasan Tanpa Rokok (KTR) dan menerapkan indikator prinsip 100% kepatuhan KTR", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki kebijakan KTR pada 7-6 tatanan dan menerapkan indikator 100 % KTR"},{"nilai":75,"deskripsi":"Nilai 75 jika memiliki kebijakan KTR pada 5-4 tatanan dan menerapkan indikator 100 % KTR"},{"nilai":50,"deskripsi":"Nilai 50 jika memiliki kebijakan KTR pada 3 tatanan dan menerapkan indikator 100 % KTR"},{"nilai":0,"deskripsi":"NIlai 0 jika memiliki kebijakan KTR pada ≤ 2 tatanan dan menerapkan indikator 100 % KTR"}] 
      },
      { 
        id: 't1-i28', 
        question: "Persentase Puskesmas yang melakukan surveilans vektor (Angka Bebas Jentik, Indeks Habitat Vektor Malaria atau Filariasis dan Success trap tikus)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase Puskesmas yang melakukan surveilans vektor (Angka Bebas Jentik ≥ 95%, Indeks Habitat Vektor Malaria atau Filariasis < 1, dan Success trap tikus <1)  ≥ 80%"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase Puskesmas yang melakukan surveilans vektor (Angka Bebas Jentik ≥ 95%, Indeks Habitat Vektor Malaria atau Filariasis < 1, dan Success trap tikus <1) ≥ 40% -  < 80%"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase Puskesmas yang melakukan surveilans vektor (Angka Bebas Jentik ≥ 95%, Indeks Habitat Vektor Malaria atau Filariasis < 1, dan Success trap tikus <1)  < 40%"}] 
      },
      { 
        id: 't1-i29', 
        question: "Persentase Puskesmas minimal yang melaksanakan pelayanan ramah anak (PRAP)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase Puskesmas memiliki SK sebagai PRAP meningkat dan minimal ≥ 75% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika  capaian persentase Puskesmas memiliki SK sebagai PRAP menurun namun masih ≥ 75% pada tahun 2024 atau persentase Puskesmas memiliki SK sebagai PRAP meningkat namun < 75% pada tahun 2024"},{"nilai":0,"deskripsi":"NIlai 0 jika capaian persentase Puskesmas memiliki SK sebagai PRAP menurun dan < 75% pada tahun 2024"}] 
      }
    ]
  },
  {
    id: 'tatanan-2',
    name: "INDIKATOR",
    indicators: [
      { 
        id: 't2-i1', 
        question: "Nilai Indeks Kualitas Lingkungan Hidup (IKLH)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika IKLH meningkat dalam 2 tahun terakhir dan mencapai ≥ 70 % pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika IKLH menurun dalam 2 tahun terakhir namun masih ≥ 70 % pada tahun 2024 atau IKLH meningkat dalam 2 tahun terakhir namun <70% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika IKLH menurun dalam 2 tahun terakhir dan <70% pada tahun 2024"}] 
      },
      { 
        id: 't2-i2', 
        question: "Jumlah rumah tangga memiliki akses sanitasi aman", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika  jumlah rumah tangga memiliki akses sanitasi aman meningkat dalam 2 tahun terakhir dan mencapai target tahunan kabupaten/kota di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika  jumlah rumah tangga memiliki akses sanitasi aman tetap dalam 2 tahun terakhir dan mencapai target tahunan kabupaten/kota tahun 2024 atau jumlah rumah tangga memiliki akses sanitasi aman menurun dalam 2 tahun terakhir dan mencapai target tahunan kabupaten/kota tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah rumah tangga memiliki akses sanitasi aman menurun dan tidak mencapai target tahunan kabupatebn/kota"}] 
      },
      { 
        id: 't2-i3', 
        question: "Jumlah rumah tangga yang melakukan pengelolaan sampah", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika jumah tangga yang melakukan pengelolaan sampah meningkat dala 2 tahun terakhiir dan mencapai target tahunan kabupaten/kota"},{"nilai":50,"deskripsi":"Nilai 50 jika  jumah tangga yang melakukan pengelolaan sampah tetap dalam 2 tahun terakhir dan mencapai target tahunan kabupaten/kota atau jumlah rumah tangga yang melakukan pengelolaan sampah menurun dalam 2 tahun terakhir dan mencapai target tahunan kabupaten/kota"},{"nilai":0,"deskripsi":"Nilai 0 jika  jumah tangga yang melakukan pengelolaan sampah menurun dan tidak mencapai target tahunan kabupaten/kota"}] 
      },
      { 
        id: 't2-i4', 
        question: "Luas kawasan permukiman kumuh dalam kewenangan pemerintah kota/kabupaten yang tertangani (luasan di bawah 10 hektar)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika luas kawasan permukiman kumuh menurun"},{"nilai":50,"deskripsi":"Nilai 50 jika luas kawasan permukiman kumuh tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika luas kawasan permukiman kumuh meningkat"}] 
      },
      { 
        id: 't2-i5', 
        question: "Jumlah rumah tangga yang memiliki akses air minum yang layak melalui Sistem Penyediaan Air Minum (SPAM) jaringan perpipaan dan non perpipaan", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika jumlah rumah tangga yang memiliki akses air minum yang layak meningkat dalam 2 tahun terakhir dan mencapai target tahunan kabupaten/kota tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika jumlah rumah tangga yang memiliki akses air minum yang layak tetap dalam 2 tahun terakhir dan mencapai taget tahunan kabupaten/kota tahun 2024  atau jumlah rumah tangga yang memikiki akses air menurun dan mencapai target kabupaten/kota tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah rumah tangga yang memiliki akses air minum yang layak menurun dan tidak mencapai target kabupaten/kota tahun 2024"}] 
      },
      { 
        id: 't2-i6', 
        question: "Persentase Tempat Fasilitas Umum (TFU) yang dilakukan inspeksi kesehatan lingkungan", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase Tempat Fasilitas Umum (TFU) meningkat dan di atas angka nasional tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50  jika persentase Tempat Fasilitas Umum (TFU) menurun namun masih di atas angka nasional tahun 2024 atau persentase Tempat Fasilitas Umum (TFU) meningkat namun di bawah angka nasional tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase Tempat Fasilitas Umum (TFU) menurun dan di bawah angka nasional tahun 2024"}] 
      },
      { 
        id: 't2-i7', 
        question: "Adanya implementasi program langit biru", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada dokumen regulasi program langit biru berupa Peraturan Daerah"},{"nilai":75,"deskripsi":"Nilai 75 jika ada dokumen regulasi program langit biru berupa Peraturan Kepala Daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika ada dokumen regulasi program langit biru berupa SE Kepala Daerah atau atau dokumen regulasi program langit biru berupa Peraturan Daerah tetapi masih berupa  draft"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada dokumen regulasi program langit biru"}] 
      },
      { 
        id: 't2-i8', 
        question: "Pelaksanaan car free day", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika pelaksanaan dilakukan rutin dan melampirkan dokumen  regulasi kegiatan car free day"},{"nilai":50,"deskripsi":"Nilai 50 jika  pelaksanaan dilakukan rutin namun tidak melampirkan dokumen  regulasi kegiatan car free day atau pelaksanaan dilakukan tidak rutin namun melampirkan dokumen  regulasi kegiatan car free day"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada  kegiatan car free day"}] 
      },
      { 
        id: 't2-i9', 
        question: "Adanya keterlibatan masyarakat dalam kegiatan Program Kali Bersih (PROKASIH)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada laporan kegiatan yang melibatkan masyarakat dan melampirkan dokumen regulasi PROKASIH"},{"nilai":50,"deskripsi":"Nilai 50 jika ada laporan kegiatan yang melibatkan masyarakat namun tidak melampirkan dokumen regulasi PROKASIH atau jika hanya melampirkan dokumen regulasi PROKASIH"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada  kegiatan yang melibatkan masyarakat dan tidak ada dokumen regulasi PROKASIH"}] 
      },
      { 
        id: 't2-i10', 
        question: "Adanya Penyelenggara SPAM (BUMD/ UPTD/ BUMDES/ POKMAS/ BUKS/ Swasta) dan memiliki dokumen RISPAM", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada penyelenggara SPAM dan memiliki dokumen RISPAM yang sudah ditetapkan oleh Kepala Daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika ada penyelenggaraan SPAM tetapi tidak memliki dokumen RISPAM atau ada dokumen RISPAM tapi dari Kabupaten/Kota Lain"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada penyelenggaraan SPAM dan tidak memiliki dokumen RISPAM"}] 
      },
      { 
        id: 't2-i11', 
        question: "Adanya regulasi terkait Air Limbah Domestik (ALD) dan  Dokumen Perencanaan Sistem Pengelolaan ALD (Strategi Sanitasi Perkotaan dan/atau Rencana Induk Sistem Pengelolaan ALD)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika melampirkan dokumen regulasi terkait pengelolaan Air Limbah Domestik (ALD) dan dokumen perencanaan"},{"nilai":50,"deskripsi":"Nilai 50 jika hanya melampirkan dokumen regulasi terkait pengelolaan Air Limbah Domestik (ALD) atau dokumen perencanaan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada dokumen regulasi terkait pengelolaan Air Limbah Domestik (ALD) dan dokumen perencanaan"}] 
      },
      { 
        id: 't2-i12', 
        question: "Adanya pemisahan peran Operator dan Regulator dalam kelembagaan pengelola persampahan", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada  (Pengelola ALD adalah UPTD/BLUD/BUMD) dan beroperasi"},{"nilai":75,"deskripsi":"Nilai 75 jika Pengelola Persampahan adalah Dinas dan beroperasi"},{"nilai":50,"deskripsi":"Nilai 50 jika  ada tetapi tidak beroperasi"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak terdapat tusi pengelolaan persampahan pada OPD"}] 
      },
      { 
        id: 't2-i13', 
        question: "Terdapat Instalasi Pengolahan Lumpur Tinja (IPLT), dengan layanan penyedotan lumpur tinja serta truk tinja yang beroperasi", 
        skala: [{"nilai":100,"deskripsi":"NIlai 100 jika adanya layanan penyedotan, truk tinja yang beroperasi dan terdapat instalasi IPLT"},{"nilai":50,"deskripsi":"Nilai 50 jika adanya layanan penyedotan dan truk tinja yang beroperasi"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada layanan penyedotan"}] 
      },
      { 
        id: 't2-i14', 
        question: "Terdapat instalasi pengolahan air limbah domestik (IPALD) serta tersambung ke rumah tangga", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika tersedia dengan idle capacity <50%"},{"nilai":75,"deskripsi":"Nilai 75 jika  tersedia dengan idle capacity 50-85%"},{"nilai":50,"deskripsi":"Nilai 50 jika tersedia dengan idle capacity >85%"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak tersedia IPALD"}] 
      },
      { 
        id: 't2-i15', 
        question: "Adanya regulasi/kebijakan terkait persampahan (Perda atau Perkada) dan Dokumen Perencanaan Sistem Pengelolaan Sampah (Strategi Sanitasi Kabupaten/Kota dan/atau Rencana Induk Sistem Pengelolaan Sampah)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada regulasi/kebijakan dan dokumen perencanaan serta terimplementasi"},{"nilai":50,"deskripsi":"Nilai 50 jika ada, hanya regulasi/kebijakan atau dokumen perencanaan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada"}] 
      },
      { 
        id: 't2-i16', 
        question: "Adanya  pelaksanaan pemilahan sampah oleh kelompok masyarakat dan program pengelolaan sampah tingkat desa yang meliputi pemrosesan awal di tingkat rumah tangga sebelum diangkut ke TPS, adanya upaya pengolahan sampah organik menjadi kompos, memfungsikan TPS menjadi tempat daur ulang sampah rumah tangga, dan pengangkutan sampah dari TPS ke TPA secara rutin", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika  > 80% desa/kelurahan"},{"nilai":75,"deskripsi":"Nilai 75 jika  50 - 80% desa/kelurahan"},{"nilai":50,"deskripsi":"Nilai 50 jika  < 50% desa/kelurahan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak dilakukan pengelolaan sampah"}] 
      },
      { 
        id: 't2-i17', 
        question: "Persentase infrastruktur pengolahan sampah berbasis masyarakat (TPS 3R dan/atau bank sampah) terbangun serta sarana pengangkutan sampah sesuai standar dan beroperasi", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase infrastruktur pengolahan sampah serta sarana pengangkutan sampah sesuai standar meningkat dalam 2 tahun terakhir dan mencapai ≥ 70 % pada tahun 2024 dan beroperasi"},{"nilai":50,"deskripsi":"Nilai 50 jika  persentase infrastruktur pengolahan sampah serta sarana pengangkutan menurun dalam 2 tahun terakhir namun masih  ≥ 80 % pada tahun 2024 dan beroperasi  atau persentase infrastruktur pengolahan sampah serta sarana pengangkutan sesuai standar  meningkat dalam 2 tahun terakhir namun < 80 % pada tahun 2024 dan beroperasi"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase infrastruktur pengolahan sampah serta sarana pengangkutan samoah sesuai standar menurun dalam 2 tahun terakhir dan < 80 % pada tahun 2024 dan tidak beroperasi"}] 
      },
      { 
        id: 't2-i18', 
        question: "Persentase korban kebakaran atau terdampak kebakaran yang mendapatkan pelayanan  penyelamatan dan evakuasi kebakaran", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase korban kebakaran atau terdampak kebakaran mendapatkan pelayanan penyelamatan dan evakuasi meningkat dalam 2 tahun terakhir dan mencapai ≥ 90% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase korban kebakaran atau terdampak kebakaran mendapatkan pelayanan penyelamatan dan evakuasi tetap dalam 2 tahun terakhir dan masih ≥ 90% pada tahun 2024 atau  persentase korban kebakaran dan terdampak kebakaran mendapatkan pelayanan penyelamatan dan evakuasi menurun dalam 2 tahun terakhir tetapi masih <90% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada pelayanan penyelamatan kebakaran dan evakuasi"}] 
      },
      { 
        id: 't2-i19', 
        question: "Keberadaan fasilitas dan sarana di kawasan pertamanan yang ramah anak, ramah lansia dan ramah difable", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ya, tersedia lengkap dan terpelihara"},{"nilai":50,"deskripsi":"Nilai 50  jika ya, tersedia sebagian dan terpelihara atau  jika ya, tersedia tidak terpelihara"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak tersedia"}] 
      },
      { 
        id: 't2-i20', 
        question: "Implementasi ketersediaan/akses tempat pengumpulan limbah B3 yang memenuhi syarat di tingkat Kabupaten/Kota", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ya, tersedia akses terhadap depo/tempat pengumpulan limbah B3"},{"nilai":50,"deskripsi":"Nilai 50 jika ada, hanya regulasi/kebijakan atau depo/tempat pengumpulan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada"}] 
      },
      { 
        id: 't2-i21', 
        question: "Akses rumah tangga yang memenuhi kriteria rumah layak huni", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika akses rumah tangga terhadap rumah layak huni meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika  akses rumah tangga terhadap rumah layak huni  tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika akses rumah tangga terhadap rumah layak huni  menurun"}] 
      },
      { 
        id: 't2-i22', 
        question: "Persentase penduduk yang memiliki akses listrik (rasio elektrifikasi)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase penduduk yang memiliki akses listrik  > 98% pada tahun 2024."},{"nilai":75,"deskripsi":"Nilai 75 jika persentase penduduk yang memiliki akses listrik  98% - 94% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase penduduk yang memiliki akses listrik 94% - 90% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase penduduk yang memiliki akses listrik  < 90% pada tahun 2024"}] 
      }
    ]
  },
  {
    id: 'tatanan-3',
    name: "INDIKATOR",
    indicators: [
      { 
        id: 't3-i1', 
        question: "Keberadaan regulasi daerah tentang pelaksanaan program Usaha Kesehatan Sekolah/Madrasah (UKS/M)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki regulasi daerah tentang pelaksanaan program Usaha Kesehatan Sekolah/Madrasah (UKS/M)"},{"nilai":50,"deskripsi":"NIlai 50 jika regulasi daerah tentang pelaksanaan program Usaha Kesehatan Sekolah/Madrasah (UKS/M) masih dalam proses/bentuk draft"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak memiliki regulasi daerah tentang pelaksanaan program Usaha Kesehatan Sekolah/Madrasah (UKS/M)"}] 
      },
      { 
        id: 't3-i2', 
        question: "Keberadaan program Usaha Kesehatan Sekolah/Madrasah (UKS/M) dalam  perencanaan daerah (RPJMD, RKPD, Renstra PD dan Renja PD)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika  program Usaha Kesehatan Sekolah/Madrasah (UKS/M) masuk ke dalam perencanaan daerah dan diimplementasikan (dibuktikan dengan dokumen penganggarannya)"},{"nilai":50,"deskripsi":"Nilai 50 jika program Usaha Kesehatan Sekolah/Madrasah (UKSM) masuk ke dalam perencanaan daerah tetapi belum diimplementasikan (dibuktikan dengan dokumen penganggarannya)"},{"nilai":0,"deskripsi":"Nilai 0 jika  program Usaha Kesehatan Sekolah/Madrasah (UKS/M) tidak masuk kedalam perencanaan daerah"}] 
      },
      { 
        id: 't3-i3', 
        question: "Persentase Sekolah/Madrasah/Pondok Pesantren yang menerapkan Satuan Pendidikan Ramah Anak", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase Sekolah/Madrasah/Pondok Pesantren yang menerapkan Satuan Pendidikan Ramah Anak meningkat dalam 2 tahun terakhir dan ≥ 71% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50  jika persentase Sekolah/Madrasah/Pondok Pesantren yang menerapkan Satuan Pendidikan Ramah Anak menurun dalam 2 tahun terakhir namun masih  ≥ 71% pada tahun 2024 atau persentase Sekolah/Madrasah/Pondok Pesantren yang menerapkan Satuan Pendidikan Ramah Anak meningkat dalam 2 tahun terakhir namun < 71% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase Sekolah/Madrasah/Pondok Pesantren yang menerapkan Satuan Pendidikan Ramah Anak menurun dalam 2 tahun terakhir dan < 71% pada tahun 2024"}] 
      },
      { 
        id: 't3-i4', 
        question: "Persentase sekolah/madrasah yang mencapai stratifikasi standar Usaha Kesehatan Sekolah/Madrasah (UKS/M) atau yang mengimplementasikan Gerakan Sekolah Sehat secara berkelanjutan", 
        skala: [{"nilai":100,"deskripsi":"NIlai 100 jika capaian persentase sekolah/madrasah yang  mengimplementasikan Gerakan Sekolah Sehat secara berkelanjutan meningkat dalam 2 tahun terakhir dan  ≥ 50% pada tahun 2024"},{"nilai":50,"deskripsi":"NIlai 50 jika capaian persentase sekolah/madrasah yang  mengimplementasikan Gerakan Sekolah Sehat secara berkelanjutan menurun dalam 2 tahun terakhir namun masih  ≥ 50% pada tahun 2024 atau capaian persentase sekolah/madrasah yang  mengimplementasikan Gerakan Sekolah Sehat secara berkelanjutan meningkat dalam 2 tahun terakhir namun < 50% pada tahun 2024"},{"nilai":0,"deskripsi":"NIlai 0 jika capaian persentase sekolah/madrasah yang  mengimplementasikan Gerakan Sekolah Sehat secara berkelanjutan menurun dalam 2 tahun terakhir dan < 50% pada tahun 2024"}] 
      },
      { 
        id: 't3-i5', 
        question: "Persentase Sekolah/Madrasah yang telah dilakukan Inspeksi Kesehatan Lingkungan (IKL)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase Sekolah/Madrasah yang telah dilakukan Inspeksi Kesehatan Lingkungan (IKL) meningkat dalam 2 tahun terakhir dan  ≥ 80% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase Sekolah/Madrasah yang telah dilakukan Inspeksi Kesehatan Lingkungan (IKL) menurun dalam 2 tahun terakhir namun masih ≥ 80% pada tahun 2024 atau capaian persentase Sekolah/Madrasah yang telah dilakukan Inspeksi Kesehatan Lingkungan (IKL) meningkat dalam 2 tahun terakhir namun < 80% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase Sekolah/Madrasah yang telah dilakukan Inspeksi Kesehatan Lingkungan (IKL) menurun dalam 2 tahun terakhir dan < 80% pada tahun 2024"}] 
      },
      { 
        id: 't3-i6', 
        question: "Keberadaan Tim Pembina UKS/M tingkat Kabupaten/Kota dan tingkat Kecamatan", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki SK Tim Pembina Kabupaten/Kota, memiliki seluruh SK Tim Pembina Kecamatan dengan melampirkan dokumen rencana kerja dan capaian kegiatannya"},{"nilai":50,"deskripsi":"Nilai 50  jika memiliki SK Tim Pembina Kabupaten/Kota, memiliki seluruh SK Tim Pembina Kecamatan namun tidak melampirkan dokumen rencana kerja dan capaian kegiatannya atau  memiliki SK Tim Pembina Kabupaten/Kota tetapi masih proses draft SK Tim Pembina Kecamatan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak memiliki SK Tim Pembina Kabupaten/Kota"}] 
      },
      { 
        id: 't3-i7', 
        question: "Presentase Sekolah/Madrasah yang memiliki tim pelaksana UKS/M dibuktikan dengan SK", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika presentase Sekolah/Madrasah yang memiliki tim pelaksana UKS/M meningkat dalam 2 tahun terakhir dan mencapai ≥ 80 % pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika presentase Sekolah/Madrasah yang memiliki tim pelaksana UKS/M menurun dalam 2 tahun terakhir namun masih  ≥ 80 % pada tahun 2024 atau  presentase Sekolah/Madrasah yang memiliki tim pelaksana UKS/M meningkat dalam 2 tahun terakhir namun < 80 % pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika presentase Sekolah/Madrasah yang memiliki tim pelaksana UKS/M menurun dalam 2 tahun terakhir dan < 80 % pada tahun 2024"}] 
      },
      { 
        id: 't3-i8', 
        question: "Persentase sekolah/madrasah yang melakukan pengawasan internal", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase sekolah/madrasah yang melakukan pengawasan internal meningkat dalam 2 tahun terakhir dan mencapai ≥80 % pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika  persentase sekolah/madrasah yang melakukan pengawasan internal  menurun dalam 2 tahun terakhir namun masih  ≥80 % pada tahun 2024 atau persentase sekolah/madrasah yang melakukan pengawasan internal  meningkat dalam 2 tahun terakhir namun <80 % pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase sekolah/madrasah yang melakukan pengawasan internal menurun dalam 2 tahun terakhir dan <80 % pada tahun 2024"}] 
      },
      { 
        id: 't3-i9', 
        question: "Persentase sekolah/ madrasah yang menerapkan sekolah Adiwiyata", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase sekolah/madrasah yang menerapkan sekolah Adiwiyata meningkat dalam 2 tahun terakhir dan mencapai ≥ 80 % pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50  jika persentase sekolah/madrasah yang menerapkan sekolah Adiwiyata menurun dalam 2 tahun terakhir namun masih ≥ 80 % pada tahun 2024 atau persentase sekolah/madrasah yang menerapkan sekolah Adiwiyata meningkat dalam 2 tahun terakhir  terakhir namun < 80 % pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0  jika persentase sekolah/madrasah yang menerapkan sekolah Adiwiyata menurun dalam 2 tahun terakhir  dan < 80 % pada tahun 2024"}] 
      },
      { 
        id: 't3-i10', 
        question: "Persentase sekolah/ madrasah  yang menyelenggarakan  skrining kesehatan", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase sekolah/ madrasah  yang menyelenggarakan  skrining kesehatan meningkat dalam 2 tahun terakhir dan mencapai ≥80% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50  jika  persentase sekolah/ madrasah  yang menyelenggarakan  skrining kesehatan menurun dalam 2 tahun terakhir namun masih ≥80% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0  persentase sekolah/ madrasah  yang menyelenggarakan  skrining kesehatan menurun dalam 2 tahun terakhir  dan <80% pada tahun 2024"}] 
      },
      { 
        id: 't3-i11', 
        question: "Persentase anak usia sekolah dasar dan sederajat yang mendapatkan Imunisasi Sekolah Lengkap (ISL)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase anak usia sekolah dasar dan sederajat yang mendapatkan Imunisasi Sekolah Lengkap (ISL) meningkat dalam 2 tahun dan ≥90% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50  jika capaian persentase anak usia sekolah dasar dan sederajat yang mendapatkan Imunisasi Sekolah Lengkap (ISL) menurun namun masih ≥90% pada tahun 2024 atau capaian persentase anak usia sekolah dasar dan sederajat yang mendapatkan Imunisasi Sekolah Lengkap (ISL) meningkat namun <90% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase anak usia sekolah dasar dan sederajat yang mendapatkan Imunisasi Sekolah Lengkap (ISL) menurun dan  <90% pada tahun 2024"}] 
      }
    ]
  },
  {
    id: 'tatanan-4',
    name: "INDIKATOR",
    indicators: [
      { 
        id: 't4-i1', 
        question: "Adanya regulasi daerah tentang pasar sehat", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada Perda/Perbub/Perwali/Kebijakan dan sudah disahkan oleh Kepala Daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika ada Perda/Perbub/Perwali/Kebijakan namun masa berlaku sudah habis atau masih dalam proses penyusunan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada Perda/Perbub/Perwali/Kebijakan"}] 
      },
      { 
        id: 't4-i2', 
        question: "Adanya regulasi penanganan Pedagang Kaki Lima (PKL)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada Perda/Perbub/Perwali/Kebijakan dan sudah disahkan oleh Kepala Daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika ada Perda/Perbub/Perwali/Kebijakan namun masa berlaku sudah habis atau masih dalam proses penyusunan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada Perda/Perbub/Perwali/Kebijakan"}] 
      },
      { 
        id: 't4-i3', 
        question: "Persentase pasar yang menerapkan Kawasan Tanpa Rokok (KTR)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar yang menerapkan KTR meningkat dan mencapai ≥ 50% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar yang menerapkan KTR meningkat dalam 2 tahun terakhir namun mencapai < 50% di tahun 2024 atau  persentase pasar yang menerapkan KTR menurun dalam 2 tahun terakhir dan mencapai ≥ 50% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar yang menerapkan KTR menurun dalam 2 tahun terakhir namun < 50% di tahun 2024 atau tidak ada pasar yang menerapkan KTR"}] 
      },
      { 
        id: 't4-i4', 
        question: "Persentase pasar yang menerapkan Kesehatan dan Keselamatan Kerja (K3)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar yang menerapkan K3 meningkat dalam 2 tahun terakhir dan mencapai ≥ 70% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar yang menerapkan K3 meningkat dalam 2 tahun terakhir namun mencapai < 70% di tahun 2024 atau persentase pasar yang menerapkan K3 menurun dalam 2 tahun terakhir dan mencapai ≥ 70% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar yang menerapkan K3 menurun  dalam 2 tahun terakhir dan mencapai < 70% di tahun 2024 atau tidak ada pasar yang menerapkan K3"}] 
      },
      { 
        id: 't4-i5', 
        question: "Persentase Pasar menyediakan akses air bersih/air minum yang memenuhi persyaratan", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar menyediakan air minum yang memenuhi persyaratan meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar menyediakan air minum yang memenuhi persyaratan meningkat dalam 2 tahun terakhir namun mencapai < 80% di tahun 2024 atau persentase pasar menyediakan air minum yang memenuhi persyaratan menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar menyediakan air minum yang memenuhi persyaratan menurun dalam 2 tahun terakhir dan mencapai < 80% di tahun 2024 atau tidak ada pasar menyediakan air minum yang memenuhi persyaratan"}] 
      },
      { 
        id: 't4-i6', 
        question: "Persentase pasar melakukan pengawasan internal terkait kesehatan (contoh : pengawasan bahan pangan berbahaya atau uji kelayakan air bersih)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar melakukan pengawasan internal meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar melakukan pengawasan internal meningkat dalam 2 tahun terakhir namun mencapai < 80% di tahun 2024 atau persentase pasar melakukan pengawasan internal menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar melakukan pengawasan internal menurun dalam 2 tahun terakhir dan mencapai < 80% di tahun 2024 atau tidak ada pasar melakukan pengawasan internal"}] 
      },
      { 
        id: 't4-i7', 
        question: "Persentase pasar melaksanakan Komunikasi, Informasi dan Edukasi (KIE) kesehatan  masyarakat bekerja sama dengan sektor terkait  kepada masyarakat pasar", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar melaksanakan KIE meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar melaksanakan KIE meningkat  dalam 2 tahun terakhir namun mencapai < 80% di tahun 2024 atau persentase pasar melaksanakan KIE menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar melaksanakan KIE menurun dalam 2 tahun terakhir dan mencapai < 80% di tahun 2024 atau tidak ada pasar melaksanakan KIE"}] 
      },
      { 
        id: 't4-i8', 
        question: "Persentase pasar memiliki fasilitas ruang ASI", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar memilki fasilitas ruang ASI meningkat dalam 2 tahun terakhir dan mencapai ≥ 70% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar memilki fasilitas ruang ASI meningkat dalam 2 tahun terakhir namun mencapai ≥ 70% di tahun 2024 atau persentase pasar memilki fasilitas ruang ASI menurun dalam 2 tahun terakhir dan mencapai ≥ 70% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar memilki fasilitas ruang ASI menurun dalam 2 tahun terakhir dan mencapai < 70% di tahun 2024 atau tidak ada pasar memilki fasilitas ruang ASI"}] 
      },
      { 
        id: 't4-i9', 
        question: "Persentase pasar melakukan pengelolaan sampah dengan prinsip 3 R (reduce, reuse, dan recyle)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar melakukan pengelolaan sampah dengan prinsip 3 R meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar melakukan pengelolaan sampah dengan prinsip 3 R meningkat dalam 2 tahun terakhir namun mencapai < 80% di tahun 202 atau persentase pasar melakukan pengelolaan sampah dengan prinsip 3 R menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar melakukan pengelolaan sampah dengan prinsip 3 R menurun dalam 2 tahun terakhir dan mencapai < 80% di tahun 2024 atau tidak ada pasar melakukan pengelolaan sampah dengan prinsip 3 R"}] 
      },
      { 
        id: 't4-i10', 
        question: "Persentase pasar melakukan pengelolaan limbah  cair", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar melakukan pengelolaan limbah cair meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar melakukan pengelolaan limbah cair meningkat dalam 2 tahun terakhir namun mencapai < 80% di tahun 2024 atau persentase pasar melakukan pengelolaan limbah cair menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar melakukan pengelolaan limbah cair menurun dalam 2 tahun terakhir dan mencapai < 80% di tahun 2024 atau tidak ada pasar melakukan pengelolaan limbah cair"}] 
      },
      { 
        id: 't4-i11', 
        question: "Persentase pasar memiliki fasilitas toilet yang bersih dan memadai", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar memiliki fasilitas toilet bersih dan memadai meningkat dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar memiliki fasilitas toilet bersih dan memadai meningkat namun mencapai < 80% di tahun 2024 atau persentase pasar memiliki fasilitas toilet bersih dan memadai menurun dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar memiliki fasilitas toilet bersih dan memadai menurun dan  mencapai < 80% atau tidak ada pasar emiliki fasilitas toilet bersih dan memadai"}] 
      },
      { 
        id: 't4-i12', 
        question: "Persentase pasar memiliki fasilitas pos kesehatan (ruang kesehatan atau fasilitas P3K)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar memiliki fasilitas pos kesehatan meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar memiliki fasilitas pos kesehatan meningkat dalam 2 tahun terakhir namun mencapai < 80% di tahun 2024 atau  persentase pasar memiliki fasilitas pos kesehatan menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar memiliki fasilitas pos kesehatan menurun dalam 2 tahun terakhir dan mencapai < 80% di tahun 2024 atau tidak ada pasar memiliki fasilitas pos kesehatan"}] 
      },
      { 
        id: 't4-i13', 
        question: "Persentase pasar terdapat pemotongan hewan di dalam pasar", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pasar terdapat pemotongan hewan di dalam pasar menurun dalam 2 tahun terakhir dan mencapai ≤ 30% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pasar terdapat pemotongan hewan di dalam pasar menurun dalam 2 tahun terakhir namun mencapai > 30% atau persentase pasar terdapat pemotongan hewan di dalam pasar meningkat dalam 2 tahun terakhir dan mencapai ≤ 30% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pasar terdapat pemotongan hewan di dalam pasar meningkat dalam 2 tahun terakhir dan mencapai > 30% atau seluruh pasar masih terdapat pemotongan hewan di dalam pasar"}] 
      }
    ]
  },
  {
    id: 'tatanan-5',
    name: "INDIKATOR",
    indicators: [
      { 
        id: 't5-i1', 
        question: "Persentase industri kecil dan menengah (IKM) memenuhi kewajiban perizinan berusaha pada sektor perindustrian", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase IKM memenuhi standar kegiatan usaha meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase IKM memenuhi standar kegiatan usaha meningkat dalam 2 tahun terakhir namun mencapai < 80% di tahun 2024 atau persentase IKM memenuhi standar kegiatan usaha menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase IKM memenuhi standar kegiatan usaha menurun dalam 2 tahun terakhir dan mencapai < 80% atau tida ada IKM memenuhi standar kegiatan usaha"}] 
      },
      { 
        id: 't5-i2', 
        question: "Persentase tempat kerja/ perusahaan yang menerapkan Kawasan Tanpa Rokok (KTR)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase tempat kerja/ perusahaan yang menerapkan KTR meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase tempat kerja/ perusahaan yang menerapkan  KTR meningkat dalam 2 tahun terakhir namun mencapai < 80% di tahun 2024 atau persentase tempat kerja/ perusahaan yang menerapkan  KTR menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase  tempat kerja/ perusahaan yang menerapkan KTR menurun dalam 2 tahun terakhir dan mencapai < 80% di tahun 2024 atau tidak ada tempat kerja/ perusahaan yang menerapkan KTR"}] 
      },
      { 
        id: 't5-i3', 
        question: "Jumlah tempat kerja atau perusahaan  memiliki Unit Panitia Pembina Keselamatan dan Kesehatan Kerja (P2K3)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika jumlah tempat kerja/ perusahaan  memiliki Unit P2K3 meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika jumlah tempat kerja/ perusahaan memiliki Unit P2K3  tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah tempat kerja/ perusahaan memiliki Unit P2K3 menurun"}] 
      },
      { 
        id: 't5-i4', 
        question: "Persentase tempat kerja memfasilitasi pemeriksaan kesehatan berkala (deteksi dini) pada pegawainya minimal 1 tahun sekali", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase tempat kerja memfasilitasi pemeriksaan kesehatan berkala meningkat dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase tempat kerja yang memfasilitasi pemeriksaan kesehatan berkala meningkat dalam 2 tahun terakhir namun mencapai < 80% ditahun 2024 atau persentase tempat kerja yang memfasilitasi pemeriksaan kesehatan berkala menurun dalam 2 tahun terakhir dan mencapai ≥ 80% di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase tempat kerja yang memfasilitasi pemeriksaan kesehatan berkala menurun dalam 2 tahun terakhir dan mencapai < 80% di tahun 2024 atau tidak ada pasar yang memfasilitasi pemeriksaan kesehatan berkala"}] 
      },
      { 
        id: 't5-i5', 
        question: "Angka kecelakaan kerja di tempat kerja setahun terakhir", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika angka kecelakaan di tempat kerja menurun"},{"nilai":50,"deskripsi":"Nilai 50 jika angka kecelakaan di tempat kerja tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika angka kecelakaan di tempat kerja meningkat"}] 
      },
      { 
        id: 't5-i6', 
        question: "Jumlah perusahaan mendapatkan penghargaan dibidang kesehatan yang diberikan oleh pemerintah pusat atau daerah", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika  jumlah perusahaan mendapatkan penghargaan dibidang kesehatan meningkat dalam 2 tahun terakhir dan mencapai ≥ 10 perusahaan di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika  jumlah perusahaan mendapatkan penghargaan dibidang kesehatan meningkat dalam 2 tahun terakhir namun mencapai <10 perusahaan di tahun 2024 atau jumlah perusahaan mendapatkan penghargaan dibidang kesehatan menurun dalam 2 tahun terakhir dan mencapai ≥ 10 perusahaan di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika  jumlah perusahaan mendapatkan penghargaan dibidang kesehatan menurun dalam 2 tahun terakhir dan mencapai <10 perusahaan atau tidak ada perusahaan mendapatkan penghargaan dibidang kesehatan"}] 
      },
      { 
        id: 't5-i7', 
        question: "Persentase jumlah puskesmas membina Pos UKK", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika presentase jumlah puskesmas yang membina pos UKK meningkat dalam 2 tahun terakhir dan mencapai ≥ 80 % di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika presentase jumlah puskesmas yang membina pos UKK meningkat dalam 2 tahun terakhir namun mencapai < 80 % di tahun 2024 atau presentase jumlah puskesmas yang membina pos UKK menurun dan mencapai ≥ 80 % di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika presentase jumlah puskesmas yang membina pos UKK menurun dalam 2 tahun terakhir dan < 80 % di tahun 2024  atau tidak ada puskesmas ang membina pos UKK"}] 
      },
      { 
        id: 't5-i8', 
        question: "Jumlah  perusahaan menerapkan Gerakan Pekerja Perempuan Sehat Produktif (GP2SP)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika  jumlah perusahaan menerapkan GP2SP  meningkat dalam 2 tahun terakhir dan mencapai ≥  200 di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika jumlah perusahaan menerapkan GP2SP  meningkat dalam 2 tahun terakhir namun mencapai < 200 di tahun 2024 atau jumlah perusahaan menerapkan GP2SP  menurun dalam 2 tahun terakhir dan mencapai ≥  200 di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah perusahaan menerapkan GP2SP  menurun dalam 2 tahun terakhir dan mencapai < 200 di tahun 2024 atau tidak ada perusahaan menerapkan GP2SP"}] 
      },
      { 
        id: 't5-i9', 
        question: "Jumlah kasus pencemaran lingkungan akibat industri dalam setahun terakhir", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika jumlah kasus pencemaran lingkungan akibat industri menurun"},{"nilai":50,"deskripsi":"Nilai 50 jika jumlah kasus pencemaran lingkungan akibat industri tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah kasus pencemaran lingkungan akibat industri meningkat"}] 
      },
      { 
        id: 't5-i10', 
        question: "Persentase perusahaan menyampaikan laporan Rencana Pengelolaan Lingkungan (RKL)/ Rencana Pemantauan Lingkungan (RPL) / Upaya Pengelolaan Lingkungan (UKL)/ Upaya Pemantauan Lingkungan (UPL)  secara berkala 6 bulan sekali", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika presentase laporan perusahaan terkait RKL-RPL/UKL-UPL  meningkat dalam 2 tahun terakhir dan mencapai ≥ 80 % di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika  presentase laporan perusahaan terkait RKL-RPL/UKL-UPL meningkat dalam 2 tahun terakhir namun < 80 % di tahun 2024 atau presentase laporan perusahaan terkait RKL-RPL/UKL-UPL  menurun dalam 2 tahun terakhir dan mencapai ≥ 80 % di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika presentase laporan perusahaan terkait RKL-RPL/UKL-UPL menurun dalam 2 tahun terakhir dan < 80 % di tahun 2024 atau tidak ada perusahaan menyampaikan laporan terkait RKL-RPL/UKL-UPL"}] 
      },
      { 
        id: 't5-i11', 
        question: "Persentase usaha mikro sektor makanan, minuman, industri pengolahan yang memiliki Sertifikat PIRT, MD BPOM/ Izin Edar", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase usaha mikro sektor makanan, minuman, industri pengolahan yang memiliki Sertifikat PIRT, MD BPOM/Izin Edar meningkat dalam 2 tahun terakhir dan mencapai ≥ 80 % di tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika  persentase usaha mikro sektor makanan, minuman, industri pengolahan yang memiliki Sertifikat PIRT, MD BPOM/Izin Edar meningkat dalam 2 tahun terakhir namun < 80 % di tahun 2024 atau persentase usaha mikro sektor makanan, minuman, industri pengolahan yang memiliki Sertifikat PIRT, MD BPOM/Izin Edar menurun dalam 2 tahun terakhir namun masih  ≥ 80 % di tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika  persentase usaha mikro sektor makanan, minuman, industri pengolahan yang memiliki Sertifikat PIRT, MD BPOM/Izin Edar menurun dalam 2 tahun terakhir dan mencapai < 80 % di tahun 2024 atau tidak ada usaha mikro sektor makanan, minuman, industri  yang memiliki Sertifikat PIRT, MD BPOM/Izin Edar"}] 
      }
    ]
  },
  {
    id: 'tatanan-6',
    name: "INDIKATOR",
    indicators: [
      { 
        id: 't6-i1', 
        question: "Keberadaan regulasi daerah tentang Pariwisata Sehat", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika dituangkan dalam Peraturan Daerah"},{"nilai":75,"deskripsi":"Nilai 75 jika dituangkan dalam Peraturan Kepala Daerah (Perwali/ Perbup) atau sedang dalam proses penyusunan Raperda"},{"nilai":50,"deskripsi":"Nilai 50 jika dituangkan dalam Peraturan lainnya"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada regulasi"}] 
      },
      { 
        id: 't6-i2', 
        question: "Rencana Induk Pembangunan Pariwisata Daerah (RIPPARDA) masuk dalam dokumen perencanaan daerah (RPJMD/Renstra/RKPD)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada Rencana Induk Pembangunan Pariwisata Daerah (RIPPARDA) dan masuk dalam dokumen perencanaan daerah"},{"nilai":75,"deskripsi":"Nilai 75 jika ada Rencana Induk Pembangunan Pariwisata Daerah (RIPPARDA) tetapi belum masuk dalam dokumen perencanaan daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika sedang dalam proses penyusunan Rencana Induk Pembangunan Pariwisata Daerah (RIPPARDA)"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada  Rencana Induk Pembangunan Pariwisata Daerah (RIPPARDA)"}] 
      },
      { 
        id: 't6-i3', 
        question: "Persentase sarana akomodasi yang memiliki Sertifikat Laik Sehat (SLS)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase daya tarik wisata yang sudah memiliki sertifikat laik sehat (SLS) dan meningkat dalam 2 tahun"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase  daya tarik wisata pariwisata yang sudah memiliki sertifikat laik sehat (SLS) dan tetap dalam 2 tahun"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase  daya tarik wisata pariwisata yang sudah memiliki sertifikat laik sehat (SLS) menurun atau 0 dalam 2 tahun"}] 
      },
      { 
        id: 't6-i4', 
        question: "Persentase Daya Tarik Wisata yang memiliki Sertifikat Laik Sehat (SLS)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase daya tarik wisata yang sudah memiliki sertifikat laik sehat (SLS) dan meningkat dalam 2 tahun"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase  daya tarik wisata pariwisata yang sudah memiliki sertifikat laik sehat (SLS) dan tetap dalam 2 tahun"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase  daya tarik wisata pariwisata yang sudah memiliki sertifikat laik sehat (SLS) dan menurun dalam 2 tahun"}] 
      },
      { 
        id: 't6-i5', 
        question: "Persentase Tempat Pengolahan Pangan (TPP) Siap Saji yang memiliki Sertifikat Laik Hygiene Sanitasi (SLHS)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase TPP yang Wajib SLSH memiliki SLHS meningkat dalam 2 tahun"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase TPP yang Wajib SLSH memiliki SLHS tetap dalam 2 tahun"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase TPP yang Wajib SLSH memiliki SLHS menurun atau 0 dalam 2 tahun"}] 
      },
      { 
        id: 't6-i6', 
        question: "Keberadaan Daya Tarik Wisata (DTW) yang menyediakan fasilitas pelayanan kesehatan atau bekerja sama dengan fasilitas pelayanan kesehatan terdekat", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika seluruh DTW menyediakan fasilitas pelayanan kesehatan"},{"nilai":50,"deskripsi":"Nilai 50 jika sebagian DTW menyediakan fasilitas pelayanan kesehatan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada DTW yang menyediakan fasilitas pelayanan kesehatan"}] 
      },
      { 
        id: 't6-i7', 
        question: "Persentase Daya Tarik Wisata (DTW) yang menerapkan pariwisata inklusif", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase Daya Tarik Wisata (DTW) yang menerapkan pariwisata inklusif meningkat dalam 2 tahun terakhir dan mencapai ≥ 75 % pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase Daya Tarik Wisata (DTW) yang menerapkan pariwisata inklusif  menurun dalam 2 tahun terakhir namun masih  ≥ 75 % pada tahun 2024 atau capaian persentase Daya Tarik Wisata (DTW) yang menerapkan pariwisata inklusif  meningkat dalam 2 tahun terakhir namun < 75 % pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase Daya Tarik Wisata (DTW) yang menerapkan pariwisata inklusif  menurun dalam 2 tahun terakhir dan < 75 % pada tahun 2024"}] 
      },
      { 
        id: 't6-i8', 
        question: "Daya Tarik Wisata (DTW) menyediakan asuransi keselamatan bagi wisatawan", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika seluruh DTW menyediakan asuransi bagi wisatawan"},{"nilai":50,"deskripsi":"Nilai 50 jika sebagian DTW menyediakan asuransi"},{"nilai":0,"deskripsi":"Nilai 0 jika DTW tidak menyediakan asuransi"}] 
      },
      { 
        id: 't6-i9', 
        question: "Tersedianya Daya Tarik Wisata (DTW) yang kondusif", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika seluruh DTW memiliki kerja sama dengan pemangku kepentingan (stakeholder terkait)"},{"nilai":50,"deskripsi":"Nilai 50 jika sebagian DTW memiliki kerja sama dengan pemangku kepentingan (stakeholder terkait)"},{"nilai":0,"deskripsi":"Nilai 0 jika DTW tidak memiliki kerja sama dengan pemangku kepentingan (stakeholder terkait)"}] 
      },
      { 
        id: 't6-i10', 
        question: "Kabupaten/Kota memiliki Desa/Kampung Wisata", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika kabupaten/kota memiliki Desa/Kampung Wisata dan sudah di SK oleh Kepala Daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika kabupaten/kota memiliki Desa/Kampung Wisata namun belum di SK oleh Kepala Daerah"},{"nilai":0,"deskripsi":"Nilai 0 jika kabupaten/kota tidak memiliki Desa/kampung Wisata"}] 
      },
      { 
        id: 't6-i11', 
        question: "Terdapat Kelompok Sadar Wisata (Pokdarwis) di setiap Desa/Kampung Wisata", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika semua Desa/Kampung Wisata memiliki Pokdarwis, berfungsi dan berkelanjutan"},{"nilai":50,"deskripsi":"Nilai 50 jika semua Desa/Kampung Wisata memiliki Pokdarwis dan berfungsi"},{"nilai":0,"deskripsi":"Nilai 0 jika semua Desa/Kampung Wisata tidak memiliki Pokdarwis"}] 
      },
      { 
        id: 't6-i12', 
        question: "Persentase Daya Tarik Wisata (DTW) yang memiliki upaya pengelolaan sampah secara mandiri", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki upaya pengelolaan sampah secara mandiri dan meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika memiliki upaya pengelolaan sampah secara mandiri dan tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika memiliki upaya pengelolaan sampah secara mandiri dan menurun"}] 
      }
    ]
  },
  {
    id: 'tatanan-7',
    name: "INDIKATOR",
    indicators: [
      { 
        id: 't7-i1', 
        question: "Adanya regulasi terkait penyediaan layanan transportasi jalan, kawasan tertib lalu lintas, sistem manajemen keselamatan lalu lintas dan angkutan jalan", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki dokumen regulasi terkait penyediaan layanan transportasi jalan kawasan tertib lalu lintas, sistem manajemen keselamatan lalu lintas dan angkutan jalan dan lainnya yang masih berlaku"},{"nilai":50,"deskripsi":"Nilai 50 jika memiliki dokumen regulasi terkait penyediaan layanan transportasi jalan kawasan tertib lalu lintas, sistem manajemen keselamatan lalu lintas dan angkutan jalan dan lainnya namun masih belum disahkan/ proses draft/ masa berlaku habis"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak memiliki dokumen regulasi terkait penyediaan layanan transportasi jalan kawasan tertib lalu lintas, sistem manajemen keselamatan lalu lintas dan angkutan jalan dan lainnya"}] 
      },
      { 
        id: 't7-i2', 
        question: "Persentase kendaraan umum yang laik jalan, minimal ≥ 80%", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase kendaraan umum yang laik jalan meningkat dalam 2 tahun terakhir dan  ≥ 80% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase kendaraan umum yang laik jalan menurun dalam 2 tahun terakhir namun masih ≥ 80% pada tahun 2024 atau persentase kendaraan umum yang laik jalan meningkat dalam 2 tahun terakhir namun < 80% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase kendaraan umum yang laik jalan menurun dalam 2 tahun terakhir dan < 80% pada tahun 2024"}] 
      },
      { 
        id: 't7-i3', 
        question: "Persentase penurunan tingkat fatalitas akibat kecelakaan dalam tahun berjalan ≤ 65%", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase penurunan tingkat fatalitas akibat kecelakaan menurun dalam 2 tahun terakhir dan ≤ 65% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase penurunan tingkat fatalitas akibat kecelakaan meningkat dalam 2 tahun terakhir namun masih ≤ 65% pada tahun 2024 atau persentase penurunan tingkat fatalitas akibat kecelakaan menurun dalam 2 tahun terakhir namun > 65% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika  capaian persentase penurunan tingkat fatalitas akibat kecelakaan meningkat dalam 2 tahun terakhir dan < 65% pada tahun 2024"}] 
      },
      { 
        id: 't7-i4', 
        question: "Adanya sistem layanan pertolongan kecelakaan yang cepat dan terintegrasi kesiapsiagaan dalam penanganan korban kecelakaan", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki sistem layanan dalam penanganan korban kecelakaan"},{"nilai":50,"deskripsi":"Nilai 50 jika memiliki sistem layanan dalam penanganan korban kecelakaan"},{"nilai":25,"deskripsi":"Nilai 25 jika memiliki sistem layanan dalam penanganan korban kecelakaan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak memiliki sistem layanan dalam penanganan korban kecelakaan"}] 
      },
      { 
        id: 't7-i5', 
        question: "Adanya program pemeriksaan NAPZA atau narkoba terhadap pengemudi", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika adanya program pemeriksaan NAPZA atau narkoba terhadap pengemudi, melampirkan dokumen laporannya dan dilakukan secara berkala"},{"nilai":75,"deskripsi":"Nilai 75 jika adanya program pemeriksaan NAPZA atau narkoba terhadap pengemudi, melampirkan dokumen laporannya namun tidak dilakukan secara berkala"},{"nilai":50,"deskripsi":"Nilai 50 jika adanya program pemeriksaan NAPZA atau narkoba terhadap pengemudi namun tidak melampirkan dokumen laporannya"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada program pemeriksaan NAPZA atau narkoba terhadap pengemudi"}] 
      },
      { 
        id: 't7-i6', 
        question: "Terminal yang memenuhi syarat kesehatan", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika semua tipe terminal dilakukan IKL dan hasilnya semua memenuhi syarat"},{"nilai":75,"deskripsi":"Nilai 75 jika semua tipe terminal dilakukan IKL dan hasilnya  ≥ 80% memenuhi syarat"},{"nilai":50,"deskripsi":"Nilai 50 jika hanya 50% dari semua tipe terminal terminal dilakukan IKL"},{"nilai":0,"deskripsi":"Nilai 0 jika semua tipe terminal tidak dilakukan IKL"}] 
      },
      { 
        id: 't7-i7', 
        question: "Persentase angkutan umum yang memiliki BLUe (Bukti Lulus Uji Elektronik)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase angkutan umum yang memiliki BLUe (Bukti Lulus Uji Elektronik)  meningkat dalam 2 tahun terakhir dan  ≥ 80% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50jika capaian persentase angkutan umum yang memiliki BLUe (Bukti Lulus Uji Elektronik)  menurun dalam 2 tahun terakhir namun masih ≥ 80% pada tahun 2024 atau persentase angkutan umum yang memiliki BLUe (Bukti Lulus Uji Elektronik) meningkat dalam 2 tahun terakhir namun < 80% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase angkutan umum yang memiliki BLUe (Bukti Lulus Uji Elektronik)  menurun dalam 2 tahun terakhir dan < 80% pada tahun 2024"}] 
      },
      { 
        id: 't7-i8', 
        question: "Keberadaan fasilitas jalur pejalan kaki (trotoar) bagi masyarakat umum dan penyandang disabilitas", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki  fasilitas jalur pejalan kaki (trotoar) bagi masyarakat umum dan penyandang disabilitas dan semua berfungsi sesuai peruntukannya"},{"nilai":50,"deskripsi":"Nilai 50 jika memiliki  fasilitas jalur pejalan kaki (trotoar) bagi masyarakat umum dan penyandang disabilitas namun tidak semua berfungsi sesuai peruntukannya (rusak)"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak memiliki  fasilitas jalur pejalan kaki (trotoar) bagi masyarakat umum dan penyandang disabilitas"}] 
      },
      { 
        id: 't7-i9', 
        question: "Jumlah titik fasilitas lajur sepeda", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika jumlah titik fasilitas lajur sepeda meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika jumlah titik fasilitas lajur sepeda tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah titik fasilitas lajur sepeda menurun atau tidak memiliki"}] 
      },
      { 
        id: 't7-i10', 
        question: "Adanya Zona Selamat Sekolah (ZoSS)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika jumlah Zona Selamat Sekolah (ZoSS) meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika jumlah Zona Selamat Sekolah (ZoSS) tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika jumlah Zona Selamat Sekolah (ZoSS) menurun atau tidak memiliki"}] 
      },
      { 
        id: 't7-i11', 
        question: "Pengawasan dan penindakan terhadap emisi gas buang kendaraan", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki bengkel terakreditasi atau yang ditunjuk sesuai peraturan kegiatan pengawasan dan terdokumentasi"},{"nilai":50,"deskripsi":"Nilai 50 jika memiliki bengkel terakreditasi atau yang ditunjuk sesuai peraturan kegiatan pengawasan namun tidak terdokumentasi"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak memiliki bengkel terakreditasi atau yang ditunjuk sesuai peraturan kegiatan pengawasan"}] 
      }
    ]
  },
  {
    id: 'tatanan-8',
    name: "INDIKATOR",
    indicators: [
      { 
        id: 't8-i1', 
        question: "Adanya peraturan mengenai Penyelenggaraan Kesejahteraan Sosial di daerah", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada Perda mencakup tiga manfaat : pensiun, disabilitas, dan kecacatan, dan survivors"},{"nilai":75,"deskripsi":"Nilai 75 jika ada Perkada atau peraturan lainnya mencakup tiga manfaat : pensiun, disabilitas, dan kecacatan, dan survivors atau masih dalam proses penyusunan Raperda"},{"nilai":50,"deskripsi":"Nilai 50 jika ada Perda, Perkada atau Peraturan lainnya namun tidak mencakup tiga manfaat : pensiun, disabilitas, dan kecacatan, dan survivors"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada"}] 
      },
      { 
        id: 't8-i2', 
        question: "Monitoring dan evaluasi program jaminan perlindungan sosial yang dilakukan daerah", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika melakukan monitoring dan evaluasi secara lengkap dan baik"},{"nilai":50,"deskripsi":"Nilai 50 jika melakukan monitoring dan evaluasi dengan beberapa catatan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak melakukan monitoring dan evaluasi"}] 
      },
      { 
        id: 't8-i3', 
        question: "Angka Kriminalitas", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika angka kriminalitas menurun"},{"nilai":50,"deskripsi":"Nilai 50 jika angka kriminalitas tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika angka kriminalitas meningkat"}] 
      },
      { 
        id: 't8-i4', 
        question: "Persentase pelayanan komprehensif yang diberikan kepada perempuan dan anak korban kekerasan", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika persentase pelayanan meningkat"},{"nilai":50,"deskripsi":"Nilai 50 jika persentase pelayanan tetap"},{"nilai":0,"deskripsi":"Nilai 0 jika persentase pelayanan menurun"}] 
      },
      { 
        id: 't8-i5', 
        question: "Persentase pemerlu pelayanan kesejahteraan sosial (PPKS) yang memperoleh program perlindungan dan jaminan sosial, rehabilitasi sosial dan pemberdayaan sosial", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase PPKS meningkat dalam 2 tahun dan ≥80% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase PPKS menurun dalam 2 tahun namun  ≥80% pada tahun 2024 atau persentase PPKS meningkat namun <80% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika capaian persentase PPKS menurun dalam 2 tahun dan <80% pada tahun 2024"}] 
      },
      { 
        id: 't8-i6', 
        question: "Adanya layanan pengaduan terkait permasalahan sosial", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada dan seluruh pengaduan ditindaklanjuti"},{"nilai":75,"deskripsi":"Nilai 75 jika ada dan sebagian pengaduan ditindaklanjuti"},{"nilai":50,"deskripsi":"Nilai 50 jika ada dan pengaduan tidak ditindaklanjuti"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada unit layanan pengaduan"}] 
      },
      { 
        id: 't8-i7', 
        question: "Adanya kebijakan/program peningkatan kesejahteraan sosial dalam Rencana Pembangunan jangka Menengah Daerah/RPJMD", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada dan terealisasi seluruhnya"},{"nilai":75,"deskripsi":"Nilai 75 jika ada namun terealisasi sebagian"},{"nilai":50,"deskripsi":"Nilai 50 jika ada tapi tidak terealisasi"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada"}] 
      },
      { 
        id: 't8-i8', 
        question: "Keberadaan peran Lembaga Kesejahteraan Sosial (LKS) yang memberikan penanganan kepada pemerlu pelayanan kesejahteraan sosial (PPKS) yang berbadan hukum/ terdaftar di dinas sosial", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada dan aktif seluruhnya"},{"nilai":75,"deskripsi":"Nilai 75 jika ada namun aktif sebagian"},{"nilai":50,"deskripsi":"Nilai 50 jika ada namun tidak aktif"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada PPKS"}] 
      },
      { 
        id: 't8-i9', 
        question: "Adanya regulasi daerah tentang penanganan kekerasan anak, perempuan dan Lansia", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika dituangkan dalam Peraturan Daerah"},{"nilai":75,"deskripsi":"Nilai 75 jika dituangkan dalam Peraturan Kepala Daerah atau sedang dalam proses penyusunan Raperda"},{"nilai":50,"deskripsi":"Nilai 50 jika dituangkan dalam Peraturan lainnya"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada regulasi"}] 
      },
      { 
        id: 't8-i10', 
        question: "Adanya penyelenggaraan penanganan kekerasan anak, perempuan dan lansia  dalam Rencana Pembangunan Jangka Menengah Daerah/RPJMD", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada dalam RPJMD dan terealisasi seluruhnya"},{"nilai":75,"deskripsi":"Nilai 75 jika ada dalam RPJMD dan terealisasi sebagian"},{"nilai":50,"deskripsi":"Nilai 50 jika ada dalam RPJMD tapi belum terealisasi"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada dalam RPJMD"}] 
      },
      { 
        id: 't8-i11', 
        question: "Adanya upaya pencegahan untuk menurunkan angka perkawinan pada usia anak", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada 4 upaya"},{"nilai":75,"deskripsi":"Nilai 75 jika ada 3 upaya"},{"nilai":50,"deskripsi":"Nilai 50 jika ada 1 - 2 upaya"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada upaya"}] 
      },
      { 
        id: 't8-i12', 
        question: "Adanya penggiat penanganan kekerasan terhadap anak, perempuan, dan Lansia baik secara individu/kelompok", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada penggiat, memiliki rencana kerja dan terealisasi"},{"nilai":75,"deskripsi":"Nilai 75 jika ada penggiat, memiliki rencana kerja namun tidak terealisasi"},{"nilai":50,"deskripsi":"Nilai 50 jika ada penggiat namun tidak memiliki rencana kerja"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada penggiat"}] 
      },
      { 
        id: 't8-i13', 
        question: "Persentase Tingkat Penggangguran Terbuka (TPT)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika capaian persentase TPT menurun dalam 2 tahun terakhir dan ≤4% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika capaian persentase TPT meningkat dalam 2 tahun terakhir namun ≤4% pada tahun 2024 atau capaian persentase TPT menurun dalm 2 tahun namun >4%"},{"nilai":0,"deskripsi":"Nilai 0 jika meningkat dalam 2 tahun dan >4% pada tahun 2024"}] 
      }
    ]
  },
  {
    id: 'tatanan-9',
    name: "INDIKATOR",
    indicators: [
      { 
        id: 't9-i1', 
        question: "Adanya dokumen Kajian Risiko Bencana (KRB)  yang telah disahkan oleh Kepala Daerah", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada KRB dan sudah disahkan oleh Kepala Daerah"},{"nilai":75,"deskripsi":"Nilai 75 jika ada KRB yang masih dalam masa berlaku namun belum disahkan oleh Kepala Daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika ada KRB namun masa berlaku sudah habis"},{"nilai":25,"deskripsi":"Nilai 25 jika sedang dalam proses penyusunan KRB"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada KRB"}] 
      },
      { 
        id: 't9-i2', 
        question: "Adanya dokumen Rencana Penanggulangan Bencana Daerah yang telah disahkan oleh Kepala Daerah", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada Rencana Penanggulangan Bencana Daerah dan sudah disahkan oleh Kepala Daerah"},{"nilai":75,"deskripsi":"Nilai 75 jika ada Rencana Penanggulangan Bencana Daerah yang masih dalam masa berlaku namun belum disahkan oleh Kepala Daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika ada Rencana Penanggulangan Bencana Daerah namun masa berlaku sudah habis"},{"nilai":25,"deskripsi":"Nilai 25 jika sedang dalam proses penyusunan  Rencana Penanggulangan Bencana Daerah"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada Rencana Penanggulangan Bencana Daerah"}] 
      },
      { 
        id: 't9-i3', 
        question: "Adanya dokumen rencana kontingensi daerah yang telah disahkan oleh Kepala Daerah", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki dokumen Rencana Kontingensi yang disahkan kepala daerah dan telah ditindaklanjuti dengan penyelenggaraan gladi"},{"nilai":75,"deskripsi":"Nilai 75 jika dokumen disahkan kepala daerah tetapi tidak dilakukan gladi"},{"nilai":50,"deskripsi":"Nilai 50 jika terdapat dokumen Rencana Kontingensi tetapi belum disahkan kepala daerah"},{"nilai":25,"deskripsi":"Nilai 25 jika sedang dalam proses penyusunan"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada dokumen Rencana Kontingensi"}] 
      },
      { 
        id: 't9-i4', 
        question: "Adanya kebijakan dan regulasi penanggulangan bencana di daerah", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada kebijakan dan regulasi berupa Perda tentang Penanggulangan Bencana"},{"nilai":75,"deskripsi":"Nilai 75 jika ada  kebijakan dan regulasi berupa Perbup/Perwali tentang Penanggulangan Bencana"},{"nilai":50,"deskripsi":"Nilai 50 jika ada kebijakan dan regulasi berupa Keputusan Bupati/Wali Kota tentang Penanggulangan Bencana"},{"nilai":25,"deskripsi":"Nilai 25 jika masih berupa Rancangan Peraturan/regulasi tentang Penanggulangan Bencana"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada kebijakan/regulasi"}] 
      },
      { 
        id: 't9-i5', 
        question: "Adanya integrasi Kajian Risiko Bencana (KRB) dan Rencana Penanggulangan Bencana ke dalam dokumen perencanaan daerah (RPJMD/RKPD/Renstra PD/ Renja PD)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika terintegrasi ke dalam dokumen perencanaan daerah"},{"nilai":50,"deskripsi":"Nilai 50 jika sedang dalam proses integrasi ke dalam dokumen perencanaan daerah"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak terintegrasi ke dalam dokumen perencanaan daerah"}] 
      },
      { 
        id: 't9-i6', 
        question: "Adanya sistem peringatan dini yang berfungsi dengan baik sesuai potensi ancaman bencana wilayahnya (EWS longsor, EWS banjir, EWS tsunami, SKDR, EWS Karlahut, EWS Bencana Nuklir, Biologi, Kimia, dll)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika minimal 80% Kawasan Rawan Bencana tersedia Sistem peringatan dini yang berfungsi dengan baik"},{"nilai":75,"deskripsi":"Nilai 75 jika 60-79% Kawasan Rawan Bencana tersedia Sistem peringatan dini yang berfungsi dengan baik"},{"nilai":50,"deskripsi":"Nilai 50 jika 40-59% Kawasan Rawan Bencana tersedia Sistem peringatan dini yang berfungsi dengan baik"},{"nilai":25,"deskripsi":"Nilai 25 jika 20-39% Kawasan Rawan Bencana tersedia Sistem peringatan dini yang berfungsi dengan baik"},{"nilai":0,"deskripsi":"Nilai 0 jika <20% Kawasan Rawan Bencana tersedia Sistem peringatan dini yang berfungsi dengan baik"}] 
      },
      { 
        id: 't9-i7', 
        question: "Adanya Tim Reaksi Cepat (TRC) dengan SK Kepala BPBD", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada SK yang masih berlaku dan ada Renja"},{"nilai":75,"deskripsi":"Nilai 75 jika ada SK yang masih berlaku namun tidak ada Renja"},{"nilai":50,"deskripsi":"Nilai 50 jika ada SK namun sudah tidak berlaku atau sedang dalam penyusunan SK"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada SK"}] 
      },
      { 
        id: 't9-i8', 
        question: "Adanya Tim Koordinasi Daerah dalam Pencegahan dan Pengendalian Zoonosis dan Penyakit Infeksius Baru di Daerah dengan SK Bupati/ Walikota", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada SK yang masih berlaku dan ada Renja"},{"nilai":75,"deskripsi":"Nilai 75 jika ada SK yang masih berlaku namun tidak ada Renja"},{"nilai":50,"deskripsi":"Nilai 50 jika ada SK namun sudah tidak berlaku atau sedang dalam penyusunan SK"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada SK"}] 
      },
      { 
        id: 't9-i9', 
        question: "Adanya alokasi pendanaan BTT untuk penyediaan logistik kebutuhan dasar yang mencukupi di masing-masing di Kabupaten/Kota dalam kesiapsiagaan bencana", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada buffer stock yang cukup/ memenuhi dalam hal jenis dan jumlahnya sesuai dengan ketentuan yang berlaku"},{"nilai":50,"deskripsi":"Nilai 50 jika ada buffer stock namun jumlah tidak cukup/ memenuhi dalam hal jenis dan/atau jumlahnya sesuai dengan ketentuan yang berlaku"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak ada buffer stock"}] 
      },
      { 
        id: 't9-i10', 
        question: "Persentase wilayah tangguh bencana (Destana/Kampung Siaga Bencana) yang aktif melakukan upaya pengelolaan risiko bencana di daerah rawan bencana", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika  ≥ 51% wilayah sudah aktif melaksanakan upaya pengelolaan risiko bencana"},{"nilai":75,"deskripsi":"Nilai 75 jika 25 - 50% wilayah sudah aktif melaksanakan upaya pengelolaan risiko bencana"},{"nilai":50,"deskripsi":"Nilai 50 jika < 25 % wilayah sudah aktif melaksanakan upaya pengelolaan risiko bencana"},{"nilai":0,"deskripsi":"Nilai 0 jika  tidak ada wilayah yang aktif melaksanakan upaya pengelolaan risiko bencana"}] 
      },
      { 
        id: 't9-i11', 
        question: "Adanya Forum Pengurangan Risiko Bencana (FPRB) sebagai upaya pemberdayaan masyarakat dalam penanggulangan bencana di Kawasan Rawan Bencana (KRB)", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika  ada, memiliki rencana kerja, terealisasi semua dan berkelanjutan"},{"nilai":75,"deskripsi":"Nilai 75 jika ada, memiliki rencana kerja dan terealisasi sebagian"},{"nilai":50,"deskripsi":"Nilai 50 jika ada, namun tidak memiliki rencana kerja"},{"nilai":0,"deskripsi":"Nilai 0 jika  tidak ada"}] 
      },
      { 
        id: 't9-i12', 
        question: "Adanya kerja sama antar daerah yang berbatasan secara langsung, kerja sama daerah dengan pihak ketiga dalam upaya penanggulangan bencana", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika ada, kerja sama antar daerah yang berbatasan secara langsung dan daerah dengan pihak ketiga"},{"nilai":75,"deskripsi":"Nilai 75 jika ada, hanya kerja sama antar daerah yang berbatasan secara langsung"},{"nilai":50,"deskripsi":"Nilai 50 jika  ada, hanya kerja sama daerah dengan pihak ketiga"},{"nilai":25,"deskripsi":"Nilai 25 jika masih dalam proses penyusunan kerja sama"},{"nilai":0,"deskripsi":"Nilai 0 jika belum ada kerja sama"}] 
      },
      { 
        id: 't9-i13', 
        question: "Kabupaten/Kota yang melaksanakan respon terhadap sinyal SKDR kurang dari 24 jam", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika respon terhadap sinyal SKDR kurang dari 24 jam meningkat dalam 2 tahun terakhir dan ≥80% pada tahun 2024"},{"nilai":50,"deskripsi":"Nilai 50 jika respon terhadap sinyal SKDR kurang dari 24 jam menurun dalam 2 tahun terakhir dan ≥80% pada tahun 2024 atau respon terhadap sinyal SKDR kurang dari 24 jam meningkat dalam 2 tahun terakhir dan <80% pada tahun 2024"},{"nilai":0,"deskripsi":"Nilai 0 jika respon terhadap sinyal SKDR kurang dari 24 jam menurun dalam 2 tahun terakhir dan <80% pada tahun 2024"}] 
      },
      { 
        id: 't9-i14', 
        question: "Kabupaten/Kota memiliki dokumen Rencana Kontingensi penyakit potensi wabah", 
        skala: [{"nilai":100,"deskripsi":"Nilai 100 jika memiliki dokumen Rencana Kontingensi dan sudah disahkan"},{"nilai":75,"deskripsi":"Nilai 75 jika memiliki dokumen Rencana Kontingensi namun belum disahkan"},{"nilai":50,"deskripsi":"Nilai 50 jika sedang dalam proses penyusunan dokumen Rencana Kontingensi"},{"nilai":0,"deskripsi":"Nilai 0 jika tidak memiliki dokumen Rencana Kontingensi"}] 
      }
    ]
  }
];



