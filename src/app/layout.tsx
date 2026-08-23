import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import UpdatePrompt from "@/components/UpdatePrompt";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Vehicle Tracker PWA",
  description: "Aplikasi monitoring kendaraan pribadi",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VehicleTracker",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-gray-50 text-slate-800 min-h-screen transition-colors duration-200">
        <Providers>
          <main className="max-w-md mx-auto min-h-screen flex flex-col pb-20">
            {children}
          </main>
          <UpdatePrompt />
        </Providers>
      </body>
    </html>
  );
}