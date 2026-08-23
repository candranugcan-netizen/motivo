import withPWAInit from "@ducanh2912/next-pwa";

/**
 * Konfigurasi PWA dengan kompatibilitas Webpack & Turbopack
 */
const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Nonaktifkan PWA di mode dev
  register: true,
  skipWaiting: true,
  workboxOptions: {
    clientsClaim: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Objek turbopack kosong untuk mengizinkan penggunaan plugin Webpack PWA
  turbopack: {},
};

export default withPWA(nextConfig);