import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Award,
  BookOpen,
  UserCheck,
  X,
  School,
} from 'lucide-react';
import { Nilai, Siswa, MataPelajaran, formatTanggalIndonesia } from '../data/initialData';
import { MadrasahSettings } from '../types';

interface RaporModuleProps {
  nilaiList: Nilai[];
  siswaList: Siswa[];
  mapelList: MataPelajaran[];
  settings: MadrasahSettings;
  onAddNilai: (nilai: Nilai) => void;
}

export const RaporModule: React.FC<RaporModuleProps> = ({
  nilaiList,
  siswaList,
  mapelList,
  settings,
  onAddNilai,
}) => {
  const [selectedStudentNis, setSelectedStudentNis] = useState<string>(siswaList[0]?.nis || '');
  const [selectedSemester, setSelectedSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);

  // Form State
  const [formSubject, setFormSubject] = useState(mapelList[0]?.subjectCode || '');
  const [formTugas, setFormTugas] = useState(85);
  const [formUts, setFormUts] = useState(85);
  const [formUas, setFormUas] = useState(85);
  const [formNotes, setFormNotes] = useState('Menunjukkan penguasaan materi yang sangat baik.');

  const currentStudent = siswaList.find((s) => s.nis === selectedStudentNis) || siswaList[0];

  // Grades for selected student
  const studentGrades = nilaiList.filter(
    (n) => n.studentNis === selectedStudentNis && n.semester === selectedSemester
  );

  const weightTugas = settings.gradeWeightTugas ?? 30;
  const weightUts = settings.gradeWeightUts ?? 30;
  const weightUas = settings.gradeWeightUas ?? 40;
  const kkm = settings.kkmDefault ?? 75;

  const calculateFinalGrade = (tugas: number, uts: number, uas: number) => {
    const totalWeight = weightTugas + weightUts + weightUas || 100;
    return Math.round((tugas * weightTugas + uts * weightUts + uas * weightUas) / totalWeight);
  };

  const getPredicate = (grade: number): 'A' | 'B' | 'C' | 'D' => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    return 'D';
  };

  const handleSubmitNilai = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent || !formSubject) return;

    const mapel = mapelList.find((m) => m.subjectCode === formSubject);
    const finalGrade = calculateFinalGrade(formTugas, formUts, formUas);

    const newNilai: Nilai = {
      studentNis: currentStudent.nis,
      studentName: currentStudent.name,
      class: currentStudent.class,
      subjectCode: formSubject,
      subjectName: mapel ? mapel.subjectName : 'Mata Pelajaran',
      semester: selectedSemester,
      academicYear: '2026/2027',
      assignment: formTugas,
      uts: formUts,
      uas: formUas,
      finalGrade: finalGrade,
      predicate: getPredicate(finalGrade),
      teacherNotes: formNotes,
    };

    onAddNilai(newNilai);
    setIsInputModalOpen(false);
  };

  // Average grade calculation
  const totalScore = studentGrades.reduce((sum, g) => sum + g.finalGrade, 0);
  const averageGrade = studentGrades.length > 0 ? (totalScore / studentGrades.length).toFixed(1) : '88.5';

  return (
    <div className="space-y-6">
      {/* Selector & Actions Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Pilih Peserta Didik
            </label>
            <select
              value={selectedStudentNis}
              onChange={(e) => setSelectedStudentNis(e.target.value)}
              className="px-4 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
            >
              {siswaList.map((s) => (
                <option key={s.nis} value={s.nis}>
                  {s.name} ({s.nis} - Kelas {s.class})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value as any)}
              className="px-4 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
            >
              <option value="Ganjil">Semester Ganjil (Gasal)</option>
              <option value="Genap">Semester Genap</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInputModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#CCA13B] hover:bg-[#DEB34E] text-slate-950 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Input Nilai Mapel</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-emerald-200" />
            <span>Cetak Rapor Resmi</span>
          </button>
        </div>
      </div>

      {/* RAPOR AKADEMIK DISPLAY (Printable standard Kemenag) */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E2EAE5] text-slate-800 printable-area space-y-6">
        {/* Kop Rapor with Logo */}
        <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-center gap-4 text-center relative">
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
          <div>
            <p className="text-xs font-bold text-slate-800 tracking-wider uppercase mb-0.5">
              {settings.kopHeader1 || 'YAYASAN PONPES ITTIHADUT THOLIBIN'}
            </p>
            <h2 className="text-base font-black text-[#1B3A33] tracking-wide uppercase">
              LAPORAN HASIL BELAJAR (RAPOR) PESERTA DIDIK
            </h2>
            <p className="text-xs font-bold text-slate-800 uppercase mt-0.5">
              {settings.kopSchoolName || 'MADRASAH TSANAWIYAH AL-HIKMAH WONOSOBO'}
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              {settings.kopDetails || 'Status Terakreditasi "A" · NSM: 121233070014 · NPSN: 20364812'}
            </p>
          </div>
        </div>

        {/* Student Identity Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="space-y-1.5">
            <p><span className="w-28 inline-block font-medium text-slate-500">Nama Siswa</span>: <strong className="uppercase">{currentStudent?.name}</strong></p>
            <p><span className="w-28 inline-block font-medium text-slate-500">NIS / NISN</span>: <span className="font-mono">{currentStudent?.nis} / {currentStudent?.nisn}</span></p>
            <p><span className="w-28 inline-block font-medium text-slate-500">Madrasah</span>: MTs Al-Hikmah Wonosobo</p>
          </div>
          <div className="space-y-1.5">
            <p><span className="w-28 inline-block font-medium text-slate-500">Kelas / Fase</span>: <strong>{currentStudent?.class} / Fase D</strong></p>
            <p><span className="w-28 inline-block font-medium text-slate-500">Semester</span>: {selectedSemester}</p>
            <p><span className="w-28 inline-block font-medium text-slate-500">Tahun Ajaran</span>: 2026/2027</p>
          </div>
        </div>

        {/* Academic Matrix Table */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B3A33] mb-2">
            A. Capaian Nilai Akademik & Muatan Agama
          </h4>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase border-b border-slate-200">
                  <th className="py-2.5 px-3 text-center w-10">No</th>
                  <th className="py-2.5 px-4">Mata Pelajaran</th>
                  <th className="py-2.5 px-3 text-center">Tugas ({weightTugas}%)</th>
                  <th className="py-2.5 px-3 text-center">UTS ({weightUts}%)</th>
                  <th className="py-2.5 px-3 text-center">UAS ({weightUas}%)</th>
                  <th className="py-2.5 px-3 text-center font-bold">Nilai Akhir</th>
                  <th className="py-2.5 px-3 text-center">Predikat</th>
                  <th className="py-2.5 px-4">Deskripsi Capaian Kompetensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {studentGrades.map((grade, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{grade.subjectName}</td>
                    <td className="py-2.5 px-3 text-center font-mono">{grade.assignment}</td>
                    <td className="py-2.5 px-3 text-center font-mono">{grade.uts}</td>
                    <td className="py-2.5 px-3 text-center font-mono">{grade.uas}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-black text-[#047857]">
                      {grade.finalGrade}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold">
                      <span className="inline-block w-6 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {grade.predicate}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-[11px] text-slate-600">
                      {grade.teacherNotes || 'Mencapai kompetensi pembelajaran dengan baik.'}
                    </td>
                  </tr>
                ))}
                {studentGrades.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-slate-400">
                      Belum ada nilai yang diinput untuk siswa ini di semester {selectedSemester}. Klik "Input Nilai Mapel" untuk menambahkan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Extracurriculars & Attendance */}
        <div className="grid grid-cols-2 gap-4 text-xs pt-2">
          {/* Ekstrakurikuler */}
          <div className="border border-slate-200 rounded-xl p-3">
            <h5 className="font-bold text-[#1B3A33] mb-2">B. Kegiatan Ekstrakurikuler</h5>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span>1. Pramuka Madrasah</span>
                <strong className="text-emerald-700">A (Sangat Baik)</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span>2. Tahfidz Al-Qur'an (Juz 30)</span>
                <strong className="text-emerald-700">A (Sangat Baik)</strong>
              </div>
              <div className="flex justify-between">
                <span>3. Hadroh & Seni Shalawat</span>
                <strong className="text-emerald-700">A (Aktif)</strong>
              </div>
            </div>
          </div>

          {/* Kehadiran */}
          <div className="border border-slate-200 rounded-xl p-3">
            <h5 className="font-bold text-[#1B3A33] mb-2">C. Rekapitulasi Presensi</h5>
            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="font-sans">Sakit (S)</span>
                <strong>1 Hari</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="font-sans">Izin (I)</span>
                <strong>0 Hari</strong>
              </div>
              <div className="flex justify-between">
                <span className="font-sans">Tanpa Keterangan (A)</span>
                <strong>0 Hari</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Wali Kelas Notes & Signatures */}
        <div className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50/60">
          <h5 className="font-bold text-[#1B3A33] mb-1">Catatan Wali Kelas:</h5>
          <p className="italic text-slate-700 leading-relaxed text-[11px]">
            "Ananda menunjukkan peningkatan prestasi yang memuaskan dan akhlak yang mulia di lingkungan madrasah dan asrama. Pertahankan semangat belajar Al-Qur'an dan sains!"
          </p>
        </div>

        {/* 3-Column Signatures */}
        <div className="pt-6 grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <p className="text-slate-600">Mengetahui,</p>
            <p className="font-medium text-slate-700">Orang Tua / Wali Siswa</p>
            <div className="h-16 flex items-center justify-center">
              <span className="text-slate-300">..............................</span>
            </div>
            <p className="font-bold text-slate-900">({currentStudent?.parentName || 'Wali Murid'})</p>
          </div>

          <div>
            <p className="text-slate-600">{settings.city || 'Wonosobo'}, 20 Desember 2026</p>
            <p className="font-medium text-slate-700">Wali Kelas {currentStudent?.class}</p>
            <div className="h-16" />
            <p className="font-bold underline text-slate-900">Ust. M. Ihsan, S.Pd.I</p>
            <p className="text-[10px] text-slate-500 font-mono">NIP. 198801122019031008</p>
          </div>

          <div>
            <p className="text-slate-600">Mengetahui,</p>
            <p className="font-semibold text-slate-700">{settings.kepsekTitle || 'Kepala Madrasah'}</p>
            <div className="h-16" />
            <p className="font-bold underline text-slate-900">{settings.kepsekName}</p>
            <p className="text-[10px] text-slate-500 font-mono">NIP. {settings.kepsekNip}</p>
          </div>
        </div>
      </div>

      {/* INPUT GRADE MODAL */}
      {isInputModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1B3A33]">
                Input Nilai Rapor Siswa
              </h3>
              <button
                onClick={() => setIsInputModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNilai} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {mapelList.map((m) => (
                    <option key={m.subjectCode} value={m.subjectCode}>
                      {m.subjectName} ({m.subjectCode} - Kelas {m.classLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tugas ({weightTugas}%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={formTugas}
                    onChange={(e) => setFormTugas(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">UTS ({weightUts}%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={formUts}
                    onChange={(e) => setFormUts(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">UAS ({weightUas}%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={formUas}
                    onChange={(e) => setFormUas(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-center font-bold"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl flex items-center justify-between text-xs">
                <span>Nilai Akhir Terhitung:</span>
                <strong className="text-emerald-900 font-mono text-base">
                  {calculateFinalGrade(formTugas, formUts, formUas)} (Predikat {getPredicate(calculateFinalGrade(formTugas, formUts, formUas))})
                </strong>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Capaian Kompetensi / Catatan Guru</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInputModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-[#047857] hover:bg-[#065F46] text-white shadow-xs"
                >
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
