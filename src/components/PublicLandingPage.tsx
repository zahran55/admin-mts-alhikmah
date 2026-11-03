import React, { useState } from 'react';
import {
  Globe,
  Bell,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  School,
  BookOpen,
  Award,
  Users,
  Send,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Maximize2,
} from 'lucide-react';
import { Announcement, Siswa, BukuTamu, MadrasahSettings } from '../types';

interface PublicLandingPageProps {
  announcements: Announcement[];
  siswaList: Siswa[];
  settings: MadrasahSettings;
  onAddBukuTamu: (tamu: BukuTamu) => void;
  onBackToDashboard: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  announcements,
  siswaList,
  settings,
  onAddBukuTamu,
  onBackToDashboard,
}) => {
  const HOSTED_URL = 'https://mtsalhikmahwsb.com/';

  // NISN Verification search state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<{
    found: boolean;
    student?: Siswa;
    searched: boolean;
  }>({ found: false, searched: false });

  // Guestbook Form State
  const [guestName, setGuestName] = useState('');
  const [guestInstitution, setGuestInstitution] = useState('');
  const [guestPurpose, setGuestPurpose] = useState('');
  const [guestMeetTarget, setGuestMeetTarget] = useState('Kepala Madrasah');
  const [guestSubmitted, setGuestSubmitted] = useState(false);

  // Embed Snippet Copy State
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const q = lookupQuery.trim().toLowerCase();
    if (!q) return;

    const matched = siswaList.find(
      (s) => s.nisn.toLowerCase() === q || s.nis.toLowerCase() === q
    );

    if (matched) {
      setLookupResult({ found: true, student: matched, searched: true });
    } else {
      setLookupResult({ found: false, searched: true });
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPurpose) return;

    onAddBukuTamu({
      id: `GUEST-WEB-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      guestName,
      institution: guestInstitution || 'Masyarakat Umum',
      purpose: guestPurpose,
      meetTarget: guestMeetTarget || 'Kepala Madrasah',
      notes: 'Check-in mandiri melalui Portal Publik mtsalhikmahwsb.com',
      signatureLink: '#web-verified',
    });

    setGuestSubmitted(true);
    setGuestName('');
    setGuestInstitution('');
    setGuestPurpose('');
    setTimeout(() => setGuestSubmitted(false), 4000);
  };

  const embedCodeSnippet = `<!-- WIDGET INTEGRASI MTS AL-HIKMAH KE WEBSITE PUBLIK (mtsalhikmahwsb.com) -->
<div id="mts-alhikmah-widgets" style="font-family: sans-serif;">
  <!-- 1. Running Ticker Pengumuman -->
  <div style="background: #1B3A33; color: #CCA13B; padding: 8px 16px; font-size: 13px; font-weight: bold; overflow: hidden; white-space: nowrap;">
    <span>📢 INFO TERKINI: ${announcements[0]?.title || 'Penerimaan Peserta Didik Baru MTs Al-Hikmah Wonosobo'} - ${announcements[0]?.content || ''}</span>
  </div>

  <!-- 2. Tombol Floating Buku Tamu Digital -->
  <a href="${HOSTED_URL}" target="_blank" style="position: fixed; bottom: 20px; right: 20px; background: #047857; color: white; padding: 12px 20px; border-radius: 9999px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.25); display: flex; align-items: center; gap: 8px; z-index: 9999;">
    <span>📖 Isi Buku Tamu Digital MTs Al-Hikmah</span>
  </a>
</div>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* BANNER NOTIFICATION TICKER */}
      <div className="bg-[#1B3A33] text-white rounded-2xl px-4 py-2.5 shadow-md flex items-center gap-3 overflow-hidden border border-[#CCA13B]/30">
        <div className="flex items-center gap-1.5 shrink-0 bg-[#CCA13B] text-slate-950 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
          <Bell className="w-3.5 h-3.5" />
          <span>Warta Madrasah</span>
        </div>

        {/* Marquee Ticker */}
        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <div className="animate-marquee flex items-center gap-8 text-xs font-semibold text-emerald-100">
            {announcements.map((ann) => (
              <span key={ann.id} className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CCA13B]" />
                <strong className="text-white">{ann.title}:</strong>
                <span>{ann.content}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* HOSTED WEBSITE EMBED & LIVE PREVIEW BANNER */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B3A33] text-[#CCA13B] flex items-center justify-center font-bold">
              <Globe className="w-5 h-5 text-[#CCA13B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#1B3A33]">
                  Website Resmi Madrasah Ter-Hosting
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Live Hosted
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {HOSTED_URL}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIframeKey((k) => k + 1)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
              title="Muat Ulang Tampilan"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Muat Ulang</span>
            </button>
            <a
              href={HOSTED_URL}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Buka di Tab Baru</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Embedded Live Iframe View of https://mtsalhikmahwsb.com/ */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner relative">
          <div className="bg-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="ml-2 font-mono text-[11px] text-slate-400">
                {HOSTED_URL}
              </span>
            </div>
            <a
              href={HOSTED_URL}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Kunjungi Langsung</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <iframe
            key={iframeKey}
            src={HOSTED_URL}
            title="Website Resmi MTs Al-Hikmah Wonosobo"
            className="w-full h-[520px] border-0 bg-white"
            loading="lazy"
          />
        </div>
      </div>

      {/* TWO INTEGRATED WIDGETS (VERIFIKASI & BUKU TAMU DIGITAL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* WIDGET 1: STUDENT VERIFICATION */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Search className="w-5 h-5 text-[#047857]" />
              <div>
                <h4 className="text-sm font-bold text-[#1B3A33]">
                  Verifikasi Data Peserta Didik (Public Lookup)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Layanan cek status keaktifan santri bagi wali murid & instansi
                </p>
              </div>
            </div>

            <form onSubmit={handleLookup} className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Masukkan Nomor NISN atau NIS (contoh: 0089472191)..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#047857]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-xs"
              >
                Cek Data
              </button>
            </form>

            {lookupResult.searched && (
              <div className="mt-4">
                {lookupResult.found && lookupResult.student ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950 uppercase">
                        {lookupResult.student.name}
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                        Status: Terdaftar Aktif
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-900 pt-1 border-t border-emerald-200/60 font-mono">
                      <p>NISN: {lookupResult.student.nisn}</p>
                      <p>NIS: {lookupResult.student.nis}</p>
                      <p className="font-sans">Kelas: {lookupResult.student.class} MTs</p>
                      <p className="font-sans">Tahun Ajaran: 2026/2027</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs flex items-center gap-2 text-rose-800">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <p>
                      Nomor NISN/NIS tidak ditemukan dalam pangkalan data madrasah.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Contoh NISN aktif: <code className="font-mono text-[#047857] font-bold cursor-pointer" onClick={() => setLookupQuery('0089472191')}>0089472191</code>
          </div>
        </div>

        {/* WIDGET 2: PUBLIC GUEST CHECK-IN */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <QrCode className="w-5 h-5 text-[#CCA13B]" />
              <div>
                <h4 className="text-sm font-bold text-[#1B3A33]">
                  Formulir Tamu Pengunjung Digital
                </h4>
                <p className="text-[11px] text-slate-500">
                  Pengisian buku tamu online langsung tersinkron ke database madrasah
                </p>
              </div>
            </div>

            <form onSubmit={handleGuestSubmit} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Nama Anda
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Bapak / Ibu Tamu"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Instansi / Domisili
                  </label>
                  <input
                    type="text"
                    required
                    value={guestInstitution}
                    onChange={(e) => setGuestInstitution(e.target.value)}
                    placeholder="Wali Murid / Dinas"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                  Ingin Bertemu Siapa?
                </label>
                <select
                  value={guestMeetTarget}
                  onChange={(e) => setGuestMeetTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Kepala Madrasah">Kepala Madrasah (H. Ahmad Fauzi, M.Pd)</option>
                  <option value="Komite Madrasah">Komite Madrasah</option>
                  <option value="Waka Kurikulum">Waka Kurikulum</option>
                  <option value="Waka Kesiswaan">Waka Kesiswaan</option>
                  <option value="Wali Kelas">Wali Kelas</option>
                  <option value="Guru BK">Guru BK</option>
                  <option value="Tata Usaha">Bagian Tata Usaha</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                  Maksud & Keperluan Kunjungan
                </label>
                <input
                  type="text"
                  required
                  value={guestPurpose}
                  onChange={(e) => setGuestPurpose(e.target.value)}
                  placeholder="Konsultasi program tahfidz / koordinasi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Buku Tamu</span>
              </button>
            </form>

            {guestSubmitted && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kunjungan Anda telah tercatat di Buku Tamu MTs Al-Hikmah.</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Resepsionis Gedung Utama</span>
            <span className="font-mono text-[#047857]">Senin - Sabtu: 07.00 - 14.30 WIB</span>
          </div>
        </div>
      </div>

      {/* EMBED CODE PREVIEW DRAWER */}
      <div className="bg-slate-900 text-emerald-300 rounded-3xl p-6 shadow-md text-xs font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-white font-sans">
          <div>
            <h4 className="font-bold text-sm">Cuplikan Kode Embed Widget untuk mtsalhikmahwsb.com</h4>
            <p className="text-[11px] text-slate-400">
              Gunakan kode di bawah jika ingin menempelkan widget pengumuman berjalan dan tombol buku tamu di website WordPress
            </p>
          </div>
          <button
            onClick={handleCopyEmbed}
            className="px-3 py-1.5 rounded-xl bg-[#CCA13B] text-slate-950 font-bold text-xs hover:bg-[#DEB34E] flex items-center gap-1"
          >
            {copiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Salin Kode</span>
          </button>
        </div>
        <pre className="mt-4 overflow-x-auto p-3 bg-slate-950 rounded-xl text-[11px] text-emerald-400 leading-relaxed">
          {embedCodeSnippet}
        </pre>
      </div>
    </div>
  );
};
