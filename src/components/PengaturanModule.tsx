import React, { useState } from 'react';
import {
  Settings,
  Upload,
  Image as ImageIcon,
  Check,
  Save,
  RotateCcw,
  Building,
  UserCheck,
  FileText,
  Printer,
  Sparkles,
  School,
  Wallet,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';
import { MadrasahSettings } from '../types';
import { DEFAULT_SETTINGS } from '../data/initialData';

interface PengaturanModuleProps {
  settings: MadrasahSettings;
  onUpdateSettings: (newSettings: MadrasahSettings) => void;
}

export const PengaturanModule: React.FC<PengaturanModuleProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [formState, setFormState] = useState<MadrasahSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);
  const [fileError, setFileError] = useState('');

  // File upload handler to Data URL (works without backend file storage)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFileError('Ukuran file maksimal 2 MB. Silakan pilih gambar yang lebih kecil.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormState((prev) => ({ ...prev, logoUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formState);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    setFormState({ ...DEFAULT_SETTINGS });
    onUpdateSettings({ ...DEFAULT_SETTINGS });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1B3A33] text-[#CCA13B] flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#1B3A33]">
              Pengaturan Identitas Madrasah, Logo & Kop Surat
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Kelola logo resmi madrasah, isi kop surat kedinasan, pejabat penandatangan (kiri & kanan), serta data bendahara pada kwitansi pembayaran.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Perubahan Tersimpan!' : 'Simpan Pengaturan'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. UPLOAD LOGO MADRASAH */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5]">
          <h4 className="text-sm font-bold text-[#1B3A33] mb-1 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#CCA13B]" />
            Upload Logo Resmi Madrasah & Kop Surat
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            Logo ini akan diterapkan seragam di semua kop surat keluar, kwitansi, kartu pelajar, rapor, dan header aplikasi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Logo Preview */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 text-center">
              {formState.logoUrl ? (
                <div className="relative group">
                  <img
                    src={formState.logoUrl}
                    alt="Logo Pratinjau"
                    className="w-28 h-28 object-contain rounded-xl p-1 bg-white border border-slate-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setFormState({ ...formState, logoUrl: '' })}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center shadow-md hover:bg-rose-700"
                    title="Hapus Logo"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-[#1B3A33] text-[#CCA13B] flex items-center justify-center font-black text-2xl border-2 border-[#CCA13B] shadow-md">
                  AH
                </div>
              )}
              <span className="text-[11px] font-bold text-slate-700 mt-3">
                {formState.logoUrl ? 'Logo Kustom Aktif' : 'Logo Standar Al-Hikmah'}
              </span>
              <p className="text-[10px] text-slate-400">Rekomendasi file PNG transparan (maks. 2 MB)</p>
            </div>

            {/* Upload Controls */}
            <div className="md:col-span-8 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih File Gambar Logo dari Perangkat (Komputer / HP)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2.5 rounded-2xl bg-[#1B3A33] hover:bg-[#254F46] text-white font-bold transition-all flex items-center gap-2 shadow-xs shrink-0">
                    <Upload className="w-4 h-4 text-[#CCA13B]" />
                    <span>Pilih Gambar Logo...</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-slate-500 text-[11px]">
                    Atau tempel tautan URL gambar di bawah
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Atau Masukkan URL Gambar Logo
                </label>
                <input
                  type="text"
                  placeholder="https://mtsalhikmahwsb.com/wp-content/uploads/logo.png"
                  value={formState.logoUrl}
                  onChange={(e) => setFormState({ ...formState, logoUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-[#047857]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. UBAH ISI KOP SURAT */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5]">
          <h4 className="text-sm font-bold text-[#1B3A33] mb-1 flex items-center gap-2">
            <Building className="w-4 h-4 text-[#047857]" />
            Ubah Teks & Informasi Isi Kop Surat
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            Konfigurasi susunan kalimat pada bagian kepala surat resmi madrasah
          </p>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Baris Pertama Kop Surat (Nama Yayasan / Lembaga Induk)
              </label>
              <input
                type="text"
                value={formState.kopHeader1 ?? 'YAYASAN PONPES ITTIHADUT THOLIBIN'}
                onChange={(e) => setFormState({ ...formState, kopHeader1: e.target.value })}
                placeholder="YAYASAN PONPES ITTIHADUT THOLIBIN"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-bold text-[#1B3A33]"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Dicetak pada baris paling atas kop surat (contoh: YAYASAN PONPES ITTIHADUT THOLIBIN)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Resmi Madrasah (Huruf Kapital)
                </label>
                <input
                  type="text"
                  required
                  value={formState.kopSchoolName}
                  onChange={(e) => setFormState({ ...formState, kopSchoolName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Status Akreditasi, NSM & NPSN
                </label>
                <input
                  type="text"
                  required
                  value={formState.kopDetails}
                  onChange={(e) => setFormState({ ...formState, kopDetails: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Alamat Lengkap, Kontak Telepon, Email & Situs Web
              </label>
              <textarea
                rows={2}
                required
                value={formState.kopAddress}
                onChange={(e) => setFormState({ ...formState, kopAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 resize-none"
              />
            </div>
          </div>
        </div>

        {/* 3. PEJABAT PENANDATANGAN KIRI & KANAN */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5]">
          <h4 className="text-sm font-bold text-[#1B3A33] mb-1 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#047857]" />
            Pengaturan Tanda Tangan Surat & Laporan (Kiri & Kanan)
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            Sesuai permintaan: Sisi Kanan untuk Kepala Madrasah, Sisi Kiri untuk Sekretaris / Kepala Tata Usaha.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tanda Tangan Kiri: Sekretaris / TU */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <span className="font-extrabold text-[#1B3A33] uppercase text-[11px] block border-b border-slate-200 pb-2">
                ✍️ Tanda Tangan Kiri (Sekretaris / Kepala TU)
              </span>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Pejabat Kiri</label>
                <input
                  type="text"
                  required
                  value={formState.sekretarisName}
                  onChange={(e) => setFormState({ ...formState, sekretarisName: e.target.value })}
                  placeholder="M. Nur Syamsi, S.Pd"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">NIP / NIY Pejabat Kiri</label>
                <input
                  type="text"
                  required
                  value={formState.sekretarisNip}
                  onChange={(e) => setFormState({ ...formState, sekretarisNip: e.target.value })}
                  placeholder="198305142011011003"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jabatan Pejabat Kiri</label>
                <input
                  type="text"
                  required
                  value={formState.sekretarisTitle}
                  onChange={(e) => setFormState({ ...formState, sekretarisTitle: e.target.value })}
                  placeholder="Kepala Tata Usaha / Sekretaris"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>

            {/* Tanda Tangan Kanan: Kepala Madrasah */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <span className="font-extrabold text-[#1B3A33] uppercase text-[11px] block border-b border-slate-200 pb-2">
                ✍️ Tanda Tangan Kanan (Kepala Madrasah)
              </span>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kepala Madrasah</label>
                <input
                  type="text"
                  required
                  value={formState.kepsekName}
                  onChange={(e) => setFormState({ ...formState, kepsekName: e.target.value })}
                  placeholder="H. Ahmad Fauzi, M.Pd"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">NIP / NIY Kepala Madrasah</label>
                <input
                  type="text"
                  required
                  value={formState.kepsekNip}
                  onChange={(e) => setFormState({ ...formState, kepsekNip: e.target.value })}
                  placeholder="197504122005011002"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jabatan Pejabat Kanan</label>
                <input
                  type="text"
                  required
                  value={formState.kepsekTitle}
                  onChange={(e) => setFormState({ ...formState, kepsekTitle: e.target.value })}
                  placeholder="Kepala MTs Al-Hikmah"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. PENGATURAN NAMA PADA KWITANSI */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5]">
          <h4 className="text-sm font-bold text-[#1B3A33] mb-1 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#CCA13B]" />
            Pengaturan Bendahara / Penandatangan Kwitansi
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            Ubah nama bendahara, NIP, serta kota madrasah yang tercetak otomatis di kwitansi pembayaran resmi
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Bendahara / Petugas Kasir
              </label>
              <input
                type="text"
                required
                value={formState.bendaharaName}
                onChange={(e) => setFormState({ ...formState, bendaharaName: e.target.value })}
                placeholder="Siti Nurjanah, S.E."
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                NIP / NIY Bendahara
              </label>
              <input
                type="text"
                required
                value={formState.bendaharaNip}
                onChange={(e) => setFormState({ ...formState, bendaharaNip: e.target.value })}
                placeholder="198509142012012003"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kota Madrasah (Lokasi Surat/Kwitansi)
              </label>
              <input
                type="text"
                required
                value={formState.city}
                onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                placeholder="Wonosobo"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* 5. INDIKATOR KRITERIA BOBOT NILAI RAPOR & EVALUASI AKADEMIK */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5]">
          <div className="flex items-start justify-between gap-4 mb-1">
            <h4 className="text-sm font-bold text-[#1B3A33] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#047857]" />
              Indikator Kriteria Bobot Nilai Rapor & Persentase Kelulusan
            </h4>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                ((formState.gradeWeightTugas ?? 30) + (formState.gradeWeightUts ?? 30) + (formState.gradeWeightUas ?? 40)) === 100
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-rose-50 text-rose-800 border-rose-300'
              }`}
            >
              Total: {(formState.gradeWeightTugas ?? 30) + (formState.gradeWeightUts ?? 30) + (formState.gradeWeightUas ?? 40)}% {((formState.gradeWeightTugas ?? 30) + (formState.gradeWeightUts ?? 30) + (formState.gradeWeightUas ?? 40)) === 100 ? '(Sesuai 100%)' : '(Harus 100%)'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Atur persentase bobot perhitungan nilai rapor akhir (Tugas/Harian, UTS, dan UAS) serta KKM standar madrasah. Nilai akhir di menu Rapor akan terhitung otomatis sesuai persentase di sini.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Tugas / Harian */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-700">Bobot Tugas / Harian</label>
                <span className="text-xs font-black text-[#047857]">{formState.gradeWeightTugas ?? 30}%</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={formState.gradeWeightTugas ?? 30}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      gradeWeightTugas: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#047857]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">Tugas harian, PR, & portofolio santri</p>
            </div>

            {/* UTS */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-700">Bobot Nilai UTS</label>
                <span className="text-xs font-black text-[#CCA13B]">{formState.gradeWeightUts ?? 30}%</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={formState.gradeWeightUts ?? 30}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      gradeWeightUts: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#047857]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">Ujian Tengah Semester / Sumatif Tengah</p>
            </div>

            {/* UAS */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-700">Bobot Nilai UAS / SAS</label>
                <span className="text-xs font-black text-blue-600">{formState.gradeWeightUas ?? 40}%</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={formState.gradeWeightUas ?? 40}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      gradeWeightUas: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#047857]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">Sumatif Akhir Semester / UAS Semester</p>
            </div>

            {/* KKM Standar */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-700">KKM Standar Madrasah</label>
                <span className="text-xs font-black text-purple-600">{formState.kkmDefault ?? 75}</span>
              </div>
              <input
                type="number"
                min="50"
                max="95"
                required
                value={formState.kkmDefault ?? 75}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    kkmDefault: Number(e.target.value) || 75,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#047857]"
              />
              <p className="text-[10px] text-slate-500 mt-1.5">Kriteria Ketuntasan Minimal (KKM)</p>
            </div>
          </div>

          {/* Visual Progress Distribution */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1.5">
              <span>Distribusi Bobot Nilai Rapor:</span>
              <span className={((formState.gradeWeightTugas ?? 30) + (formState.gradeWeightUts ?? 30) + (formState.gradeWeightUas ?? 40)) === 100 ? 'text-[#047857]' : 'text-rose-600'}>
                {formState.gradeWeightTugas ?? 30}% (Tugas) + {formState.gradeWeightUts ?? 30}% (UTS) + {formState.gradeWeightUas ?? 40}% (UAS) = {(formState.gradeWeightTugas ?? 30) + (formState.gradeWeightUts ?? 30) + (formState.gradeWeightUas ?? 40)}%
              </span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${Math.min(formState.gradeWeightTugas ?? 30, 100)}%` }}
                className="bg-[#047857] h-full"
                title={`Tugas: ${formState.gradeWeightTugas ?? 30}%`}
              />
              <div
                style={{ width: `${Math.min(formState.gradeWeightUts ?? 30, 100)}%` }}
                className="bg-[#CCA13B] h-full"
                title={`UTS: ${formState.gradeWeightUts ?? 30}%`}
              />
              <div
                style={{ width: `${Math.min(formState.gradeWeightUas ?? 40, 100)}%` }}
                className="bg-blue-600 h-full"
                title={`UAS: ${formState.gradeWeightUas ?? 40}%`}
              />
            </div>
          </div>
        </div>

        {/* 6. PRATINJAU LANGSUNG KOP & DUAL SIGNATURE */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h4 className="text-sm font-bold text-[#1B3A33] flex items-center gap-2">
              <Printer className="w-4 h-4 text-[#047857]" />
              Pratinjau Hasil Cetak Kop & Tanda Tangan Kiri-Kanan
            </h4>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Live Preview
            </span>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-xs space-y-6">
            {/* Kop Pratinjau */}
            <div className="border-b-4 border-double border-slate-800 pb-3 flex items-center gap-4">
              {formState.logoUrl ? (
                <img
                  src={formState.logoUrl}
                  alt="Logo Kop"
                  className="w-16 h-16 object-contain shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-[#1B3A33] text-[#CCA13B] flex items-center justify-center font-black text-xl border-2 border-[#CCA13B] shrink-0">
                  AH
                </div>
              )}
              <div className="text-center flex-1">
                <p className="text-xs font-bold text-slate-800 tracking-wider uppercase mb-0.5">
                  {formState.kopHeader1 || 'YAYASAN PONPES ITTIHADUT THOLIBIN'}
                </p>
                <h3 className="text-base font-black text-[#1B3A33] tracking-wide uppercase">
                  {formState.kopSchoolName}
                </h3>
                <p className="text-[10px] font-semibold text-slate-700 mt-0.5">
                  {formState.kopDetails}
                </p>
                <p className="text-[9px] text-slate-500 mt-0.5">
                  {formState.kopAddress}
                </p>
              </div>
            </div>

            {/* Simulasi Tanda Tangan Kiri & Kanan (Ruang Tanda Tangan Bersih) */}
            <div className="pt-4 flex items-center justify-between text-center px-4">
              {/* Kiri: Sekretaris / TU */}
              <div className="w-56">
                <p className="font-semibold text-slate-800">{formState.sekretarisTitle}</p>
                {/* Ruang tanda tangan bersih tanpa tulisan warna hijau */}
                <div className="h-16 my-1 flex items-center justify-center">
                  <div className="w-32 border-b border-dashed border-slate-300" />
                </div>
                <p className="font-bold underline text-slate-900">{formState.sekretarisName}</p>
                <p className="text-[9px] text-slate-500 font-mono">NIP. {formState.sekretarisNip}</p>
              </div>

              {/* Kanan: Kepala Madrasah */}
              <div className="w-56">
                <p className="font-semibold text-slate-800">{formState.kepsekTitle}</p>
                {/* Ruang tanda tangan bersih tanpa tulisan warna hijau */}
                <div className="h-16 my-1 flex items-center justify-center">
                  <div className="w-32 border-b border-dashed border-slate-300" />
                </div>
                <p className="font-bold underline text-slate-900">{formState.kepsekName}</p>
                <p className="text-[9px] text-slate-500 font-mono">NIP. {formState.kepsekNip}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button at bottom */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Pengaturan Berhasil Disimpan!' : 'Simpan Semua Pengaturan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
