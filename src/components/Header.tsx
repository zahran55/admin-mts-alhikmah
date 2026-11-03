import React from 'react';
import {
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { User, MadrasahSettings } from '../types';
import { GasConfig } from '../services/gasService';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  gasConfig: GasConfig;
  settings: MadrasahSettings;
  onOpenGasModal: () => void;
  onLogout: () => void;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  currentUser,
  settings,
  onLogout,
}) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Ringkasan Eksekutif & Statistik';
      case 'siswa':
        return 'Manajemen Peserta Didik & Kartu Pelajar';
      case 'guru':
        return 'Direktori Pendidik & Tenaga Kependidikan';
      case 'keuangan':
        return 'Sistem Keuangan & Generator Kwitansi';
      case 'surat':
        return 'Administrasi Persuratan & Buku Tamu Digital';
      case 'absensi':
        return 'Pemindai Presensi Barcode & QR Code';
      case 'mapel':
        return 'Kurikulum & Distribusi Jam Pelajaran';
      case 'rapor':
        return 'Pengolahan Nilai & Cetak Rapor Akademik';
      case 'arsip':
        return 'Repositori Dokumen & Sertifikat Akreditasi';
      case 'laporan':
        return 'Laporan Pertanggungjawaban Tahunan';
      case 'pengaturan':
        return 'Pengaturan Logo, Kop Surat & Penandatangan';
      case 'database':
        return 'Arsitektur Google Sheets & Apps Script';
      case 'portal':
        return 'Portal Publik (mtsalhikmahwsb.com)';
      default:
        return 'Sistem Informasi Administrasi';
    }
  };

  return (
    <header className="px-4 lg:px-8 py-3.5 flex items-center justify-between border-b border-[#D5E2DA] bg-white/80 backdrop-blur-md sticky top-0 z-30 no-print">
      {/* Left: Elegant Breadcrumb & Madrasah Logo */}
      <div className="flex items-center gap-3">
        {settings.logoUrl && (
          <img
            src={settings.logoUrl}
            alt="Logo Madrasah"
            className="w-9 h-9 object-contain rounded-lg p-0.5 border border-slate-200 bg-white shrink-0"
          />
        )}

        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#1B3A33]/70 uppercase tracking-widest">
            <span>{settings.kopSchoolName || 'MTs Al-Hikmah Wonosobo'}</span>
            <span>•</span>
            <span className="text-[#047857]">{currentUser.role}</span>
          </div>
          <h1 className="text-sm sm:text-base lg:text-lg font-black text-[#1B3A33] tracking-tight">
            {getTabTitle(activeTab)}
          </h1>
        </div>
      </div>

      {/* Right: Sleek User Profile lockup & Direct Logout button */}
      <div className="flex items-center gap-3">
        {/* User Badge */}
        <div className="flex items-center gap-2.5 pl-3 pr-2 py-1 bg-[#F4F8F5] rounded-full border border-[#D5E2DA]">
          <div className="w-7 h-7 rounded-full bg-[#1B3A33] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <UserIcon className="w-4 h-4 text-[#CCA13B]" />
            )}
          </div>
          <div className="hidden sm:block text-left pr-1">
            <p className="text-xs font-bold text-[#1B3A33] leading-none line-clamp-1">
              {currentUser.name}
            </p>
            <p className="text-[10px] font-semibold text-[#047857] leading-tight">
              {currentUser.role}
            </p>
          </div>
        </div>

        {/* Direct Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer shadow-2xs active:scale-95"
          title="Keluar dari sistem (Logout)"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
};
