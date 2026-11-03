export type UserRole = 'Admin' | 'Bendahara' | 'Guru';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  avatarUrl?: string;
  title?: string;
}

export interface Siswa {
  nis: string;
  nisn: string;
  name: string;
  class: '7A' | '7B' | '8A' | '8B' | '9A' | '9B';
  gender: 'L' | 'P';
  birthPlaceDate: string;
  address: string;
  parentContact: string;
  parentName: string;
  photoUrl: string;
  barcodeQR: string;
  status: 'Aktif' | 'Lulus' | 'Mutasi';
}

export interface Guru {
  nip: string;
  name: string;
  subjectAssigned: string;
  phone: string;
  email: string;
  status: 'PNS' | 'PPPK' | 'Yayasan' | 'GTT' | 'Honorer';
  teachingHours: number;
  classSupervisor?: string;
  avatarUrl: string;
}

export interface Keuangan {
  id: string;
  date: string;
  category: 'Inflow' | 'Outflow';
  type: 'SPP Bulanan' | 'Dana BOS' | 'Infaq/Pembangunan' | 'Gaji & Honor' | 'Operasional Sekolah' | 'Sarana & Prasarana' | 'Kegiatan Siswa';
  description: string;
  amount: number;
  receiptNo: string;
  adminUser: string;
  payerOrPayee?: string;
}

export interface SuratMasuk {
  letterNo: string;
  dateReceived: string;
  sender: string;
  subject: string;
  fileLink: string;
  status: 'Diterima' | 'Disposisi Kepala' | 'Tindak Lanjut' | 'Selesai / Diarsipkan';
  notes?: string;
}

export interface SuratKeluar {
  letterNo: string;
  dateSent: string;
  recipient: string;
  subject: string;
  templateId: 'Undangan Rapat' | 'Surat Keterangan Aktif' | 'Pemberitahuan Wali' | 'Permohonan Kerjasama' | 'Surat Tugas' | 'Surat Resmi';
  content?: string;
  eventDayDate?: string;
  eventTime?: string;
  eventPlace?: string;
  eventAgenda?: string;
  closingText?: string;
  status: 'Draft' | 'Terkirim' | 'Diarsipkan';
  signerName: string;
}

export interface BukuTamu {
  id: string;
  timestamp: string;
  guestName: string;
  institution: string;
  purpose: string;
  meetTarget: string; // Ingin bertemu siapa: Kepala Sekolah, Komite, Waka, dll.
  phone?: string;
  notes?: string;
  signatureLink?: string;
}

export interface Absensi {
  id: string;
  date: string;
  time: string;
  userStudentId: string;
  name: string;
  role: 'Siswa' | 'Guru';
  classOrSubject: string;
  type: 'Check-in' | 'Check-out';
  status: 'Present' | 'Sick' | 'Permit' | 'Absent';
  verificationMethod: 'Barcode Scan' | 'QR Code' | 'Manual Input';
}

export interface MataPelajaran {
  subjectCode: string;
  subjectName: string;
  category: 'Agama Islam' | 'Umum' | 'Muatan Lokal';
  classLevel: '7' | '8' | '9';
  teacherNip: string;
  teacherName: string;
  creditHours: number;
}

export interface Nilai {
  studentNis: string;
  studentName: string;
  class: string;
  subjectCode: string;
  subjectName: string;
  semester: 'Ganjil' | 'Genap';
  academicYear: string;
  assignment: number;
  uts: number;
  uas: number;
  finalGrade: number;
  predicate: 'A' | 'B' | 'C' | 'D';
  teacherNotes?: string;
}

export interface Arsip {
  docId: string;
  title: string;
  category: 'Kurikulum' | 'Kemenag & Yayasan' | 'Sertifikat & Akreditasi' | 'SK Madrasah' | 'Kebijakan';
  uploadDate: string;
  fileLink: string;
  accessLevel: 'Publik' | 'Guru' | 'Admin';
  fileSize: string;
}

export interface Announcement {
  id: string;
  date: string;
  title: string;
  content: string;
  category: 'Akademik' | 'Keuangan' | 'Kegiatan' | 'Pengumuman Penting';
  active: boolean;
}

export interface MadrasahSettings {
  logoUrl: string;
  kopHeader1?: string;
  kopHeader2?: string;
  kopSchoolName: string;
  kopDetails: string;
  kopAddress: string;
  // Pejabat Tanda Tangan Kanan (Kepala Madrasah)
  kepsekName: string;
  kepsekNip: string;
  kepsekTitle: string;
  // Pejabat Tanda Tangan Kiri (Sekretaris / Kepala TU / Komite)
  sekretarisName: string;
  sekretarisNip: string;
  sekretarisTitle: string;
  // Pejabat Kwitansi
  bendaharaName: string;
  bendaharaNip: string;
  bendaharaTitle: string;
  city: string;
  // Kriteria Bobot Nilai Rapor
  gradeWeightTugas?: number;
  gradeWeightUts?: number;
  gradeWeightUas?: number;
  kkmDefault?: number;
}

