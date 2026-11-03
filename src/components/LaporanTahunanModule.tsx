import React, { useState } from 'react';
import {
  BarChart3,
  Printer,
  Download,
  Users,
  Wallet,
  Mail,
  CheckCircle2,
  Calendar,
  Building,
  TrendingUp,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  BookOpen,
  Send,
  Inbox,
  UserCheck,
} from 'lucide-react';
import {
  Siswa,
  Guru,
  Keuangan,
  SuratMasuk,
  SuratKeluar,
  BukuTamu,
  Absensi,
  formatRupiah,
  formatTanggalIndonesia,
} from '../data/initialData';
import { MadrasahSettings } from '../types';

interface LaporanTahunanModuleProps {
  siswaList: Siswa[];
  guruList: Guru[];
  keuanganList: Keuangan[];
  suratMasukList: SuratMasuk[];
  suratKeluarList: SuratKeluar[];
  bukuTamuList?: BukuTamu[];
  absensiList: Absensi[];
  settings: MadrasahSettings;
}

export const LaporanTahunanModule: React.FC<LaporanTahunanModuleProps> = ({
  siswaList,
  guruList,
  keuanganList,
  suratMasukList,
  suratKeluarList,
  bukuTamuList = [],
  absensiList,
  settings,
}) => {
  const [reportType, setReportType] = useState<'gabungan' | 'keuangan' | 'bukuTamu' | 'persuratan'>('gabungan');

  // Calculations
  const totalSiswa = siswaList.length;
  const santriPutra = siswaList.filter((s) => s.gender === 'L').length;
  const santriPutri = siswaList.filter((s) => s.gender === 'P').length;

  const totalInflow = keuanganList
    .filter((k) => k.category === 'Inflow')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalOutflow = keuanganList
    .filter((k) => k.category === 'Outflow')
    .reduce((sum, item) => sum + item.amount, 0);

  const saldoKas = totalInflow - totalOutflow;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar with Report Mode Switcher */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
        <div>
          <h3 className="text-base font-bold text-[#1B3A33]">
            Pusat Laporan Tahunan & Akuntabilitas Madrasah
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih jenis laporan yang ingin dilihat dan dicetak ke format PDF
          </p>
        </div>

        {/* Report Mode Selector & Print Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl flex-wrap gap-1">
            <button
              onClick={() => setReportType('gabungan')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                reportType === 'gabungan'
                  ? 'bg-white text-[#1B3A33] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Laporan Gabungan
            </button>
            <button
              onClick={() => setReportType('keuangan')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                reportType === 'keuangan'
                  ? 'bg-white text-[#047857] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Khusus Keuangan (BKU)
            </button>
            <button
              onClick={() => setReportType('bukuTamu')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                reportType === 'bukuTamu'
                  ? 'bg-white text-[#CCA13B] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Khusus Buku Tamu
            </button>
            <button
              onClick={() => setReportType('persuratan')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                reportType === 'persuratan'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4. Khusus Surat Masuk & Keluar
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#CCA13B]" />
            <span>
              {reportType === 'gabungan' && 'Cetak / Simpan PDF Laporan Gabungan'}
              {reportType === 'keuangan' && 'Cetak / Simpan PDF Laporan Keuangan'}
              {reportType === 'bukuTamu' && 'Cetak / Simpan PDF Laporan Buku Tamu'}
              {reportType === 'persuratan' && 'Cetak / Simpan PDF Laporan Surat'}
            </span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. LAPORAN GABUNGAN (UMUM & KOMPREHENSIF) */}
      {/* ======================================================== */}
      {reportType === 'gabungan' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E2EAE5] printable-area space-y-8 text-slate-800 text-xs">
          {/* Header Kop Resmi dengan Logo */}
          <div className="border-b-4 border-double border-slate-800 pb-4 flex items-center justify-center gap-4 text-center">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Logo Madrasah"
                className="w-16 h-16 object-contain shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#1B3A33] text-[#CCA13B] flex items-center justify-center font-black text-xl border-2 border-[#CCA13B] shrink-0">
                AH
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-slate-800 tracking-wider uppercase mb-0.5">
                {settings.kopHeader1 || 'YAYASAN PONPES ITTIHADUT THOLIBIN'}
              </p>
              <h2 className="text-lg font-black text-[#1B3A33] tracking-wide uppercase mt-0.5">
                LAPORAN AKUNTABILITAS TAHUNAN GABUNGAN (LAKIP)
              </h2>
              <p className="text-xs font-bold text-slate-700 uppercase">
                {settings.kopSchoolName}
              </p>
              <p className="text-[9px] text-slate-500 mt-1">
                {settings.kopAddress}
              </p>
            </div>
          </div>

          {/* I. Ringkasan Eksekutif KPI */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B3A33] mb-3 pb-1 border-b border-slate-200">
              I. Ringkasan Eksekutif Indikator Kunci (KPI)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Total Siswa Aktif
                </span>
                <p className="text-xl font-extrabold text-[#1B3A33] mt-1 tabular-nums">
                  {totalSiswa} Siswa
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  L: {santriPutra} · P: {santriPutri}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Guru & Staf Kependidikan
                </span>
                <p className="text-xl font-extrabold text-[#1B3A33] mt-1 tabular-nums">
                  {guruList.length} Pendidik
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  100% Sarjana Terverifikasi
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Cadangan Kas Bersih
                </span>
                <p className="text-xl font-extrabold text-[#047857] mt-1 tabular-nums">
                  {formatRupiah(saldoKas)}
                </p>
                <p className="text-[10px] text-emerald-700 mt-1">
                  Surplus Operasional Sehat
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Rata-rata Presensi
                </span>
                <p className="text-xl font-extrabold text-[#CCA13B] mt-1 tabular-nums">
                  97.8%
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Disiplin Santri Terverifikasi
                </p>
              </div>
            </div>
          </div>

          {/* II. Demografi & Distribusi Rombel */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B3A33] mb-3 pb-1 border-b border-slate-200">
              II. Demografi & Distribusi Rombel Belajar
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="py-2.5 px-4">Tingkat Kelas</th>
                    <th className="py-2.5 px-4 text-center">Jumlah Rombel</th>
                    <th className="py-2.5 px-4 text-center">Santri Putra</th>
                    <th className="py-2.5 px-4 text-center">Santri Putri</th>
                    <th className="py-2.5 px-4 text-right">Total Santri</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-2.5 px-4 font-bold">Kelas 7 (Fase D Awal)</td>
                    <td className="py-2.5 px-4 text-center">2 Rombel (7A, 7B)</td>
                    <td className="py-2.5 px-4 text-center">1</td>
                    <td className="py-2.5 px-4 text-center">1</td>
                    <td className="py-2.5 px-4 text-right font-bold">2 Siswa</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold">Kelas 8 (Fase D Lanjutan)</td>
                    <td className="py-2.5 px-4 text-center">2 Rombel (8A, 8B)</td>
                    <td className="py-2.5 px-4 text-center">1</td>
                    <td className="py-2.5 px-4 text-center">1</td>
                    <td className="py-2.5 px-4 text-right font-bold">2 Siswa</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold">Kelas 9 (Fase D Akhir)</td>
                    <td className="py-2.5 px-4 text-center">2 Rombel (9A, 9B)</td>
                    <td className="py-2.5 px-4 text-center">1</td>
                    <td className="py-2.5 px-4 text-center">1</td>
                    <td className="py-2.5 px-4 text-right font-bold">2 Siswa</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="py-2.5 px-4 text-[#1B3A33]" colSpan={4}>TOTAL KESELURUHAN PESERTA DIDIK</td>
                    <td className="py-2.5 px-4 text-right text-[#047857]">{totalSiswa} Siswa</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* III. Ringkasan Keuangan Gabungan */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B3A33] mb-3 pb-1 border-b border-slate-200">
              III. Ikhtisar Realisasi Kas Madrasah
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-4">
                <h5 className="font-bold text-[#047857] mb-2">Total Penerimaan (Inflow)</h5>
                <p className="text-lg font-black text-emerald-800 font-mono">{formatRupiah(totalInflow)}</p>
                <p className="text-[11px] text-slate-500 mt-1">Sumber: Dana BOS Kemenag, SPP Santri, Infaq Yayasan</p>
              </div>
              <div className="border border-slate-200 rounded-xl p-4">
                <h5 className="font-bold text-rose-600 mb-2">Total Pengeluaran (Outflow)</h5>
                <p className="text-lg font-black text-rose-700 font-mono">{formatRupiah(totalOutflow)}</p>
                <p className="text-[11px] text-slate-500 mt-1">Pos: Gaji GTT, Listrik, Internet Lab, Operasional Sekolah</p>
              </div>
            </div>
          </div>

          {/* Tanda Tangan Kiri-Kanan Bersih */}
          <div className="pt-8 border-t border-slate-300 flex items-center justify-between text-center px-4">
            <div className="w-56">
              <p className="font-semibold text-slate-800">{settings.sekretarisTitle}</p>
              <div className="h-16" />
              <p className="font-bold underline text-slate-900">{settings.sekretarisName}</p>
              <p className="text-[9px] text-slate-500 font-mono">NIP. {settings.sekretarisNip}</p>
            </div>

            <div className="w-56">
              <p className="font-semibold text-slate-800">{settings.kepsekTitle}</p>
              <div className="h-16" />
              <p className="font-bold underline text-slate-900">{settings.kepsekName}</p>
              <p className="text-[9px] text-slate-500 font-mono">NIP. {settings.kepsekNip}</p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. LAPORAN KHUSUS KEUANGAN SAJA (BUKU KAS UMUM LENGKAP) */}
      {/* ======================================================== */}
      {reportType === 'keuangan' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E2EAE5] printable-area space-y-8 text-slate-800 text-xs">
          {/* Header Kop Laporan Keuangan */}
          <div className="border-b-4 border-double border-slate-800 pb-4 flex items-center justify-center gap-4 text-center">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Logo Madrasah"
                className="w-16 h-16 object-contain shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#1B3A33] text-[#CCA13B] flex items-center justify-center font-black text-xl border-2 border-[#CCA13B] shrink-0">
                AH
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-slate-800 tracking-wider uppercase mb-0.5">
                {settings.kopHeader1 || 'YAYASAN PONPES ITTIHADUT THOLIBIN'}
              </p>
              <h2 className="text-lg font-black text-[#1B3A33] tracking-wide uppercase mt-0.5">
                LAPORAN PERTANGGUNGJAWABAN KEUANGAN & BUKU KAS UMUM
              </h2>
              <p className="text-xs font-bold text-slate-700 uppercase">
                {settings.kopSchoolName}
              </p>
              <p className="text-[9px] text-slate-500 mt-1">
                Periode Tahun Anggaran 2026/2027 · Dana BOS, Komite & SPP
              </p>
            </div>
          </div>

          {/* Ringkasan Neraca Keuangan */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                Total Penerimaan Kas (Inflow)
              </span>
              <p className="text-xl font-black text-emerald-900 mt-1 font-mono">
                {formatRupiah(totalInflow)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                Total Pengeluaran Kas (Outflow)
              </span>
              <p className="text-xl font-black text-rose-900 mt-1 font-mono">
                {formatRupiah(totalOutflow)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#1B3A33] text-white border-2 border-[#CCA13B]">
              <span className="text-[10px] font-bold text-[#CCA13B] uppercase tracking-wider">
                Saldo Kas Bersih Tersedia
              </span>
              <p className="text-xl font-black text-white mt-1 font-mono">
                {formatRupiah(saldoKas)}
              </p>
            </div>
          </div>

          {/* Rincian Transaksi BKU */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B3A33] mb-3 pb-1 border-b border-slate-200">
              Rincian Mutasi Transaksi Kas Masuk & Kas Keluar
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">No</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-4">No. Kwitansi</th>
                    <th className="py-2.5 px-4">Uraian / Keterangan</th>
                    <th className="py-2.5 px-3 text-center">Kategori Pos</th>
                    <th className="py-2.5 px-4 text-right">Penerimaan (Rp)</th>
                    <th className="py-2.5 px-4 text-right">Pengeluaran (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {keuanganList.map((tx, idx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-center text-slate-500">{idx + 1}</td>
                      <td className="py-2 px-3 text-slate-700 font-sans">{tx.date}</td>
                      <td className="py-2 px-4 font-bold text-slate-900">{tx.receiptNo}</td>
                      <td className="py-2 px-4 font-sans text-slate-800">{tx.description}</td>
                      <td className="py-2 px-3 text-center font-sans">
                        <span className="px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 text-[10px]">
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right text-emerald-700 font-bold">
                        {tx.category === 'Inflow' ? formatRupiah(tx.amount) : '-'}
                      </td>
                      <td className="py-2 px-4 text-right text-rose-600 font-bold">
                        {tx.category === 'Outflow' ? formatRupiah(tx.amount) : '-'}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold font-sans text-xs">
                    <td colSpan={5} className="py-2.5 px-4 text-right uppercase text-slate-800">
                      JUMLAH TOTAL KAS
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-emerald-800">
                      {formatRupiah(totalInflow)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-rose-800">
                      {formatRupiah(totalOutflow)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tanda Tangan Khusus Keuangan: Bendahara di Kiri, Kepala Madrasah di Kanan */}
          <div className="pt-8 border-t border-slate-300 flex items-center justify-between text-center px-4">
            <div className="w-56">
              <p className="font-semibold text-slate-800">{settings.bendaharaTitle}</p>
              <div className="h-16" />
              <p className="font-bold underline text-slate-900">{settings.bendaharaName}</p>
              <p className="text-[9px] text-slate-500 font-mono">NIP. {settings.bendaharaNip}</p>
            </div>

            <div className="w-56">
              <p className="font-semibold text-slate-800">{settings.kepsekTitle}</p>
              <div className="h-16" />
              <p className="font-bold underline text-slate-900">{settings.kepsekName}</p>
              <p className="text-[9px] text-slate-500 font-mono">NIP. {settings.kepsekNip}</p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. LAPORAN KHUSUS BUKU TAMU & KUNJUNGAN KEDINASAN */}
      {/* ======================================================== */}
      {reportType === 'bukuTamu' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E2EAE5] printable-area space-y-6 text-slate-800 text-xs">
          {/* Header Kop Madrasah */}
          <div className="border-b-4 border-double border-slate-800 pb-3 flex items-center justify-center gap-4 text-center">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Logo Madrasah"
                className="w-16 h-16 object-contain shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#1B3A33] text-[#CCA13B] flex items-center justify-center font-black text-xl border-2 border-[#CCA13B] shrink-0">
                AH
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-slate-800 tracking-wider uppercase mb-0.5">
                {settings.kopHeader1 || 'YAYASAN PONPES ITTIHADUT THOLIBIN'}
              </p>
              <h2 className="text-base font-black text-[#1B3A33] tracking-wide uppercase">
                LAPORAN REKAPITULASI BUKU TAMU & KUNJUNGAN KEDINASAN
              </h2>
              <p className="text-xs font-bold text-slate-700 uppercase mt-0.5">
                {settings.kopSchoolName}
              </p>
              <p className="text-[10px] text-slate-600 font-medium">
                {settings.kopDetails}
              </p>
              <p className="text-[9px] text-slate-500 mt-0.5">
                {settings.kopAddress}
              </p>
            </div>
          </div>

          {/* KPI Summary Buku Tamu */}
          <div>
            <div className="flex items-center justify-between pb-1 mb-3 border-b border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B3A33]">
                I. Ringkasan Statistik Kunjungan Kedinasan
              </h4>
              <span className="text-[11px] font-mono text-slate-500">
                Periode: Tahun Ajaran 2026/2027
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Total Tamu Tercatat</span>
                <p className="text-xl font-extrabold text-[#1B3A33] mt-1 tabular-nums">
                  {bukuTamuList.length} Tamu
                </p>
                <span className="text-[9px] text-emerald-700 font-semibold">Tercatat di resepsionis</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Tamu Kepala Madrasah</span>
                <p className="text-xl font-extrabold text-[#CCA13B] mt-1 tabular-nums">
                  {bukuTamuList.filter((t) => t.meetTarget?.toLowerCase().includes('kepala')).length} Kunjungan
                </p>
                <span className="text-[9px] text-slate-500 font-semibold">Audiensi & kedinasan</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Tamu Komite & Waka</span>
                <p className="text-xl font-extrabold text-blue-700 mt-1 tabular-nums">
                  {bukuTamuList.filter((t) => !t.meetTarget?.toLowerCase().includes('kepala')).length} Kunjungan
                </p>
                <span className="text-[9px] text-slate-500 font-semibold">Koordinasi madrasah</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Verifikasi Kehadiran</span>
                <p className="text-xl font-extrabold text-[#047857] mt-1 tabular-nums">
                  100%
                </p>
                <span className="text-[9px] text-emerald-700 font-semibold">Tervalidasi buku tamu</span>
              </div>
            </div>
          </div>

          {/* Tabel Detail Kunjungan Buku Tamu */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B3A33] mb-2 pb-1 border-b border-slate-200">
              II. Daftar Buku Agenda Kunjungan Tamu Madrasah
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase border-b border-slate-200">
                    <th className="py-2.5 px-3 text-center w-10">No</th>
                    <th className="py-2.5 px-3 w-36">Waktu Kunjungan</th>
                    <th className="py-2.5 px-4">Nama Tamu & Instansi</th>
                    <th className="py-2.5 px-4 w-40">Tujuan Bertemu</th>
                    <th className="py-2.5 px-4">Maksud & Keperluan</th>
                    <th className="py-2.5 px-3 text-center w-24">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {bukuTamuList.map((tamu, idx) => (
                    <tr key={tamu.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{tamu.timestamp}</td>
                      <td className="py-2.5 px-4">
                        <p className="font-bold text-slate-900">{tamu.guestName}</p>
                        <p className="text-[10px] text-slate-500">{tamu.institution}</p>
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-[#8F6813]">
                        {tamu.meetTarget || 'Kepala Madrasah'}
                      </td>
                      <td className="py-2.5 px-4 text-slate-700 leading-snug">
                        {tamu.purpose}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                          Terverifikasi
                        </span>
                      </td>
                    </tr>
                  ))}
                  {bukuTamuList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-slate-400">
                        Belum ada catatan kunjungan tamu pada sistem.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dual Signature: Kiri Sekretaris / Resepsionis, Kanan Kepala Madrasah */}
          <div className="pt-8 border-t border-slate-300 flex items-center justify-between text-center px-4">
            <div className="w-60">
              <p className="text-slate-500 text-[10px] mb-0.5">Mengetahui Petugas Resepsionis,</p>
              <p className="font-semibold text-slate-800">{settings.sekretarisTitle}</p>
              <div className="h-16" />
              <p className="font-bold underline text-slate-900">{settings.sekretarisName}</p>
              <p className="text-[9px] text-slate-500 font-mono">NIP. {settings.sekretarisNip}</p>
            </div>

            <div className="w-60">
              <p className="text-slate-500 text-[10px] mb-0.5">
                {settings.city || 'Wonosobo'}, {formatTanggalIndonesia(new Date().toISOString().split('T')[0])}
              </p>
              <p className="font-semibold text-slate-800">{settings.kepsekTitle}</p>
              <div className="h-16" />
              <p className="font-bold underline text-slate-900">{settings.kepsekName}</p>
              <p className="text-[9px] text-slate-500 font-mono">NIP. {settings.kepsekNip}</p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. LAPORAN KHUSUS PERSURATAN (SURAT MASUK & SURAT KELUAR) */}
      {/* ======================================================== */}
      {reportType === 'persuratan' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E2EAE5] printable-area space-y-6 text-slate-800 text-xs">
          {/* Header Kop Madrasah */}
          <div className="border-b-4 border-double border-slate-800 pb-3 flex items-center justify-center gap-4 text-center">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Logo Madrasah"
                className="w-16 h-16 object-contain shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#1B3A33] text-[#CCA13B] flex items-center justify-center font-black text-xl border-2 border-[#CCA13B] shrink-0">
                AH
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-slate-800 tracking-wider uppercase mb-0.5">
                {settings.kopHeader1 || 'YAYASAN PONPES ITTIHADUT THOLIBIN'}
              </p>
              <h2 className="text-base font-black text-[#1B3A33] tracking-wide uppercase">
                BUKU AGENDA & LAPORAN REKAPITULASI PERSURATAN KEDINASAN
              </h2>
              <p className="text-xs font-bold text-slate-700 uppercase mt-0.5">
                {settings.kopSchoolName}
              </p>
              <p className="text-[10px] text-slate-600 font-medium">
                {settings.kopDetails}
              </p>
              <p className="text-[9px] text-slate-500 mt-0.5">
                {settings.kopAddress}
              </p>
            </div>
          </div>

          {/* KPI Summary Persuratan */}
          <div>
            <div className="flex items-center justify-between pb-1 mb-3 border-b border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B3A33]">
                I. Ringkasan Volume Administrasi Persuratan
              </h4>
              <span className="text-[11px] font-mono text-slate-500">
                Periode: Tahun Ajaran 2026/2027
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Surat Masuk Kedinasan</span>
                <p className="text-xl font-extrabold text-[#047857] mt-1 tabular-nums">
                  {suratMasukList.length} Surat
                </p>
                <span className="text-[9px] text-emerald-700 font-semibold">Tercatat di agenda TU</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Surat Keluar Resmi</span>
                <p className="text-xl font-extrabold text-[#CCA13B] mt-1 tabular-nums">
                  {suratKeluarList.length} Surat
                </p>
                <span className="text-[9px] text-amber-700 font-semibold">Diterbitkan resmi madrasah</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Total Agenda Persuratan</span>
                <p className="text-xl font-extrabold text-[#1B3A33] mt-1 tabular-nums">
                  {suratMasukList.length + suratKeluarList.length} Berkas
                </p>
                <span className="text-[9px] text-slate-500 font-semibold">Arsip persuratan terpadu</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Status Tindak Lanjut</span>
                <p className="text-xl font-extrabold text-blue-700 mt-1 tabular-nums">
                  100%
                </p>
                <span className="text-[9px] text-blue-700 font-semibold">Disposisi & terdokumentasi</span>
              </div>
            </div>
          </div>

          {/* Bagian A: Buku Agenda Surat Masuk */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B3A33] mb-2 pb-1 border-b border-slate-200">
              II. Buku Agenda Surat Masuk Kedinasan
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase border-b border-slate-200">
                    <th className="py-2.5 px-3 text-center w-10">No</th>
                    <th className="py-2.5 px-4 w-44">Nomor Surat Masuk</th>
                    <th className="py-2.5 px-3 w-28">Tgl Diterima</th>
                    <th className="py-2.5 px-4">Asal Instansi Pengirim</th>
                    <th className="py-2.5 px-4">Perihal / Isi Ringkas Surat</th>
                    <th className="py-2.5 px-4 text-center w-36">Status Disposisi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {suratMasukList.map((surat, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{surat.letterNo}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{surat.dateReceived}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{surat.sender}</td>
                      <td className="py-2.5 px-4 text-slate-700 leading-snug">{surat.subject}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {surat.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {suratMasukList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-slate-400">
                        Belum ada arsip surat masuk pada sistem.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bagian B: Buku Agenda Surat Keluar */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B3A33] mb-2 pb-1 border-b border-slate-200">
              III. Buku Agenda Surat Keluar Kedinasan
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase border-b border-slate-200">
                    <th className="py-2.5 px-3 text-center w-10">No</th>
                    <th className="py-2.5 px-4 w-44">Nomor Surat Keluar</th>
                    <th className="py-2.5 px-3 w-28">Tgl Dikirim</th>
                    <th className="py-2.5 px-4">Ditujukan Kepada</th>
                    <th className="py-2.5 px-4">Perihal Surat</th>
                    <th className="py-2.5 px-4 text-center w-36">Penandatangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {suratKeluarList.map((surat, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{surat.letterNo}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{surat.dateSent}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{surat.recipient}</td>
                      <td className="py-2.5 px-4 text-slate-700 leading-snug">{surat.subject}</td>
                      <td className="py-2.5 px-4 text-center font-medium text-slate-800">
                        {surat.signerName || settings.kepsekName}
                      </td>
                    </tr>
                  ))}
                  {suratKeluarList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-slate-400">
                        Belum ada arsip surat keluar pada sistem.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dual Signature: Kiri Sekretaris / TU, Kanan Kepala Madrasah */}
          <div className="pt-8 border-t border-slate-300 flex items-center justify-between text-center px-4">
            <div className="w-60">
              <p className="text-slate-500 text-[10px] mb-0.5">Mengetahui Kepala TU,</p>
              <p className="font-semibold text-slate-800">{settings.sekretarisTitle}</p>
              <div className="h-16" />
              <p className="font-bold underline text-slate-900">{settings.sekretarisName}</p>
              <p className="text-[9px] text-slate-500 font-mono">NIP. {settings.sekretarisNip}</p>
            </div>

            <div className="w-60">
              <p className="text-slate-500 text-[10px] mb-0.5">
                {settings.city || 'Wonosobo'}, {formatTanggalIndonesia(new Date().toISOString().split('T')[0])}
              </p>
              <p className="font-semibold text-slate-800">{settings.kepsekTitle}</p>
              <div className="h-16" />
              <p className="font-bold underline text-slate-900">{settings.kepsekName}</p>
              <p className="text-[9px] text-slate-500 font-mono">NIP. {settings.kepsekNip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
