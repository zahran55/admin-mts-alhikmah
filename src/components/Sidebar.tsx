import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Wallet,
  Mail,
  QrCode,
  BookOpen,
  FileSpreadsheet,
  Archive,
  BarChart3,
  Database,
  Globe,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { User, UserRole, MadrasahSettings } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onSwitchRole: (role: UserRole) => void;
  onLogout: () => void;
  settings: MadrasahSettings;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onSwitchRole,
  onLogout,
  settings,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard, roles: ['Admin', 'Bendahara', 'Guru'] },
    { id: 'siswa', label: 'SISWA', icon: Users, roles: ['Admin', 'Guru'] },
    { id: 'guru', label: 'GURU & STAF', icon: GraduationCap, roles: ['Admin'] },
    { id: 'keuangan', label: 'KEUANGAN', icon: Wallet, roles: ['Admin', 'Bendahara'] },
    { id: 'surat', label: 'PERSURATAN', icon: Mail, roles: ['Admin'] },
    { id: 'absensi', label: 'PRESENSI SCAN', icon: QrCode, roles: ['Admin', 'Guru'] },
    { id: 'mapel', label: 'MATA PELAJARAN', icon: BookOpen, roles: ['Admin', 'Guru'] },
    { id: 'rapor', label: 'RAPOR AKADEMIK', icon: FileSpreadsheet, roles: ['Admin', 'Guru'] },
    { id: 'arsip', label: 'ARSIP DIGITAL', icon: Archive, roles: ['Admin', 'Guru'] },
    { id: 'laporan', label: 'LAPORAN TAHUNAN', icon: BarChart3, roles: ['Admin', 'Bendahara'] },
    { id: 'pengaturan', label: 'PENGATURAN KOP', icon: Settings, roles: ['Admin'] },
    { id: 'database', label: 'GOOGLE SHEETS', icon: Database, roles: ['Admin'] },
    { id: 'portal', label: 'PORTAL PUBLIK', icon: Globe, roles: ['Admin', 'Bendahara', 'Guru'] },
  ];

  // If Admin: show all menus!
  const visibleMenuItems = currentUser.role === 'Admin'
    ? menuItems
    : menuItems.filter((item) => item.roles.includes(currentUser.role));

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-72 lg:w-68 xl:w-72 bg-[#1B3A33] text-white flex flex-col justify-between p-5 lg:my-4 lg:ml-4 lg:rounded-3xl shadow-2xl transition-transform duration-300 ease-in-out shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Profile Lockup - Inspired by Reference */}
        <div>
          <div className="flex flex-col items-center text-center pt-1 pb-5 border-b border-white/10">
            {/* Custom Logo or Avatar */}
            <div className="relative mb-2.5">
              <div className="w-16 h-16 rounded-full border-2 border-[#CCA13B] p-0.5 overflow-hidden shadow-lg bg-[#244E45] flex items-center justify-center">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt="Logo Madrasah"
                    className="w-full h-full object-contain bg-white rounded-full p-1"
                  />
                ) : (
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                    alt={currentUser.name}
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#1B3A33] rounded-full" title="Online" />
            </div>

            <h2 className="text-sm font-bold tracking-wide text-white uppercase line-clamp-1">
              {currentUser.name}
            </h2>
            <p className="text-[11px] text-white/70 font-mono tracking-tight mt-0.5 truncate max-w-[200px]">
              {currentUser.email}
            </p>

            {/* Role Badge */}
            <div className="mt-2.5 flex items-center gap-1.5 bg-[#254F46] px-3.5 py-1 rounded-full border border-white/10 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#CCA13B]" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-200">
                Akses: {currentUser.role}
              </span>
            </div>
          </div>

          {/* Navigation Links with Reference's Pill Indicator */}
          <nav className="mt-4 space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-white text-[#1B3A33] shadow-md font-bold scale-[1.02]'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#CCA13B]' : 'text-emerald-300/80'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#1B3A33]/70" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section with Direct Logout Button */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          {/* Tombol Keluar Langsung ke Login */}
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-full text-xs font-bold text-rose-200 bg-rose-950/50 hover:bg-rose-900 border border-rose-500/40 transition-all shadow-md active:scale-98 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-300" />
            <span>KELUAR (LOGOUT)</span>
          </button>

          <div className="flex items-center justify-between text-[10px] text-white/50 pt-1">
            <span>MTs Al-Hikmah Wonosobo</span>
            <span className="font-mono text-emerald-300">v2.6</span>
          </div>
        </div>
      </aside>
    </>
  );
};
