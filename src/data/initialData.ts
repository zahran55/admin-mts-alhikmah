import {
  User,
  Siswa,
  Guru,
  Keuangan,
  SuratMasuk,
  SuratKeluar,
  BukuTamu,
  Absensi,
  MataPelajaran,
  Nilai,
  Arsip,
  Announcement,
  MadrasahSettings,
} from '../types';

export type {
  User,
  Siswa,
  Guru,
  Keuangan,
  SuratMasuk,
  SuratKeluar,
  BukuTamu,
  Absensi,
  MataPelajaran,
  Nilai,
  Arsip,
  Announcement,
  MadrasahSettings,
};

export const DEFAULT_SETTINGS: MadrasahSettings = {
  logoUrl: '',
  kopHeader1: 'YAYASAN PONPES ITTIHADUT THOLIBIN',
  kopHeader2: '',
  kopSchoolName: 'MADRASAH TSANAWIYAH AL-HIKMAH WONOSOBO',
  kopDetails: 'Status Terakreditasi "A" · NSM: 121233070014 · NPSN: 20364812',
  kopAddress: 'Jl. Raya Wonosobo - Dieng KM 04, Mojotengah, Wonosobo 56351 | Email: info@mtsalhikmahwsb.com | Web: https://mtsalhikmahwsb.com',
  kepsekName: 'H. Ahmad Fauzi, M.Pd',
  kepsekNip: '197504122005011002',
  kepsekTitle: 'Kepala MTs Al-Hikmah',
  sekretarisName: 'M. Nur Syamsi, S.Pd',
  sekretarisNip: '198305142011011003',
  sekretarisTitle: 'Kepala Tata Usaha / Sekretaris',
  bendaharaName: 'Siti Nurjanah, S.E.',
  bendaharaNip: '198509142012012003',
  bendaharaTitle: 'Bendahara Madrasah',
  city: 'Wonosobo',
  gradeWeightTugas: 30,
  gradeWeightUts: 30,
  gradeWeightUas: 40,
  kkmDefault: 75,
};

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-001',
    username: 'admin',
    name: 'H. Ahmad Fauzi, M.Pd',
    role: 'Admin',
    email: 'ahmadfauzi@mtsalhikmahwsb.com',
    title: 'Kepala Madrasah & Administrator',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-002',
    username: 'bendahara',
    name: 'Siti Nurjanah, S.E.',
    role: 'Bendahara',
    email: 'bendahara@mtsalhikmahwsb.com',
    title: 'Bendahara Madrasah & Komite',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-003',
    username: 'guru',
    name: 'Ust. Muhammad Ihsan, S.Pd.I',
    role: 'Guru',
    email: 'ihsan@mtsalhikmahwsb.com',
    title: 'Guru Fiqih & Wali Kelas 8A',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_SISWA: Siswa[] = [
  {
    nis: '232407001',
    nisn: '0089472191',
    name: 'Ahmad Raihan Pratama',
    class: '7A',
    gender: 'L',
    birthPlaceDate: 'Wonosobo, 14 Mei 2012',
    address: 'Jl. Dieng Km. 4, Mojotengah, Wonosobo',
    parentContact: '081234567890',
    parentName: 'Bambang Pratama',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    barcodeQR: 'NIS-232407001',
    status: 'Aktif',
  },
  {
    nis: '232407002',
    nisn: '0089472192',
    name: 'Aisyah Zahra Ramadhani',
    class: '7A',
    gender: 'P',
    birthPlaceDate: 'Wonosobo, 22 Agustus 2012',
    address: 'Kp. Kalibeber RT 02/RW 03, Wonosobo',
    parentContact: '081398765432',
    parentName: 'Sulaiman Hadi',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    barcodeQR: 'NIS-232407002',
    status: 'Aktif',
  },
  {
    nis: '232408015',
    nisn: '0078234190',
    name: 'Fikri Haikal Rahman',
    class: '8A',
    gender: 'L',
    birthPlaceDate: 'Temanggung, 03 Februari 2011',
    address: 'Desa Bumireso, Wonosobo Barat',
    parentContact: '085211223344',
    parentName: 'H. Abdurrahman',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    barcodeQR: 'NIS-232408015',
    status: 'Aktif',
  },
  {
    nis: '232408016',
    nisn: '0078234191',
    name: 'Nabila Putri Salsabila',
    class: '8A',
    gender: 'P',
    birthPlaceDate: 'Wonosobo, 19 Juli 2011',
    address: 'Jl. Kyai Muntaha No. 12, Wonosobo',
    parentContact: '087788990011',
    parentName: 'Drs. Tri Wahyudi',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    barcodeQR: 'NIS-232408016',
    status: 'Aktif',
  },
  {
    nis: '222309033',
    nisn: '0067345210',
    name: 'Muhammad Dimas Al-Farizi',
    class: '9A',
    gender: 'L',
    birthPlaceDate: 'Wonosobo, 11 November 2010',
    address: 'Garung, Wonosobo',
    parentContact: '081900112233',
    parentName: 'H. Syamsul Huda',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    barcodeQR: 'NIS-222309033',
    status: 'Aktif',
  },
  {
    nis: '222309034',
    nisn: '0067345211',
    name: 'Fatimatuz Zahro',
    class: '9B',
    gender: 'P',
    birthPlaceDate: 'Magelang, 28 April 2010',
    address: 'Kertek, Wonosobo',
    parentContact: '085744556677',
    parentName: 'M. Yusuf',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    barcodeQR: 'NIS-222309034',
    status: 'Aktif',
  },
];

