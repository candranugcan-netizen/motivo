// Interface data kendaraan
export interface Vehicle {
  id: string;
  nama_kendaraan: string;
  plat_nomor: string;
  odometer_saat_ini: number;
  tgl_ganti_oli_terakhir: string; // Format ISO: YYYY-MM-DD
  km_ganti_oli_terakhir: number;
  last_updated: string;
}

// Interface data riwayat servis
export interface MaintenanceLog {
  id: string;
  vehicle_id: string;
  tanggal: string;
  jenis_servis: string;
  odometer: number;
  biaya: number;
  catatan: string;
}

// Interface data pengisian BBM
export interface FuelLog {
  id: string;
  vehicle_id: string;
  tanggal: string;
  odometer: number;
  liter: number;
  total_biaya: number;
}

// Status Hasil Evaluasi Oli
export interface OilStatusResult {
  status: "SAFE" | "WARNING" | "DANGER"; // SAFE: Aman, WARNING: Mendekati batas, DANGER: Lewat batas
  kmDiff: number; // Selisih KM yang sudah ditempuh sejak ganti oli
  daysDiff: number; // Selisih hari yang sudah lewat sejak ganti oli
  kmRemaining: number; // Sisa KM menuju batas 2000 KM
  daysRemaining: number; // Sisa hari menuju batas 60 hari
  reason: string; // Pesan deskriptif status
}