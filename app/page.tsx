'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import Layout from '@/components/Layout';
import NutrientScanner from '@/components/NutrientScanner';
import MealHistory from '@/components/MealHistory';
import { motion, AnimatePresence } from 'motion/react';
import { Apple, Activity, Users, ChevronRight, Sparkles, Camera, History, PieChart, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [user, loading] = useAuthState(auth);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-24">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden rounded-[48px] bg-zinc-900 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#ffffff_0%,transparent_50%)]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-zinc-300 border border-white/10"
            >
              <Sparkles className="w-3 h-3 text-yellow-400" />
              Powered by Gemini Flash AI
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-[0.9]"
            >
              Análise Nutricional <br />
              <span className="text-zinc-500 italic">em Segundos.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            >
              A ferramenta profissional para nutricionistas e personal trainers. Estime calorias e macros instantaneamente a partir de uma foto.
            </motion.p>

            {!user && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4"
              >
                <button className="px-8 py-4 bg-white text-zinc-900 rounded-2xl font-bold flex items-center gap-2 hover:bg-zinc-100 transition-all shadow-xl shadow-white/5">
                  Começar Agora Grátis
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-4 text-zinc-500 text-sm font-medium">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Seguro</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 10k+ Profissionais</span>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-[32px] border border-zinc-100 shadow-sm space-y-4">
            <div className="p-3 bg-zinc-50 rounded-2xl w-fit text-zinc-900">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold">Scanner IA</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Nossa IA analisa a composição do prato, identificando alimentos e porções com alta precisão.
            </p>
          </div>

          <div className="p-8 bg-white rounded-[32px] border border-zinc-100 shadow-sm space-y-4">
            <div className="p-3 bg-zinc-50 rounded-2xl w-fit text-zinc-900">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold">Macros & Calorias</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Decomposição detalhada de Proteínas, Carboidratos e Gorduras para cada item identificado.
            </p>
          </div>

          <div className="p-8 bg-white rounded-[32px] border border-zinc-100 shadow-sm space-y-4">
            <div className="p-3 bg-zinc-50 rounded-2xl w-fit text-zinc-900">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold">Histórico Profissional</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Mantenha um registro completo das refeições dos seus clientes para acompanhamento de longo prazo.
            </p>
          </div>
        </section>

        {/* Main App Area */}
        <AnimatePresence mode="wait">
          {user ? (
            <motion.div
              key="app"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-24"
            >
              <NutrientScanner />
              <MealHistory />
            </motion.div>
          ) : (
            <motion.div
              key="login-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 space-y-6 bg-zinc-50 rounded-[48px] border border-zinc-100"
            >
              <div className="p-6 bg-white rounded-full w-fit mx-auto shadow-sm text-zinc-300">
                <Apple className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold">Pronto para começar?</h2>
                <p className="text-zinc-500 max-w-md mx-auto">
                  Faça login para acessar o scanner nutricional e começar a monitorar suas refeições com IA.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Section */}
        <section className="py-20 border-t border-zinc-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-1">
              <p className="text-4xl font-display font-bold text-zinc-900">98%</p>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Precisão IA</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-display font-bold text-zinc-900">2s</p>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Tempo de Análise</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-display font-bold text-zinc-900">50k+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Refeições Logadas</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-display font-bold text-zinc-900">24/7</p>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Suporte Técnico</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
