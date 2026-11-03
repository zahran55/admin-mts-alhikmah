import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  ExternalLink,
  RefreshCw,
  Table,
  FileCode,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  GAS_CODE_GS,
  GasConfig,
  saveGasConfig,
  testGasConnection,
  downloadGasScriptFile,
} from '../services/gasService';

interface GoogleSheetsIntegrationModalProps {
  gasConfig: GasConfig;
  onUpdateGasConfig: (config: GasConfig) => void;
}

export const GoogleSheetsIntegrationModal: React.FC<GoogleSheetsIntegrationModalProps> = ({
  gasConfig,
  onUpdateGasConfig,
}) => {
  const [webAppUrl, setWebAppUrl] = useState(gasConfig.webAppUrl || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedSheetDetail, setSelectedSheetDetail] = useState<string | null>('Siswa');

  const sheetsOverview = [
    { name: 'Users', columns: 'ID, Username, Password, Name, Role [Admin, Bendahara, Guru]', desc: 'Otentikasi dan hak akses RBAC sistem' },
    { name: 'Siswa', columns: 'NIS, NISN, Name, Class, Gender, Address, Parent Contact, Photo URL, Barcode/QR', desc: 'Database induk santri & kartu tanda pelajar' },
    { name: 'Guru', columns: 'NIP, Name, Subject Assigned, Phone, Email, Status', desc: 'Direktori dewan guru dan jam mengajar' },
    { name: 'Keuangan', columns: 'ID, Date, Category [Inflow/Outflow], Description, Amount, Receipt No, Admin User', desc: 'Buku Kas Umum (BKU) dan pembayaran SPP/BOS' },
    { name: 'SuratMasuk', columns: 'Letter No, Date Received, Sender, Subject, File Link, Status', desc: 'Agenda surat masuk dan disposisi kepala madrasah' },
    { name: 'SuratKeluar', columns: 'Letter No, Date Sent, Recipient, Subject, Generator Template ID', desc: 'Registrasi dan generator kop surat keluar resmi' },
    { name: 'BukuTamu', columns: 'ID, Timestamp, Guest Name, Institution/Origin, Purpose, Phone, Signature Link', desc: 'Buku tamu digital via pemindaian QR code resepsionis' },
    { name: 'Absensi', columns: 'ID, Date, Time, User/Student ID, Type [Check-in/Check-out], Status [Present, Sick, Permit, Absent]', desc: 'Catatan presensi harian barcode & QR' },
    { name: 'MataPelajaran', columns: 'Subject Code, Subject Name, Class Level, Teacher NIP', desc: 'Kurikulum merdeka dan pembagian tugas guru' },
    { name: 'Nilai', columns: 'Student NIS, Subject Code, Semester, Academic Year, Assignment, UTS, UAS, Final Grade', desc: 'Matriks pengolahan nilai dan cetak rapor' },
    { name: 'Arsip', columns: 'Doc ID, Title, Category, Upload Date, File Link, Access Level', desc: 'Repositori digital SK, akreditasi, dan kebijakan' },
  ];

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const result = await testGasConnection(webAppUrl);
    setTestResult(result);
    setIsTesting(false);

    if (result.success) {
      const updated: GasConfig = {
        webAppUrl,
        isConnected: true,
        lastSync: new Date().toISOString(),
      };
      saveGasConfig(updated);
      onUpdateGasConfig(updated);
    }
  };

  const handleSaveOnly = () => {
    const updated: GasConfig = {
      webAppUrl,
      isConnected: Boolean(webAppUrl),
      lastSync: new Date().toISOString(),
    };
    saveGasConfig(updated);
    onUpdateGasConfig(updated);
    alert('Pengaturan URL Google Apps Script berhasil disimpan!');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GAS_CODE_GS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#1B3A33] to-[#244E45] rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#CCA13B]" />
            <h3 className="text-base font-bold text-white">
              Arsitektur Google Sheets & Google Apps Script (GAS)
            </h3>
          </div>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
            MTs Al-Hikmah menggunakan Google Sheets sebagai basis data awan gratis dan aman, dikelola melalui API Web App Google Apps Script untuk semua operasi CRUD 11 Sheet terintegrasi.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyCode}
            className="px-4 py-2 rounded-2xl bg-[#CCA13B] text-slate-950 hover:bg-[#DEB34E] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Code.gs'}</span>
          </button>
          <button
            onClick={downloadGasScriptFile}
            className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#CCA13B]" />
            <span>Unduh Code.gs</span>
          </button>
        </div>
      </div>

      {/* WEB APP CONNECTION SETTINGS */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5]">
        <h4 className="text-sm font-bold text-[#1B3A33] mb-1">
          Koneksi API Google Apps Script Web App
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Masukkan URL Web App hasil deploy dari Google Apps Script untuk menyinkronkan data secara langsung
        </p>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={webAppUrl}
              onChange={(e) => setWebAppUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#047857]"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTestConnection}
              disabled={isTesting || !webAppUrl}
              className="px-5 py-2.5 rounded-2xl bg-[#047857] hover:bg-[#065F46] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Menguji...' : 'Uji Koneksi'}</span>
            </button>
            <button
              onClick={handleSaveOnly}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Simpan URL
            </button>
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`mt-4 p-4 rounded-2xl text-xs flex items-center gap-3 ${
              testResult.success
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <p className="leading-snug">{testResult.message}</p>
          </div>
        )}
      </div>

      {/* 4-STEP DEPLOYMENT GUIDE */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5]">
        <h4 className="text-sm font-bold text-[#1B3A33] mb-4">
          Panduan 4 Langkah Instalasi Backend Google Sheets
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 relative">
            <span className="w-6 h-6 rounded-full bg-[#1B3A33] text-white font-bold flex items-center justify-center text-[11px] mb-2">
              1
            </span>
            <h5 className="font-bold text-slate-900 mb-1">Buat Spreadsheet</h5>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Buka Google Sheets baru di akun Google Anda, beri nama <strong>DB_ADMIN_MTS_ALHIKMAH</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 relative">
            <span className="w-6 h-6 rounded-full bg-[#1B3A33] text-white font-bold flex items-center justify-center text-[11px] mb-2">
              2
            </span>
            <h5 className="font-bold text-slate-900 mb-1">Buka Apps Script</h5>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Klik menu <strong>Ekstensi &gt; Apps Script</strong>. Tempel kode <strong>Code.gs</strong> yang disediakan di atas.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 relative">
            <span className="w-6 h-6 rounded-full bg-[#1B3A33] text-white font-bold flex items-center justify-center text-[11px] mb-2">
              3
            </span>
            <h5 className="font-bold text-slate-900 mb-1">Jalankan Inisialisasi</h5>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Pilih fungsi <code>initSheetsDatabase</code> lalu klik tombol <strong>Run</strong>. Semua 11 sheet akan dibuat otomatis!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 relative">
            <span className="w-6 h-6 rounded-full bg-[#1B3A33] text-white font-bold flex items-center justify-center text-[11px] mb-2">
              4
            </span>
            <h5 className="font-bold text-slate-900 mb-1">Deploy Web App</h5>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Klik <strong>Deploy &gt; New Deployment &gt; Web app</strong>. Pilih "Who has access: Anyone", lalu salin URL ke form di atas.
            </p>
          </div>
        </div>
      </div>

      {/* 11 SHEETS SCHEMA ARCHITECTURE */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h4 className="text-sm font-bold text-[#1B3A33]">
              Daftar Struktur 11 Sheet Terintegrasi
            </h4>
            <p className="text-xs text-slate-500">
              Setiap sheet terkonfigurasi dengan kolom terstandar dan tipe data spesifik
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#047857] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            11 Dedikasi Sheet Aktif
          </span>
        </div>

        <div className="space-y-3">
          {sheetsOverview.map((sheet, idx) => (
            <div
              key={sheet.name}
              className="p-4 rounded-2xl border border-slate-200 hover:border-[#047857] hover:bg-emerald-50/20 transition-all text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#1B3A33] text-white font-mono font-bold text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h5 className="font-bold text-slate-900 font-mono text-sm">
                    {sheet.name}
                  </h5>
                </div>
                <span className="text-[11px] text-slate-500">{sheet.desc}</span>
              </div>
              <p className="mt-2 text-[11px] font-mono text-emerald-800 bg-emerald-50/80 p-2 rounded-xl border border-emerald-100 leading-relaxed">
                <strong>Kolom:</strong> {sheet.columns}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
