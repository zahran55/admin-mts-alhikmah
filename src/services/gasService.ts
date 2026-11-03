import { Siswa, Guru, Keuangan, SuratMasuk, SuratKeluar, BukuTamu, Absensi } from '../types';

export const GAS_CODE_GS = `/**
 * ============================================================================
 * SISTEM INFORMASI ADMINISTRASI MTS AL-HIKMAH WONOSOBO
 * Backend Google Apps Script (GAS) Web App
 * https://mtsalhikmahwsb.com/
 * ============================================================================
 * 
 * PETUNJUK INSTALASI:
 * 1. Buka Google Sheets baru di https://sheets.google.com
 * 2. Beri nama spreadsheet: "DB_ADMIN_MTS_ALHIKMAH"
 * 3. Masuk ke menu: Ekstensi > Apps Script
 * 4. Hapus semua kode default, lalu tempelkan seluruh kode ini ke 'Code.gs'
 * 5. Pilih fungsi 'initSheetsDatabase' dari toolbar dan klik 'Jalankan' (Run).
 *    Beri izin/otorisasi akun Google Anda. Ini akan membuat 11 sheet otomatis!
 * 6. Klik tombol 'Deploy' (Terapkan) di kanan atas > 'New deployment' (Penerapan baru)
 * 7. Pilih tipe: 'Web app' (Aplikasi web)
 *    - Description: "MTs Al-Hikmah API v1"
 *    - Execute as: "Me" (Saya)
 *    - Who has access: "Anyone" (Siapa saja)
 * 8. Klik Deploy dan salin URL Web App yang dihasilkan.
 * 9. Tempelkan URL tersebut ke konfigurasi di Dashboard MTs Al-Hikmah.
 */

// Konfigurasi Nama-nama Sheet
const SHEETS_CONFIG = {
  Users: ["ID", "Username", "Password", "Name", "Role"],
  Siswa: ["NIS", "NISN", "Name", "Class", "Gender", "Address", "Parent Contact", "Photo URL", "Barcode/QR"],
  Guru: ["NIP", "Name", "Subject Assigned", "Phone", "Email", "Status"],
  Keuangan: ["ID", "Date", "Category", "Description", "Amount", "Receipt No", "Admin User"],
  SuratMasuk: ["Letter No", "Date Received", "Sender", "Subject", "File Link", "Status"],
  SuratKeluar: ["Letter No", "Date Sent", "Recipient", "Subject", "Generator Template ID"],
  BukuTamu: ["ID", "Timestamp", "Guest Name", "Institution/Origin", "Purpose", "Phone", "Signature Link"],
  Absensi: ["ID", "Date", "Time", "User/Student ID", "Type", "Status"],
  MataPelajaran: ["Subject Code", "Subject Name", "Class Level", "Teacher NIP"],
  Nilai: ["Student NIS", "Subject Code", "Semester", "Academic Year", "Assignment", "UTS", "UAS", "Final Grade"],
  Arsip: ["Doc ID", "Title", "Category", "Upload Date", "File Link", "Access Level"]
};

/**
 * Inisialisasi otomatis 11 Sheet dengan Header & Warna Identitas Al-Hikmah
 */
function initSheetsDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  for (const sheetName in SHEETS_CONFIG) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    // Periksa apakah header sudah ada
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      const headers = SHEETS_CONFIG[sheetName];
      sheet.appendRow(headers);
      
      // Styling Header: Emerald Green MTs Al-Hikmah (#1B3A33) dengan teks putih
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#1B3A33");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setFontFamily("Arial");
      sheet.setFrozenRows(1);
    }
  }
  
  // Hapus Sheet default jika kosong
  const defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch(e) {}
  }
  
  Logger.log("Inisialisasi 11 Sheet MTs Al-Hikmah berhasil selesai.");
}

/**
 * Handle HTTP GET Requests
 */
function doGet(e) {
  const params = e.parameter || {};
  const action = params.action || "ping";
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Status Ping
    if (action === "ping") {
      return jsonResponse({
        success: true,
        message: "API Google Sheets MTs Al-Hikmah aktif dan siap digunakan.",
        timestamp: new Date().toISOString(),
        sheets: Object.keys(SHEETS_CONFIG)
      });
    }
    
    // 2. Ambil Semua Data dari Satu Sheet
    if (action === "getSheet") {
      const sheetName = params.sheet;
      if (!sheetName || !SHEETS_CONFIG[sheetName]) {
        return jsonResponse({ success: false, error: "Nama sheet tidak valid." });
      }
      
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) return jsonResponse({ success: false, error: "Sheet belum dibuat." });
      
      const data = getSheetDataAsObjects(sheet);
      return jsonResponse({ success: true, sheet: sheetName, count: data.length, data: data });
    }

    // 2b. Ambil Semua Sheet Sekaligus untuk Sinkronisasi Cepat Lintas Perangkat
    if (action === "getAllSheets") {
      const result = {};
      for (const sheetName in SHEETS_CONFIG) {
        const sheet = ss.getSheetByName(sheetName);
        result[sheetName] = sheet ? getSheetDataAsObjects(sheet) : [];
      }
      return jsonResponse({ success: true, timestamp: new Date().toISOString(), data: result });
    }
    
    // 3. Verifikasi Publik Siswa berdasarkan NISN (Untuk Portal mtsalhikmahwsb.com)
    if (action === "lookupStudent") {
      const query = (params.q || "").trim().toLowerCase();
      const sheet = ss.getSheetByName("Siswa");
      if (!sheet) return jsonResponse({ success: false, error: "Database siswa kosong." });
      
      const data = getSheetDataAsObjects(sheet);
      const student = data.find(s => 
        (s["NISN"] && String(s["NISN"]).toLowerCase() === query) || 
        (s["NIS"] && String(s["NIS"]).toLowerCase() === query)
      );
      
      if (!student) {
        return jsonResponse({ success: false, message: "Data siswa tidak ditemukan." });
      }
      
      // Kembalikan data aman (tanpa kontak pribadi jika untuk verifikasi publik)
      return jsonResponse({
        success: true,
        student: {
          name: student["Name"],
          nis: student["NIS"],
          nisn: student["NISN"],
          class: student["Class"],
          status: "Aktif Terdaftar di MTs Al-Hikmah"
        }
      });
    }
    
    return jsonResponse({ success: false, error: "Action tidak dikenal." });
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

/**
 * Handle HTTP POST Requests (Insert, Update, Delete, Presensi)
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const sheetName = postData.sheet;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Simpan Log Presensi Siswa/Guru
    if (action === "logAttendance") {
      const sheet = ss.getSheetByName("Absensi");
      const record = postData.record;
      sheet.appendRow([
        record.id || Utilities.getUuid(),
        record.date || Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd"),
        record.time || Utilities.formatDate(new Date(), "GMT+7", "HH:mm:ss"),
        record.userStudentId,
        record.type || "Check-in",
        record.status || "Present"
      ]);
      return jsonResponse({ success: true, message: "Presensi berhasil dicatat." });
    }
    
    // 2. Simpan Buku Tamu Digital
    if (action === "addGuest") {
      const sheet = ss.getSheetByName("BukuTamu");
      const guest = postData.guest;
      sheet.appendRow([
        guest.id || Utilities.getUuid(),
        guest.timestamp || Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss"),
        guest.guestName,
        guest.institution || "-",
        guest.purpose,
        guest.phone || "-",
        guest.signatureLink || "-"
      ]);
      return jsonResponse({ success: true, message: "Buku tamu berhasil disimpan." });
    }
    
    // 3. Tambah Baris Umum (CRUD)
    if (action === "insert") {
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) return jsonResponse({ success: false, error: "Sheet tidak ditemukan." });
      
      const headers = SHEETS_CONFIG[sheetName];
      const rowData = headers.map(h => postData.data[h] !== undefined ? postData.data[h] : "");
      sheet.appendRow(rowData);
      
      return jsonResponse({ success: true, message: "Data berhasil ditambahkan." });
    }
    
    return jsonResponse({ success: false, error: "Action POST tidak valid." });
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

/**
 * Helper: Ambil data sheet sebagai array object key-value
 */
function getSheetDataAsObjects(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

/**
 * Helper: Output JSON dengan header CORS agar bisa dipanggil dari web
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export interface GasConfig {
  webAppUrl: string;
  spreadsheetId?: string;
  lastSync?: string;
  isConnected: boolean;
}

const STORAGE_KEY = 'mts_alhikmah_gas_config';

// URL Default Google Apps Script (Bisa disetel di sini agar otomatis aktif di semua HP/Laptop)
export const DEFAULT_GAS_URL = (import.meta as any).env?.VITE_GAS_URL || 'https://script.google.com/macros/s/AKfycbxSiwjNo4w5zFBkaM9-eqzLzD8wQCU-B_EERtu1LdpTG5tYRdiFMEsdJrGEIsZvOK0iEg/exec';

export function getGasConfig(): GasConfig {
  let url = DEFAULT_GAS_URL;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.webAppUrl) url = parsed.webAppUrl;
    }
  } catch (e) {
    console.error('Failed to load gas config', e);
  }
  return {
    webAppUrl: url,
    spreadsheetId: '',
    lastSync: undefined,
    isConnected: Boolean(url),
  };
}

export function saveGasConfig(config: GasConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save gas config', e);
  }
}

export async function testGasConnection(url: string): Promise<{ success: boolean; message: string; sheets?: string[] }> {
  if (!url || !url.startsWith('http')) {
    return { success: false, message: 'URL Web App tidak valid. Pastikan diawali dengan https://script.google.com/...' };
  }

  // Deteksi jika user salah menyalin URL /dev (test deployment) alih-alih /exec (production)
  if (url.endsWith('/dev') || url.includes('/dev?')) {
    return {
      success: false,
      message: 'Perhatian: Anda menyalin URL uji coba (/dev). URL /dev ini tidak bisa diakses publik. Silakan buka Apps Script > Deploy > New deployment (Penerapan Baru) > dan salin URL yang berakhiran /exec.',
    };
  }

  try {
    const testUrl = `${url}${url.includes('?') ? '&' : '?'}action=ping`;
    const res = await fetch(testUrl, { method: 'GET', redirect: 'follow' });
    const data = await res.json();

    if (data.success) {
      return {
        success: true,
        message: 'Koneksi ke Google Sheets & Google Apps Script berhasil terverifikasi!',
        sheets: data.sheets,
      };
    } else {
      return { success: false, message: data.error || 'Respon API Apps Script mengembalikan status gagal.' };
    }
  } catch (err: any) {
    return {
      success: false,
      message: 'Gagal menghubungi Web App Google Apps Script. Periksa: 1) Pastikan URL berakhiran /exec bukan /dev, 2) Pastikan sudah klik "Jalankan/Run" fungsi initSheetsDatabase dan memberikan izin (Review Permissions), 3) Jika baru mengganti kode, pastikan buat "New Version" saat Deploy.',
    };
  }
}

export function downloadGasScriptFile(): void {
  const blob = new Blob([GAS_CODE_GS], { type: 'text/javascript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Code.gs';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Kirim data ke Google Apps Script Web App secara otomatis
 */
export async function postToGoogleSheets(payload: any): Promise<boolean> {
  const config = getGasConfig();
  if (!config.webAppUrl) {
    return false;
  }

  try {
    // Mode no-cors dengan text/plain adalah standar pengiriman data ke Google Apps Script dari browser tanpa terblokir CORS
    await fetch(config.webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      mode: 'no-cors',
    });
    return true;
  } catch (err) {
    console.warn('Gagal sinkronisasi ke Google Sheets:', err);
    return false;
  }
}

export function syncAddSiswaToGas(siswa: Siswa) {
  return postToGoogleSheets({
    action: 'insert',
    sheet: 'Siswa',
    data: {
      'NIS': siswa.nis,
      'NISN': siswa.nisn,
      'Name': siswa.name,
      'Class': siswa.class,
      'Gender': siswa.gender,
      'Address': siswa.address,
      'Parent Contact': siswa.parentContact,
      'Photo URL': siswa.photoUrl,
      'Barcode/QR': siswa.barcodeQR || siswa.nis,
    },
  });
}

export function syncAddBukuTamuToGas(tamu: BukuTamu) {
  return postToGoogleSheets({
    action: 'addGuest',
    guest: {
      id: tamu.id,
      timestamp: tamu.timestamp,
      guestName: tamu.guestName,
      institution: tamu.institution,
      purpose: tamu.purpose,
      meetTarget: tamu.meetTarget || tamu.phone || '-',
      phone: tamu.meetTarget || tamu.phone || '-',
      notes: tamu.notes || tamu.signatureLink || '-',
      signatureLink: tamu.signatureLink || '-',
    },
  });
}

export function syncAddGuruToGas(guru: Guru) {
  return postToGoogleSheets({
    action: 'insert',
    sheet: 'Guru',
    data: {
      'NIP': guru.nip,
      'Name': guru.name,
      'Subject Assigned': guru.subjectAssigned,
      'Phone': guru.phone,
      'Email': guru.email,
      'Status': guru.status,
    },
  });
}

export function syncAddKeuanganToGas(k: Keuangan) {
  return postToGoogleSheets({
    action: 'insert',
    sheet: 'Keuangan',
    data: {
      'ID': k.id,
      'Date': k.date,
      'Category': k.category,
      'Description': k.description,
      'Amount': k.amount,
      'Receipt No': k.receiptNo,
      'Admin User': k.adminUser,
    },
  });
}

export function syncAddSuratMasukToGas(sm: SuratMasuk) {
  return postToGoogleSheets({
    action: 'insert',
    sheet: 'SuratMasuk',
    data: {
      'Letter No': sm.letterNo,
      'Date Received': sm.dateReceived,
      'Sender': sm.sender,
      'Subject': sm.subject,
      'File Link': sm.fileLink || '-',
      'Status': sm.status,
    },
  });
}

export function syncAddSuratKeluarToGas(sk: SuratKeluar) {
  return postToGoogleSheets({
    action: 'insert',
    sheet: 'SuratKeluar',
    data: {
      'Letter No': sk.letterNo,
      'Date Sent': sk.dateSent,
      'Recipient': sk.recipient,
      'Subject': sk.subject,
      'Generator Template ID': sk.templateId,
    },
  });
}

export function syncAddAbsensiToGas(a: Absensi) {
  return postToGoogleSheets({
    action: 'logAttendance',
    record: {
      id: a.id,
      date: a.date,
      time: a.time,
      userStudentId: a.userStudentId,
      type: a.type,
      status: a.status,
    },
  });
}

// ============================================================================
// MAPPERS: Konversi data mentah Google Sheets menjadi format aplikasi MTs
// ============================================================================

export function mapGasSiswa(rows: any[]): Siswa[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r) => ({
      nis: String(r['NIS'] || r.nis || ''),
      nisn: String(r['NISN'] || r.nisn || ''),
      name: String(r['Name'] || r.name || ''),
      class: (r['Class'] || r.class || '7A') as any,
      gender: (r['Gender'] || r.gender || 'L') as any,
      birthPlaceDate: 'Wonosobo',
      address: String(r['Address'] || r.address || 'Wonosobo'),
      parentContact: String(r['Parent Contact'] || r.parentContact || '-'),
      parentName: '-',
      photoUrl: String(r['Photo URL'] || r.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
      barcodeQR: String(r['Barcode/QR'] || r.barcodeQR || `NIS-${r['NIS'] || r.nis}`),
      status: 'Aktif' as any,
    }))
    .filter((s) => s.nis && s.name);
}

export function mapGasBukuTamu(rows: any[]): BukuTamu[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r, i) => ({
      id: String(r['ID'] || r.id || `GUEST-${Date.now()}-${i}`),
      timestamp: String(r['Timestamp'] || r.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19)),
      guestName: String(r['Guest Name'] || r.guestName || ''),
      institution: String(r['Institution/Origin'] || r.institution || '-'),
      purpose: String(r['Purpose'] || r.purpose || '-'),
      meetTarget: String(r['Phone'] || r.meetTarget || 'Kepala Madrasah'),
      notes: String(r['Signature Link'] || r.notes || ''),
      signatureLink: '#verified',
    }))
    .filter((t) => t.guestName);
}

export function mapGasGuru(rows: any[]): Guru[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r) => ({
      nip: String(r['NIP'] || r.nip || ''),
      name: String(r['Name'] || r.name || ''),
      subjectAssigned: String(r['Subject Assigned'] || r.subjectAssigned || '-'),
      phone: String(r['Phone'] || r.phone || '-'),
      email: String(r['Email'] || r.email || '-'),
      status: (r['Status'] || r.status || 'PNS') as any,
      teachingHours: Number(r['Teaching Hours'] || r.teachingHours || 24),
      avatarUrl: String(r['Photo URL'] || r.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
    }))
    .filter((g) => g.nip && g.name);
}

export function mapGasKeuangan(rows: any[]): Keuangan[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((r, i) => {
    const cat = (r['Category'] || r.category || 'Inflow') as 'Inflow' | 'Outflow';
    return {
      id: String(r['ID'] || r.id || `TRX-${Date.now()}-${i}`),
      date: String(r['Date'] || r.date || new Date().toISOString().split('T')[0]),
      category: cat,
      type: (r['Type'] || r.type || (cat === 'Inflow' ? 'SPP Bulanan' : 'Operasional Sekolah')) as any,
      description: String(r['Description'] || r.description || '-'),
      amount: Number(r['Amount'] || r.amount || 0),
      receiptNo: String(r['Receipt No'] || r.receiptNo || `KW-${Date.now()}`),
      adminUser: String(r['Admin User'] || r.adminUser || 'Bendahara'),
    };
  });
}

export function mapGasSuratMasuk(rows: any[]): SuratMasuk[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r) => ({
      letterNo: String(r['Letter No'] || r.letterNo || ''),
      dateReceived: String(r['Date Received'] || r.dateReceived || ''),
      sender: String(r['Sender'] || r.sender || '-'),
      subject: String(r['Subject'] || r.subject || '-'),
      fileLink: String(r['File Link'] || r.fileLink || '#'),
      status: (r['Status'] || r.status || 'Diterima') as any,
      notes: '',
    }))
    .filter((s) => s.letterNo);
}

export function mapGasSuratKeluar(rows: any[]): SuratKeluar[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r) => ({
      letterNo: String(r['Letter No'] || r.letterNo || ''),
      dateSent: String(r['Date Sent'] || r.dateSent || ''),
      recipient: String(r['Recipient'] || r.recipient || ''),
      subject: String(r['Subject'] || r.subject || ''),
      templateId: (r['Generator Template ID'] || r.templateId || 'Undangan Rapat') as any,
      content: 'Dengan hormat, sehubungan dengan agenda madrasah dan persiapan kurikulum terpadu tahun ajaran berjalan, kami mengundang Bapak/Ibu untuk hadir dalam pertemuan yang akan diselenggarakan pada:',
      eventDayDate: 'Ahad, 15 November 2026',
      eventTime: 'Pukul 08.30 WIB s.d Selesai',
      eventPlace: 'Aula Pertemuan MTs Al-Hikmah Wonosobo',
      eventAgenda: 'Rapat Koordinasi Evaluasi Pembelajaran & Parenting Santri',
      closingText: 'Demikian surat ini kami sampaikan, atas perhatian dan kehadirannya kami ucapkan terima kasih.',
      status: ((r['Status'] || r.status || 'Terkirim') as 'Draft' | 'Terkirim' | 'Diarsipkan'),
      signerName: 'Kepala Madrasah',
    }))
    .filter((s) => s.letterNo);
}

export function mapGasAbsensi(rows: any[]): Absensi[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r, i) => ({
      id: String(r['ID'] || r.id || `ATT-${Date.now()}-${i}`),
      date: String(r['Date'] || r.date || ''),
      time: String(r['Time'] || r.time || ''),
      userStudentId: String(r['User/Student ID'] || r.userStudentId || ''),
      name: String(r['Name'] || r.name || 'Santri MTs'),
      role: (r['Role'] || r.role || 'Siswa') as 'Siswa' | 'Guru',
      classOrSubject: String(r['Class'] || r.classOrSubject || 'Kelas 7A'),
      type: (r['Type'] || r.type || 'Check-in') as any,
      status: (r['Status'] || r.status || 'Present') as any,
      verificationMethod: 'Barcode Scan' as const,
    }))
    .filter((a) => a.userStudentId);
}

/**
 * Mengambil semua data dari Google Sheets untuk sinkronisasi lintas perangkat
 */
export async function fetchAllSheetsFromGas(customUrl?: string): Promise<{
  siswa?: Siswa[];
  bukuTamu?: BukuTamu[];
  guru?: Guru[];
  keuangan?: Keuangan[];
  suratMasuk?: SuratMasuk[];
  suratKeluar?: SuratKeluar[];
  absensi?: Absensi[];
} | null> {
  const config = getGasConfig();
  const url = customUrl || config.webAppUrl;
  if (!url) return null;

  try {
    // 1. Coba endpoint batch getAllSheets
    const batchUrl = `${url}${url.includes('?') ? '&' : '?'}action=getAllSheets`;
    const res = await fetch(batchUrl, { method: 'GET', redirect: 'follow' });
    const json = await res.json();
    if (json.success && json.data) {
      return {
        siswa: json.data.Siswa ? mapGasSiswa(json.data.Siswa) : undefined,
        bukuTamu: json.data.BukuTamu ? mapGasBukuTamu(json.data.BukuTamu) : undefined,
        guru: json.data.Guru ? mapGasGuru(json.data.Guru) : undefined,
        keuangan: json.data.Keuangan ? mapGasKeuangan(json.data.Keuangan) : undefined,
        suratMasuk: json.data.SuratMasuk ? mapGasSuratMasuk(json.data.SuratMasuk) : undefined,
        suratKeluar: json.data.SuratKeluar ? mapGasSuratKeluar(json.data.SuratKeluar) : undefined,
        absensi: json.data.Absensi ? mapGasAbsensi(json.data.Absensi) : undefined,
      };
    }
  } catch (e) {
    // 2. Fallback: jika script di spreadsheet belum di-update dengan getAllSheets, fetch sheet penting secara paralel
    try {
      const [siswaRes, tamuRes, guruRes, keuanganRes] = await Promise.all([
        fetch(`${url}${url.includes('?') ? '&' : '?'}action=getSheet&sheet=Siswa`, { redirect: 'follow' })
          .then((r) => r.json())
          .catch(() => null),
        fetch(`${url}${url.includes('?') ? '&' : '?'}action=getSheet&sheet=BukuTamu`, { redirect: 'follow' })
          .then((r) => r.json())
          .catch(() => null),
        fetch(`${url}${url.includes('?') ? '&' : '?'}action=getSheet&sheet=Guru`, { redirect: 'follow' })
          .then((r) => r.json())
          .catch(() => null),
        fetch(`${url}${url.includes('?') ? '&' : '?'}action=getSheet&sheet=Keuangan`, { redirect: 'follow' })
          .then((r) => r.json())
          .catch(() => null),
      ]);

      return {
        siswa: siswaRes?.success && siswaRes.data?.length ? mapGasSiswa(siswaRes.data) : undefined,
        bukuTamu: tamuRes?.success && tamuRes.data?.length ? mapGasBukuTamu(tamuRes.data) : undefined,
        guru: guruRes?.success && guruRes.data?.length ? mapGasGuru(guruRes.data) : undefined,
        keuangan: keuanganRes?.success && keuanganRes.data?.length ? mapGasKeuangan(keuanganRes.data) : undefined,
      };
    } catch (err) {
      console.warn('Fallback sheet fetch gagal:', err);
    }
  }
  return null;
}


