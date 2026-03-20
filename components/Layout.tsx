'use client';

import Auth from '@/components/Auth';
import { Apple, Activity, Users, ShieldCheck, Instagram, Twitter, Github } from 'lucide-react';
import { motion } from 'motion/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 text-white rounded-xl shadow-lg shadow-zinc-200">
              <Apple className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-display font-bold tracking-tight">NutriScan <span className="text-zinc-400">Pro</span></h1>
              <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">AI Nutrient Analysis</span>
            </div>
          </div>

          <Auth />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Apple className="w-5 h-5 text-zinc-900" />
              <span className="font-display font-bold text-lg">NutriScan Pro</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              A ferramenta definitiva para nutricionistas e personal trainers que buscam precisão e agilidade no acompanhamento nutricional.
            </p>
            <div className="flex items-center gap-4 text-zinc-400">
              <Instagram className="w-5 h-5 hover:text-zinc-900 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 hover:text-zinc-900 cursor-pointer transition-colors" />
              <Github className="w-5 h-5 hover:text-zinc-900 cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Recursos</h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li className="hover:text-zinc-900 cursor-pointer transition-colors">Scanner de Pratos</li>
              <li className="hover:text-zinc-900 cursor-pointer transition-colors">Histórico de Refeições</li>
              <li className="hover:text-zinc-900 cursor-pointer transition-colors">Análise de Macros</li>
              <li className="hover:text-zinc-900 cursor-pointer transition-colors">Relatórios para Profissionais</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Empresa</h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li className="hover:text-zinc-900 cursor-pointer transition-colors">Sobre Nós</li>
              <li className="hover:text-zinc-900 cursor-pointer transition-colors">Privacidade</li>
              <li className="hover:text-zinc-900 cursor-pointer transition-colors">Termos de Uso</li>
              <li className="hover:text-zinc-900 cursor-pointer transition-colors">Contato</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Status do Sistema</h4>
            <div className="p-4 bg-zinc-50 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">API Gemini</span>
                <span className="text-emerald-600 font-bold">Operacional</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Firestore</span>
                <span className="text-emerald-600 font-bold">Operacional</span>
              </div>
              <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-12 mt-12 border-t border-zinc-50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400">© 2026 NutriScan Pro. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6 text-xs text-zinc-400">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Seguro</span>
            <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Alta Performance</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 10k+ Profissionais</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
