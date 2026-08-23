"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useVehicle } from "@/context/VehicleContext";
import { Wrench, Fuel, Check } from "lucide-react";

// Opsi Jenis Servis
const SERVICE_OPTIONS = [
  "Ganti Oli Mesin",
  "Ganti Oli Transmisi/Gardan",
  "Ganti Minyak Rem",
  "Ganti Air Radiator (Coolant)",
  "Tune Up / Servis Berkala",
  "Ganti Busi",
  "Ganti Filter Udara",
  "Ganti Filter Bensin/AC",
  "Ganti Kampas Rem",
  "Ganti Ban",
  "Spooring & Balancing",
  "Servis Suspensi/Shockbreaker",
  "Ganti Aki",
  "Servis AC",
  "Ganti Lampu/Kelistrikan",
  "Perbaikan Bodikit/Cat",
  "Cuci & Detailing",
  "Lain-lain",
];

export default function InputPage() {
  const router = useRouter();
  const { selectedVehicle, addMaintenance, addFuel } = useVehicle();
  const [tab, setTab] = useState<"service" | "fuel">("service");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // State Form Servis
  const [serviceForm, setServiceForm] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    jenis_servis: "Ganti Oli Mesin",
    odometer: selectedVehicle?.odometer_saat_ini || "",
    biaya: "",
    catatan: "",
  });

  // State Form BBM
  const [fuelForm, setFuelForm] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    odometer: selectedVehicle?.odometer_saat_ini || "",
    liter: "",
    total_biaya: "",
  });

  if (!selectedVehicle) {
    return (
      <div className="p-4 text-center py-12 text-slate-400 text-sm">
        Pilih atau buat kendaraan terlebih dahulu di Dashboard.
        <Navbar />
      </div>
    );
  }

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await addMaintenance({
      vehicle_id: selectedVehicle.id,
      tanggal: serviceForm.tanggal,
      jenis_servis: serviceForm.jenis_servis,
      odometer: Number(serviceForm.odometer),
      biaya: Number(serviceForm.biaya),
      catatan: serviceForm.catatan,
    });

    setIsSubmitting(false);
    setSuccessMsg("Catatan servis berhasil disimpan!");
    setTimeout(() => {
      setSuccessMsg("");
      router.push("/");
    }, 1200);
  };

  const handleFuelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await addFuel({
      vehicle_id: selectedVehicle.id,
      tanggal: fuelForm.tanggal,
      odometer: Number(fuelForm.odometer),
      liter: Number(fuelForm.liter),
      total_biaya: Number(fuelForm.total_biaya),
    });

    setIsSubmitting(false);
    setSuccessMsg("Catatan BBM berhasil disimpan!");
    setTimeout(() => {
      setSuccessMsg("");
      router.push("/");
    }, 1200);
  };

  return (
    <div className="p-4 flex-1">
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Catat Aktivitas</h1>
      <p className="text-xs text-slate-500 mb-4">Kendaraan: <span className="font-semibold text-blue-600">{selectedVehicle.nama_kendaraan}</span></p>

      {/* Tab Switcher */}
      <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl mb-4">
        <button
          onClick={() => setTab("service")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
            tab === "service" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500"
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          Servis & Perawatan
        </button>
        <button
          onClick={() => setTab("fuel")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
            tab === "fuel" ? "bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm" : "text-slate-500"
          }`}
        >
          <Fuel className="w-3.5 h-3.5" />
          Isi BBM
        </button>
      </div>

      {successMsg && (
        <div className="p-3 mb-4 bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {/* Form Servis */}
      {tab === "service" ? (
        <form onSubmit={handleServiceSubmit} className="space-y-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div>
            <label className="text-xs font-semibold text-slate-500">Jenis Perawatan/Servis</label>
            <select
              value={serviceForm.jenis_servis}
              onChange={(e) => setServiceForm({ ...serviceForm, jenis_servis: e.target.value })}
              className="w-full mt-1 p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Tanggal</label>
            <input
              type="date"
              required
              value={serviceForm.tanggal}
              onChange={(e) => setServiceForm({ ...serviceForm, tanggal: e.target.value })}
              className="w-full mt-1 p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Odometer Saat Servis (KM)</label>
            <input
              type="number"
              required
              placeholder="Contoh: 15200"
              value={serviceForm.odometer}
              onChange={(e) => setServiceForm({ ...serviceForm, odometer: e.target.value })}
              className="w-full mt-1 p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Total Biaya (Rp)</label>
            <input
              type="number"
              required
              placeholder="0"
              value={serviceForm.biaya}
              onChange={(e) => setServiceForm({ ...serviceForm, biaya: e.target.value })}
              className="w-full mt-1 p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Catatan Tambahan (Opsional)</label>
            <textarea
              rows={2}
              placeholder="Merek oli, bengkel, Garansi, dll."
              value={serviceForm.catatan}
              onChange={(e) => setServiceForm({ ...serviceForm, catatan: e.target.value })}
              className="w-full mt-1 p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-500/20 disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Catatan Servis"}
          </button>
        </form>
      ) : (
        /* Form BBM */
        <form onSubmit={handleFuelSubmit} className="space-y-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div>
            <label className="text-xs font-semibold text-slate-500">Tanggal Pengisian</label>
            <input
              type="date"
              required
              value={fuelForm.tanggal}
              onChange={(e) => setFuelForm({ ...fuelForm, tanggal: e.target.value })}
              className="w-full mt-1 p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Odometer Saat Isi BBM (KM)</label>
            <input
              type="number"
              required
              placeholder="Contoh: 15200"
              value={fuelForm.odometer}
              onChange={(e) => setFuelForm({ ...fuelForm, odometer: e.target.value })}
              className="w-full mt-1 p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Jumlah Bahan Bakar (Liter)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="Contoh: 4.5"
              value={fuelForm.liter}
              onChange={(e) => setFuelForm({ ...fuelForm, liter: e.target.value })}
              className="w-full mt-1 p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Total Biaya Pengisian (Rp)</label>
            <input
              type="number"
              required
              placeholder="0"
              value={fuelForm.total_biaya}
              onChange={(e) => setFuelForm({ ...fuelForm, total_biaya: e.target.value })}
              className="w-full mt-1 p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 bg-amber-500 text-white font-bold text-sm rounded-xl hover:bg-amber-600 transition shadow-md shadow-amber-500/20 disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Catatan BBM"}
          </button>
        </form>
      )}

      <Navbar />
    </div>
  );
}