"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Vehicle, MaintenanceLog, FuelLog } from "@/types";
import { fetchAllData, syncOfflineQueue, sendPostData } from "@/lib/api";

interface VehicleContextType {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  setSelectedVehicleId: (id: string) => void;
  maintenanceLogs: MaintenanceLog[];
  fuelLogs: FuelLog[];
  isLoading: boolean;
  isOnline: boolean;
  refreshData: () => Promise<void>;
  addVehicle: (data: Omit<Vehicle, "id" | "last_updated">) => Promise<boolean>;
  addMaintenance: (data: Omit<MaintenanceLog, "id">) => Promise<boolean>;
  addFuel: (data: Omit<FuelLog, "id">) => Promise<boolean>;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleIdState] = useState<string>("");
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Memuat data pertama kali dan mendaftarkan listener koneksi internet
  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = async () => {
      setIsOnline(true);
      // Eksekusi sinkronisasi antrean data offline jika perangkat kembali terkoneksi internet
      const count = await syncOfflineQueue();
      if (count > 0) {
        await refreshData();
      }
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Ambil data awal
    refreshData();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fungsi memuat/memperbarui data dari API atau LocalStorage
  const refreshData = async () => {
    setIsLoading(true);
    const data = await fetchAllData();
    setVehicles(data.vehicles || []);
    setMaintenanceLogs(data.maintenance || []);
    setFuelLogs(data.fuel || []);

    // Pilih kendaraan pertama jika belum ada kendaraan yang dipilih
    if (data.vehicles && data.vehicles.length > 0 && !selectedVehicleId) {
      setSelectedVehicleIdState(data.vehicles[0].id);
    }
    setIsLoading(false);
  };

  const setSelectedVehicleId = (id: string) => {
    setSelectedVehicleIdState(id);
  };

  // Kendaraan aktif saat ini
  const selectedVehicle = vehicles.find((v) => String(v.id) === String(selectedVehicleId)) || vehicles[0] || null;

  // Aksi Tambah Kendaraan Baru
  const addVehicle = async (data: Omit<Vehicle, "id" | "last_updated">) => {
    const res = await sendPostData({ action: "addVehicle", ...data });
    await refreshData();
    return res.status === "success" || res.status === "offline_queued";
  };

  // Aksi Catat Servis
  const addMaintenance = async (data: Omit<MaintenanceLog, "id">) => {
    const res = await sendPostData({ action: "addMaintenance", ...data });
    await refreshData();
    return res.status === "success" || res.status === "offline_queued";
  };

  // Aksi Catat BBM
  const addFuel = async (data: Omit<FuelLog, "id">) => {
    const res = await sendPostData({ action: "addFuel", ...data });
    await refreshData();
    return res.status === "success" || res.status === "offline_queued";
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        selectedVehicle,
        setSelectedVehicleId,
        maintenanceLogs: maintenanceLogs.filter((m) => String(m.vehicle_id) === String(selectedVehicle?.id)),
        fuelLogs: fuelLogs.filter((f) => String(f.vehicle_id) === String(selectedVehicle?.id)),
        isLoading,
        isOnline,
        refreshData,
        addVehicle,
        addMaintenance,
        addFuel,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

/**
 * Custom Hook untuk memanggil state kendaraan di semua komponen
 */
export function useVehicle() {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error("useVehicle harus digunakan di dalam VehicleProvider");
  }
  return context;
}