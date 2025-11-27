'use client';

import React, { useState, useEffect } from 'react';
// ✅ FIX: Rutas absolutas con @/ para evitar "Module not found"
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/config';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { Trash2, Plus, Store, Loader2, Minus, Maximize2 } from 'lucide-react';

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

  const [formData, setFormData] = useState({
    name: '',
    category: 'restaurant',
    price: '',
    spots: '',
    description: ''
  });

  useEffect(() => {
    if (!userId) return;

    // Nota: En producción real quitaríamos 'artifacts/...' y usaríamos una colección raíz 'services'
    const appId = typeof window !== 'undefined' ? (window as any).__app_id || 'default-app-id' : 'default-app-id';
    const servicesRef = collection(db, 'artifacts', appId, 'public', 'data', 'services');

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

  const handleUpdateSpots = async (id: string, newSpots: number) => {
    if (newSpots < 0) return;
    try {
      const appId = (window as any).__app_id || 'default-app-id';
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'services', id);
      await updateDoc(docRef, { spots: newSpots });
    } catch (error) {
      console.error("Error al actualizar cupos:", error);
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2"><Loader2 className="animate-spin w-5 h-5"/> Cargando tus servicios...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
          <Plus size={22} className="text-emerald-600"/> Publicar Nuevo Servicio
        </h3>
        
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
            <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 outline-none" placeholder="Ej. Mesa para 2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 outline-none bg-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="restaurant">Restaurante</option>
              <option value="hotel">Hotel / Hospedaje</option>
              <option value="parking">Estacionamiento</option>
              <option value="other">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Precio ($)</label>
            <input type="number" required min="0" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 outline-none" placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Cupos Iniciales</label>
            <input type="number" required min="1" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 outline-none" placeholder="Ej. 5" value={formData.spots} onChange={e => setFormData({...formData, spots: e.target.value})} />
          </div>
          <div className="col-span-2">
             <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
             <textarea required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 outline-none" rows={2} placeholder="Detalles..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="col-span-2">
            <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex justify-center items-center gap-2 shadow-lg disabled:bg-gray-400">
              {isSubmitting ? <><Loader2 className="animate-spin" /> Publicando...</> : 'Publicar Nuevo Servicio'}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2 border-b pb-3">
          <Store size={22} className="text-emerald-600"/> Gestión de Cupos
        </h3>
        
        {services.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500"><Maximize2 size={24} className="mx-auto mb-2"/>Publica un servicio para empezar.</div>
        ) : (
          <div className="grid gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="sm:w-3/5 mb-3 sm:mb-0">
                  <h4 className="font-extrabold text-lg text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{service.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs font-medium">
                    <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full capitalize">{service.category}</span>
                    <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">${service.price}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-xl border">
                        <button onClick={() => handleUpdateSpots(service.id, service.spots - 1)} disabled={service.spots <= 0} className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-full disabled:bg-gray-300"><Minus size={18} /></button>
                        <div className="text-center min-w-[3rem]"><p className="text-2xl font-black text-gray-800">{service.spots}</p><p className="text-[10px] text-gray-500 font-bold">CUPOS</p></div>
                        <button onClick={() => handleUpdateSpots(service.id, service.spots + 1)} className="p-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"><Plus size={18} /></button>
                    </div>
                    <button onClick={() => handleDelete(service.id)} className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"><Trash2 size={20} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}