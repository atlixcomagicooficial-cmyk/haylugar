"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext'; // Ajusta la ruta según tu estructura

// Fuente de Google
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Haylugar - Encuentra tu espacio',
  description: 'Marketplace de disponibilidad en tiempo real para negocios.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        {/* Envolvemos toda la app en el AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
