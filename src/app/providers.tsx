"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";
import { VehicleProvider } from "@/context/VehicleContext"; // Import VehicleProvider

/**
 * Wrapper Provider Gabungan untuk Client Components
 * Memastikan ThemeProvider dan VehicleProvider berada dalam satu pohon konteks React
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <VehicleProvider>
        {children}
      </VehicleProvider>
    </NextThemesProvider>
  );
}