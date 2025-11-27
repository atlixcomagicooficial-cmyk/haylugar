'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { Trash2, Plus, Store, Loader2 } from 'lucide-react';

// Definimos la interfaz del Servicio
interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  spots: number;
  description: string;
  ownerId: string;
}

export default function ServiceManager() {
  const { userId } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    name: '',
    category: 'restaurant',
    price: '',
    spots: '',
    description: ''
  });

  // 1. Suscribirse a los datos de Firestore en tiempo real
  useEffect(() => {
    if (!userId) return;

    // Referencia a la colección 'services' dentro de la estructura de artifactos del canvas
    // NOTA: Usamos una ruta específica para este entorno demo. En producción sería simplemente 'services'
    const appId = typeof window !== 'undefined' ? (window as any).__app_id || 'default-app-id' : 'default-app-id';
    const servicesRef = collection(db, 'artifacts', appId, 'public', 'data', 'services');

    // Query: Dame solo los servicios donde ownerId == mi userId
    const q = query(servicesRef, where('ownerId', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[];
      setServices(data);
      setLoading(false);
    }, (error) => {
      console.error("Error al leer servicios:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // 2. Manejar la creación de un nuevo servicio
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setIsSubmitting(true);

    try {
      const appId = (window as any).__app_id || 'default-app-id';
      const servicesRef = collection(db, 'artifacts', appId, 'public', 'data', 'services');

      await addDoc(servicesRef, {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        spots: Number(formData.spots),
        description: formData.description,
        ownerId: userId,
        createdAt: serverTimestamp(),
      });

      // Limpiar formulario
      setFormData({
        name: '',
        category: 'restaurant',
        price: '',
        spots: '',
        description: ''
      });
    } catch (error) {
      console.error("Error al crear servicio:", error);
      alert("Hubo un error al guardar el servicio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Manejar eliminación
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
    
    try {
      const appId = (window as any).__app_id || 'default-app-id';
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'services', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500">Cargando tus servicios...</div>;

  return (
    <div className="space-y-8">
      {/* Sección de Formulario */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Plus size={20} className="text-emerald-600"/> Publicar Nuevo Servicio
        </h3>
        
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Servicio</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Ej. Mesa para 2, Estacionamiento Techado..."
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="restaurant">Restaurante</option>
              <option value="hotel">Hotel / Hospedaje</option>
              <option value="parking">Estacionamiento</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
            <input
              type="number"
              required
              min="0"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="0.00"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cupos Disponibles</label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Ej. 5"
              value={formData.spots}
              onChange={e => setFormData({...formData, spots: e.target.value})}
            />
          </div>

          <div className="col-span-2">
             <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Breve</label>
             <textarea
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                rows={2}
                placeholder="Detalles adicionales..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
             />
          </div>

          <div className="col-span-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Publicar Servicio'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Servicios */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Store size={20} className="text-emerald-600"/> Mis Servicios Activos
        </h3>
        
        {services.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
            No tienes servicios publicados aún.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <div key={service.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-500 mb-1">{service.description}</p>
                  <div className="flex gap-2 text-xs font-medium">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full capitalize">
                      {service.category}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      ${service.price}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                      {service.spots} cupos
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(service.id)}
                  className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar servicio"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}