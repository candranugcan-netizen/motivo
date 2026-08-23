"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, User, WifiOff } from "lucide-react";
import { useVehicle } from "@/context/VehicleContext";

/**
 * Navigation Bar Bawah khusus perangkat mobile
 * Menyediakan tautan cepat ke Dashboard, Form Input, dan Profil.
 */
export default function Navbar() {
  const pathname = usePathname();
  const { isOnline } = useVehicle();

  // Helper untuk menentukan apakah menu sedang aktif
  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Indikator Status Offline */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-slate-900 text-xs font-semibold py-1 px-3 text-center flex items-center justify-center gap-1.5 shadow-sm">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Mode Offline: Transaksi disimpan secara lokal</span>
        </div>
      )}

      {/* Navigasi Bawah Stasioner */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 max-w-md mx-auto">
        <div className="flex justify-around items-center h-16">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
              isActive("/") ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/input"
            className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
              isActive("/input") ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <PlusCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Catat</span>
          </Link>

          <Link
            href="/profile"
            className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
              isActive("/profile") ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profil</span>
          </Link>
        </div>
      </nav>
    </>
  );
}