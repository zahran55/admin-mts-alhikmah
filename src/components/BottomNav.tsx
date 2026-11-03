import React from 'react';
import {
  LayoutDashboard,
  Users,
  Wallet,
  QrCode,
  Menu,
  LogOut,
  Globe,
  Settings,
} from 'lucide-react';
import { User } from '../types';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onLogout: () => void;
  onOpenMobileMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onOpenMobileMenu,
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1B3A33] text-white border-t border-white/15 shadow-2xl px-2 py-1.5 backdrop-blur-md no-print safe-area-inset-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'dashboard'
              ? 'text-[#CCA13B] font-bold scale-105'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Beranda</span>
        </button>

        {/* 2. Siswa / Keuangan (Tergantung Role) */}
        {currentUser.role === 'Bendahara' ? (
          <button
            onClick={() => setActiveTab('keuangan')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              activeTab === 'keuangan'
                ? 'text-[#CCA13B] font-bold scale-105'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Wallet className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Keuangan</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('siswa')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              activeTab === 'siswa'
                ? 'text-[#CCA13B] font-bold scale-105'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Siswa</span>
          </button>
        )}

        {/* 3. Scan Presensi (Center Action Button) */}
        <button
          onClick={() => setActiveTab('absensi')}
          className={`flex flex-col items-center justify-center -mt-4 py-1.5 px-3 rounded-2xl transition-all shadow-lg ${
            activeTab === 'absensi'
              ? 'bg-[#CCA13B] text-slate-950 font-bold ring-2 ring-white'
              : 'bg-[#047857] text-white hover:bg-[#065F46]'
          }`}
        >
          <QrCode className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Scan</span>
        </button>

        {/* 4. Menu Lainnya (Buka Drawer Lengkap) */}
        <button
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-white/70 hover:text-white transition-all"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Semua Menu</span>
        </button>

        {/* 5. Tombol Keluar (Logout) */}
        <button
          type="button"
          onClick={onLogout}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-rose-300 hover:text-rose-100 transition-all cursor-pointer"
          title="Keluar dari Akun"
        >
          <LogOut className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Keluar</span>
        </button>
      </div>
    </nav>
  );
};
