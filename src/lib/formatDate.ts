// src/lib/formatDate.ts

export function formatTanggal(isoString: string | undefined): string {
  if (!isoString) return "-";
  
  const date = new Date(isoString);
  
  // Mengubah ke format lokal: 22 Agt 2026, 17:00
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}