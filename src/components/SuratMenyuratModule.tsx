import React, { useState } from 'react';
import {
  Mail,
  FileText,
  BookOpen,
  Plus,
  Search,
  Printer,
  QrCode,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  Send,
  Building,
  UserCheck,
  X,
  ExternalLink,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SuratMasuk, SuratKeluar, BukuTamu, formatTanggalIndonesia } from '../data/initialData';
import { MadrasahSettings } from '../types';

interface SuratMenyuratModuleProps {
  suratMasukList: SuratMasuk[];
  suratKeluarList: SuratKeluar[];
  bukuTamuList: BukuTamu[];
  settings: MadrasahSettings;
  onAddSuratMasuk: (surat: SuratMasuk) => void;
  onDeleteSuratMasuk?: (letterNo: string) => void;
  onAddSuratKeluar: (surat: SuratKeluar) => void;
  onDeleteSuratKeluar?: (letterNo: string) => void;
  onAddBukuTamu: (tamu: BukuTamu) => void;
  onDeleteBukuTamu?: (id: string) => void;
}

export const SuratMenyuratModule: React.FC<SuratMenyuratModuleProps> = ({
  suratMasukList,
  suratKeluarList,
  bukuTamuList,
  settings,
  onAddSuratMasuk,
  onDeleteSuratMasuk,
  onAddSuratKeluar,
  onDeleteSuratKeluar,
  onAddBukuTamu,
  onDeleteBukuTamu,
}) => {
  const [subTab, setSubTab] = useState<'suratMasuk' | 'suratKeluar' | 'bukuTamu'>('suratMasuk');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Panels
  const [isSuratMasukModalOpen, setIsSuratMasukModalOpen] = useState(false);
  const [isSuratKeluarModalOpen, setIsSuratKeluarModalOpen] = useState(false);
  const [isBukuTamuModalOpen, setIsBukuTamuModalOpen] = useState(false);
  const [isQrStandeeOpen, setIsQrStandeeOpen] = useState(false);
  const [previewSuratKeluar, setPreviewSuratKeluar] = useState<SuratKeluar | null>(suratKeluarList[0] || null);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);

  // Forms
  const [formDataSuratMasuk, setFormDataSuratMasuk] = useState<Partial<SuratMasuk>>({
    letterNo: '',
    dateReceived: new Date().toISOString().split('T')[0],
    sender: '',
    subject: '',
    status: 'Disposisi Kepala',
    notes: '',
  });

  const [formDataSuratKeluar, setFormDataSuratKeluar] = useState<Partial<SuratKeluar>>({
    letterNo: `092/MTs.AH/PP.01.1/XI/2026`,
    dateSent: new Date().toISOString().split('T')[0],
    recipient: '',
    subject: '',
    templateId: 'Undangan Rapat',
    content: 'Dengan hormat, sehubungan dengan agenda koordinasi madrasah dan persiapan kurikulum terpadu tahun ajaran berjalan, kami mengundang Bapak/Ibu untuk hadir dalam pertemuan yang akan diselenggarakan pada:',
    eventDayDate: 'Ahad, 15 November 2026',
    eventTime: 'Pukul 08.30 WIB s.d Selesai',
    eventPlace: 'Aula Pertemuan MTs Al-Hikmah Wonosobo',
    eventAgenda: 'Rapat Koordinasi Evaluasi Pembelajaran & Parenting Santri',
    closingText: 'Demikian surat ini kami sampaikan, atas perhatian dan kehadirannya kami ucapkan terima kasih.',
    status: 'Terkirim',
    signerName: settings.kepsekName,
  });

  const [formDataTamu, setFormDataTamu] = useState<Partial<BukuTamu>>({
    guestName: '',
    institution: '',
    purpose: '',
    meetTarget: 'Kepala Madrasah',
    notes: '',
  });

  const handleSubmitSuratMasuk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDataSuratMasuk.letterNo || !formDataSuratMasuk.sender) return;

    onAddSuratMasuk({
      letterNo: formDataSuratMasuk.letterNo!,
      dateReceived: formDataSuratMasuk.dateReceived || new Date().toISOString().split('T')[0],
      sender: formDataSuratMasuk.sender!,
      subject: formDataSuratMasuk.subject || 'Surat Dinas',
      fileLink: 'https://mtsalhikmahwsb.com/docs/surat.pdf',
      status: (formDataSuratMasuk.status as any) || 'Diterima',
      notes: formDataSuratMasuk.notes || 'Telah diterima di meja resepsionis TU.',
    });
    setIsSuratMasukModalOpen(false);
  };

  const handleSubmitSuratKeluar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDataSuratKeluar.letterNo || !formDataSuratKeluar.recipient) return;

    const newSurat: SuratKeluar = {
      letterNo: formDataSuratKeluar.letterNo!,
      dateSent: formDataSuratKeluar.dateSent || new Date().toISOString().split('T')[0],
      recipient: formDataSuratKeluar.recipient!,
      subject: formDataSuratKeluar.subject || 'Surat Resmi MTs Al-Hikmah',
      templateId: (formDataSuratKeluar.templateId as any) || 'Undangan Rapat',
      content: formDataSuratKeluar.content || 'Dengan hormat, sehubungan dengan agenda madrasah dan persiapan kurikulum terpadu tahun ajaran berjalan, kami mengundang Bapak/Ibu untuk hadir dalam pertemuan yang akan diselenggarakan pada:',
      eventDayDate: formDataSuratKeluar.eventDayDate || 'Ahad, 15 November 2026',
      eventTime: formDataSuratKeluar.eventTime || 'Pukul 08.30 WIB s.d Selesai',
      eventPlace: formDataSuratKeluar.eventPlace || 'Aula Pertemuan MTs Al-Hikmah Wonosobo',
      eventAgenda: formDataSuratKeluar.eventAgenda || 'Rapat Koordinasi Evaluasi Pembelajaran & Parenting Santri',
      closingText: formDataSuratKeluar.closingText || 'Demikian surat ini kami sampaikan, atas perhatian dan kehadirannya kami ucapkan terima kasih.',
      status: 'Terkirim',
      signerName: settings.kepsekName,
    };

    onAddSuratKeluar(newSurat);
    setPreviewSuratKeluar(newSurat);
    setIsSuratKeluarModalOpen(false);
  };

  const handleSubmitTamu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDataTamu.guestName || !formDataTamu.purpose) return;

    onAddBukuTamu({
      id: `GUEST-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      guestName: formDataTamu.guestName!,
      institution: formDataTamu.institution || 'Umum / Orang Tua',
      purpose: formDataTamu.purpose!,
      meetTarget: formDataTamu.meetTarget || 'Kepala Madrasah',
      notes: formDataTamu.notes || 'Kunjungan telah selesai.',
      signatureLink: '#verified',
    });
    setIsBukuTamuModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub navigation segmented pills */}
      <div className="bg-white rounded-3xl p-3 shadow-sm border border-[#E2EAE5] flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setSubTab('suratMasuk')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'suratMasuk'
                ? 'bg-white text-[#1B3A33] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Surat Masuk ({suratMasukList.length})
          </button>
          <button
            onClick={() => setSubTab('suratKeluar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'suratKeluar'
                ? 'bg-white text-[#1B3A33] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Surat Keluar Generator ({suratKeluarList.length})
          </button>
          <button
            onClick={() => setSubTab('bukuTamu')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'bukuTamu'
                ? 'bg-white text-[#1B3A33] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Buku Tamu Digital ({bukuTamuList.length})
          </button>
        </div>

        {/* Action Button */}
        <div>
          {subTab === 'suratMasuk' && (
            <button
              onClick={() => setIsSuratMasukModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Agenda Surat Masuk</span>
            </button>
          )}

          {subTab === 'suratKeluar' && (
            <button
              onClick={() => setIsSuratKeluarModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Surat Keluar Baru</span>
            </button>
          )}

          {subTab === 'bukuTamu' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsQrStandeeOpen(true)}
                className="px-4 py-2 rounded-2xl bg-[#CCA13B] hover:bg-[#DEB34E] text-slate-950 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <QrCode className="w-4 h-4" />
                <span>Tampilkan QR Standee Tamu</span>
              </button>
              <button
                onClick={() => setIsBukuTamuModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Input Tamu Manual</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 1. SUB-TAB: SURAT MASUK */}
      {subTab === 'suratMasuk' && (
        <div className="bg-white rounded-3xl shadow-sm border border-[#E2EAE5] overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1B3A33]">Buku Agenda Surat Masuk</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pencatatan surat dinas dari Kemenag, dinas terkait, LP Ma'arif, dan instansi mitra
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">Nomor & Tanggal Surat</th>
                  <th className="py-3.5 px-4">Pengirim / Asal Instansi</th>
                  <th className="py-3.5 px-4">Perihal / Isi Ringkas</th>
                  <th className="py-3.5 px-4">Disposisi Kepala</th>
                  <th className="py-3.5 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {suratMasukList.map((surat, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-mono">
                      <p className="font-bold text-slate-800">{surat.letterNo}</p>
                      <p className="text-[11px] text-slate-500">Diterima: {surat.dateReceived}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {surat.sender}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-[260px]">
                      {surat.subject}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 italic">
                      "{surat.notes || '-'}"
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {surat.status}
                        </span>
                        {onDeleteSuratMasuk && (
                          <button
                            onClick={() => onDeleteSuratMasuk(surat.letterNo)}
                            className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus Surat Masuk"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. SUB-TAB: SURAT KELUAR GENERATOR WITH DUAL SIGNATURE */}
      {subTab === 'suratKeluar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List of Sent Letters (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5]">
            <h4 className="text-base font-bold text-[#1B3A33] mb-1">Daftar Surat Keluar Resmi</h4>
            <p className="text-xs text-slate-500 mb-4">Pilih surat untuk melihat dan mencetak kop surat</p>

            <div className="space-y-3">
              {suratKeluarList.map((surat, idx) => (
                <div
                  key={idx}
                  onClick={() => setPreviewSuratKeluar(surat)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    previewSuratKeluar?.letterNo === surat.letterNo
                      ? 'border-[#047857] bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                    <span className="font-bold text-slate-800">{surat.letterNo}</span>
                    <div className="flex items-center gap-1.5">
                      <span>{surat.dateSent}</span>
                      {onDeleteSuratKeluar && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSuratKeluar(surat.letterNo);
                          }}
                          className="p-1 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Hapus Surat Keluar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{surat.subject}</h5>
                  <p className="text-[11px] text-slate-600 mt-1">Kepada: {surat.recipient}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Letter Preview & Generator (7 cols) - Printable with Dynamic Logo & Dual Signatures */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] flex flex-col justify-between">
            {previewSuratKeluar ? (
              <div>
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2 no-print">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#047857] uppercase tracking-wider">
                      Format Surat Resmi
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsQuickEditOpen(!isQuickEditOpen)}
                      className="px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Edit langsung isi paragraf, hari, waktu, tempat, dan penutup surat"
                    >
                      <Edit3 className="w-3 h-3 text-emerald-700" />
                      <span>{isQuickEditOpen ? 'Tutup Editor Teks' : 'Edit Isi Surat & Acara'}</span>
                      {isQuickEditOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-1.5 rounded-xl bg-[#1B3A33] hover:bg-[#254F46] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#CCA13B]" />
                    <span>Cetak Surat (Kop Resmi)</span>
                  </button>
                </div>

                {/* Collapsible Quick-Editor Box for Real-time In-place Letter Customization */}
                {isQuickEditOpen && (
                  <div className="no-print mb-4 p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-[#047857]" />
                        <h4 className="text-xs font-bold text-[#1B3A33]">
                          Edit Langsung Isi Paragraf, Hari, Waktu, Tempat & Penutup
                        </h4>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full font-medium">
                        Perubahan langsung tampil di lembar surat
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Paragraf Pembuka / Isi Utama
                        </label>
                        <textarea
                          rows={2}
                          value={previewSuratKeluar.content || ''}
                          onChange={(e) =>
                            setPreviewSuratKeluar({ ...previewSuratKeluar, content: e.target.value })
                          }
                          className="w-full px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-xs focus:ring-2 focus:ring-[#047857] outline-none"
                          placeholder="Tuliskan pembuka dan maksud surat/undangan..."
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Hari / Tanggal
                        </label>
                        <input
                          type="text"
                          value={previewSuratKeluar.eventDayDate || ''}
                          onChange={(e) =>
                            setPreviewSuratKeluar({ ...previewSuratKeluar, eventDayDate: e.target.value })
                          }
                          placeholder="Contoh: Ahad, 15 November 2026"
                          className="w-full px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-xs focus:ring-2 focus:ring-[#047857] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Waktu Pelaksanaan
                        </label>
                        <input
                          type="text"
                          value={previewSuratKeluar.eventTime || ''}
                          onChange={(e) =>
                            setPreviewSuratKeluar({ ...previewSuratKeluar, eventTime: e.target.value })
                          }
                          placeholder="Contoh: Pukul 08.30 WIB s.d Selesai"
                          className="w-full px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-xs focus:ring-2 focus:ring-[#047857] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Tempat Kegiatan
                        </label>
                        <input
                          type="text"
                          value={previewSuratKeluar.eventPlace || ''}
                          onChange={(e) =>
                            setPreviewSuratKeluar({ ...previewSuratKeluar, eventPlace: e.target.value })
                          }
                          placeholder="Contoh: Aula Pertemuan MTs Al-Hikmah Wonosobo"
                          className="w-full px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-xs focus:ring-2 focus:ring-[#047857] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Agenda / Acara
                        </label>
                        <input
                          type="text"
                          value={previewSuratKeluar.eventAgenda || ''}
                          onChange={(e) =>
                            setPreviewSuratKeluar({ ...previewSuratKeluar, eventAgenda: e.target.value })
                          }
                          placeholder="Contoh: Rapat Koordinasi Evaluasi Pembelajaran & Parenting"
                          className="w-full px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-xs focus:ring-2 focus:ring-[#047857] outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Paragraf Penutup (Diisi Sendiri)
                        </label>
                        <textarea
                          rows={2}
                          value={previewSuratKeluar.closingText || ''}
                          onChange={(e) =>
                            setPreviewSuratKeluar({ ...previewSuratKeluar, closingText: e.target.value })
                          }
                          className="w-full px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-xs focus:ring-2 focus:ring-[#047857] outline-none"
                          placeholder="Demikian surat ini kami sampaikan, atas perhatian dan kehadirannya kami ucapkan terima kasih."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Printable Letter Container */}
                <div className="p-6 border border-slate-200 rounded-2xl bg-white text-slate-800 printable-area text-xs space-y-4">
                  {/* Dynamic Kop Surat with Uploaded Logo (Tanpa Kemenag & Tanpa Baris 2) */}
                  <div className="border-b-4 border-double border-slate-900 pb-3 flex items-center gap-4">
                    {settings.logoUrl ? (
                      <img
                        src={settings.logoUrl}
                        alt="Logo Madrasah"
                        className="w-16 h-16 object-contain shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-[#1B3A33] text-[#CCA13B] flex items-center justify-center font-black text-xl border-2 border-[#CCA13B] shrink-0">
                        AH
                      </div>
                    )}
                    <div className="text-center flex-1">
                      <p className="text-xs font-bold text-slate-800 tracking-wider uppercase mb-0.5">
                        {settings.kopHeader1 || 'YAYASAN PONPES ITTIHADUT THOLIBIN'}
                      </p>
                      <h2 className="text-base font-black text-[#1B3A33] tracking-wide uppercase">
                        {settings.kopSchoolName}
                      </h2>
                      <p className="text-[10px] font-semibold text-slate-700 mt-0.5">
                        {settings.kopDetails}
                      </p>
                      <p className="text-[9px] text-slate-500 mt-0.5">
                        {settings.kopAddress}
                      </p>
                    </div>
                  </div>

                  {/* Letter Header Information (Bersih tanpa tanggal terbit/cetak) */}
                  <div className="flex justify-between items-start text-xs pt-2">
                    <div className="space-y-1">
                      <p><span className="w-16 inline-block font-semibold">Nomor</span>: {previewSuratKeluar.letterNo}</p>
                      <p><span className="w-16 inline-block font-semibold">Lampiran</span>: -</p>
                      <p><span className="w-16 inline-block font-semibold">Perihal</span>: <strong>{previewSuratKeluar.subject}</strong></p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p>Kepada Yth.</p>
                    <p className="font-bold">{previewSuratKeluar.recipient}</p>
                    <p>di Tempat</p>
                  </div>

                  {/* Body Content */}
                  <div className="pt-2 leading-relaxed space-y-2 text-justify">
                    <p className="italic font-serif">Assalamu’alaikum Warahmatullahi Wabarakatuh,</p>
                    <p>
                      {previewSuratKeluar.content ||
                        'Diberitahukan dengan hormat, sehubungan dengan agenda madrasah dan persiapan kurikulum terpadu tahun ajaran berjalan, kami mengundang Bapak/Ibu untuk hadir dalam pertemuan yang akan diselenggarakan pada:'}
                    </p>
                    {(previewSuratKeluar.eventDayDate || previewSuratKeluar.eventTime || previewSuratKeluar.eventPlace || previewSuratKeluar.eventAgenda) && (
                      <div className="pl-6 space-y-1 py-1">
                        {previewSuratKeluar.eventDayDate && (
                          <p><span className="w-24 inline-block font-medium">Hari / Tanggal</span>: {previewSuratKeluar.eventDayDate}</p>
                        )}
                        {previewSuratKeluar.eventTime && (
                          <p><span className="w-24 inline-block font-medium">Waktu</span>: {previewSuratKeluar.eventTime}</p>
                        )}
                        {previewSuratKeluar.eventPlace && (
                          <p><span className="w-24 inline-block font-medium">Tempat</span>: {previewSuratKeluar.eventPlace}</p>
                        )}
                        {previewSuratKeluar.eventAgenda && (
                          <p><span className="w-24 inline-block font-medium">Acara</span>: {previewSuratKeluar.eventAgenda}</p>
                        )}
                      </div>
                    )}
                    <p>
                      {previewSuratKeluar.closingText ||
                        'Demikian surat ini kami sampaikan, atas perhatian dan kehadirannya kami ucapkan terima kasih.'}
                    </p>
                    <p className="italic font-serif">Wassalamu’alaikum Warahmatullahi Wabarakatuh.</p>
                  </div>

                  {/* DUAL SIGNATURE: KIRI SEKRETARIS/TU (TANPA KATA MEMERIKSA), KANAN KEPALA MADRASAH (RUANG TANDA TANGAN BERSIH TANPA NAMA HIJAU) */}
                  <div className="pt-8 flex items-center justify-between text-center px-4">
                    {/* KIRI: Sekretaris / Kepala TU */}
                    <div className="w-56">
                      <p className="font-semibold text-slate-800">{settings.sekretarisTitle}</p>
                      {/* Ruang tanda tangan bersih asli tanpa teks warna hijau */}
                      <div className="h-20" />
                      <p className="font-bold underline text-slate-900">{settings.sekretarisName}</p>
                      <p className="text-[9px] text-slate-500 font-mono">NIP. {settings.sekretarisNip}</p>
                    </div>

                    {/* KANAN: Kepala Madrasah */}
                    <div className="w-56">
                      <p className="font-semibold text-slate-800">{settings.kepsekTitle}</p>
                      {/* Ruang tanda tangan bersih asli tanpa teks warna hijau */}
                      <div className="h-20" />
                      <p className="font-bold underline text-slate-900">{settings.kepsekName}</p>
                      <p className="text-[9px] text-slate-500 font-mono">NIP. {settings.kepsekNip}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 text-xs">
                Pilih surat keluar di sebelah kiri untuk melihat pratinjau.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. SUB-TAB: BUKU TAMU DIGITAL (DENGAN INGIN BERTEMU SIAPA) */}
      {subTab === 'bukuTamu' && (
        <div className="bg-white rounded-3xl shadow-sm border border-[#E2EAE5] overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-base font-bold text-[#1B3A33]">Daftar Kunjungan Buku Tamu Digital</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pencatatan tamu resmi dengan target tujuan bertemu pihak madrasah
              </p>
            </div>
            <button
              onClick={() => setIsQrStandeeOpen(true)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#CCA13B]/20 text-[#8F6813] hover:bg-[#CCA13B]/30 flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>Buka QR Standee Tamu</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">Waktu Kunjungan</th>
                  <th className="py-3.5 px-4">Nama Tamu & Instansi</th>
                  <th className="py-3.5 px-4">Ingin Bertemu Siapa</th>
                  <th className="py-3.5 px-4">Maksud & Keperluan</th>
                  <th className="py-3.5 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {bukuTamuList.map((tamu) => (
                  <tr key={tamu.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-slate-600">
                      {tamu.timestamp}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{tamu.guestName}</p>
                      <p className="text-[11px] text-slate-500">{tamu.institution}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#CCA13B]/15 text-[#8F6813] border border-[#CCA13B]/30">
                        {tamu.meetTarget || 'Kepala Madrasah'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-[280px]">
                      {tamu.purpose}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Terdaftar
                        </span>
                        {onDeleteBukuTamu && (
                          <button
                            type="button"
                            onClick={() => onDeleteBukuTamu(tamu.id)}
                            className="p-1 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus Data Tamu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QR STANDEE MODAL */}
      {isQrStandeeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl text-center">
            <div className="flex justify-end">
              <button
                onClick={() => setIsQrStandeeOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 rounded-2xl border-2 border-[#CCA13B] bg-gradient-to-b from-[#1B3A33] to-[#244E45] text-white my-4 shadow-xl printable-area">
              {settings.logoUrl && (
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  className="w-12 h-12 object-contain mx-auto mb-2 bg-white rounded-xl p-1"
                />
              )}
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#CCA13B]">
                SELAMAT DATANG DI
              </p>
              <h3 className="text-base font-extrabold uppercase mt-0.5">
                {settings.kopSchoolName || 'MTs AL-HIKMAH WONOSOBO'}
              </h3>
              <p className="text-[10px] text-emerald-200 mt-1">
                Silakan scan QR Code di bawah untuk mengisi Buku Tamu Digital secara instan melalui smartphone Anda:
              </p>

              <div className="my-5 p-4 bg-white rounded-2xl inline-block shadow-lg">
                <QrCode className="w-40 h-40 text-[#1B3A33]" />
              </div>

              <div className="bg-white/10 rounded-xl p-2.5 text-[10px] font-mono text-emerald-100">
                https://mtsalhikmahwsb.com/
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setIsQrStandeeOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1B3A33] text-white hover:bg-[#254F46] flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4 text-[#CCA13B]" />
                <span>Cetak Standee Meja</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INPUT BUKU TAMU MANUAL WITH "INGIN BERTEMU SIAPA" */}
      {isBukuTamuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1B3A33]">
                Catat Tamu Pengunjung Madrasah
              </h3>
              <button
                onClick={() => setIsBukuTamuModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTamu} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Tamu</label>
                <input
                  type="text"
                  required
                  value={formDataTamu.guestName}
                  onChange={(e) => setFormDataTamu({ ...formDataTamu, guestName: e.target.value })}
                  placeholder="Contoh: Drs. H. Suryanto"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Asal Lembaga / Instansi / Domisili</label>
                <input
                  type="text"
                  required
                  value={formDataTamu.institution}
                  onChange={(e) => setFormDataTamu({ ...formDataTamu, institution: e.target.value })}
                  placeholder="Contoh: LP Ma’arif NU Wonosobo / Orang Tua Santri"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              {/* PENGGANTI NO WHATSAPP: INGIN BERTEMU SIAPA */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ingin Bertemu Siapa? (Target Kunjungan)
                </label>
                <select
                  value={formDataTamu.meetTarget}
                  onChange={(e) => setFormDataTamu({ ...formDataTamu, meetTarget: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800"
                >
                  <option value="Kepala Madrasah">Kepala Madrasah (H. Ahmad Fauzi, M.Pd)</option>
                  <option value="Komite Madrasah">Komite Madrasah</option>
                  <option value="Waka Kurikulum">Waka Kurikulum & Akademik</option>
                  <option value="Waka Kesiswaan">Waka Kesiswaan & Kedisiplinan</option>
                  <option value="Wali Kelas">Wali Kelas Santri</option>
                  <option value="Guru BK">Guru Bimbingan Konseling (BK)</option>
                  <option value="Bagian Tata Usaha">Bagian Tata Usaha & Administrasi</option>
                  <option value="Bendahara Madrasah">Bendahara Madrasah</option>
                  <option value="Lainnya">Pihak Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Maksud & Keperluan Kunjungan</label>
                <textarea
                  rows={3}
                  required
                  value={formDataTamu.purpose}
                  onChange={(e) => setFormDataTamu({ ...formDataTamu, purpose: e.target.value })}
                  placeholder="Contoh: Koordinasi teknis pelaksanaan program keasramaan dan tahfidz"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBukuTamuModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-[#047857] hover:bg-[#065F46] text-white shadow-xs"
                >
                  Simpan Buku Tamu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BUAT SURAT KELUAR */}
      {isSuratKeluarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1B3A33]">
                Generator Surat Keluar Resmi
              </h3>
              <button
                onClick={() => setIsSuratKeluarModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSuratKeluar} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Surat Otomatis</label>
                  <input
                    type="text"
                    required
                    value={formDataSuratKeluar.letterNo}
                    onChange={(e) => setFormDataSuratKeluar({ ...formDataSuratKeluar, letterNo: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Surat</label>
                  <input
                    type="date"
                    required
                    value={formDataSuratKeluar.dateSent}
                    onChange={(e) => setFormDataSuratKeluar({ ...formDataSuratKeluar, dateSent: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Penerima Surat (Yth.)</label>
                <input
                  type="text"
                  required
                  value={formDataSuratKeluar.recipient}
                  onChange={(e) => setFormDataSuratKeluar({ ...formDataSuratKeluar, recipient: e.target.value })}
                  placeholder="Contoh: Seluruh Orang Tua Siswa Kelas 7 / Kemenag Wonosobo"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Perihal Surat</label>
                <input
                  type="text"
                  required
                  value={formDataSuratKeluar.subject}
                  onChange={(e) => setFormDataSuratKeluar({ ...formDataSuratKeluar, subject: e.target.value })}
                  placeholder="Contoh: Undangan Rapat Koordinasi Kurikulum & Parenting"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Isi Paragraf Pembuka</label>
                <textarea
                  rows={3}
                  value={formDataSuratKeluar.content}
                  onChange={(e) => setFormDataSuratKeluar({ ...formDataSuratKeluar, content: e.target.value })}
                  placeholder="Tuliskan maksud undangan/surat..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 resize-none text-xs"
                />
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2.5">
                <p className="text-[11px] font-bold text-emerald-900">Rincian Waktu & Tempat (Dapat Disesuaikan Sendiri)</p>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Hari / Tanggal</label>
                    <input
                      type="text"
                      value={formDataSuratKeluar.eventDayDate || ''}
                      onChange={(e) => setFormDataSuratKeluar({ ...formDataSuratKeluar, eventDayDate: e.target.value })}
                      placeholder="Ahad, 15 November 2026"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Waktu</label>
                    <input
                      type="text"
                      value={formDataSuratKeluar.eventTime || ''}
                      onChange={(e) => setFormDataSuratKeluar({ ...formDataSuratKeluar, eventTime: e.target.value })}
                      placeholder="Pukul 08.30 WIB s.d Selesai"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Tempat</label>
                    <input
                      type="text"
                      value={formDataSuratKeluar.eventPlace || ''}
                      onChange={(e) => setFormDataSuratKeluar({ ...formDataSuratKeluar, eventPlace: e.target.value })}
                      placeholder="Aula Pertemuan MTs Al-Hikmah"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Agenda / Acara</label>
                    <input
                      type="text"
                      value={formDataSuratKeluar.eventAgenda || ''}
                      onChange={(e) => setFormDataSuratKeluar({ ...formDataSuratKeluar, eventAgenda: e.target.value })}
                      placeholder="Rapat Koordinasi"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Paragraf Penutup (Diisi Sendiri)</label>
                <textarea
                  rows={2}
                  value={formDataSuratKeluar.closingText || ''}
                  onChange={(e) => setFormDataSuratKeluar({ ...formDataSuratKeluar, closingText: e.target.value })}
                  placeholder="Demikian surat ini kami sampaikan, atas perhatian dan kehadirannya kami ucapkan terima kasih."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 resize-none text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSuratKeluarModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-[#047857] hover:bg-[#065F46] text-white shadow-xs"
                >
                  Buat & Lihat Pratinjau
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INPUT SURAT MASUK */}
      {isSuratMasukModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1B3A33]">
                Registrasi Agenda Surat Masuk
              </h3>
              <button
                onClick={() => setIsSuratMasukModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSuratMasuk} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Surat Asal</label>
                  <input
                    type="text"
                    required
                    value={formDataSuratMasuk.letterNo}
                    onChange={(e) => setFormDataSuratMasuk({ ...formDataSuratMasuk, letterNo: e.target.value })}
                    placeholder="B-123/Kk.11.23/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Diterima</label>
                  <input
                    type="date"
                    required
                    value={formDataSuratMasuk.dateReceived}
                    onChange={(e) => setFormDataSuratMasuk({ ...formDataSuratMasuk, dateReceived: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instansi / Pengirim</label>
                <input
                  type="text"
                  required
                  value={formDataSuratMasuk.sender}
                  onChange={(e) => setFormDataSuratMasuk({ ...formDataSuratMasuk, sender: e.target.value })}
                  placeholder="Kankemenag Kab. Wonosobo"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Perihal Surat</label>
                <input
                  type="text"
                  required
                  value={formDataSuratMasuk.subject}
                  onChange={(e) => setFormDataSuratMasuk({ ...formDataSuratMasuk, subject: e.target.value })}
                  placeholder="Undangan Sosialisasi Program Madrasah Ramah Anak"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instruksi / Catatan Disposisi</label>
                <textarea
                  rows={2}
                  value={formDataSuratMasuk.notes}
                  onChange={(e) => setFormDataSuratMasuk({ ...formDataSuratMasuk, notes: e.target.value })}
                  placeholder="Mohon dihadiri oleh Waka Kesiswaan..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSuratMasukModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-[#047857] hover:bg-[#065F46] text-white shadow-xs"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
