/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_SISWA,
  INITIAL_GURU,
  INITIAL_KEUANGAN,
  INITIAL_SURAT_MASUK,
  INITIAL_SURAT_KELUAR,
  INITIAL_BUKU_TAMU,
  INITIAL_ABSENSI,
  INITIAL_MATA_PELAJARAN,
  INITIAL_NILAI,
  INITIAL_ARSIP,
  INITIAL_ANNOUNCEMENTS,
  DEFAULT_SETTINGS,
} from './data/initialData';
import {
  User,
  UserRole,
  Siswa,
  Guru,
  Keuangan,
  SuratMasuk,
  SuratKeluar,
  BukuTamu,
  Absensi,
  MataPelajaran,
  Nilai,
  Arsip,
  Announcement,
  MadrasahSettings,
} from './types';
import {
  getGasConfig,
  saveGasConfig,
  GasConfig,
  syncAddSiswaToGas,
  syncAddBukuTamuToGas,
  syncAddGuruToGas,
  syncAddKeuanganToGas,
  syncAddSuratMasukToGas,
  syncAddSuratKeluarToGas,
  syncAddAbsensiToGas,
} from './services/gasService';

import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardOverview } from './components/DashboardOverview';
import { SiswaModule } from './components/SiswaModule';
import { GuruModule } from './components/GuruModule';
import { KeuanganModule } from './components/KeuanganModule';
import { SuratMenyuratModule } from './components/SuratMenyuratModule';
import { AbsensiModule } from './components/AbsensiModule';
import { MataPelajaranModule } from './components/MataPelajaranModule';
import { RaporModule } from './components/RaporModule';
import { ArsipModule } from './components/ArsipModule';
import { LaporanTahunanModule } from './components/LaporanTahunanModule';
import { PengaturanModule } from './components/PengaturanModule';
import { GoogleSheetsIntegrationModal } from './components/GoogleSheetsIntegrationModal';
import { PublicLandingPage } from './components/PublicLandingPage';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem('mts_is_logged_in');
      return savedAuth === 'true';
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const savedUser = localStorage.getItem('mts_auth_user');
      return savedUser ? JSON.parse(savedUser) : INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  // Settings State (Kop surat, logo web & kop, tanda tangan kiri kanan, bendahara kwitansi)
  const [settings, setSettings] = useState<MadrasahSettings>(() => {
    try {
      const savedSettings = localStorage.getItem('mts_madrasah_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          kopHeader1: parsed.kopHeader1 || 'YAYASAN PONPES ITTIHADUT THOLIBIN',
        };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Navigation & UI
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [gasConfig, setGasConfig] = useState<GasConfig>(getGasConfig());

  // Database State with LocalStorage Caching
  const [siswaList, setSiswaList] = useState<Siswa[]>(() => {
    try {
      const saved = localStorage.getItem('mts_siswa_data');
      return saved ? JSON.parse(saved) : INITIAL_SISWA;
    } catch {
      return INITIAL_SISWA;
    }
  });

  const [guruList, setGuruList] = useState<Guru[]>(() => {
    try {
      const saved = localStorage.getItem('mts_guru_data');
      return saved ? JSON.parse(saved) : INITIAL_GURU;
    } catch {
      return INITIAL_GURU;
    }
  });

  const [keuanganList, setKeuanganList] = useState<Keuangan[]>(() => {
    try {
      const saved = localStorage.getItem('mts_keuangan_data');
      return saved ? JSON.parse(saved) : INITIAL_KEUANGAN;
    } catch {
      return INITIAL_KEUANGAN;
    }
  });

  const [suratMasukList, setSuratMasukList] = useState<SuratMasuk[]>(() => {
    try {
      const saved = localStorage.getItem('mts_surat_masuk_data');
      return saved ? JSON.parse(saved) : INITIAL_SURAT_MASUK;
    } catch {
      return INITIAL_SURAT_MASUK;
    }
  });

  const [suratKeluarList, setSuratKeluarList] = useState<SuratKeluar[]>(() => {
    try {
      const saved = localStorage.getItem('mts_surat_keluar_data');
      return saved ? JSON.parse(saved) : INITIAL_SURAT_KELUAR;
    } catch {
      return INITIAL_SURAT_KELUAR;
    }
  });

  const [bukuTamuList, setBukuTamuList] = useState<BukuTamu[]>(() => {
    try {
      const saved = localStorage.getItem('mts_buku_tamu_data');
      return saved ? JSON.parse(saved) : INITIAL_BUKU_TAMU;
    } catch {
      return INITIAL_BUKU_TAMU;
    }
  });

  const [absensiList, setAbsensiList] = useState<Absensi[]>(() => {
    try {
      const saved = localStorage.getItem('mts_absensi_data');
      return saved ? JSON.parse(saved) : INITIAL_ABSENSI;
    } catch {
      return INITIAL_ABSENSI;
    }
  });

  const [mapelList, setMapelList] = useState<MataPelajaran[]>(() => {
    try {
      const saved = localStorage.getItem('mts_mapel_data');
      return saved ? JSON.parse(saved) : INITIAL_MATA_PELAJARAN;
    } catch {
      return INITIAL_MATA_PELAJARAN;
    }
  });

  const [nilaiList, setNilaiList] = useState<Nilai[]>(() => {
    try {
      const saved = localStorage.getItem('mts_nilai_data');
      return saved ? JSON.parse(saved) : INITIAL_NILAI;
    } catch {
      return INITIAL_NILAI;
    }
  });

  const [arsipList, setArsipList] = useState<Arsip[]>(() => {
    try {
      const saved = localStorage.getItem('mts_arsip_data');
      return saved ? JSON.parse(saved) : INITIAL_ARSIP;
    } catch {
      return INITIAL_ARSIP;
    }
  });

  const [announcements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem('mts_announcements_data');
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('mts_madrasah_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('mts_siswa_data', JSON.stringify(siswaList));
  }, [siswaList]);

  useEffect(() => {
    localStorage.setItem('mts_guru_data', JSON.stringify(guruList));
  }, [guruList]);

  useEffect(() => {
    localStorage.setItem('mts_keuangan_data', JSON.stringify(keuanganList));
  }, [keuanganList]);

  useEffect(() => {
    localStorage.setItem('mts_surat_masuk_data', JSON.stringify(suratMasukList));
  }, [suratMasukList]);

  useEffect(() => {
    localStorage.setItem('mts_surat_keluar_data', JSON.stringify(suratKeluarList));
  }, [suratKeluarList]);

  useEffect(() => {
    localStorage.setItem('mts_buku_tamu_data', JSON.stringify(bukuTamuList));
  }, [bukuTamuList]);

  useEffect(() => {
    localStorage.setItem('mts_absensi_data', JSON.stringify(absensiList));
  }, [absensiList]);

  useEffect(() => {
    localStorage.setItem('mts_mapel_data', JSON.stringify(mapelList));
  }, [mapelList]);

  useEffect(() => {
    localStorage.setItem('mts_nilai_data', JSON.stringify(nilaiList));
  }, [nilaiList]);

  useEffect(() => {
    localStorage.setItem('mts_arsip_data', JSON.stringify(arsipList));
  }, [arsipList]);

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('mts_is_logged_in', 'true');
    localStorage.setItem('mts_auth_user', JSON.stringify(user));

    // Direct routing based on user role
    if (user.role === 'Admin') {
      setActiveTab('dashboard'); // Admin directly to executive dashboard & all menus
    } else if (user.role === 'Guru') {
      setActiveTab('absensi'); // Guru directly to presensi scanner & attendance
    } else if (user.role === 'Bendahara') {
      setActiveTab('keuangan'); // Bendahara directly to cashflow & kwitansi
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.removeItem('mts_is_logged_in');
    localStorage.removeItem('mts_auth_user');
    setIsMobileOpen(false);
  };

  const handleSwitchRole = (role: UserRole) => {
    const foundUser = INITIAL_USERS.find((u) => u.role === role);
    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem('mts_auth_user', JSON.stringify(foundUser));
    }
  };

  const handleUpdateSettings = (newSettings: MadrasahSettings) => {
    setSettings(newSettings);
    localStorage.setItem('mts_madrasah_settings', JSON.stringify(newSettings));
  };

  // Notification Toast for sync
  const [syncToast, setSyncToast] = useState<{ message: string; isGas: boolean } | null>(null);

  const showSyncNotification = (message: string) => {
    const isGas = Boolean(gasConfig.webAppUrl);
    setSyncToast({ message, isGas });
    setTimeout(() => setSyncToast(null), 4000);
  };

  // CRUD Handlers with Auto-Sync to Google Sheets
  const handleAddSiswa = (newSiswa: Siswa) => {
    setSiswaList([newSiswa, ...siswaList]);
    syncAddSiswaToGas(newSiswa);
    showSyncNotification('Data siswa baru berhasil disimpan & dikirim ke Google Sheets!');
  };

  const handleUpdateSiswa = (updatedSiswa: Siswa) => {
    setSiswaList(siswaList.map((s) => (s.nis === updatedSiswa.nis ? updatedSiswa : s)));
    syncAddSiswaToGas(updatedSiswa);
    showSyncNotification('Data siswa berhasil diperbarui di sistem & Google Sheets!');
  };

  const handleDeleteSiswa = (nis: string) => {
    setSiswaList(siswaList.filter((s) => s.nis !== nis));
  };

  const handleAddGuru = (newGuru: Guru) => {
    setGuruList([newGuru, ...guruList]);
    syncAddGuruToGas(newGuru);
    showSyncNotification('Data guru berhasil disimpan & dikirim ke Google Sheets!');
  };

  const handleUpdateGuru = (updatedGuru: Guru) => {
    setGuruList(guruList.map((g) => (g.nip === updatedGuru.nip ? updatedGuru : g)));
    syncAddGuruToGas(updatedGuru);
    showSyncNotification('Data guru berhasil diperbarui di sistem & Google Sheets!');
  };

  const handleDeleteGuru = (nip: string) => {
    setGuruList(guruList.filter((g) => g.nip !== nip));
  };

  const handleAddKeuangan = (newKeuangan: Keuangan) => {
    setKeuanganList([newKeuangan, ...keuanganList]);
    syncAddKeuanganToGas(newKeuangan);
    showSyncNotification('Transaksi kas berhasil dicatat & disinkronkan ke Google Sheets!');
  };

  const handleDeleteKeuangan = (id: string) => {
    setKeuanganList(keuanganList.filter((k) => k.id !== id));
  };

  const handleAddSuratMasuk = (surat: SuratMasuk) => {
    setSuratMasukList([surat, ...suratMasukList]);
    syncAddSuratMasukToGas(surat);
    showSyncNotification('Surat masuk berhasil diregistrasi & disinkronkan ke Google Sheets!');
  };

  const handleDeleteSuratMasuk = (letterNo: string) => {
    setSuratMasukList(suratMasukList.filter((s) => s.letterNo !== letterNo));
  };

  const handleAddSuratKeluar = (surat: SuratKeluar) => {
    setSuratKeluarList([surat, ...suratKeluarList]);
    syncAddSuratKeluarToGas(surat);
    showSyncNotification('Surat keluar berhasil dibuat & disinkronkan ke Google Sheets!');
  };

  const handleDeleteSuratKeluar = (letterNo: string) => {
    setSuratKeluarList(suratKeluarList.filter((s) => s.letterNo !== letterNo));
  };

  const handleAddBukuTamu = (tamu: BukuTamu) => {
    setBukuTamuList([tamu, ...bukuTamuList]);
    syncAddBukuTamuToGas(tamu);
    showSyncNotification('Buku tamu berhasil dicatat & dikirim ke Google Sheets!');
  };

  const handleDeleteBukuTamu = (id: string) => {
    setBukuTamuList(bukuTamuList.filter((b) => b.id !== id));
  };

  const handleAddAbsensi = (record: Absensi) => {
    setAbsensiList([record, ...absensiList]);
    syncAddAbsensiToGas(record);
    showSyncNotification('Presensi santri/guru berhasil direkam ke Google Sheets!');
  };

  const handleAddMapel = (mapel: MataPelajaran) => {
    setMapelList([...mapelList, mapel]);
  };

  const handleUpdateMapel = (updated: MataPelajaran) => {
    setMapelList(
      mapelList.map((m) => (m.subjectCode === updated.subjectCode ? updated : m))
    );
  };

  const handleDeleteMapel = (code: string) => {
    setMapelList(mapelList.filter((m) => m.subjectCode !== code));
  };

  const handleAddNilai = (nilai: Nilai) => {
    setNilaiList([nilai, ...nilaiList]);
  };

  const handleAddArsip = (arsip: Arsip) => {
    setArsipList([arsip, ...arsipList]);
  };

  const handleDeleteArsip = (id: string) => {
    setArsipList(arsipList.filter((a) => a.docId !== id));
  };

  // If user is not logged in, show Login Page
  if (!isLoggedIn) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        settings={settings}
        onOpenPublicWeb={() => {
          // Allow opening portal directly
          setCurrentUser(INITIAL_USERS[0]);
          setIsLoggedIn(true);
          setActiveTab('portal');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF3EF] flex flex-col lg:flex-row text-[#1E302B]">
      {/* SIDEBAR (Desktop permanent, Mobile drawer; showing all menus for Admin, role-based for others) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
        settings={settings}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 lg:pb-8">
        {/* TOP BAR / HEADER */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          gasConfig={gasConfig}
          settings={settings}
          onOpenGasModal={() => setActiveTab('database')}
          onLogout={handleLogout}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* CONTENT CONTAINER */}
        <div className="flex-1 p-3 sm:p-5 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              siswaList={siswaList}
              guruList={guruList}
              keuanganList={keuanganList}
              suratMasukList={suratMasukList}
              absensiList={absensiList}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'siswa' && (
            <SiswaModule
              siswaList={siswaList}
              settings={settings}
              onAddSiswa={handleAddSiswa}
              onUpdateSiswa={handleUpdateSiswa}
              onDeleteSiswa={handleDeleteSiswa}
            />
          )}

          {activeTab === 'guru' && (
            <GuruModule
              guruList={guruList}
              settings={settings}
              onAddGuru={handleAddGuru}
              onUpdateGuru={handleUpdateGuru}
              onDeleteGuru={handleDeleteGuru}
            />
          )}

          {activeTab === 'keuangan' && (
            <KeuanganModule
              keuanganList={keuanganList}
              settings={settings}
              onAddKeuangan={handleAddKeuangan}
              onDeleteKeuangan={handleDeleteKeuangan}
            />
          )}

          {activeTab === 'surat' && (
            <SuratMenyuratModule
              suratMasukList={suratMasukList}
              suratKeluarList={suratKeluarList}
              bukuTamuList={bukuTamuList}
              settings={settings}
              onAddSuratMasuk={handleAddSuratMasuk}
              onDeleteSuratMasuk={handleDeleteSuratMasuk}
              onAddSuratKeluar={handleAddSuratKeluar}
              onDeleteSuratKeluar={handleDeleteSuratKeluar}
              onAddBukuTamu={handleAddBukuTamu}
              onDeleteBukuTamu={handleDeleteBukuTamu}
            />
          )}

          {activeTab === 'absensi' && (
            <AbsensiModule
              absensiList={absensiList}
              siswaList={siswaList}
              guruList={guruList}
              onAddAbsensi={handleAddAbsensi}
            />
          )}

          {activeTab === 'mapel' && (
            <MataPelajaranModule
              mapelList={mapelList}
              guruList={guruList}
              onAddMapel={handleAddMapel}
              onUpdateMapel={handleUpdateMapel}
              onDeleteMapel={handleDeleteMapel}
            />
          )}

          {activeTab === 'rapor' && (
            <RaporModule
              nilaiList={nilaiList}
              siswaList={siswaList}
              mapelList={mapelList}
              settings={settings}
              onAddNilai={handleAddNilai}
            />
          )}

          {activeTab === 'arsip' && (
            <ArsipModule
              arsipList={arsipList}
              onAddArsip={handleAddArsip}
              onDeleteArsip={handleDeleteArsip}
            />
          )}

          {activeTab === 'laporan' && (
            <LaporanTahunanModule
              siswaList={siswaList}
              guruList={guruList}
              keuanganList={keuanganList}
              suratMasukList={suratMasukList}
              suratKeluarList={suratKeluarList}
              bukuTamuList={bukuTamuList}
              absensiList={absensiList}
              settings={settings}
            />
          )}

          {activeTab === 'pengaturan' && (
            <PengaturanModule
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}

          {activeTab === 'database' && (
            <GoogleSheetsIntegrationModal
              gasConfig={gasConfig}
              onUpdateGasConfig={setGasConfig}
            />
          )}

          {activeTab === 'portal' && (
            <PublicLandingPage
              announcements={announcements}
              siswaList={siswaList}
              settings={settings}
              onAddBukuTamu={handleAddBukuTamu}
              onBackToDashboard={() => setActiveTab('dashboard')}
            />
          )}
        </div>
      </main>

      {/* FLOATING SYNC TOAST NOTIFICATION */}
      {syncToast && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-[#1B3A33] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className={`w-2.5 h-2.5 rounded-full ${syncToast.isGas ? 'bg-emerald-400 animate-pulse' : 'bg-[#CCA13B]'}`} />
          <div>
            <p className="text-xs font-semibold">{syncToast.message}</p>
            {syncToast.isGas && (
              <p className="text-[10px] text-emerald-200/80">Google Sheets Web App terhubung</p>
            )}
          </div>
        </div>
      )}

      {/* MOBILE & TABLET BOTTOM NAVIGATION BAR (Android/Tablet/Phone responsive) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenMobileMenu={() => setIsMobileOpen(true)}
      />
    </div>
  );
}
