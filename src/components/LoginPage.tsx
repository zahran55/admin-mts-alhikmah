import React, { useState } from 'react';
import {
  Lock,
  User as UserIcon,
  ArrowRight,
  School,
  Globe,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { User, MadrasahSettings } from '../types';
import { INITIAL_USERS } from '../data/initialData';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  settings: MadrasahSettings;
  onOpenPublicWeb: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  settings,
  onOpenPublicWeb,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    // 1. Admin authentication (password: admin431)
    if (
      (trimmedUser === 'admin' || trimmedUser === 'ahmadfauzi@mtsalhikmahwsb.com') &&
      trimmedPass === 'admin431'
    ) {
      const adminUser = INITIAL_USERS.find((u) => u.role === 'Admin') || INITIAL_USERS[0];
      onLoginSuccess(adminUser);
      return;
    }

    // 2. Guru authentication (password: guru4321)
    if (
      (trimmedUser === 'guru' || trimmedUser === 'ihsan@mtsalhikmahwsb.com') &&
      trimmedPass === 'guru4321'
    ) {
      const guruUser = INITIAL_USERS.find((u) => u.role === 'Guru') || INITIAL_USERS[2];
      onLoginSuccess(guruUser);
      return;
    }

    // 3. Bendahara authentication (password: bendahra4321 or bendahara4321)
    if (
      (trimmedUser === 'bendahara' || trimmedUser === 'bendahra' || trimmedUser === 'siti@mtsalhikmahwsb.com') &&
      (trimmedPass === 'bendahra4321' || trimmedPass === 'bendahara4321')
    ) {
      const bendaharaUser = INITIAL_USERS.find((u) => u.role === 'Bendahara') || INITIAL_USERS[1];
      onLoginSuccess(bendaharaUser);
      return;
    }

    setErrorMsg('Username atau password tidak sesuai. Pastikan username dan kata sandi yang Anda masukkan benar.');
  };

  return (
    <div className="min-h-screen bg-[#EEF3EF] flex flex-col justify-between selection:bg-[#047857] selection:text-white p-4 sm:p-6 lg:p-8">
      {/* Top Bar with School link */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt="Logo MTs Al-Hikmah"
              className="w-10 h-10 object-contain rounded-xl border border-slate-200 bg-white p-1"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#1B3A33] text-[#CCA13B] flex items-center justify-center font-black border border-[#CCA13B] shadow-sm">
              AH
            </div>
          )}
          <div>
            <h1 className="text-sm font-black text-[#1B3A33] tracking-tight uppercase">
              {settings.kopSchoolName || 'MTs Al-Hikmah Wonosobo'}
            </h1>
            <p className="text-[10px] text-slate-500 font-mono">
              Sistem Informasi Manajemen Administrasi Madrasah
            </p>
          </div>
        </div>

        <button
          onClick={onOpenPublicWeb}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#047857] bg-white hover:bg-emerald-50 border border-slate-200 transition-all shadow-xs cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Kunjungi Website Resmi (mtsalhikmahwsb.com)</span>
          <span className="sm:hidden">Web Resmi</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-4xl w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-[#D5E2DA] bg-white">
        {/* Left Side: Brand Showcase & Architecture */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1B3A33] via-[#244E45] to-[#122722] text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-[#CCA13B]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-[#CCA13B] mb-6">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
              ) : (
                <School className="w-6 h-6 text-[#CCA13B]" />
              )}
            </div>

            <span className="text-[10px] font-bold tracking-widest text-[#CCA13B] uppercase">
              PORTAL ADMINISTRASI TERPADU
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-1 text-white uppercase">
              MTs Al-Hikmah
            </h2>
            <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
              Login untuk mengelola seluruh administrasi madrasah: data siswa & kartu barcode, direktori GTK, kas & kwitansi bendahara, agenda surat, absensi scan, dan cetak rapor akademik.
            </p>

            <div className="mt-8 space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-[#CCA13B] shrink-0" />
                <span>Login Langsung Menuju Halaman Role Pengguna</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-[#CCA13B] shrink-0" />
                <span>Kartu Pelajar & GTK Lengkap Barcode Presensi</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-[#CCA13B] shrink-0" />
                <span>Kop Surat & Cetak PDF Bersih Tanpa Watermark</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-[11px] text-white/60 flex items-center justify-between">
            <span>Versi Aplikasi 2.7</span>
            <span className="font-mono text-emerald-300">Wonosobo, Jawa Tengah</span>
          </div>
        </div>

        {/* Right Side: Login Form & Credentials Table */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="pb-4">
              <h3 className="text-xl font-black text-[#1B3A33]">
                Masuk ke Sistem Administrasi
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Silakan pilih akun peran Anda atau masukkan username dan password di bawah:
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Manual Form */}
            <form onSubmit={handleManualLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Pengguna (Username)
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan: admin / guru / bendahara"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#047857] font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#047857] font-semibold text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
            MTs Al-Hikmah Wonosobo · Sistem Terintegrasi Google Sheets Database
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-slate-500 pt-4">
        &copy; {new Date().getFullYear()} MTs Al-Hikmah Wonosobo. Hak cipta dilindungi undang-undang.
      </div>
    </div>
  );
};
