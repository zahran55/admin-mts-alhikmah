import React, { useState, useRef, useEffect } from 'react';
import {
  QrCode,
  Scan,
  Camera,
  CheckCircle2,
  Volume2,
  VolumeX,
  Clock,
  UserCheck,
  AlertCircle,
  Users,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { Absensi, Siswa, Guru } from '../types';

interface AbsensiModuleProps {
  absensiList: Absensi[];
  siswaList: Siswa[];
  guruList: Guru[];
  onAddAbsensi: (record: Absensi) => void;
}

export const AbsensiModule: React.FC<AbsensiModuleProps> = ({
  absensiList,
  siswaList,
  guruList,
  onAddAbsensi,
}) => {
  const [scanInput, setScanInput] = useState('');
  const [targetType, setTargetType] = useState<'Check-in' | 'Check-out'>('Check-in');
  const [selectedRole, setSelectedRole] = useState<'Siswa' | 'Guru'>('Siswa');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastScannedResult, setLastScannedResult] = useState<{
    name: string;
    id: string;
    status: string;
    time: string;
  } | null>(null);

  const [filterDate, setFilterDate] = useState('2026-11-01');
  const inputRef = useRef<HTMLInputElement>(null);

  // Play pleasant check-in chime using Web Audio API
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.12); // E6 note

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {
      console.log('Audio feedback not available', e);
    }
  };

  const [scanError, setScanError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Toggle Camera
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
        setScanError(null);
      } catch (err) {
        console.warn('Camera error or blocked:', err);
        setScanError('Tidak dapat mengakses kamera. Pastikan izin kamera diaktifkan atau gunakan scanner barcode / input manual di bawah.');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleProcessScan = (codeToScan: string) => {
    const raw = codeToScan.trim();
    if (!raw) return;
    setScanError(null);

    // Strip prefixes like NIS-, NIP-, or asterisk delimiters
    const clean = raw.replace(/^(NIS-|NIP-|\*)/gi, '').replace(/\*$/g, '').trim();

    // Check student or teacher
    let matchedName = '';
    let matchedClassOrSubject = '';
    let matchedId = '';

    if (selectedRole === 'Siswa') {
      const s = siswaList.find(
        (st) =>
          st.nis === clean ||
          st.nis === raw ||
          st.barcodeQR === raw ||
          st.barcodeQR === clean ||
          st.name.toLowerCase().includes(raw.toLowerCase())
      );
      if (s) {
        matchedName = s.name;
        matchedClassOrSubject = `Kelas ${s.class}`;
        matchedId = s.nis;
      }
    } else {
      const g = guruList.find(
        (t) =>
          t.nip === clean ||
          t.nip === raw ||
          t.name.toLowerCase().includes(raw.toLowerCase())
      );
      if (g) {
        matchedName = g.name;
        matchedClassOrSubject = g.subjectAssigned;
        matchedId = g.nip;
      }
    }

    if (!matchedName) {
      setScanError(`Kode "${raw}" tidak ditemukan dalam database ${selectedRole}. Silakan periksa kartu atau coba daftar di samping.`);
      return;
    }

    const now = new Date();
    const timeStr = now.toTimeString().substring(0, 8);
    const dateStr = filterDate || '2026-11-01';

    const newRecord: Absensi = {
      id: `ABS-${Date.now()}`,
      date: dateStr,
      time: timeStr,
      userStudentId: matchedId,
      name: matchedName,
      role: selectedRole,
      classOrSubject: matchedClassOrSubject,
      type: targetType,
      status: 'Present',
      verificationMethod: 'Barcode Scan',
    };

    onAddAbsensi(newRecord);
    playBeep();

    setLastScannedResult({
      name: matchedName,
      id: matchedId,
      status: `${targetType} Berhasil (${selectedRole})`,
      time: timeStr,
    });

    setScanInput('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProcessScan(scanInput);
  };

  // Today's stats
  const todayLogs = absensiList.filter((a) => a.date === filterDate);
  const presentCount = todayLogs.filter((a) => a.status === 'Present').length;
  const sickCount = todayLogs.filter((a) => a.status === 'Sick').length;
  const permitCount = todayLogs.filter((a) => a.status === 'Permit').length;

  return (
    <div className="space-y-6">
      {/* SCANNER CONSOLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Scanner Terminal (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1B3A33] text-[#CCA13B] flex items-center justify-center">
                  <Scan className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1B3A33]">
                    Terminal Pemindai Presensi Barcode & QR
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mendukung scanner gun USB, barcode kartu pelajar, dan QR code ponsel
                  </p>
                </div>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  soundEnabled
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-slate-100 text-slate-500'
                }`}
                title={soundEnabled ? 'Suara Chime Aktif' : 'Suara Bisu'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Target Settings: Role & Type */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Target Presensi
                </label>
                <div className="flex items-center p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('Siswa')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedRole === 'Siswa'
                        ? 'bg-white text-[#1B3A33] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Santri / Siswa
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('Guru')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedRole === 'Guru'
                        ? 'bg-white text-[#1B3A33] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Guru & Staf
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Jenis Presensi
                </label>
                <div className="flex items-center p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setTargetType('Check-in')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      targetType === 'Check-in'
                        ? 'bg-[#047857] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Masuk Pagi
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('Check-out')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      targetType === 'Check-out'
                        ? 'bg-[#CCA13B] text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pulang
                  </button>
                </div>
              </div>
            </div>

            {/* Live Camera / Scanner Viewport Frame */}
            <div className="mt-5 relative h-52 rounded-2xl bg-gradient-to-b from-[#1B3A33] to-[#122722] overflow-hidden flex flex-col items-center justify-center text-white border-2 border-[#CCA13B]/50 shadow-inner">
              {/* Actual Camera Feed if active */}
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : null}

              {/* Corner targeting brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#CCA13B] z-10" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#CCA13B] z-10" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#CCA13B] z-10" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#CCA13B] z-10" />

              {/* Animated Laser Scan Line */}
              <div className="w-56 h-0.5 bg-[#CCA13B] shadow-[0_0_14px_#CCA13B] animate-pulse z-10" />

              <div className="mt-4 text-center z-10 bg-black/40 px-4 py-2 rounded-xl backdrop-blur-xs">
                <QrCode className="w-8 h-8 text-emerald-300 mx-auto mb-1 opacity-90" />
                <p className="text-xs font-bold tracking-wider text-emerald-100 uppercase">
                  {isCameraActive ? 'Kamera Pemindai Aktif' : `Arahkan Barcode ${selectedRole} ke Scanner`}
                </p>
                <p className="text-[10px] text-white/70 mt-0.5">
                  Mendukung Barcode Kartu Pelajar (NIS) & Kartu GTK (NIP)
                </p>
              </div>

              {/* Camera Toggle Button inside viewport */}
              <button
                type="button"
                onClick={toggleCamera}
                className="absolute top-3 right-3 z-20 px-3 py-1 rounded-xl text-[10px] font-bold bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-[#CCA13B]" />
                <span>{isCameraActive ? 'Matikan Kamera' : 'Nyalakan Kamera HP'}</span>
              </button>
            </div>

            {/* Error Message Alert Banner */}
            {scanError && (
              <div className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span className="flex-1">{scanError}</span>
                <button
                  type="button"
                  onClick={() => setScanError(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  &times;
                </button>
              </div>
            )}

            {/* Input Form for Scanner Gun or Keyboard Input */}
            <form onSubmit={handleManualSubmit} className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={
                    selectedRole === 'Siswa'
                      ? 'Tempel / Scan kode NIS siswa (contoh: 232407001 atau NIS-232407001)...'
                      : 'Tempel / Scan kode NIP guru (contoh: 197504122005011002)...'
                  }
                  value={scanInput}
                  onChange={(e) => {
                    setScanInput(e.target.value);
                    if (scanError) setScanError(null);
                  }}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-[#047857]"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-98"
              >
                <span>Verifikasi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Instant Scan Confirmation Feedback */}
          {lastScannedResult && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-emerald-950 uppercase">
                    {lastScannedResult.name}
                  </h5>
                  <p className="text-[11px] text-emerald-800 font-mono">
                    ID: {lastScannedResult.id} · Pukul {lastScannedResult.time} WIB
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-200/70 px-2.5 py-1 rounded-full">
                {lastScannedResult.status}
              </span>
            </div>
          )}
        </div>

        {/* Right: Quick Test Roster / Click-to-Scan Simulation (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-[#E2EAE5] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-[#1B3A33]">
                Simulasi Barcode Cepat (Klik untuk Scan)
              </h4>
              <span className="text-[11px] text-slate-500">Klik 1 tombol untuk test</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 mb-3">
              Gunakan daftar berikut untuk mensimulasikan pemindaian kartu tanpa perlu alat barcode fisik:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {(selectedRole === 'Siswa' ? siswaList : guruList).map((person: any) => (
                <div
                  key={person.nis || person.nip}
                  onClick={() => handleProcessScan(person.nis || person.nip)}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-[#047857] hover:bg-emerald-50/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={person.photoUrl || person.avatarUrl}
                      alt={person.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#047857] truncate">
                        {person.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {person.nis ? `Kelas ${person.class} · NIS: ${person.nis}` : `NIP: ${person.nip}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#047857] group-hover:underline">
                    Scan Sekarang
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Counter Summary */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-800">Hadir</p>
              <p className="text-base font-extrabold text-emerald-950 tabular-nums">{presentCount}</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-100">
              <p className="text-[10px] font-bold text-amber-800">Sakit / Izin</p>
              <p className="text-base font-extrabold text-amber-950 tabular-nums">{sickCount + permitCount}</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-700">Tanggal</p>
              <p className="text-xs font-bold text-slate-900 mt-1">{filterDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S ATTENDANCE LOG TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#E2EAE5] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-base font-bold text-[#1B3A33]">
              Log Presensi Harian Real-Time
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Catatan riwayat pemindaian barcode masuk dan pulang
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-6">Waktu Scan</th>
                <th className="py-3.5 px-4">Nama Peserta / Guru</th>
                <th className="py-3.5 px-4">Peran & Kelas/Mapel</th>
                <th className="py-3.5 px-4 text-center">Tipe Presensi</th>
                <th className="py-3.5 px-4 text-center">Metode</th>
                <th className="py-3.5 px-6 text-right">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {todayLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-mono text-slate-700 font-bold">
                    {log.time} WIB
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{log.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">ID: {log.userStudentId}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800">{log.classOrSubject}</span>
                    <p className="text-[11px] text-slate-500">{log.role}</p>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        log.type === 'Check-in'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {log.type === 'Check-in' ? 'Masuk' : 'Pulang'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-600">
                    {log.verificationMethod}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      Tepat Waktu (Hadir)
                    </span>
                  </td>
                </tr>
              ))}
              {todayLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    Belum ada rekaman presensi pada tanggal {filterDate}. Silakan lakukan pemindaian di atas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
