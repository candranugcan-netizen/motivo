"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Navbar from "@/components/Navbar";
import { Moon, Sun, Trash2, RefreshCw, ShieldCheck, User } from "lucide-react";

export default function ProfilePage() {
  // Gunakan resolvedTheme agar mendeteksi status "dark" atau "light" meskipun defaultnya "system"
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [msg, setMsg] = useState("");

  const appVersion = "1.0.0-pwa";

  // Memastikan komponen sudah di-mount di browser sebelum merender icon tema
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClearCache = async () => {
    setClearing(true);
    try {
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      localStorage.clear();
      setMsg("Cache berhasil dibersihkan. Memuat ulang aplikasi...");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch {
      setMsg("Gagal membersihkan cache.");
      setClearing(false);
    }
  };

  const isDark = resolvedTheme === "dark";

  return (
    <div className="p-4 flex-1">
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Profil & Pengaturan</h1>

      {/* Kartu Profil */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-600 text-white rounded-full">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Pemilik Kendaraan</h3>
          <p className="text-xs text-slate-400">PWA Personal Tracking Engine</p>
        </div>
      </div>

      {/* Toggle Dark Mode */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4 mb-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tampilan</h4>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Mode Gelap ({mounted ? (isDark ? "Aktif" : "Nonaktif") : "..."})
          </span>
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
          >
            {mounted && isDark ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {/* Cache Management */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-3 mb-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sistem & Cache PWA</h4>

        <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-300 py-1">
          <span>Versi Aplikasi</span>
          <span className="font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-800 dark:text-slate-200">{appVersion}</span>
        </div>

        {msg && <p className="text-xs text-blue-600 dark:text-blue-400 font-medium py-1">{msg}</p>}

        <button
          onClick={handleClearCache}
          disabled={clearing}
          className="w-full py-2.5 px-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition disabled:opacity-50"
        >
          {clearing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Bersihkan Cache & Paksa Update
        </button>
      </div>

      <div className="text-center text-xs text-slate-400 pt-4 flex items-center justify-center gap-1">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        Data tersimpan aman di Google Sheets
      </div>

      <Navbar />
    </div>
  );
}