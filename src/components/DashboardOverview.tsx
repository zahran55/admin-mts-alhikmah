import React from 'react';
import {
  Wallet,
  Users,
  QrCode,
  GraduationCap,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  Siswa,
  Guru,
  Keuangan,
  SuratMasuk,
  Absensi,
  formatRupiah,
} from '../data/initialData';

interface DashboardOverviewProps {
  siswaList: Siswa[];
  guruList: Guru[];
  keuanganList: Keuangan[];
  suratMasukList: SuratMasuk[];
  absensiList: Absensi[];
  onNavigate: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  siswaList,
  guruList,
  keuanganList,
  suratMasukList,
  absensiList,
  onNavigate,
}) => {
  // Live calculations
  const totalInflow = keuanganList
    .filter((k) => k.category === 'Inflow')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalOutflow = keuanganList
    .filter((k) => k.category === 'Outflow')
    .reduce((sum, item) => sum + item.amount, 0);

  const saldoKas = totalInflow - totalOutflow;

  const todayDate = '2026-11-01';
  const todayAbsensi = absensiList.filter((a) => a.date === todayDate);
  const totalHadir = todayAbsensi.filter((a) => a.status === 'Present').length;
  const attendanceRate = siswaList.length > 0 ? ((totalHadir / siswaList.length) * 100).toFixed(1) : '97.2';

  // Last activities list
  const recentTransactions = keuanganList.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* TOP 3 STAT CARDS - Faithful to the User Reference Image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Warm Golden Ochre - Reference Boeing 787 Style */}
        <div className="relative overflow-hidden rounded-3xl bg-[#CCA13B] text-white p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          {/* Subtle contour topography SVG background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg viewBox="0 0 300 150" className="w-full h-full stroke-white fill-none">
              <path d="M-20,40 Q100,10 200,60 T350,30" strokeWidth="1.5" />
              <path d="M-20,70 Q120,40 220,90 T350,60" strokeWidth="1.5" />
              <path d="M-20,100 Q80,70 180,120 T350,90" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-white/90">
                Saldo Kas Madrasah
              </p>
              <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight mt-1 tabular-nums">
                {formatRupiah(saldoKas)}
              </h3>
              <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-white/95">
                <span className="flex items-center text-emerald-950 bg-white/30 px-2 py-0.5 rounded-full text-[11px]">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +14.2%
                </span>
                <span>Penerimaan BOS & SPP</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('keuangan')}
              className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shadow-xs"
              title="Lihat Keuangan"
            >
              <Wallet className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Card 2: Deep Pine Slate Green - Reference Airbus Style */}
        <div className="relative overflow-hidden rounded-3xl bg-[#284F47] text-white p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-emerald-200">
                Total Siswa Aktif
              </p>
              <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight mt-1 tabular-nums">
                {siswaList.length} Siswa
              </h3>
              <p className="text-xs text-white/80 mt-3 font-medium">
                Kelas 7: 2 Siswa · Kelas 8: 2 Siswa · Kelas 9: 2 Siswa
              </p>
            </div>

            <button
              onClick={() => onNavigate('siswa')}
              className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shadow-xs"
              title="Kelola Siswa"
            >
              <Users className="w-5 h-5 text-[#CCA13B]" />
            </button>
          </div>

          {/* Miniature silhouette illustration */}
          <div className="absolute -bottom-4 -right-4 w-28 h-28 opacity-10 pointer-events-none">
            <Users className="w-full h-full text-white" />
          </div>
        </div>

        {/* Card 3: Deep Dark Emerald with Stylized Network Nodes - Reference Total Flights Style */}
        <div className="relative overflow-hidden rounded-3xl bg-[#1B3A33] text-white p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-emerald-200">
                Presensi Hari Ini
              </p>
              <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight mt-1 tabular-nums">
                {totalHadir > 0 ? totalHadir : '472'} Hadir
              </h3>
              <p className="text-xs text-white/80 mt-3 font-medium">
                Tingkat Kehadiran: <span className="text-[#CCA13B] font-bold">97.8%</span>
              </p>
            </div>

            <button
              onClick={() => onNavigate('absensi')}
              className="w-10 h-10 rounded-2xl bg-[#CCA13B] text-slate-950 flex items-center justify-center transition-transform hover:scale-105 shadow-xs font-bold"
              title="Buka Pemindai Presensi"
            >
              <QrCode className="w-5 h-5" />
            </button>
          </div>

          {/* Network Map Graphic matching reference */}
          <div className="absolute bottom-2 right-2 opacity-30 pointer-events-none">
            <svg viewBox="0 0 100 50" className="w-24 h-12 stroke-[#CCA13B] fill-none">
              <path d="M10,40 Q40,10 70,30 T95,15" strokeWidth="1" strokeDasharray="2,2" />
              <circle cx="10" cy="40" r="2" fill="#CCA13B" />
              <circle cx="45" cy="18" r="2" fill="#CCA13B" />
              <circle cx="70" cy="30" r="2.5" fill="#CCA13B" />
              <circle cx="95" cy="15" r="2" fill="#CCA13B" />
            </svg>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION - Left: Recent Transactions (Ticket/Row Style) & Right: Statistics Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Last Trips / Recent Financial & Academic Activities (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h4 className="text-base font-bold text-[#1B3A33]">Transaksi & Mutasi Kas Terkini</h4>
              <p className="text-xs text-slate-500 mt-0.5">Catatan penerimaan SPP, BOS, dan operasional madrasah</p>
            </div>
            <button
              onClick={() => onNavigate('keuangan')}
              className="text-xs font-semibold text-[#047857] hover:text-[#064E3B] flex items-center gap-1"
            >
              <span>Semua Mutasi</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Column Header */}
          <div className="grid grid-cols-12 text-[11px] font-bold text-slate-600 tracking-wider uppercase mt-4 px-3 py-2 bg-slate-50/70 rounded-xl">
            <span className="col-span-5">Penyetor / Keterangan</span>
            <span className="col-span-3 text-center">Kategori</span>
            <span className="col-span-4 text-right">Nominal</span>
          </div>

          {/* Rows styled with the user reference's clean ticket rhythm */}
          <div className="divide-y divide-slate-100 mt-1">
            {recentTransactions.map((tx, idx) => (
              <div
                key={tx.id || idx}
                className="grid grid-cols-12 items-center px-3 py-3.5 hover:bg-emerald-50/30 rounded-xl transition-colors group"
              >
                {/* Member / Payer */}
                <div className="col-span-5 flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      tx.category === 'Inflow'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {tx.category === 'Inflow' ? '+' : '-'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-[#047857]">
                      {tx.payerOrPayee || tx.adminUser}
                    </p>
                    <p className="text-[11px] text-slate-600 truncate font-mono">
                      {tx.receiptNo}
                    </p>
                  </div>
                </div>

                {/* Category Pill */}
                <div className="col-span-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      tx.category === 'Inflow'
                        ? 'bg-[#CCA13B]/20 text-[#8F6813]'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tx.type}
                  </span>
                </div>

                {/* Amount */}
                <div className="col-span-4 text-right">
                  <span
                    className={`text-xs font-bold font-mono tabular-nums ${
                      tx.category === 'Inflow' ? 'text-emerald-700' : 'text-slate-700'
                    }`}
                  >
                    {tx.category === 'Inflow' ? '+ ' : '- '}
                    {formatRupiah(tx.amount)}
                  </span>
                  <p className="text-[10px] text-slate-600">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Statistics Bar Chart (5 cols) - Styled like the reference */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-[#1B3A33]">Statistik Presensi</h4>
              <span className="text-[11px] font-medium text-slate-600">Semester Ganjil</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Rasio kehadiran per bulan (%)</p>
          </div>

          {/* Bar Chart Visualization - Golden and Green Dual Bars */}
          <div className="mt-6 flex items-end justify-between h-44 px-2 pt-4 border-b border-slate-100">
            {[
              { month: 'Jul', bar1: 65, bar2: 45 },
              { month: 'Agu', bar1: 85, bar2: 55 },
              { month: 'Sep', bar1: 75, bar2: 40 },
              { month: 'Okt', bar1: 60, bar2: 30 },
              { month: 'Nov', bar1: 92, bar2: 70 },
              { month: 'Des', bar1: 80, bar2: 50 },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 group">
                <div className="flex items-end gap-1.5 h-32">
                  {/* Golden Ochre Bar */}
                  <div
                    style={{ height: `${item.bar1}%` }}
                    className="w-2.5 bg-[#CCA13B] rounded-t-sm transition-all duration-300 group-hover:brightness-110"
                    title={`Siswa: ${item.bar1}%`}
                  />
                  {/* Deep Pine Green Bar */}
                  <div
                    style={{ height: `${item.bar2}%` }}
                    className="w-2.5 bg-[#1B3A33] rounded-t-sm transition-all duration-300 group-hover:brightness-110"
                    title={`Guru: ${item.bar2}%`}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-600 uppercase">{item.month}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#CCA13B] rounded-xs" />
              <span className="text-slate-600 text-[11px] font-medium">Siswa (97.8%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#1B3A33] rounded-xs" />
              <span className="text-slate-600 text-[11px] font-medium">Guru & Staf (100%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION - Donut Share & Schedule Spline Curve Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Bottom Left: Proporsi Siswa & Gender (Donut Chart) - Reference "Flights Share" (4 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-[#1B3A33]">Komposisi Peserta Didik</h4>
            <p className="text-xs text-slate-500 mt-0.5">Distribusi per tingkat kelas MTs</p>
          </div>

          {/* Donut Chart SVG */}
          <div className="relative flex items-center justify-center my-6">
            <svg viewBox="0 0 160 160" className="w-40 h-40">
              {/* Segment 1: Kelas 7 (Golden Ochre) */}
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke="#CCA13B"
                strokeWidth="24"
                strokeDasharray="113 264"
                strokeDashoffset="0"
              />
              {/* Segment 2: Kelas 8 (Teal Emerald) */}
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke="#047857"
                strokeWidth="24"
                strokeDasharray="125 252"
                strokeDashoffset="-113"
              />
              {/* Segment 3: Kelas 9 (Deep Pine Green) */}
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke="#1B3A33"
                strokeWidth="24"
                strokeDasharray="139 238"
                strokeDashoffset="-238"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xl font-extrabold text-[#1B3A33] tabular-nums">486</span>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Total Siswa</p>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100">
            <div>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#CCA13B] mb-1" />
              <p className="text-[10px] font-bold text-slate-700">Kelas 7</p>
              <p className="text-xs font-semibold text-[#1B3A33]">33.3%</p>
            </div>
            <div>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#047857] mb-1" />
              <p className="text-[10px] font-bold text-slate-700">Kelas 8</p>
              <p className="text-xs font-semibold text-[#1B3A33]">33.7%</p>
            </div>
            <div>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1B3A33] mb-1" />
              <p className="text-[10px] font-bold text-slate-700">Kelas 9</p>
              <p className="text-xs font-semibold text-[#1B3A33]">33.0%</p>
            </div>
          </div>
        </div>

        {/* Bottom Right: Schedule / Spline Curved Line Area Chart with Tooltip - Reference "Flights Schedule" (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-[#1B3A33]">Tren Kehadiran & Aktivitas Akademik</h4>
              <p className="text-xs text-slate-500 mt-0.5">Grafik dinamika kehadiran harian dan evaluasi mingguan</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#CCA13B]" /> Kehadiran Siswa
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B3A33]" /> Log Aktivitas
              </span>
            </div>
          </div>

          {/* Interactive Spline Chart Area with Floating Tooltip like in Reference */}
          <div className="relative mt-4 h-48 w-full">
            <svg viewBox="0 0 600 180" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="curveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#CCA13B" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#CCA13B" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[30, 70, 110, 150].map((y) => (
                <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#F1F5F3" strokeWidth="1" />
              ))}

              {/* Shaded Area for Golden Curve */}
              <path
                d="M 20 130 C 80 150, 140 60, 200 90 C 260 120, 320 20, 380 40 C 440 60, 500 140, 580 80 L 580 170 L 20 170 Z"
                fill="url(#curveGrad)"
              />

              {/* Golden Spline Curve */}
              <path
                d="M 20 130 C 80 150, 140 60, 200 90 C 260 120, 320 20, 380 40 C 440 60, 500 140, 580 80"
                fill="none"
                stroke="#CCA13B"
                strokeWidth="2.5"
              />

              {/* Secondary Dark Pine Curve */}
              <path
                d="M 20 90 C 80 160, 160 140, 240 100 C 320 60, 400 160, 480 110 C 520 80, 550 70, 580 120"
                fill="none"
                stroke="#1B3A33"
                strokeWidth="2"
                opacity="0.85"
              />

              {/* Highlight Pin at (380, 40) */}
              <circle cx="380" cy="40" r="5" fill="#CCA13B" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="200" cy="90" r="4" fill="#1B3A33" stroke="#FFFFFF" strokeWidth="2" />
            </svg>

            {/* Floating Tooltip matching the reference's "3500 Passengers" dark badge */}
            <div
              className="absolute pointer-events-none -top-1 left-[58%] -translate-x-1/2 bg-[#1B3A33] text-white px-3 py-1.5 rounded-xl shadow-lg text-center"
              style={{ zIndex: 10 }}
            >
              <p className="text-[11px] font-bold font-mono tracking-tight text-[#CCA13B]">
                472 Siswa Hadir
              </p>
              <p className="text-[9px] text-white/70">Puncak Kehadiran 98.4%</p>
            </div>
          </div>

          {/* Month Scale */}
          <div className="flex justify-between px-3 text-[11px] font-bold text-slate-600 pt-2 border-t border-slate-100">
            <span>Januari</span>
            <span>Februari</span>
            <span>Maret</span>
            <span>April</span>
            <span>Mei</span>
            <span>Juni</span>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS BANNER */}
      <div className="bg-gradient-to-r from-[#1B3A33] via-[#244E45] to-[#1B3A33] rounded-3xl p-5 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#CCA13B]" />
            Aksi Cepat & Alur Kerja Terpadu
          </h4>
          <p className="text-xs text-emerald-100/80 mt-0.5">
            Jalan pintas untuk penginputan presensi harian, cetak kwitansi SPP, atau buat surat resmi
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigate('absensi')}
            className="px-3.5 py-2 rounded-full text-xs font-bold bg-[#CCA13B] text-slate-950 hover:bg-[#DEB34E] transition-all shadow-xs flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Presensi Scan</span>
          </button>
          <button
            onClick={() => onNavigate('keuangan')}
            className="px-3.5 py-2 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 flex items-center gap-1.5"
          >
            <Wallet className="w-3.5 h-3.5 text-[#CCA13B]" />
            <span>Kwitansi Baru</span>
          </button>
          <button
            onClick={() => onNavigate('siswa')}
            className="px-3.5 py-2 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-emerald-300" />
            <span>Cetak Kartu Siswa</span>
          </button>
          <button
            onClick={() => onNavigate('surat')}
            className="px-3.5 py-2 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-300" />
            <span>Buku Tamu QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
