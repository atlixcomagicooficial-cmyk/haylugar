'use client';

// IMPORTACIÓN CLAVE: Subimos un nivel (..) para salir de 'app' y entramos a 'context'
// Esto conecta con el archivo src/context/AuthContext.tsx que tienes actualmente.
import { useAuth } from '@/context/AuthContext'; 

import { LogOut, User as UserIcon } from 'lucide-react';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import ServiceManager from '../components/ServiceManager'; // Importamos el componente ServiceManager

// Función de utilidad para cerrar sesión
const handleLogout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

/**
 * Componente principal de la página de inicio.
 * Muestra el estado de autenticación y el ID de usuario, y renderiza el gestor de servicios.
 */
export default function Home() {
  // Obtenemos los datos de autenticación desde el contexto
  const { userId, currentUser, isAuthenticated } = useAuth();

  // Si el AuthContext está cargando o no hay usuario, mostramos una pantalla de carga
  if (!userId) {
     return (
       <div className="flex justify-center items-center h-screen bg-slate-50 text-emerald-600">
         Cargando aplicación...
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Barra de Navegación */}
      <header className="bg-emerald-700 text-white p-4 shadow-xl flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold tracking-wider">HAYLUGAR ADMIN</h1>
        
        {/* Información de Usuario y Botón de Logout */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-sm bg-emerald-600 px-3 py-1 rounded-full">
            <UserIcon className="w-4 h-4" />
            {/* Mostrar los primeros 8 caracteres del userId para identificación visual */}
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
          {/* Bienvenida e Instrucciones */}
          <div className="text-center mb-10 bg-white p-6 rounded-xl shadow-lg border-t-4 border-emerald-500">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Panel de Administración</h2>
            <p className="text-gray-600">
              Gestiona tus servicios y actualiza la disponibilidad de cupos en tiempo real.
            </p>
          </div>
          
          {/* Integración del Gestor de Servicios (Incluye disponibilidad) */}
          <ServiceManager />

          {/* Sección de Información de Conexión (Pie de contenido) */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Estado de Conexión</h3>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="text-sm text-emerald-800 break-all">
                <span className="font-bold">Tu ID de Negocio (Firebase UID):</span> {userId}
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Pie de página */}
      <footer className="p-4 text-center text-sm text-gray-500 border-t mt-8">
        Haylugar App © 2025. Desarrollado con Next.js, Tailwind y Firebase.
      </footer>
    </div>
  );
}