export const INITIAL_GURU: Guru[] = [
  {
    nip: '197504122005011002',
    name: 'H. Ahmad Fauzi, M.Pd',
    subjectAssigned: 'Al-Qur’an Hadits & Manajemen',
    phone: '08122334455',
    email: 'fauzi@mtsalhikmahwsb.com',
    status: 'PNS',
    teachingHours: 12,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    nip: '198209152010012004',
    name: 'Hj. Dewi Masithoh, M.Pd',
    subjectAssigned: 'Bahasa Indonesia & Literasi',
    phone: '08133445566',
    email: 'dewimasithoh@mtsalhikmahwsb.com',
    status: 'PNS',
    teachingHours: 24,
    classSupervisor: '7A',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    nip: '198801122019031008',
    name: 'Ust. Muhammad Ihsan, S.Pd.I',
    subjectAssigned: 'Fiqih & Ushul Fiqih',
    phone: '08564123890',
    email: 'ihsan@mtsalhikmahwsb.com',
    status: 'Yayasan',
    teachingHours: 20,
    classSupervisor: '8A',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    nip: '199203242022022011',
    name: 'Nur Azizah, S.Pd',
    subjectAssigned: 'Matematika Terapan',
    phone: '08781234567',
    email: 'nurazizah@mtsalhikmahwsb.com',
    status: 'GTT',
    teachingHours: 22,
    classSupervisor: '9A',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    nip: '198606182014021005',
    name: 'Aris Wicaksono, M.Si',
    subjectAssigned: 'IPA Terpadu & Sains Qurani',
    phone: '082199887766',
    email: 'aris@mtsalhikmahwsb.com',
    status: 'PNS',
    teachingHours: 24,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_KEUANGAN: Keuangan[] = [
  {
    id: 'TRX-202611-001',
    date: '2026-11-01',
    category: 'Inflow',
    type: 'SPP Bulanan',
    description: 'Pembayaran SPP Bulan November 2026 - Ahmad Raihan Pratama (Kelas 7A)',
    amount: 250000,
    receiptNo: 'KW/MTS-AH/2026/XI/0001',
    adminUser: 'Siti Nurjanah, S.E.',
    payerOrPayee: 'Bambang Pratama',
  },
  {
    id: 'TRX-202611-002',
    date: '2026-11-01',
    category: 'Inflow',
    type: 'SPP Bulanan',
    description: 'Pembayaran SPP Bulan November 2026 - Fikri Haikal Rahman (Kelas 8A)',
    amount: 250000,
    receiptNo: 'KW/MTS-AH/2026/XI/0002',
    adminUser: 'Siti Nurjanah, S.E.',
    payerOrPayee: 'H. Abdurrahman',
  },
  {
    id: 'TRX-202610-098',
    date: '2026-10-28',
    category: 'Inflow',
    type: 'Dana BOS',
    description: 'Penerimaan Dana BOS Kemenag Tahap II Tahun Anggaran 2026',
    amount: 68500000,
    receiptNo: 'BOS/KMN/2026/X/0014',
    adminUser: 'H. Ahmad Fauzi, M.Pd',
    payerOrPayee: 'Kemenag RI Kab. Wonosobo',
  },
  {
    id: 'TRX-202610-099',
    date: '2026-10-30',
    category: 'Outflow',
    type: 'Gaji & Honor',
    description: 'Penyaluran Honorarium Guru Tidak Tetap & Staf Periode Oktober 2026',
    amount: 18400000,
    receiptNo: 'KW/MTS-AH/2026/X/0088',
    adminUser: 'Siti Nurjanah, S.E.',
    payerOrPayee: '16 Guru & Tendik Honorer',
  },
  {
    id: 'TRX-202610-100',
    date: '2026-10-31',
    category: 'Outflow',
    type: 'Operasional Sekolah',
    description: 'Pembayaran Tagihan Listrik PLN & Internet Dedicated Madrasah',
    amount: 3250000,
    receiptNo: 'KW/MTS-AH/2026/X/0089',
    adminUser: 'Siti Nurjanah, S.E.',
    payerOrPayee: 'PLN & Telkom Indonesia',
  },
  {
    id: 'TRX-202610-101',
    date: '2026-10-25',
    category: 'Inflow',
    type: 'Infaq/Pembangunan',
    description: 'Infaq Pembangunan Asrama & Laboratorium Komputer Madrasah',
    amount: 5000000,
    receiptNo: 'KW/MTS-AH/2026/X/0075',
    adminUser: 'Siti Nurjanah, S.E.',
    payerOrPayee: 'Alumni Angkatan 2018',
  },
];

export const INITIAL_SURAT_MASUK: SuratMasuk[] = [
  {
    letterNo: 'B-142/Kk.11.23/2/PP.00/10/2026',
    dateReceived: '2026-10-27',
    sender: 'Kantor Kementerian Agama Kabupaten Wonosobo',
    subject: 'Sosialisasi Asesmen Nasional Berbasis Komputer (ANBK) Madrasah Tsanawiyah',
    fileLink: 'https://mtsalhikmahwsb.com/docs/surat-anbk-2026.pdf',
    status: 'Disposisi Kepala',
    notes: 'Mohon Waka Kurikulum menyiapkan lab komputer dan jadwal gladi bersih.',
  },
  {
    letterNo: '045/LP-MAARIF/WSB/X/2026',
    dateReceived: '2026-10-24',
    sender: 'LP Ma’arif NU Wonosobo',
    subject: 'Undangan Kompetisi Sains Madrasah (KSM) dan Porseni Tingkat Kabupaten',
    fileLink: 'https://mtsalhikmahwsb.com/docs/ksm-porseni-2026.pdf',
    status: 'Tindak Lanjut',
    notes: 'Delegasikan 4 siswa untuk bidang Matematika & IPA.',
  },
  {
    letterNo: '112/PKM-WSO/X/2026',
    dateReceived: '2026-10-18',
    sender: 'Puskesmas Mojotengah Wonosobo',
    subject: 'Pemberitahuan Pelaksanaan Skrining Kesehatan Remaja & Imunisasi BIAS',
    fileLink: 'https://mtsalhikmahwsb.com/docs/skrining-puskesmas.pdf',
    status: 'Selesai / Diarsipkan',
    notes: 'Telah dilaksanakan pada 22 Oktober 2026, 100% siswa kelas 7 terlayani.',
  },
];

export const INITIAL_SURAT_KELUAR: SuratKeluar[] = [
  {
    letterNo: '089/MTs.AH/PP.01.1/XI/2026',
    dateSent: '2026-11-01',
    recipient: 'Seluruh Orang Tua / Wali Siswa Kelas 7, 8, dan 9',
    subject: 'Undangan Rapat Koordinasi Penilaian Akhir Semester Gasal & Parenting Qurani',
    templateId: 'Undangan Rapat',
    content: 'Diberitahukan dengan hormat bahwa dalam rangka persiapan Penilaian Akhir Semester (PAS) Gasal TP 2026/2027 dan penguatan sinergi madrasah dengan wali santri, kami mengundang Bapak/Ibu untuk hadir dalam pertemuan yang akan diselenggarakan pada:',
    eventDayDate: 'Ahad, 8 November 2026',
    eventTime: 'Pukul 08.30 WIB s.d Selesai',
    eventPlace: 'Aula Pertemuan MTs Al-Hikmah Wonosobo',
    eventAgenda: 'Sosialisasi PAS Gasal & Parenting Qurani Pembentukan Karakter Santri',
    closingText: 'Demikian surat undangan ini kami sampaikan. Atas perhatian, kehadiran, dan kerjasama yang baik, kami ucapkan terima kasih.',
    status: 'Terkirim',
    signerName: 'H. Ahmad Fauzi, M.Pd',
  },
  {
    letterNo: '090/MTs.AH/PP.00.2/XI/2026',
    dateSent: '2026-11-01',
    recipient: 'Ahmad Raihan Pratama (NIS 232407001)',
    subject: 'Surat Keterangan Aktif Belajar untuk Persyaratan Beasiswa PIP Kemenag',
    templateId: 'Surat Keterangan Aktif',
    content: 'Kepala Madrasah Tsanawiyah Al-Hikmah Wonosobo menerangkan dengan sebenarnya bahwa siswa di bawah ini adalah benar-benar peserta didik aktif pada tahun ajaran berjalan:',
    closingText: 'Demikian surat keterangan ini kami buat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.',
    status: 'Terkirim',
    signerName: 'H. Ahmad Fauzi, M.Pd',
  },
];

export const INITIAL_BUKU_TAMU: BukuTamu[] = [
  {
    id: 'GUEST-20261101-01',
    timestamp: '2026-11-01 08:30:15',
    guestName: 'Drs. H. Mulyadi, M.Ag',
    institution: 'Pengawas Madrasah Kemenag Wonosobo',
    purpose: 'Monitoring Kesiapan Kurikulum Berbasis Pesantren & Supervisi Akademik',
    meetTarget: 'Kepala Madrasah',
    phone: '08123445588',
    notes: 'Diterima di Ruang Kepala Madrasah dengan hasil supervisi sangat baik.',
    signatureLink: '#verified',
  },
  {
    id: 'GUEST-20261031-02',
    timestamp: '2026-10-31 10:15:00',
    guestName: 'Ir. Hendro Kusumo',
    institution: 'PT Telkom Indonesia Wonosobo',
    purpose: 'Maintenance Infrastruktur Fiber Optic & Upgrade Jaringan Lab Komputer',
    meetTarget: 'Tata Usaha & Sarpras',
    phone: '08571239988',
    notes: 'Pekerjaan selesai, bandwidth stabil 100 Mbps simetris.',
    signatureLink: '#verified',
  },
  {
    id: 'GUEST-20261030-03',
    timestamp: '2026-10-30 13:45:20',
    guestName: 'Ibu Hj. Siti Maemunah',
    institution: 'Wali Murid Kelas 8A',
    purpose: 'Konsultasi Program Tahfidz Al-Qur’an 3 Juz dan Asrama',
    meetTarget: 'Wali Kelas 8A (Ust. Ihsan)',
    phone: '08783344112',
    notes: 'Diterima oleh Ust. Ihsan (Wali Kelas 8A).',
    signatureLink: '#verified',
  },
];

export const INITIAL_ABSENSI: Absensi[] = [
  {
    id: 'ABS-20261101-001',
    date: '2026-11-01',
    time: '06:42:15',
    userStudentId: '232407001',
    name: 'Ahmad Raihan Pratama',
    role: 'Siswa',
    classOrSubject: 'Kelas 7A',
    type: 'Check-in',
    status: 'Present',
    verificationMethod: 'Barcode Scan',
  },
  {
    id: 'ABS-20261101-002',
    date: '2026-11-01',
    time: '06:45:30',
    userStudentId: '232407002',
    name: 'Aisyah Zahra Ramadhani',
    role: 'Siswa',
    classOrSubject: 'Kelas 7A',
    type: 'Check-in',
    status: 'Present',
    verificationMethod: 'QR Code',
  },
  {
    id: 'ABS-20261101-003',
    date: '2026-11-01',
    time: '06:50:11',
    userStudentId: '197504122005011002',
    name: 'H. Ahmad Fauzi, M.Pd',
    role: 'Guru',
    classOrSubject: 'Kepala Madrasah / Al-Qur’an Hadits',
    type: 'Check-in',
    status: 'Present',
    verificationMethod: 'Barcode Scan',
  },
  {
    id: 'ABS-20261101-004',
    date: '2026-11-01',
    time: '06:53:40',
    userStudentId: '198801122019031008',
    name: 'Ust. Muhammad Ihsan, S.Pd.I',
    role: 'Guru',
    classOrSubject: 'Fiqih / Wali Kelas 8A',
    type: 'Check-in',
    status: 'Present',
    verificationMethod: 'QR Code',
  },
  {
    id: 'ABS-20261101-005',
    date: '2026-11-01',
    time: '07:05:22',
    userStudentId: '232408015',
    name: 'Fikri Haikal Rahman',
    role: 'Siswa',
    classOrSubject: 'Kelas 8A',
    type: 'Check-in',
    status: 'Present',
    verificationMethod: 'Barcode Scan',
  },
  {
    id: 'ABS-20261101-006',
    date: '2026-11-01',
    time: '07:10:00',
    userStudentId: '232408016',
    name: 'Nabila Putri Salsabila',
    role: 'Siswa',
    classOrSubject: 'Kelas 8A',
    type: 'Check-in',
    status: 'Present',
    verificationMethod: 'QR Code',
  },
];

export const INITIAL_MATA_PELAJARAN: MataPelajaran[] = [
  {
    subjectCode: 'QH-07',
    subjectName: 'Al-Qur’an Hadits',
    category: 'Agama Islam',
    classLevel: '7',
    teacherNip: '197504122005011002',
    teacherName: 'H. Ahmad Fauzi, M.Pd',
    creditHours: 3,
  },
  {
    subjectCode: 'FQ-08',
    subjectName: 'Fiqih Ibadah & Muamalah',
    category: 'Agama Islam',
    classLevel: '8',
    teacherNip: '198801122019031008',
    teacherName: 'Ust. Muhammad Ihsan, S.Pd.I',
    creditHours: 3,
  },
  {
    subjectCode: 'MTK-09',
    subjectName: 'Matematika Terapan',
    category: 'Umum',
    classLevel: '9',
    teacherNip: '199203242022022011',
    teacherName: 'Nur Azizah, S.Pd',
    creditHours: 4,
  },
  {
    subjectCode: 'BIN-07',
    subjectName: 'Bahasa Indonesia & Literasi',
    category: 'Umum',
    classLevel: '7',
    teacherNip: '198209152010012004',
    teacherName: 'Hj. Dewi Masithoh, M.Pd',
    creditHours: 4,
  },
  {
    subjectCode: 'IPA-08',
    subjectName: 'IPA Terpadu & Laboratorium',
    category: 'Umum',
    classLevel: '8',
    teacherNip: '198606182014021005',
    teacherName: 'Aris Wicaksono, M.Si',
    creditHours: 4,
  },
  {
    subjectCode: 'ARB-07',
    subjectName: 'Bahasa Arab Komunikatif',
    category: 'Agama Islam',
    classLevel: '7',
    teacherNip: '198801122019031008',
    teacherName: 'Ust. Muhammad Ihsan, S.Pd.I',
    creditHours: 3,
  },
];

export const INITIAL_NILAI: Nilai[] = [
  {
    studentNis: '232407001',
    studentName: 'Ahmad Raihan Pratama',
    class: '7A',
    subjectCode: 'QH-07',
    subjectName: 'Al-Qur’an Hadits',
    semester: 'Ganjil',
    academicYear: '2026/2027',
    assignment: 88,
    uts: 90,
    uas: 92,
    finalGrade: 90,
    predicate: 'A',
    teacherNotes: 'Sangat baik dalam hafalan juz 30 dan tajwid makhraj.',
  },
  {
    studentNis: '232407001',
    studentName: 'Ahmad Raihan Pratama',
    class: '7A',
    subjectCode: 'BIN-07',
    subjectName: 'Bahasa Indonesia & Literasi',
    semester: 'Ganjil',
    academicYear: '2026/2027',
    assignment: 84,
    uts: 86,
    uas: 88,
    finalGrade: 86,
    predicate: 'B',
    teacherNotes: 'Aktif dalam presentasi karya tulis deskriptif.',
  },
  {
    studentNis: '232408015',
    studentName: 'Fikri Haikal Rahman',
    class: '8A',
    subjectCode: 'FQ-08',
    subjectName: 'Fiqih Ibadah & Muamalah',
    semester: 'Ganjil',
    academicYear: '2026/2027',
    assignment: 92,
    uts: 94,
    uas: 95,
    finalGrade: 94,
    predicate: 'A',
    teacherNotes: 'Pemahaman materi zakat dan shalat jenazah sangat mendalam.',
  },
  {
    studentNis: '232408016',
    studentName: 'Nabila Putri Salsabila',
    class: '8A',
    subjectCode: 'IPA-08',
    subjectName: 'IPA Terpadu & Laboratorium',
    semester: 'Ganjil',
    academicYear: '2026/2027',
    assignment: 90,
    uts: 88,
    uas: 92,
    finalGrade: 90,
    predicate: 'A',
    teacherNotes: 'Teliti saat praktikum mikroskop dan fotosintesis.',
  },
];

export const INITIAL_ARSIP: Arsip[] = [
  {
    docId: 'DOC-KMN-2026-01',
    title: 'Surat Keputusan (SK) Izin Operasional MTs Al-Hikmah Kemenag RI',
    category: 'Kemenag & Yayasan',
    uploadDate: '2026-08-12',
    fileLink: 'https://mtsalhikmahwsb.com/arsip/sk-izin-operasional.pdf',
    accessLevel: 'Publik',
    fileSize: '2.4 MB',
  },
  {
    docId: 'DOC-KUR-2026-02',
    title: 'Kurikulum Operasional Madrasah (KOM) Merdeka Belajar TP 2026/2027',
    category: 'Kurikulum',
    uploadDate: '2026-07-20',
    fileLink: 'https://mtsalhikmahwsb.com/arsip/kom-mts-alhikmah-2026.pdf',
    accessLevel: 'Guru',
    fileSize: '8.7 MB',
  },
  {
    docId: 'DOC-AKR-2025-01',
    title: 'Sertifikat Akreditasi Badan Akreditasi Nasional (BAN-S/M) - Predikat A',
    category: 'Sertifikat & Akreditasi',
    uploadDate: '2025-11-10',
    fileLink: 'https://mtsalhikmahwsb.com/arsip/sertifikat-akreditasi-a.pdf',
    accessLevel: 'Publik',
    fileSize: '1.8 MB',
  },
  {
    docId: 'DOC-POS-2026-03',
    title: 'Standard Operating Procedure (SOP) Manajemen Keuangan & SPP Siswa',
    category: 'Kebijakan',
    uploadDate: '2026-09-05',
    fileLink: 'https://mtsalhikmahwsb.com/arsip/sop-keuangan-madrasah.pdf',
    accessLevel: 'Admin',
    fileSize: '3.1 MB',
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ANN-01',
    date: '2026-11-01',
    title: 'Gladi Bersih ANBK 2026/2027',
    content: 'Gladi bersih ANBK Kelas 8 akan dilaksanakan pada 4-5 November 2026 di Lab Komputer Madrasah.',
    category: 'Akademik',
    active: true,
  },
  {
    id: 'ANN-02',
    date: '2026-10-30',
    title: 'Batas Akhir Pelunasan SPP Bulan November',
    content: 'Batas akhir administrasi SPP bulan November selambat-lambatnya tanggal 10 November 2026 melalui Bendahara Madrasah.',
    category: 'Keuangan',
    active: true,
  },
  {
    id: 'ANN-03',
    date: '2026-10-28',
    title: 'Peringatan Hari Guru Nasional & Khataman Al-Qur’an',
    content: 'Khataman Al-Qur’an 30 Juz serentak akan digelar pada 25 November 2026 di Masjid Al-Hikmah.',
    category: 'Kegiatan',
    active: true,
  },
];

// Helper: Format Indonesian Currency
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper: Convert Number to Indonesian Words (Terbilang)
export function angkaTerbilang(nilai: number): string {
  const angka = Math.floor(Math.abs(nilai));
  const huruf = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  let hasil = '';

  if (angka < 12) {
    hasil = ' ' + huruf[angka];
  } else if (angka < 20) {
    hasil = angkaTerbilang(angka - 10) + ' Belas';
  } else if (angka < 100) {
    hasil = angkaTerbilang(Math.floor(angka / 10)) + ' Puluh' + angkaTerbilang(angka % 10);
  } else if (angka < 200) {
    hasil = ' Seratus' + angkaTerbilang(angka - 100);
  } else if (angka < 1000) {
    hasil = angkaTerbilang(Math.floor(angka / 100)) + ' Ratus' + angkaTerbilang(angka % 100);
  } else if (angka < 2000) {
    hasil = ' Seribu' + angkaTerbilang(angka - 1000);
  } else if (angka < 1000000) {
    hasil = angkaTerbilang(Math.floor(angka / 1000)) + ' Ribu' + angkaTerbilang(angka % 1000);
  } else if (angka < 1000000000) {
    hasil = angkaTerbilang(Math.floor(angka / 1000000)) + ' Juta' + angkaTerbilang(angka % 1000000);
  } else if (angka < 1000000000000) {
    hasil = angkaTerbilang(Math.floor(angka / 1000000000)) + ' Miliar' + angkaTerbilang(angka % 1000000000);
  }

  return hasil.trim() + ' Rupiah';
}

// Helper: Indonesian Date Formatter
export function formatTanggalIndonesia(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}
