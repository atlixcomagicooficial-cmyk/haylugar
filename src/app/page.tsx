import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import ServiceManager from '../components/ServiceManager';

// Función de utilidad para cerrar sesión (solo si el usuario no es anónimo)
const handleLogout = async () => {
  try {
    await signOut(auth);
    // Nota: El onAuthStateChanged en AuthContext se encargará de refrescar el estado.
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};


/**
 * Componente principal de la página de inicio.
 * Muestra el estado de autenticación y el ID de usuario.
 */
export default function Home() {
  // Obtenemos los datos de autenticación desde el contexto
  const { userId, currentUser, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Barra de Navegación Simple */}
      <header className="bg-emerald-700 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Haylugar</h1>
        {/* Botón de Logout */}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition duration-150"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        )}
      </header>

      {/* Contenido Principal */}
      <main className="flex-grow p-6 lg:p-10">

{/* ... tu código existente de estado de usuario ... */}
  
  <div className="mt-10 max-w-4xl mx-auto">
    <ServiceManager />
  </div>

        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Estado de la Aplicación (Firebase)</h2>
          
          <div className="space-y-4">
            {/* Estado de Autenticación */}
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm font-medium text-gray-500">Estado:</p>
              <p className={`text-lg font-bold ${isAuthenticated ? 'text-green-600' : 'text-orange-600'}`}>
                {isAuthenticated ? 'AUTENTICADO' : 'Anónimo / No Autenticado'}
              </p>
            </div>

            {/* User ID (Clave para Firestore) */}
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="text-sm font-medium text-emerald-700">ID Único de Usuario (userId):</p>
              <code className="block break-all text-sm bg-emerald-100 p-2 rounded font-mono text-emerald-800 mt-1">
                {userId || 'Cargando...'}
              </code>
              <p className="text-xs mt-2 text-emerald-600">
                Este ID es crucial para almacenar datos privados del usuario en Firestore.
              </p>
            </div>

            {/* Información Adicional del Usuario (si está disponible) */}
            {currentUser && currentUser.isAnonymous && (
               <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-700">Tipo de Sesión:</p>
                  <p className="text-md text-yellow-800">Sesión Anónima (Proporcionada por el entorno de desarrollo).</p>
               </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Próximo Paso</h3>
            <p className="text-gray-600">
              Ahora que la autenticación está verificada, el siguiente paso es crear el componente para **gestionar la disponibilidad de un negocio** (el corazón de "Haylugar") y conectarlo a Firestore.
            </p>
          </div>
        </div>
      </main>
      
      {/* Pie de página */}
      <footer className="p-4 text-center text-sm text-gray-500 border-t mt-8">
        Haylugar App. Desarrollado con Next.js y Firebase.
      </footer>
    </div>
  );
}
