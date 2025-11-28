'use client';

import React, { useState, useEffect } from 'react'; // Agregamos useState y useEffect
import { useAuth } from '@/context/AuthContext'; 
import { auth } from '@/firebase/config';
import ServiceManager from '@/components/ServiceManager'; 

import { LogOut, User as UserIcon, AlertTriangle, HelpCircle, Settings } from 'lucide-react';
import { signOut } from 'firebase/auth';

// Función para manejar el cierre de sesión
const handleLogout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

export default function Home() {
  const { userId, isAuthenticated, isLoading } = useAuth();
  const [showTimeoutHelp, setShowTimeoutHelp] = useState(false);

  // Verificación inmediata de configuración
  // Nota: Next.js reemplaza estas variables en tiempo de construcción.
  const isConfigMissing = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  // Detector de problemas: Si tarda más de 3 segundos, mostramos ayuda
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading && !isConfigMissing) {
      timer = setTimeout(() => {
        setShowTimeoutHelp(true);
      }, 3000); // Reducido a 3 segundos
    }
    return () => clearTimeout(timer);
  }, [isLoading, isConfigMissing]);

  // 0. Estado Crítico: Faltan Variables de Entorno (Detectado inmediatamente)
  if (isConfigMissing) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 p-6 text-center">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg border-l-8 border-red-600 animate-in zoom-in-95 duration-300">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <Settings size={48} className="text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Falta Configuración en Vercel</h2>
          <div className="text-left bg-red-50 p-4 rounded-lg mb-6 border border-red-100">
            <p className="text-red-800 font-medium mb-2">La aplicación no tiene las claves de Firebase.</p>
            <ol className="list-decimal list-inside text-sm text-red-700 space-y-1">
              <li>Ve a tu proyecto en <strong>Vercel</strong> &gt; <strong>Settings</strong>.</li>
              <li>Entra a <strong>Environment Variables</strong>.</li>
              <li>Copia las claves de tu archivo local <code>.env.local</code>.</li>
              <li>Guárdalas y haz <strong>Redeploy</strong>.</li>
            </ol>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
          >
            Ya las agregué, Recargar página
          </button>
        </div>
      </div>
    );
  }

  // 1. Estado de Carga (con ayuda inteligente si tarda mucho)
  if (isLoading) {
     return (
       <div className="flex flex-col justify-center items-center h-screen bg-slate-50 text-emerald-600 gap-4 p-6">
         
         {!showTimeoutHelp ? (
           <>
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
             <span className="animate-pulse font-medium">Conectando con Firebase...</span>
           </>
         ) : (
           <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full border border-orange-200 animate-in fade-in slide-in-from-bottom-4">
             <div className="flex items-center gap-3 mb-4 text-orange-600">
               <AlertTriangle size={32} />
               <h2 className="text-xl font-bold">Parece que hay un problema</h2>
             </div>
             
             <p className="text-gray-600 mb-4">
               La conexión está tardando más de lo normal. Posibles causas:
             </p>

             <div className="space-y-3 mb-6">
               <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                 <HelpCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                 <div>
                   <span className="font-bold text-gray-800 block">Autenticación Anónima Desactivada</span>
                   <p className="text-sm text-gray-600">
                     Asegúrate de haber habilitado el proveedor &quot;Anónimo&quot; en la consola de Firebase Authentication.
                   </p>
                 </div>
               </div>

               <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                 <Settings className="w-5 h-5 text-blue-500 mt-0.5" />
                 <div>
                   <span className="font-bold text-gray-800 block">¿Hiciste Redeploy?</span>
                   <p className="text-sm text-gray-600">
                     Si acabas de agregar las variables, debes ir a Deployments y hacer clic en <strong>Redeploy</strong> para que funcionen.
                   </p>
                 </div>
               </div>
             </div>

             <div className="text-center">
                <p className="text-xs text-gray-400 mb-2">Intentando reconectar...</p>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mx-auto"></div>
             </div>
           </div>
         )}
       </div>
     );
  }

  // 2. Estado de Error (Cargó, pero no hay usuario)
  if (!userId) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 p-4 text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md border-l-4 border-red-500">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error de Autenticación</h2>
          <p className="text-gray-600 mb-6">
            No se pudo iniciar sesión. Verifica la consola del navegador (F12) para ver el error exacto de Firebase.
          </p>
          <a 
            href="https://console.firebase.google.com/" 
            target="_blank" 
            className="inline-block bg-slate-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-700"
          >
            Ir a Firebase Console
          </a>
        </div>
      </div>
    );
  }

  // 3. Estado de Éxito (App Normal)
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
          {/* Tarjeta de Bienvenida */}
          <div className="text-center mb-10 bg-white p-6 rounded-xl shadow-lg border-t-4 border-emerald-500">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Panel de Administración</h2>
            <p className="text-gray-600">
              Gestiona tus servicios y actualiza la disponibilidad de cupos en tiempo real.
            </p>
          </div>
          
          {/* Gestor de Servicios y Disponibilidad */}
          <ServiceManager />

          {/* Información de Debug/Conexión */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Estado de Conexión</h3>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="text-sm text-emerald-800 break-all">
                <span className="font-bold">Tu ID de Negocio:</span> {userId}
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-500 border-t mt-8">
        Haylugar App © 2025. Desarrollado con Next.js, Tailwind y Firebase.
      </footer>
    </div>
  );
}