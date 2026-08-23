import { Vehicle, MaintenanceLog, FuelLog } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_GAS_API_URL || "";
const LOCAL_STORAGE_KEY = "vehicle_tracker_cache";
const OFFLINE_QUEUE_KEY = "vehicle_tracker_offline_queue";

interface CacheData {
  vehicles: Vehicle[];
  maintenance: MaintenanceLog[];
  fuel: FuelLog[];
  lastSynced: string;
}

/**
 * Membaca data cache dari LocalStorage
 */
export function getLocalCache(): CacheData {
  if (typeof window === "undefined") return { vehicles: [], maintenance: [], fuel: [], lastSynced: "" };
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : { vehicles: [], maintenance: [], fuel: [], lastSynced: "" };
}

/**
 * Menyimpan data terbaru ke LocalStorage
 */
export function saveLocalCache(data: Partial<CacheData>) {
  if (typeof window === "undefined") return;
  const current = getLocalCache();
  const updated = { ...current, ...data, lastSynced: new Date().toISOString() };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Mengambil seluruh data dari Google Apps Script API.
 * Jika offline/gagal, otomatis menggunakan data LocalStorage.
 */
export async function fetchAllData(): Promise<CacheData> {
  try {
    if (!navigator.onLine) {
      return getLocalCache();
    }

    const res = await fetch(`${API_URL}?action=getAllData`, { cache: "no-store" });
    const result = await res.json();

    if (result.status === "success") {
      saveLocalCache(result.data);
      return { ...result.data, lastSynced: new Date().toISOString() };
    } else {
      return getLocalCache();
    }
  } catch (error) {
    console.warn("Gagal fetching dari API, menggunakan LocalStorage:", error);
    return getLocalCache();
  }
}

/**
 * Mengirimkan payload ke Google Apps Script.
 * Jika perangkat dalam keadaan offline, transaksi dimasukkan ke dalam antrean offline queue.
 */
export async function sendPostData(payload: Record<string, unknown>) {
  if (!navigator.onLine) {
    // Simpan ke antrean offline jika jaringan tidak ada
    const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]");
    queue.push(payload);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    return { status: "offline_queued", message: "Data tersimpan offline. Akan disinkronkan saat terhubung internet." };
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" }, // GAS mensyaratkan text/plain agar menghindari preflight CORS issue
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    // Jika fetch gagal (koneksi terputus tiba-tiba)
    const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]");
    queue.push(payload);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    return { status: "offline_queued", message: "Gagal terhubung API. Data disimpan sementara secara lokal." };
  }
}

/**
 * Memproses dan menyinkronkan seluruh antrean transaksi offline ke Google Sheets
 */
export async function syncOfflineQueue(): Promise<number> {
  if (typeof window === "undefined" || !navigator.onLine) return 0;

  const queue: Array<Record<string, unknown>> = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]");
  if (queue.length === 0) return 0;

  let syncedCount = 0;
  const remainingQueue = [];

  for (const item of queue) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(item),
      });
      const result = await res.json();
      if (result.status === "success") {
        syncedCount++;
      } else {
        remainingQueue.push(item);
      }
    } catch {
      remainingQueue.push(item);
    }
  }

  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remainingQueue));
  return syncedCount;
}