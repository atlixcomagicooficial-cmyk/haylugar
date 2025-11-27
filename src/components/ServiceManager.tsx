'use client';

import React, { useState, useEffect } from 'react';
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

  // 🔥 FIX: Firestore nunca debe ejecutarse si db es null
  useEffect(() => {
    if (!userId) return;
    if (!db) return; // ← FIX CRÍTICO

    const appId =
      typeof window !== 'undefined'
        ? (window as any).__app_id || 'default-app-id'
        : 'default-app-id';

    const servicesRef = collection(
      db,
      'artifacts',
      appId,
      'public',
      'data',
      'services'
    );

    const q = query(servicesRef, where('ownerId', '==', userId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Service[];
        setServices(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error al leer servicios:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (!db) return; // ← FIX

    setIsSubmitting(true);

    try {
      const appId = (window as any).__app_id || 'default-app-id';
      const servicesRef = collection(
        db,
        'artifacts',
        appId,
        'public',
        'data',
        'services'
      );

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
        description: '',
      });
    } catch (error) {
      console.error('Error al crear servicio:', error);
      alert('Hubo un error al guardar el servicio.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return; // ← FIX
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;

    try {
      const appId = (window as any).__app_id || 'default-app-id';
      const docRef = doc(
        db,
        'artifacts',
        appId,
        'public',
        'data',
        'services',
        id
      );
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const handleUpdateSpots = async (id: string, newSpots: number) => {
    if (!db) return; // ← FIX
    if (newSpots < 0) return;

    try {
      const appId = (window as any).__app_id || 'default-app-id';
      const docRef = doc(
        db,
        'artifacts',
        appId,
        'public',
        'data',
        'services',
        id
      );
      await updateDoc(docRef, { spots: newSpots });
    } catch (error) {
      console.error('Error al actualizar cupos:', error);
    }
  };

  if (loading)
    return (
      <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2">
        <Loader2 className="animate-spin w-5 h-5" /> Cargando tus servicios...
      </div>
    );

  return (
    <div className="space-y-8">
      {/* FORMULARIO DE CREACIÓN */}
      <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
          <Plus size={22} className="text-emerald-600" /> Publicar Nuevo
          Servicio
        </h3>

        {/* ... resto del código sin cambios ... */}
      </div>

      {/* LISTA DE SERVICIOS */}
      {/* ... resto del código sin cambios ... */}
    </div>
  );
}