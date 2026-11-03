import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Printer,
  Download,
  CreditCard,
  Edit2,
  Trash2,
  X,
  Check,
  QrCode,
  ShieldCheck,
  Eye,
  School,
} from 'lucide-react';
import { Siswa, MadrasahSettings } from '../types';
import { BarcodeVisual } from './BarcodeVisual';

interface SiswaModuleProps {
  siswaList: Siswa[];
  settings: MadrasahSettings;
  onAddSiswa: (siswa: Siswa) => void;
  onUpdateSiswa: (siswa: Siswa) => void;
  onDeleteSiswa: (nis: string) => void;
}

export const SiswaModule: React.FC<SiswaModuleProps> = ({
  siswaList,
  settings,
  onAddSiswa,
  onUpdateSiswa,
  onDeleteSiswa,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedGender, setSelectedGender] = useState<string>('ALL');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);
  const [selectedCardSiswa, setSelectedCardSiswa] = useState<Siswa | null>(siswaList[0] || null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Siswa>>({
    nis: '',
    nisn: '',
    name: '',
    class: '7A',
    gender: 'L',
    birthPlaceDate: '',
    address: '',
    parentContact: '',
    parentName: '',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    barcodeQR: '',
    status: 'Aktif',
  });

  // Filtered List
  const filteredSiswa = siswaList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis.includes(searchTerm) ||
      s.nisn.includes(searchTerm);
    const matchesClass = selectedClass === 'ALL' || s.class === selectedClass;
    const matchesGender = selectedGender === 'ALL' || s.gender === selectedGender;
    return matchesSearch && matchesClass && matchesGender;
  });

  const handleOpenAdd = () => {
    setEditingSiswa(null);
    setFormData({
      nis: `232407${Math.floor(100 + Math.random() * 900)}`,
      nisn: `0089${Math.floor(100000 + Math.random() * 900000)}`,
      name: '',
      class: '7A',
      gender: 'L',
      birthPlaceDate: 'Wonosobo, ',
      address: '',
      parentContact: '08',
      parentName: '',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      barcodeQR: '',
      status: 'Aktif',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (siswa: Siswa) => {
    setEditingSiswa(siswa);
    setFormData({ ...siswa });
    setIsFormOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.nis) return;

    const finalData: Siswa = {
      nis: formData.nis!,
      nisn: formData.nisn || `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      name: formData.name!,
      class: (formData.class as any) || '7A',
      gender: (formData.gender as any) || 'L',
      birthPlaceDate: formData.birthPlaceDate || 'Wonosobo',
      address: formData.address || 'Wonosobo',
      parentContact: formData.parentContact || '-',
      parentName: formData.parentName || '-',
      photoUrl: formData.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      barcodeQR: `NIS-${formData.nis}`,
      status: (formData.status as any) || 'Aktif',
    };

    if (editingSiswa) {
      onUpdateSiswa(finalData);
    } else {
      onAddSiswa(finalData);
    }
    setIsFormOpen(false);
  };

  const handlePreviewCard = (siswa: Siswa) => {
    setSelectedCardSiswa(siswa);
    setIsCardModalOpen(true);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NIS, atau NISN siswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent bg-slate-50/50"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
          >
            <option value="ALL">Semua Kelas (7, 8, 9)</option>
            <option value="7A">Kelas 7A</option>
            <option value="7B">Kelas 7B</option>
            <option value="8A">Kelas 8A</option>
            <option value="8B">Kelas 8B</option>
            <option value="9A">Kelas 9A</option>
            <option value="9B">Kelas 9B</option>
          </select>

          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
          >
            <option value="ALL">Semua Gender</option>
            <option value="L">Laki-laki (Santri Putra)</option>
            <option value="P">Perempuan (Santri Putri)</option>
          </select>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Main Student Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#E2EAE5] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1B3A33]">Daftar Peserta Didik Aktif</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan {filteredSiswa.length} dari total {siswaList.length} siswa terdaftar
            </p>
          </div>
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
            Tahun Ajaran 2026/2027
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-6">Foto & Identitas Siswa</th>
                <th className="py-3.5 px-4">NIS / NISN</th>
                <th className="py-3.5 px-4 text-center">Kelas</th>
                <th className="py-3.5 px-4">Kontak Orang Tua</th>
                <th className="py-3.5 px-4">Alamat Domisili</th>
                <th className="py-3.5 px-6 text-right">Aksi & Kartu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSiswa.map((siswa) => (
                <tr key={siswa.nis} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={siswa.photoUrl}
                        alt={siswa.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-[#047857] transition-colors">
                          {siswa.name}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          {siswa.gender === 'L' ? 'Santri Putra' : 'Santri Putri'} · {siswa.birthPlaceDate}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <p className="font-bold text-slate-800">{siswa.nis}</p>
                    <p className="text-[11px] text-slate-600">NISN: {siswa.nisn}</p>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-[#1B3A33]/10 text-[#1B3A33]">
                      {siswa.class}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-slate-800">{siswa.parentName}</p>
                    <p className="text-[11px] text-slate-600 font-mono">{siswa.parentContact}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-[180px] truncate">
                    {siswa.address}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handlePreviewCard(siswa)}
                        className="p-1.5 rounded-xl bg-[#CCA13B]/15 text-[#8F6813] hover:bg-[#CCA13B]/30 transition-colors"
                        title="Lihat & Cetak Kartu Pelajar"
                      >
                        <CreditCard className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(siswa)}
                        className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Edit Data Siswa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteSiswa(siswa.nis)}
                        className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Siswa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSiswa.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    Tidak ada data siswa yang cocok dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ID CARD MODAL & GENERATOR PREVIEW (Front & Back) */}
      {isCardModalOpen && selectedCardSiswa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[92vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#CCA13B]" />
                <h3 className="text-base font-bold text-[#1B3A33]">
                  Generator Kartu Pelajar Resmi MTs Al-Hikmah
                </h3>
              </div>
              <button
                onClick={() => setIsCardModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable ID Card Area */}
            <div className="my-6 space-y-6 printable-area">
              {/* SISI DEPAN (FRONT) */}
              <div className="relative w-full max-w-[460px] mx-auto h-[270px] rounded-2xl overflow-hidden shadow-xl border-2 border-[#CCA13B] bg-gradient-to-br from-[#1B3A33] via-[#244E45] to-[#122722] text-white p-4 flex flex-col justify-between">
                {/* Header Kop Madrasah (Tanpa Kemenag & Tanpa Baris 2) */}
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
                    <p className="text-[7px] text-emerald-200 uppercase tracking-widest font-bold">
                      KARTU TANDA PELAJAR SANTRI
                    </p>
                  </div>
                </div>

                {/* Body: Photo & Student Metadata */}
                <div className="flex items-center gap-4 my-auto">
                  <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-white shadow-md shrink-0 bg-slate-800">
                    <img
                      src={selectedCardSiswa.photoUrl}
                      alt={selectedCardSiswa.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-1 text-xs flex-1">
                    <div>
                      <p className="text-[9px] text-[#CCA13B] font-bold uppercase tracking-wider">Nama Lengkap</p>
                      <p className="text-sm font-extrabold text-white leading-tight uppercase line-clamp-1">
                        {selectedCardSiswa.name}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <p className="text-white/60">NIS</p>
                        <p className="font-mono font-bold text-emerald-200">{selectedCardSiswa.nis}</p>
                      </div>
                      <div>
                        <p className="text-white/60">NISN</p>
                        <p className="font-mono font-bold text-emerald-200">{selectedCardSiswa.nisn}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <p className="text-white/60">Kelas</p>
                        <p className="font-bold text-white">{selectedCardSiswa.class}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Berlaku S.d</p>
                        <p className="font-bold text-white">Juli 2029</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Barcode Area (Scannable Barcode on Front of Card) */}
                <div className="pt-2 border-t border-white/20 flex items-center justify-between gap-3">
                  <div className="bg-white px-2 py-0.5 rounded-sm shadow-xs flex-1 max-w-[240px]">
                    <BarcodeVisual
                      value={selectedCardSiswa.nis}
                      label={`*NIS-${selectedCardSiswa.nis}*`}
                      barHeight={24}
                    />
                  </div>
                  <span className="text-[8px] text-emerald-200 font-mono font-bold text-right">
                    SCAN PRESENSI HARIAN
                  </span>
                </div>
              </div>

              {/* SISI BELAKANG (BACK) */}
              <div className="relative w-full max-w-[460px] mx-auto h-[270px] rounded-2xl overflow-hidden shadow-xl border-2 border-slate-200 bg-white text-slate-800 p-4 flex flex-col justify-between">
                <div>
                  <div className="text-center pb-2 border-b border-slate-100">
                    <h5 className="text-[10px] font-black uppercase text-[#1B3A33] tracking-wider">
                      TATA TERTIB & KETENTUAN KARTU PELAJAR
                    </h5>
                  </div>

                  <ol className="text-[9px] text-slate-600 list-decimal pl-4 space-y-1 mt-2.5 leading-tight">
                    <li>Kartu ini adalah bukti identitas sah santri MTs Al-Hikmah Wonosobo.</li>
                    <li>Wajib dibawa setiap hari dan digunakan saat presensi barcode & perpustakaan.</li>
                    <li>Dilarang mencoret, merusak, atau meminjamkan kartu ini kepada pihak lain.</li>
                    <li>Bila kartu hilang, segera lapor ke bagian Tata Usaha madrasah.</li>
                  </ol>
                </div>

                {/* Bottom Verification Section: Dynamic QR + Barcode + Clean Signature */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {/* SVG Barcode & QR Code */}
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <QrCode className="w-12 h-12 text-[#1B3A33]" />
                    </div>
                    <div className="w-32">
                      <BarcodeVisual
                        value={selectedCardSiswa.nis}
                        label={selectedCardSiswa.nis}
                        barHeight={22}
                      />
                    </div>
                  </div>

                  {/* Stamp & Signature (Clean space without artificial green name) */}
                  <div className="text-right text-[9px] leading-tight">
                    <p className="text-slate-500">{settings.city || 'Wonosobo'}, 14 Juli 2026</p>
                    <p className="font-semibold text-slate-700">{settings.kepsekTitle || 'Kepala MTs Al-Hikmah'},</p>
                    {/* Clean signature gap */}
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
                onClick={handlePrintCard}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1B3A33] hover:bg-[#254F46] text-white transition-all flex items-center gap-2 shadow-xs"
              >
                <Printer className="w-4 h-4 text-[#CCA13B]" />
                <span>Cetak Kartu Pelajar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT SISWA MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1B3A33]">
                {editingSiswa ? 'Edit Data Peserta Didik' : 'Pendaftaran Siswa Baru'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Muhammad Haidar Ali"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#047857]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIS (Nomor Induk Siswa)</label>
                  <input
                    type="text"
                    required
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NISN (Kemenag)</label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tingkat & Rombel</label>
                  <select
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="7A">Kelas 7A</option>
                    <option value="7B">Kelas 7B</option>
                    <option value="8A">Kelas 8A</option>
                    <option value="8B">Kelas 8B</option>
                    <option value="9A">Kelas 9A</option>
                    <option value="9B">Kelas 9B</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="L">Laki-laki (Santri Putra)</option>
                    <option value="P">Perempuan (Santri Putri)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tempat, Tanggal Lahir</label>
                <input
                  type="text"
                  value={formData.birthPlaceDate}
                  onChange={(e) => setFormData({ ...formData, birthPlaceDate: e.target.value })}
                  placeholder="Wonosobo, 14 Mei 2012"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="Bapak / Ibu Wali"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={formData.parentContact}
                    onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
                    placeholder="08123456789"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Dusun, Desa, Kecamatan, Kabupaten"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Pasfoto Siswa (Rasio 3:4)</label>
                <input
                  type="text"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
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
                  {editingSiswa ? 'Simpan Perubahan' : 'Daftarkan Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
