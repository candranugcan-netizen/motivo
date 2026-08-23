"use client";

import { AlertTriangle, CheckCircle, Droplets } from "lucide-react";
import { Vehicle } from "@/types";
import { evaluateOilStatus } from "@/lib/reminder";

interface Props {
  vehicle: Vehicle;
}

/**
 * Kartu Peringatan Servis Oli Mesin
 * Menghitung interval jarak (2.000 KM) dan interval waktu (60 Hari)
 */
export default function OilReminderCard({ vehicle }: Props) {
  const result = evaluateOilStatus(vehicle);

  // Konfigurasi warna status
  const theme = {
    SAFE: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      border: "border-emerald-500/30",
      text: "text-emerald-600 dark:text-emerald-400",
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      title: "Kondisi Oli Mesin Prima",
    },
    WARNING: {
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
      border: "border-amber-500/30",
      text: "text-amber-600 dark:text-amber-400",
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      title: "Persiapan Ganti Oli Mesin",
    },
    DANGER: {
      bg: "bg-rose-500/10 dark:bg-rose-500/20",
      border: "border-rose-500/30",
      text: "text-rose-600 dark:text-rose-400",
      icon: <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />,
      title: "WAKTU GANTI OLI MESIN!",
    },
  }[result.status];

  return (
    <div className={`p-4 rounded-2xl border ${theme.bg} ${theme.border} transition-all mb-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets className={`w-5 h-5 ${theme.text}`} />
          <h4 className={`font-bold text-sm ${theme.text}`}>{theme.title}</h4>
        </div>
        {theme.icon}
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-3">{result.reason}</p>

      {/* Grid Status Jarak & Waktu */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white/60 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          <span className="text-slate-400 block mb-0.5">Sudah Ditempuh</span>
          <span className="font-bold text-slate-800 dark:text-slate-100">{result.kmDiff.toLocaleString()} / 2.000 KM</span>
        </div>
        <div className="bg-white/60 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          <span className="text-slate-400 block mb-0.5">Waktu Penggunaan</span>
          <span className="font-bold text-slate-800 dark:text-slate-100">{result.daysDiff} / 60 Hari</span>
        </div>
      </div>
    </div>
  );
}