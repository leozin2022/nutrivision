'use client';

import { useEffect, useState } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '@/firebase';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { History, Calendar, Clock, ChevronRight, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

interface MealRecord {
  id: string;
  userId: string;
  imageUrl: string;
  analysis: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    summary: string;
  };
  timestamp: any;
}

export default function MealHistory() {
  const [user] = useAuthState(auth);
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'meals'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mealData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MealRecord[];
      setMeals(mealData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'meals');
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-zinc-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        Carregando histórico...
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-3xl border border-zinc-100 shadow-sm">
        <div className="p-4 bg-zinc-50 rounded-full text-zinc-300 w-fit mx-auto mb-4">
          <History className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900">Nenhum registro</h3>
        <p className="text-sm text-zinc-400">Suas refeições analisadas aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-display font-bold flex items-center gap-2">
          <History className="w-5 h-5 text-zinc-400" />
          Histórico Recente
        </h3>
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Últimas 10</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {meals.map((meal, idx) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-zinc-100 transition-all overflow-hidden"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={meal.imageUrl}
                  alt="Meal"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Calendar className="w-3 h-3" />
                  {meal.timestamp?.toDate ? format(meal.timestamp.toDate(), 'dd MMM', { locale: ptBR }) : 'Recent'}
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-zinc-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {meal.timestamp?.toDate ? format(meal.timestamp.toDate(), 'HH:mm', { locale: ptBR }) : 'Agora'}
                    </span>
                  </div>
                  <span className="text-lg font-display font-bold text-zinc-900">
                    {meal.analysis.totalCalories} <span className="text-[10px] text-zinc-400 uppercase tracking-widest">kcal</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-zinc-50 rounded-xl text-center">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Prot</p>
                    <p className="text-xs font-bold text-zinc-900">{meal.analysis.totalProtein}g</p>
                  </div>
                  <div className="p-2 bg-zinc-50 rounded-xl text-center">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Carb</p>
                    <p className="text-xs font-bold text-zinc-900">{meal.analysis.totalCarbs}g</p>
                  </div>
                  <div className="p-2 bg-zinc-50 rounded-xl text-center">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Gord</p>
                    <p className="text-xs font-bold text-zinc-900">{meal.analysis.totalFat}g</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between group/btn cursor-pointer">
                  <div className="flex items-center gap-2 text-zinc-400 group-hover/btn:text-zinc-900 transition-colors">
                    <Info className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Ver Detalhes</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover/btn:text-zinc-900 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
