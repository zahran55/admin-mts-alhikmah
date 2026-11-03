import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Filter,
  Printer,
  Download,
  FileCheck,
  X,
  CreditCard,
  Building,
  Calendar,
  Trash2,
} from 'lucide-react';
import { Keuangan, formatRupiah, angkaTerbilang, formatTanggalIndonesia } from '../data/initialData';
import { MadrasahSettings } from '../types';

interface KeuanganModuleProps {
  keuanganList: Keuangan[];
  settings: MadrasahSettings;
  onAddKeuangan: (item: Keuangan) => void;
  onDeleteKeuangan: (id: string) => void;
}

export const KeuanganModule: React.FC<KeuanganModuleProps> = ({
  keuanganList,
  settings,
  onAddKeuangan,
  onDeleteKeuangan,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'Inflow' | 'Outflow'>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Keuangan | null>(keuanganList[0] || null);

  // Form State
  const [formData, setFormData] = useState<Partial<Keuangan>>({
    date: '2026-11-01',
    category: 'Inflow',
    type: 'SPP Bulanan',
    description: '',
    amount: 250000,
    payerOrPayee: '',
  });

  // Calculations
  const totalInflow = keuanganList
    .filter((k) => k.category === 'Inflow')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalOutflow = keuanganList
    .filter((k) => k.category === 'Outflow')
    .reduce((sum, item) => sum + item.amount, 0);

  const saldoKas = totalInflow - totalOutflow;

  // Filtered List
  const filteredList = keuanganList.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.payerOrPayee && item.payerOrPayee.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleOpenAdd = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: 'Inflow',
      type: 'SPP Bulanan',
      description: 'Pembayaran SPP Bulan November 2026 - Siswa',
      amount: 250000,
      payerOrPayee: '',
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    const receiptSequence = String(keuanganList.length + 1).padStart(4, '0');
    const newTx: Keuangan = {
      id: `TRX-${Date.now()}`,
      date: formData.date || new Date().toISOString().split('T')[0],
      category: (formData.category as any) || 'Inflow',
      type: (formData.type as any) || 'SPP Bulanan',
      description: formData.description!,
      amount: Number(formData.amount),
      receiptNo: `KW/MTS-AH/2026/XI/${receiptSequence}`,
      adminUser: settings.bendaharaName,
      payerOrPayee: formData.payerOrPayee || 'Wali Siswa',
    };

    onAddKeuangan(newTx);
    setIsFormOpen(false);
    setSelectedReceipt(newTx);
    setIsReceiptModalOpen(true);
  };

  const handlePreviewReceipt = (tx: Keuangan) => {
    setSelectedReceipt(tx);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 3 FINANCIAL SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#CCA13B] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs uppercase font-bold tracking-wider text-white/90">
              Total Kas Madrasah Saat Ini
            </span>
            <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight mt-1 tabular-nums">
              {formatRupiah(saldoKas)}
            </h3>
            <p className="text-xs text-white/90 mt-3 font-medium">
              Akumulasi kas bendahara dan rekening operasional
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5]">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Total Pemasukan (Inflow)
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-[#047857] mt-1 tabular-nums">
            {formatRupiah(totalInflow)}
          </h3>
          <p className="text-xs text-slate-500 mt-3">
            BOS, SPP bulanan, dan infaq pembangunan
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5]">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Total Pengeluaran (Outflow)
            </span>
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-rose-600 mt-1 tabular-nums">
            {formatRupiah(totalOutflow)}
          </h3>
          <p className="text-xs text-slate-500 mt-3">
            Gaji guru, listrik PLN, internet, sarpras madrasah
          </p>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari transaksi berdasarkan keterangan, nomor kwitansi, atau nama pembayar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#047857] bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">Semua Arus Kas</option>
            <option value="Inflow">Kas Masuk (Inflow)</option>
            <option value="Outflow">Kas Keluar (Outflow)</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">Semua Kategori Pos</option>
            <option value="SPP Bulanan">SPP Bulanan</option>
            <option value="Dana BOS">Dana BOS</option>
            <option value="Infaq/Pembangunan">Infaq / Pembangunan</option>
            <option value="Gaji & Honor">Gaji & Honorarium</option>
            <option value="Operasional Sekolah">Operasional Sekolah</option>
            <option value="Sarana & Prasarana">Sarpras Madrasah</option>
          </select>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Transaksi / Kwitansi</span>
          </button>
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#E2EAE5] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1B3A33]">Buku Kas Umum (BKU) Madrasah</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Riwayat transaksi kas masuk dan kas keluar resmi {settings.kopSchoolName || 'MTs Al-Hikmah'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {filteredList.length} Catatan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-6">Tanggal & Kwitansi</th>
                <th className="py-3.5 px-4">Pihak / Penyetor</th>
                <th className="py-3.5 px-4">Kategori & Keterangan</th>
                <th className="py-3.5 px-4 text-center">Arus Kas</th>
                <th className="py-3.5 px-4 text-right">Nominal</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredList.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="py-3.5 px-6 font-mono">
                    <p className="font-bold text-slate-800">{tx.receiptNo}</p>
                    <p className="text-[11px] text-slate-500">{tx.date}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{tx.payerOrPayee || '-'}</p>
                    <p className="text-[11px] text-slate-500">Petugas: {tx.adminUser}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 mb-1">
                      {tx.type}
                    </span>
                    <p className="text-slate-700 leading-snug line-clamp-1">{tx.description}</p>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        tx.category === 'Inflow'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {tx.category === 'Inflow' ? 'Kas Masuk' : 'Kas Keluar'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                    <span
                      className={`font-bold text-sm ${
                        tx.category === 'Inflow' ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {tx.category === 'Inflow' ? '+' : '-'} {formatRupiah(tx.amount)}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handlePreviewReceipt(tx)}
                        className="px-3 py-1.5 rounded-xl bg-[#CCA13B]/15 text-[#8F6813] hover:bg-[#CCA13B]/30 font-semibold text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        title="Lihat & Cetak Kwitansi Resmi"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Kwitansi</span>
                      </button>
                      <button
                        onClick={() => onDeleteKeuangan(tx.id)}
                        className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    Tidak ada transaksi keuangan yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* OFFICIAL KWITANSI MODAL (Print-Ready with Dynamic Logo & Bendahara Settings) */}
      {isReceiptModalOpen && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[92vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#047857]" />
                <h3 className="text-base font-bold text-[#1B3A33]">
                  Kwitansi Bukti Pembayaran Resmi Madrasah
                </h3>
              </div>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PRINTABLE RECEIPT TEMPLATE WITH LOGO */}
            <div className="my-6 p-6 border-2 border-slate-300 rounded-2xl bg-[#FCFDFD] text-slate-800 printable-area shadow-sm">
              {/* Kop Kwitansi */}
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 gap-4">
                <div className="flex items-center gap-3">
                  {settings.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt="Logo Madrasah"
                      className="w-14 h-14 object-contain shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#1B3A33] text-[#CCA13B] flex items-center justify-center font-black text-lg border border-[#CCA13B] shrink-0">
                      AH
                    </div>
                  )}
                  <div>
                    <h2 className="text-base font-black text-[#1B3A33] tracking-wide uppercase">
                      {settings.kopSchoolName || 'MTs AL-HIKMAH WONOSOBO'}
                    </h2>
                    <p className="text-[9px] text-slate-600 line-clamp-1">
                      {settings.kopAddress || 'Jl. Raya Wonosobo - Dieng KM 04, Mojotengah, Wonosobo'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black uppercase text-[#1B3A33] bg-slate-100 px-3 py-1 rounded-md border border-slate-300">
                    KWITANSI
                  </span>
                  <p className="text-[11px] font-mono font-bold text-slate-700 mt-1">
                    No: {selectedReceipt.receiptNo}
                  </p>
                </div>
              </div>

              {/* Receipt Content Body */}
              <div className="mt-5 space-y-3.5 text-xs">
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-3 text-slate-600 font-semibold">Telah Terima Dari</span>
                  <span className="col-span-1 text-center font-bold">:</span>
                  <span className="col-span-8 font-bold text-slate-900 uppercase">
                    {selectedReceipt.payerOrPayee || 'Wali Murid Siswa'}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 bg-slate-100/70 p-2.5 rounded-xl border border-slate-200">
                  <span className="col-span-3 text-slate-600 font-semibold">Uang Sejumlah</span>
                  <span className="col-span-1 text-center font-bold">:</span>
                  <span className="col-span-8 font-serif italic font-bold text-[#1B3A33]">
                    # {angkaTerbilang(selectedReceipt.amount)} #
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-3 text-slate-600 font-semibold">Untuk Pembayaran</span>
                  <span className="col-span-1 text-center font-bold">:</span>
                  <span className="col-span-8 text-slate-800 leading-relaxed">
                    {selectedReceipt.description} ({selectedReceipt.type})
                  </span>
                </div>
              </div>

              {/* Footer: Amount Block & Dynamic Bendahara Signature */}
              <div className="mt-8 pt-4 border-t border-slate-200 flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                    Terbilang Nominal
                  </p>
                  <div className="px-4 py-2 bg-[#1B3A33] text-white rounded-xl inline-block font-mono font-extrabold text-base tracking-wide border-2 border-[#CCA13B]">
                    {formatRupiah(selectedReceipt.amount)}
                  </div>
                </div>

                <div className="text-center text-xs w-52">
                  <p className="text-slate-600">
                    {settings.city || 'Wonosobo'}, {formatTanggalIndonesia(selectedReceipt.date)}
                  </p>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {settings.bendaharaTitle || 'Bendahara Madrasah'},
                  </p>
                  {/* Digital Stamp Simulation */}
                  <div className="my-1 h-12 flex items-center justify-center">
                    <span className="text-[11px] font-bold text-[#047857] border border-[#047857]/40 px-2 py-0.5 rounded-sm rotate-[-4deg]">
                      [ LUNAS / TERVERIFIKASI ]
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 underline">
                    {settings.bendaharaName || selectedReceipt.adminUser}
                  </p>
                  <p className="text-[9px] text-slate-500 font-mono">
                    NIP / NIY. {settings.bendaharaNip || '198509142012012003'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#047857] hover:bg-[#065F46] text-white flex items-center gap-2 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Kwitansi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD TRANSACTION FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1B3A33]">
                Catat Transaksi Kas Baru
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Arus Kas</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Inflow">Kas Masuk (Inflow)</option>
                    <option value="Outflow">Kas Keluar (Outflow)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Pos</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="SPP Bulanan">SPP Bulanan Siswa</option>
                    <option value="Dana BOS">Penerimaan Dana BOS</option>
                    <option value="Infaq/Pembangunan">Infaq / Pembangunan</option>
                    <option value="Gaji & Honor">Gaji & Honorarium</option>
                    <option value="Operasional Sekolah">Operasional Madrasah</option>
                    <option value="Sarana & Prasarana">Sarpras & Perlengkapan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Penyetor / Penerima Dana</label>
                <input
                  type="text"
                  required
                  value={formData.payerOrPayee}
                  onChange={(e) => setFormData({ ...formData, payerOrPayee: e.target.value })}
                  placeholder="Contoh: Bambang Pratama (Wali Siswa Kelas 7A)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nominal (Rupiah)</label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-sm font-bold"
                  />
                  {formData.amount && (
                    <p className="text-[10px] text-emerald-700 font-serif italic mt-1 line-clamp-1">
                      {angkaTerbilang(Number(formData.amount))}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan Rinci Transaksi</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Contoh: Pembayaran SPP bulan November 2026 atas nama Ahmad Raihan Pratama"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 resize-none"
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
                  Simpan & Cetak Kwitansi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
