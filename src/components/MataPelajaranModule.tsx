import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Clock,
  UserCheck,
  Award,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { MataPelajaran, Guru } from '../types';

interface MataPelajaranModuleProps {
  mapelList: MataPelajaran[];
  guruList: Guru[];
  onAddMapel: (mapel: MataPelajaran) => void;
  onUpdateMapel: (mapel: MataPelajaran) => void;
  onDeleteMapel: (code: string) => void;
}

export const MataPelajaranModule: React.FC<MataPelajaranModuleProps> = ({
  mapelList,
  guruList,
  onAddMapel,
  onUpdateMapel,
  onDeleteMapel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMapel, setEditingMapel] = useState<MataPelajaran | null>(null);

  const [formData, setFormData] = useState<Partial<MataPelajaran>>({
    subjectCode: '',
    subjectName: '',
    category: 'Agama Islam',
    classLevel: '7',
    teacherNip: guruList[0]?.nip || '',
    creditHours: 3,
  });

  const filteredMapel = mapelList.filter((m) => {
    const matchesSearch =
      m.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || m.classLevel === levelFilter;
    const matchesCategory = categoryFilter === 'ALL' || m.category === categoryFilter;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingMapel(null);
    setFormData({
      subjectCode: `MP-${Math.floor(10 + Math.random() * 90)}`,
      subjectName: '',
      category: 'Agama Islam',
      classLevel: '7',
      teacherNip: guruList[0]?.nip || '',
      creditHours: 3,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mapel: MataPelajaran) => {
    setEditingMapel(mapel);
    setFormData({ ...mapel });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subjectName || !formData.subjectCode) return;

    const assignedGuru = guruList.find((g) => g.nip === formData.teacherNip);
    const finalData: MataPelajaran = {
      subjectCode: formData.subjectCode!,
      subjectName: formData.subjectName!,
      category: (formData.category as any) || 'Agama Islam',
      classLevel: (formData.classLevel as any) || '7',
      teacherNip: formData.teacherNip || '-',
      teacherName: assignedGuru ? assignedGuru.name : formData.teacherName || 'Ust. Guru Pengampu',
      creditHours: Number(formData.creditHours) || 3,
    };

    if (editingMapel) {
      onUpdateMapel(finalData);
    } else {
      onAddMapel(finalData);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari mata pelajaran, kode, atau nama guru pengampu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#047857] bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">Semua Tingkat (7, 8, 9)</option>
            <option value="7">Kelas 7 (Fase D)</option>
            <option value="8">Kelas 8 (Fase D)</option>
            <option value="9">Kelas 9 (Fase D)</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">Semua Rumpun</option>
            <option value="Agama Islam">Pendidikan Agama Islam (PAI)</option>
            <option value="Umum">Mata Pelajaran Umum</option>
            <option value="Muatan Lokal">Muatan Lokal Pesantren</option>
          </select>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Mapel</span>
          </button>
        </div>
      </div>

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMapel.map((mapel) => (
          <div
            key={mapel.subjectCode}
            className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-xs font-bold text-[#047857] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  {mapel.subjectCode}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    mapel.category === 'Agama Islam'
                      ? 'bg-[#CCA13B]/20 text-[#8F6813]'
                      : 'bg-blue-50 text-blue-800'
                  }`}
                >
                  {mapel.category}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 group-hover:text-[#047857] transition-colors mt-3">
                {mapel.subjectName}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Tingkat Kelas: <strong>Kelas {mapel.classLevel} MTs</strong>
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <UserCheck className="w-4 h-4 text-[#047857] shrink-0" />
                  <span className="font-semibold truncate">{mapel.teacherName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Beban: {mapel.creditHours} Jam Pelajaran (JP)
                  </span>
                  <span className="font-bold text-[#1B3A33]">Kurikulum Merdeka</span>
                </div>
              </div>
            </div>

            {/* Actions: Edit & Hapus */}
            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => handleOpenEdit(mapel)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
                title="Edit Mata Pelajaran"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDeleteMapel(mapel.subjectCode)}
                className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Hapus Mata Pelajaran"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1B3A33]">
                {editingMapel ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Mapel</label>
                  <input
                    type="text"
                    required
                    value={formData.subjectCode}
                    onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono"
                    readOnly={Boolean(editingMapel)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tingkat Kelas</label>
                  <select
                    value={formData.classLevel}
                    onChange={(e) => setFormData({ ...formData, classLevel: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="7">Kelas 7</option>
                    <option value="8">Kelas 8</option>
                    <option value="9">Kelas 9</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Mata Pelajaran</label>
                <input
                  type="text"
                  required
                  value={formData.subjectName}
                  onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                  placeholder="Contoh: Sejarah Kebudayaan Islam (SKI)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rumpun Pelajaran</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Agama Islam">Pendidikan Agama Islam</option>
                    <option value="Umum">Mata Pelajaran Umum</option>
                    <option value="Muatan Lokal">Muatan Lokal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Beban SKS (JP)</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={formData.creditHours}
                    onChange={(e) => setFormData({ ...formData, creditHours: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Guru Pengampu</label>
                <select
                  value={formData.teacherNip}
                  onChange={(e) => setFormData({ ...formData, teacherNip: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {guruList.map((g) => (
                    <option key={g.nip} value={g.nip}>
                      {g.name} - {g.subjectAssigned}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-[#047857] hover:bg-[#065F46] text-white shadow-xs"
                >
                  {editingMapel ? 'Simpan Perubahan' : 'Simpan Mapel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
