"use client";

import Navbar from "@/components/Navbar";
import VehicleSelector from "@/components/VehicleSelector";
import OilReminderCard from "@/components/OilReminderCard";
import { useVehicle } from "@/context/VehicleContext";
import { Gauge, Wrench, Fuel, Calendar } from "lucide-react";

// Fungsi format tanggal (Versi Paling Kebal)
const formatTanggal = (rawVal?: any) => {
  if (!rawVal || rawVal === "-") return "-";
  
  try {
    // 1. Paksa ubah ke String apa pun bentuk datanya
    const str = String(rawVal);
    
    // 2. Potong langsung di huruf "T" (untuk membuang T17:00:00.000Z)
    const datePart = str.split("T")[0]; 
    
    // 3. Pecah berdasarkan strip "-"
    const parts = datePart.split("-");
    if (parts.length !== 3) return str; // Kembalikan string mentah jika gagal

    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parts[2];

    const namaBulan = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
      "Jul", "Agt", "Sep", "Okt", "Nov", "Des"
    ];
    
    return `${day} ${namaBulan[monthIndex]} ${year}`;
  } catch (error) {
    return "Error Format"; // Tampilkan tulisan ini jika benar-benar gagal
  }
};

export default function Dashboard() {
  const { selectedVehicle, maintenanceLogs, fuelLogs, isLoading } = useVehicle();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 flex-1">
      {/* Header Aplikasi */}
      <header className="mb-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Vehicle Tracker</h1>
        <p className="text-xs text-slate-500">Monitoring perawatan & efisiensi kendaraan</p>
      </header>

      {/* Selector Kendaraan */}
      <VehicleSelector />

      {selectedVehicle ? (
        <>
          {/* Engine Pengingat Oli */}
          <OilReminderCard vehicle={selectedVehicle} />

          {/* Metric Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                <Gauge className="w-4 h-4" />
                <span className="text-xs text-slate-400 font-medium">Odometer Saat Ini</span>
              </div>
              <p className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
                {Number(selectedVehicle.odometer_saat_ini).toLocaleString("id-ID")} <span className="text-xs font-normal">KM</span>
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs text-slate-400 font-medium">Oli Terakhir</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1">
                {/* Format tanggal diterapkan di sini */}
                {formatTanggal(selectedVehicle.tgl_ganti_oli_terakhir)}
              </p>
            </div>
          </div>

          {/* Riwayat Aktivitas Terbaru */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-500" />
              Catatan Servis Terakhir
            </h3>

            {maintenanceLogs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Belum ada riwayat servis recorded</p>
            ) : (
              <div className="space-y-2.5">
                {maintenanceLogs.slice(-3).reverse().map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{item.jenis_servis}</span>
                      {/* Format tanggal diterapkan di sini */}
                      <span className="text-slate-400">{formatTanggal(item.tanggal)} • {Number(item.odometer).toLocaleString("id-ID")} KM</span>
                    </div>
                    <span className="font-semibold text-rose-500 dark:text-rose-400">
                      Rp {Number(item.biaya).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Riwayat Pengisian BBM Terbaru */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Fuel className="w-4 h-4 text-amber-500" />
              Catatan BBM Terakhir
            </h3>

            {fuelLogs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Belum ada riwayat pengisian BBM</p>
            ) : (
              <div className="space-y-2.5">
                {fuelLogs.slice(-3).reverse().map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{item.liter} Liter</span>
                      {/* Format tanggal diterapkan di sini */}
                      <span className="text-slate-400">{formatTanggal(item.tanggal)} • Odo: {Number(item.odometer).toLocaleString("id-ID")} KM</span>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Rp {Number(item.total_biaya).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-slate-400 text-sm">
          Silakan tambah kendaraan terlebih dahulu untuk memulai pencatatan.
        </div>
      )}

      <Navbar />
    </div>
  );
}