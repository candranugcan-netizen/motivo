"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

/**
 * Komponen pembantu untuk mendeteksi Service Worker update
 * Menampilkan pesan di layar jika versi aplikasi baru telah di-deploy
 */
export default function UpdatePrompt() {
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    // Mengecek apakah Service Worker didukung oleh browser
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Event listener jika ada pembaharuan versi Service Worker
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                // Versi baru terdeteksi, munculkan pop-up pemberitahuan
                setShowReload(true);
              }
            };
          }
        };
      });
    }
  }, []);

  const handleReload = () => {
    // Menghapus cache browser dan mereload halaman penuh
    window.location.reload();
  };

  if (!showReload) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 p-4 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-between">
      <div className="text-sm font-medium">
        Versi baru aplikasi tersedia!
      </div>
      <button
        onClick={handleReload}
        className="flex items-center gap-1.5 bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 transition"
      >
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        Perbarui
      </button>
    </div>
  );
}