'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, loginWithGoogle, logout, db } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { LogIn, LogOut, User as UserIcon, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Auth() {
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    async function syncUser() {
      if (user) {
        setIsSyncing(true);
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // Default to client role for new users
          const newUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: 'client',
            createdAt: serverTimestamp(),
          };
          await setDoc(userRef, newUser);
          setRole('client');
        } else {
          setRole(userSnap.data().role);
        }
        setIsSyncing(false);
      } else {
        setRole(null);
      }
    }
    syncUser();
  }, [user]);

  if (loading || isSyncing) {
    return (
      <div className="flex items-center gap-2 text-zinc-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Autenticando...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={loginWithGoogle}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors text-sm font-medium"
      >
        <LogIn className="w-4 h-4" />
        Entrar com Google
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end">
        <span className="text-sm font-semibold">{user.displayName}</span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
          {role === 'nutritionist' ? 'Nutricionista' : role === 'trainer' ? 'Personal Trainer' : 'Cliente'}
        </span>
      </div>
      <button
        onClick={logout}
        className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500"
        title="Sair"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
