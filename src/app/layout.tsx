import './globals.css';
// ⚠️ FIX: Reemplazamos la fuente 'Geist' con 'Inter' para asegurar la compatibilidad en el entorno de Vercel.
import { Inter } from 'next/font/google';

// Configurar el font 'Inter' de Google Fonts
const inter = Inter({ 
  subsets: ['latin'],
  // Definir la variable CSS del font si es necesario
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
      {/* Aplicamos la clase del font 'Inter' al body */}
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
