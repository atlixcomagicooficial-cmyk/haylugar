"use client";

import { useAuth } from "@/context/AuthContext";
import ServiceManager from "@/components/ServiceManager";

import { LogOut, User as UserIcon } from "lucide-react";
import { signOut } from "firebase/auth";

export default function Home() {
  const { userId, isAuthenticated } = useAuth();

  // 🔥 IMPORTANTE: auth solo se usa aquí dentro, nunca en imports
  const handleLogout = async () => {
    try {
      // Obtiene auth desde window sin importar en SSR
      const { auth } = await import("@/firebase/config");

      if (!auth) return; // ← Protección SSR

      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (!userId) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 text-emerald-600">
        Cargando aplicación...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-emerald-700 text-white p-4 shadow-xl flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold tracking-wider">HAYLUGAR ADMIN</h1>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-sm bg-emerald-600 px-3 py-1 rounded-full">
            <UserIcon className="w-4 h-4" />
            <span className="font-semibold">{userId.substring(0, 8)}...</span>
          </div>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition duration-150 shadow-md"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Cerrar Sesión</span>
            </button>
          )}
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-grow p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 bg-white p-6 rounded-xl shadow-lg border-t-4 border-emerald-500">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Panel de Administración
            </h2>
            <p className="text-gray-600">
              Gestiona tus servicios y actualiza la disponibilidad de cupos en tiempo real.
            </p>
          </div>

          <ServiceManager />

          <div className="mt-12 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              Estado de Conexión
            </h3>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="text-sm text-emerald-800 break-all">
                <span className="font-bold">Tu ID de Negocio:</span> {userId}
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-gray-500 border-t mt-8">
        Haylugar App © 2025. Desarrollado con Next.js, Tailwind y Firebase.
      </footer>
    </div>
  );
}
