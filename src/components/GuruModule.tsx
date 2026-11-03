import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Phone,
  Mail,
  BookOpen,
  Clock,
  Award,
  CreditCard,
  Printer,
  QrCode,
  School,
  CheckCircle2,
} from 'lucide-react';
import { Guru, MadrasahSettings } from '../types';
import { BarcodeVisual } from './BarcodeVisual';

interface GuruModuleProps {
  guruList: Guru[];
  settings: MadrasahSettings;
  onAddGuru: (guru: Guru) => void;
  onUpdateGuru: (guru: Guru) => void;
  onDeleteGuru: (nip: string) => void;
}

export const GuruModule: React.FC<GuruModuleProps> = ({
  guruList,
  settings,
  onAddGuru,
  onUpdateGuru,
  onDeleteGuru,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGuru, setEditingGuru] = useState<Guru | null>(null);

  // ID Card GTK State
  const [selectedCardGuru, setSelectedCardGuru] = useState<Guru | null>(guruList[0] || null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Guru>>({
    nip: '',
    name: '',
    subjectAssigned: '',
    phone: '',
    email: '',
    status: 'PNS',
    teachingHours: 24,
    classSupervisor: '',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  });

  const filteredGuru = guruList.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.subjectAssigned.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.nip.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingGuru(null);
    setFormData({
      nip: `198${Math.floor(100000000000000 + Math.random() * 900000000000000)}`,
      name: '',
      subjectAssigned: 'Al-Qur’an Hadits',
      phone: '08',
      email: '',
      status: 'Yayasan',
      teachingHours: 20,
      classSupervisor: '',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (guru: Guru) => {
    setEditingGuru(guru);
    setFormData({ ...guru });
    setIsFormOpen(true);
  };

  const handleOpenCard = (guru: Guru) => {
    setSelectedCardGuru(guru);
    setIsCardModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.nip) return;

    const data: Guru = {
      nip: formData.nip!,
      name: formData.name!,
      subjectAssigned: formData.subjectAssigned || 'Pendidikan Agama Islam',
      phone: formData.phone || '-',
      email: formData.email || `${formData.name.toLowerCase().replace(/[^a-z]/g, '')}@mtsalhikmahwsb.com`,
      status: (formData.status as any) || 'Yayasan',
      teachingHours: Number(formData.teachingHours) || 24,
      classSupervisor: formData.classSupervisor || undefined,
      avatarUrl: formData.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    };

    if (editingGuru) {
      onUpdateGuru(data);
    } else {
      onAddGuru(data);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1B3A33]">Direktori Tenaga Pendidik & Staf (GTK)</h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data dewan asatidz, pengampu mata pelajaran, jam mengajar, dan pencetakan Kartu GTK ber-barcode
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah GTK Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#E2EAE5] shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama guru, NIP, atau mata pelajaran..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#047857]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-medium bg-white text-slate-700"
          >
            <option value="ALL">Semua Status</option>
            <option value="PNS">PNS Kemenag</option>
            <option value="PPPK">PPPK</option>
            <option value="Yayasan">Tetap Yayasan</option>
            <option value="Honorer">Guru Honorer</option>
          </select>
        </div>
      </div>

      {/* Grid of Teachers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGuru.map((guru) => (
          <div
            key={guru.nip}
            className="bg-white rounded-3xl p-5 shadow-sm border border-[#E2EAE5] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4">
                <img
                  src={guru.avatarUrl}
                  alt={guru.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#CCA13B]/40 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        guru.status === 'PNS'
                          ? 'bg-blue-100 text-blue-800'
                          : guru.status === 'PPPK'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {guru.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#1B3A33] mt-1 line-clamp-1">
                    {guru.name}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-500">NIP: {guru.nip}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-[#047857] shrink-0" />
                  <span className="font-semibold text-slate-800 truncate">{guru.subjectAssigned}</span>
                </p>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-[#CCA13B]" />
                    {guru.teachingHours} Jam / Minggu
                  </span>
                  {guru.classSupervisor && (
                    <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full font-bold text-[10px]">
                      Wali {guru.classSupervisor}
                    </span>
                  )}
                </div>
                <p className="flex items-center gap-2 text-[11px]">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span className="font-mono">{guru.phone}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleOpenCard(guru)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#1B3A33] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Cetak Kartu GTK dengan Barcode Presensi"
              >
                <CreditCard className="w-3.5 h-3.5 text-[#047857]" />
                <span>Kartu GTK</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(guru)}
                  className="p-1.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Edit data guru"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteGuru(guru.nip)}
                  className="p-1.5 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                  title="Hapus data guru"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CETAK KARTU GTK (ID CARD GURU DENGAN BARCODE PRESENSI) */}
      {isCardModalOpen && selectedCardGuru && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[95vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1B3A33] text-[#CCA13B] flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1B3A33]">
                    Kartu Identitas GTK & Barcode Presensi
                  </h3>
                  <p className="text-xs text-slate-500">
                    ID Card resmi untuk presensi barcode harian guru dan staf madrasah
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCardModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="my-6 space-y-6 printable-area">
              {/* SISI DEPAN (FRONT) */}
              <div className="relative w-full max-w-[460px] mx-auto h-[270px] rounded-2xl overflow-hidden shadow-xl border-2 border-[#CCA13B] bg-gradient-to-br from-[#1B3A33] via-[#244E45] to-[#122722] text-white p-4 flex flex-col justify-between">
                {/* Header Kop Madrasah */}
                <div className="flex items-center gap-3 border-b border-white/20 pb-2">
                  {settings.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt="Logo Madrasah"
                      className="w-10 h-10 object-contain rounded-xl bg-white p-1 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-[#CCA13B] shrink-0 p-1">
                      <School className="w-6 h-6 text-[#CCA13B]" />
                    </div>
                  )}
                  <div className="leading-tight">
                    <h4 className="text-xs font-black tracking-wider uppercase text-white">
                      {settings.kopSchoolName || 'MTs AL-HIKMAH WONOSOBO'}
                    </h4>
                    <p className="text-[8px] text-white/80 font-medium">
                      {settings.kopDetails || 'NPSN: 20364812 · Akreditasi A · Wonosobo'}
                    </p>
                    <p className="text-[7px] text-[#CCA13B] uppercase tracking-widest font-extrabold">
                      KARTU IDENTITAS GURU & TENAGA KEPENDIDIKAN (GTK)
                    </p>
                  </div>
                </div>

                {/* Body: Photo & Teacher Metadata */}
                <div className="flex items-center gap-4 my-auto">
                  <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-white shadow-md shrink-0 bg-slate-800">
                    <img
                      src={selectedCardGuru.avatarUrl}
                      alt={selectedCardGuru.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-1 text-xs flex-1">
                    <div>
                      <p className="text-[9px] text-[#CCA13B] font-bold uppercase tracking-wider">Nama Lengkap & Gelar</p>
                      <p className="text-sm font-extrabold text-white leading-tight uppercase line-clamp-1">
                        {selectedCardGuru.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-[10px]">NIP / NIY</p>
                      <p className="font-mono font-bold text-emerald-200 text-xs">{selectedCardGuru.nip}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-[10px]">Mata Pelajaran</p>
                      <p className="font-bold text-white text-xs">{selectedCardGuru.subjectAssigned}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] pt-0.5">
                      <span className="bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                        {selectedCardGuru.status}
                      </span>
                      <span className="text-white/70">
                        {selectedCardGuru.teachingHours} Jam Mengajar
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Barcode Area (Scannable Barcode for GTK Attendance) */}
                <div className="pt-2 border-t border-white/20 flex items-center justify-between gap-3">
                  <div className="bg-white px-2 py-0.5 rounded-sm shadow-xs flex-1 max-w-[240px]">
                    <BarcodeVisual
                      value={selectedCardGuru.nip}
                      label={`*NIP-${selectedCardGuru.nip}*`}
                      barHeight={24}
                    />
                  </div>
                  <span className="text-[8px] text-emerald-200 font-mono font-bold text-right">
                    SCAN PRESENSI GTK
                  </span>
                </div>
              </div>

              {/* SISI BELAKANG (BACK) */}
              <div className="relative w-full max-w-[460px] mx-auto h-[270px] rounded-2xl overflow-hidden shadow-xl border-2 border-slate-200 bg-white text-slate-800 p-4 flex flex-col justify-between">
                <div>
                  <div className="text-center pb-2 border-b border-slate-100">
                    <h5 className="text-[10px] font-black uppercase text-[#1B3A33] tracking-wider">
                      KETENTUAN KARTU TANDA GTK
                    </h5>
                  </div>

                  <ol className="text-[9px] text-slate-600 list-decimal pl-4 space-y-1 mt-2.5 leading-tight">
                    <li>Kartu ini adalah identitas resmi Tenaga Pendidik & Kependidikan MTs Al-Hikmah Wonosobo.</li>
                    <li>Wajib digunakan untuk absensi kehadiran harian (check-in & check-out).</li>
                    <li>Barcode di bagian depan dapat langsung dipindai pada terminal pemindai presensi.</li>
                    <li>Segera hubungi pihak tata usaha jika terjadi kerusakan atau kehilangan kartu.</li>
                  </ol>
                </div>

                {/* Bottom Verification Section: Dynamic QR + Barcode + Clean Signature */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <QrCode className="w-12 h-12 text-[#1B3A33]" />
                    </div>
                    <div className="w-32">
                      <BarcodeVisual
                        value={selectedCardGuru.nip}
                        label={selectedCardGuru.nip}
                        barHeight={22}
                      />
                    </div>
                  </div>

                  <div className="text-right text-[9px] leading-tight">
                    <p className="text-slate-500">{settings.city || 'Wonosobo'}, 14 Juli 2026</p>
                    <p className="font-semibold text-slate-700">{settings.kepsekTitle || 'Kepala MTs Al-Hikmah'},</p>
                    <div className="h-8" />
                    <p className="font-bold text-slate-900 underline">{settings.kepsekName}</p>
                    <p className="text-[8px] text-slate-500 font-mono">NIP. {settings.kepsekNip}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsCardModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1B3A33] hover:bg-[#254F46] text-white transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#CCA13B]" />
                <span>Cetak Kartu GTK</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1B3A33]">
                {editingGuru ? 'Edit Data Tenaga Pendidik' : 'Tambah Guru / Staf Baru'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Ust. Hamdan Rasyid, S.Ag"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#047857]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIP / NIY</label>
                  <input
                    type="text"
                    required
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Kepegawaian</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="PNS">PNS Kemenag</option>
                    <option value="PPPK">PPPK</option>
                    <option value="Yayasan">Tetap Yayasan</option>
                    <option value="Honorer">Honorer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran Diampu</label>
                  <input
                    type="text"
                    required
                    value={formData.subjectAssigned}
                    onChange={(e) => setFormData({ ...formData, subjectAssigned: e.target.value })}
                    placeholder="Contoh: Fiqih / Bahasa Arab"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jam Mengajar (JP)</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={formData.teachingHours}
                    onChange={(e) => setFormData({ ...formData, teachingHours: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wali Kelas (Opsional)</label>
                  <input
                    type="text"
                    value={formData.classSupervisor || ''}
                    onChange={(e) => setFormData({ ...formData, classSupervisor: e.target.value })}
                    placeholder="Contoh: 7A, 8B, atau kosongkan"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. HP / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08123456789"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@mtsalhikmahwsb.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Foto Profil</label>
                <input
                  type="text"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-[#047857] hover:bg-[#065F46] text-white shadow-xs"
                >
                  {editingGuru ? 'Simpan Perubahan' : 'Tambah Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
