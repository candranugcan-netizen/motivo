import { Vehicle, OilStatusResult } from "@/types";

// Batas toleransi interval ganti oli
const MAX_OIL_KM = 2000; // Maksimal 2.000 KM
const MAX_OIL_DAYS = 60; // Maksimal 60 Hari (2 Bulan)

/**
 * Menghitung dan mendiagnosis apakah kendaraan sudah waktunya ganti oli mesin.
 * Evaluasi dilakukan berbasis jarak (KM) dan berbasis waktu (Hari).
 */
export function evaluateOilStatus(vehicle: Vehicle): OilStatusResult {
  const currentOdo = Number(vehicle.odometer_saat_ini) || 0;
  const lastOilOdo = Number(vehicle.km_ganti_oli_terakhir) || 0;

  // 1. Hitung selisih jarak tempuh
  const kmDiff = Math.max(0, currentOdo - lastOilOdo);
  const kmRemaining = MAX_OIL_KM - kmDiff;

  // 2. Hitung selisih hari dari tanggal ganti oli terakhir
  const lastDate = vehicle.tgl_ganti_oli_terakhir
    ? new Date(vehicle.tgl_ganti_oli_terakhir)
    : new Date();
  const today = new Date();

  // Konversi selisih millisecond ke hitungan hari
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  const daysDiff = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const daysRemaining = MAX_OIL_DAYS - daysDiff;

  // 3. Evaluasi Kriteria Bahaya (DANGER)
  if (kmDiff >= MAX_OIL_KM || daysDiff >= MAX_OIL_DAYS) {
    let reason = "Sudah melebihi batas ";
    if (kmDiff >= MAX_OIL_KM && daysDiff >= MAX_OIL_DAYS) {
      reason += "jarak (2.000 KM) dan waktu (2 bulan)!";
    } else if (kmDiff >= MAX_OIL_KM) {
      reason += "jarak tempuh (2.000 KM)!";
    } else {
      reason += "waktu (2 bulan)!";
    }

    return { status: "DANGER", kmDiff, daysDiff, kmRemaining, daysRemaining, reason };
  }

  // 4. Evaluasi Kriteria Peringatan (WARNING) - Jika sudah mencapai 80% dari limit
  if (kmDiff >= MAX_OIL_KM * 0.8 || daysDiff >= MAX_OIL_DAYS * 0.8) {
    return {
      status: "WARNING",
      kmDiff,
      daysDiff,
      kmRemaining,
      daysRemaining,
      reason: "Mendekati jadwal ganti oli. Persiapkan perawatan kendaraan.",
    };
  }

  // 5. Kondisi Aman (SAFE)
  return {
    status: "SAFE",
    kmDiff,
    daysDiff,
    kmRemaining,
    daysRemaining,
    reason: "Kondisi oli mesin masih prima.",
  };
}