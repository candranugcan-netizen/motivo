"use client";

import { useState } from "react";
import { Plus, Car } from "lucide-react";
import { useVehicle } from "@/context/VehicleContext";

/**
 * Dropdown pemilih kendaraan aktif & Modal penambahan kendaraan baru
 */
export default function VehicleSelector() {
  const { vehicles, selectedVehicle, setSelectedVehicleId, addVehicle } = useVehicle();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [form, setForm] = useState({
    nama_kendaraan: "",
    plat_nomor: "",
    odometer_saat_ini: "",
    tgl_ganti_oli_terakhir: new Date().toISOString().split("T")[0],
    km_ganti_oli_terakhir: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama_kendaraan || !form.plat_nomor) return;

    await addVehicle({
      nama_kendaraan: form.nama_kendaraan,
      plat_nomor: form.plat_nomor,
      odometer_saat_ini: Number(form.odometer_saat_ini) || 0,
      tgl_ganti_oli_terakhir: form.tgl_ganti_oli_terakhir,
      km_ganti_oli_terakhir: Number(form.km_ganti_oli_terakhir) || Number(form.odometer_saat_ini) || 0,
    });

    setIsOpenModal(false);
    setForm({
      nama_kendaraan: "",
      plat_nomor: "",
      odometer_saat_ini: "",
      tgl_ganti_oli_terakhir: new Date().toISOString().split("T")[0],
      km_ganti_oli_terakhir: "",
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-xl">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <label className="text-xs text-slate-400 dark:text-slate-400 font-medium block">Pilih Kendaraan</label>
            {vehicles.length > 0 ? (
              <select
                value={selectedVehicle?.id || ""}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id} className="dark:bg-slate-800">
                    {v.nama_kendaraan} ({v.plat_nomor})
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm font-semibold text-slate-500">Belum Ada Kendaraan</span>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsOpenModal(true)}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-md shadow-blue-500/20"
          title="Tambah Kendaraan"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Tambah Kendaraan */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Tambah Kendaraan Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500">Nama Kendaraan</label>
                <input
                  type="text"
                  placeholder="Contoh: Honda Vario / Avanza"
                  required
                  value={form.nama_kendaraan}
                  onChange={(e) => setForm({ ...form, nama_kendaraan: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Plat Nomor</label>
                <input
                  type="text"
                  placeholder="Contoh: B 1234 ABC"
                  required
                  value={form.plat_nomor}
                  onChange={(e) => setForm({ ...form, plat_nomor: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Odometer Saat Ini (KM)</label>
                <input
                  type="number"
                  placeholder="15000"
                  required
                  value={form.odometer_saat_ini}
                  onChange={(e) => setForm({ ...form, odometer_saat_ini: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Tanggal Ganti Oli Terakhir</label>
                <input
                  type="date"
                  value={form.tgl_ganti_oli_terakhir}
                  onChange={(e) => setForm({ ...form, tgl_ganti_oli_terakhir: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="flex-1 py-2.5 rounded-xl border dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}