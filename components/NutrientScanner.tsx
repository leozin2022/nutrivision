'use client';

import { useState, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Camera, Upload, Loader2, CheckCircle2, AlertCircle, X, ChevronRight, PieChart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, handleFirestoreError, OperationType } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Image from 'next/image';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });

interface NutrientAnalysis {
  foodItems: {
    name: string;
    quantity: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  summary: string;
}

export default function NutrientScanner() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<NutrientAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeMeal = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const base64Data = image.split(',')[1];
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: 'image/jpeg',
                },
              },
              {
                text: `Analise esta foto de comida e estime os nutrientes. Retorne APENAS um JSON no seguinte formato:
                {
                  "foodItems": [
                    { "name": "nome do alimento", "quantity": "quantidade estimada", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 }
                  ],
                  "totalCalories": 0,
                  "totalProtein": 0,
                  "totalCarbs": 0,
                  "totalFat": 0,
                  "summary": "breve resumo nutricional"
                }
                Seja o mais preciso possível para um profissional de nutrição/treino.`,
              },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              foodItems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    quantity: { type: Type.STRING },
                    calories: { type: Type.NUMBER },
                    protein: { type: Type.NUMBER },
                    carbs: { type: Type.NUMBER },
                    fat: { type: Type.NUMBER },
                  },
                  required: ['name', 'quantity', 'calories', 'protein', 'carbs', 'fat'],
                },
              },
              totalCalories: { type: Type.NUMBER },
              totalProtein: { type: Type.NUMBER },
              totalCarbs: { type: Type.NUMBER },
              totalFat: { type: Type.NUMBER },
              summary: { type: Type.STRING },
            },
            required: ['foodItems', 'totalCalories', 'totalProtein', 'totalCarbs', 'totalFat', 'summary'],
          },
        },
      });

      const result = JSON.parse(response.text || '{}') as NutrientAnalysis;
      setAnalysis(result);

      // Save to Firestore
      if (auth.currentUser) {
        try {
          await addDoc(collection(db, 'meals'), {
            userId: auth.currentUser.uid,
            imageUrl: image, // In a real app, upload to Storage and save URL
            analysis: result,
            timestamp: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, 'meals');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Falha ao analisar a imagem. Tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display font-bold tracking-tight">Scanner Nutricional</h2>
        <p className="text-zinc-500">Capture ou envie uma foto do prato para análise instantânea.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-4">
          <div
            className={`relative aspect-square rounded-3xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center gap-4 ${
              image ? 'border-zinc-900' : 'border-zinc-200 hover:border-zinc-400 bg-white'
            }`}
          >
            {image ? (
              <>
                <Image src={image} alt="Food" fill className="object-cover" />
                <button
                  onClick={reset}
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-zinc-900 hover:bg-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="p-4 bg-zinc-50 rounded-full text-zinc-400">
                  <Camera className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Tire uma foto ou arraste</p>
                  <p className="text-sm text-zinc-400">JPG, PNG até 5MB</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-zinc-900 text-white rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors"
                >
                  Selecionar Foto
                </button>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {image && !analysis && !isAnalyzing && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={analyzeMeal}
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
            >
              Analisar Nutrientes
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}

          {isAnalyzing && (
            <div className="w-full py-4 bg-zinc-100 text-zinc-500 rounded-2xl font-medium flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              IA Analisando Composição...
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {analysis ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-xl shadow-zinc-100 space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-display font-bold">Análise Completa</h3>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    IA Verificado
                  </div>
                </div>

                {/* Macro Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-900 text-white rounded-2xl space-y-1">
                    <p className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Calorias</p>
                    <p className="text-2xl font-display font-bold">{analysis.totalCalories} kcal</p>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-2xl space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Proteína</p>
                    <p className="text-2xl font-display font-bold text-zinc-900">{analysis.totalProtein}g</p>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-2xl space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Carboidratos</p>
                    <p className="text-2xl font-display font-bold text-zinc-900">{analysis.totalCarbs}g</p>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-2xl space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Gorduras</p>
                    <p className="text-2xl font-display font-bold text-zinc-900">{analysis.totalFat}g</p>
                  </div>
                </div>

                {/* Food Items List */}
                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Composição do Prato</p>
                  <div className="space-y-3">
                    {analysis.foodItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border-b border-zinc-50 last:border-0">
                        <div>
                          <p className="font-semibold text-zinc-900">{item.name}</p>
                          <p className="text-xs text-zinc-400">{item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-zinc-900">{item.calories} kcal</p>
                          <p className="text-[10px] text-zinc-400">P: {item.protein}g | C: {item.carbs}g | G: {item.fat}g</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 rounded-2xl">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Resumo IA</p>
                  <p className="text-sm text-zinc-600 leading-relaxed italic">&quot;{analysis.summary}&quot;</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-zinc-100 rounded-3xl"
              >
                <div className="p-4 bg-zinc-50 rounded-full text-zinc-200 mb-4">
                  <PieChart className="w-12 h-12" />
                </div>
                <h3 className="text-lg font-bold text-zinc-400">Aguardando Análise</h3>
                <p className="text-sm text-zinc-300 max-w-[200px] mx-auto">
                  Envie uma foto para ver a decomposição nutricional detalhada.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
