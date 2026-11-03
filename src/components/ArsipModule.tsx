import React, { useState } from 'react';
import {
  Archive,
  Search,
  Plus,
  FileText,
  Download,
  ExternalLink,
  Shield,
  Trash2,
  FolderOpen,
  X,
} from 'lucide-react';
import { Arsip } from '../types';

interface ArsipModuleProps {
  arsipList: Arsip[];
  onAddArsip: (arsip: Arsip) => void;
  onDeleteArsip: (id: string) => void;
}

export const ArsipModule: React.FC<ArsipModuleProps> = ({
  arsipList,
  onAddArsip,
  onDeleteArsip,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Arsip>>({
    docId: '',
    title: '',
    category: 'Kemenag & Yayasan',
    uploadDate: new Date().toISOString().split('T')[0],
    fileLink: 'https://mtsalhikmahwsb.com/arsip/dokumen.pdf',
    accessLevel: 'Publik',
    fileSize: '2.5 MB',
  });

  const filteredArsip = arsipList.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.docId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setFormData({
      docId: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: '',
      category: 'Kurikulum',
      uploadDate: new Date().toISOString().split('T')[0],
      fileLink: 'https://mtsalhikmahwsb.com/arsip/dokumen.pdf',
      accessLevel: 'Guru',
      fileSize: '3.2 MB',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.docId) return;

    onAddArsip({
      docId: formData.docId!,
      title: formData.title!,
      category: (formData.category as any) || 'Kurikulum',
      uploadDate: formData.uploadDate || new Date().toISOString().split('T')[0],
      fileLink: formData.fileLink || 'https://mtsalhikmahwsb.com/arsip/dokumen.pdf',
      accessLevel: (formData.accessLevel as any) || 'Guru',
      fileSize: formData.fileSize || '1.8 MB',
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Actions Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari arsip berdasarkan judul SK, kurikulum, atau sertifikat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#047857] bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">Semua Kategori Arsip</option>
            <option value="Kurikulum">Kurikulum & Silabus</option>
            <option value="Kemenag & Yayasan">SK Kemenag & Yayasan</option>
            <option value="Sertifikat & Akreditasi">Sertifikat & Akreditasi</option>
            <option value="Kebijakan">SOP & Kebijakan Madrasah</option>
          </select>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Arsipkan Dokumen</span>
          </button>
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArsip.map((doc) => (
          <div
            key={doc.docId}
            className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {doc.docId}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    doc.accessLevel === 'Publik'
                      ? 'bg-emerald-100 text-emerald-800'
                      : doc.accessLevel === 'Guru'
                      ? 'bg-[#CCA13B]/20 text-[#8F6813]'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  Akses {doc.accessLevel}
                </span>
              </div>

              <div className="flex items-start gap-3 mt-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#047857] flex items-center justify-center shrink-0 border border-emerald-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#047857] transition-colors line-clamp-2 leading-snug">
                    {doc.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {doc.category} · {doc.fileSize}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">
                Diunggah: {doc.uploadDate}
              </span>

              <div className="flex items-center gap-1.5">
                <a
                  href={doc.fileLink}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors inline-flex"
                  title="Unduh / Buka Dokumen"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => onDeleteArsip(doc.docId)}
                  className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Hapus Dokumen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1B3A33]">
                Unggah / Registrasi Dokumen Arsip
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Dokumen Resmi</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: SK Penetapan Kurikulum Madrasah TP 2026/2027"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Arsip</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Kurikulum">Kurikulum & Silabus</option>
                    <option value="Kemenag & Yayasan">Kemenag & Yayasan</option>
                    <option value="Sertifikat & Akreditasi">Sertifikat & Akreditasi</option>
                    <option value="Kebijakan">SOP & Kebijakan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tingkat Akses</label>
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Publik">Publik (Bisa dilihat siapa saja)</option>
                    <option value="Guru">Guru & Tenaga Kependidikan</option>
                    <option value="Admin">Administrator Khusus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL / Link File PDF di Cloud / Drive</label>
                <input
                  type="text"
                  required
                  value={formData.fileLink}
                  onChange={(e) => setFormData({ ...formData, fileLink: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-[11px]"
                />
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
                  Simpan ke Arsip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
