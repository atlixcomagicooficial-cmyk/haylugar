import './globals.css';
import { Inter } from 'next/font/google';
// ✅ FIX: Usamos el alias '@/' para importar AuthProvider de forma segura
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

// ✅ FIX: Esto solo funciona si el componente es Server Side (sin 'use client')
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
