/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MeshBackground } from './components/MeshBackground';
import { UploadZone } from './components/UploadZone';
import { ScanningLoader } from './components/ScanningLoader';
import { BentoDashboard } from './components/BentoDashboard';
import { History } from './components/History';
import { analyzeCropImage } from './services/gemini';
import { AnalysisResult, Region } from './types';
import { ChevronLeft, Share2, Download, Leaf, MapPin } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [view, setView] = useState<'landing' | 'scanning' | 'results'>('landing');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [region, setRegion] = useState<Region>("West Africa");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Load history from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('agrinova_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Save history to LocalStorage
  useEffect(() => {
    localStorage.setItem('agrinova_history', JSON.stringify(history.slice(0, 5)));
  }, [history]);

  const handleImageSelect = useCallback(async (base64: string) => {
    setSelectedImage(base64);
    setView('scanning');

    try {
      const result = await analyzeCropImage(base64, region);
      setCurrentResult(result);
      setHistory(prev => [result, ...prev].slice(0, 10)); // Keep last 10
      setView('results');
    } catch (error) {
      console.error("Analysis failed", error);
      setView('landing');
      alert("Something went wrong with the analysis. Please check your connection.");
    }
  }, [region]);

  const handleHistorySelect = (scan: AnalysisResult) => {
    setCurrentResult(scan);
    setSelectedImage(scan.imageUrl || null);
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearHistory = () => {
    if (confirm("Clear all previous scans?")) {
      setHistory([]);
      localStorage.removeItem('agrinova_history');
    }
  };

  return (
    <div className="relative min-h-screen">
      <MeshBackground />
      
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 h-[64px] flex items-center justify-between px-10 border-b border-editorial-glass-border bg-black/20 pointer-events-none">
        <div className="flex items-center space-x-2 pointer-events-auto cursor-pointer group" onClick={() => setView('landing')}>
          <span className="text-xl font-extrabold tracking-tighter text-white">
            🌱 Agri<span className="text-editorial-emerald">Nova</span> AI
          </span>
        </div>

        <div className="flex items-center space-x-6 pointer-events-auto">
          {view === 'results' && (
             <div className="hidden md:flex items-center space-x-2 text-white/40 font-bold uppercase tracking-[1px] text-[10px]">
                <MapPin className="w-3 h-3 text-editorial-emerald" />
                <span>📍 Deployment: Rift Valley, Kenya (Maize Belt)</span>
             </div>
          )}
          
          <div className={cn(
            "text-[11px] font-black uppercase tracking-[1px] px-3 py-1 rounded-full border transition-all",
            isOffline 
              ? "bg-editorial-gold/10 text-editorial-gold border-editorial-gold/30" 
              : "bg-editorial-emerald/10 text-editorial-emerald border-editorial-emerald/30"
          )}>
            ● {isOffline ? "Offline Cache Active" : "Live AI Network"}
          </div>

          {view === 'results' && (
             <button 
              onClick={() => setView('landing')}
              className="glass px-4 py-2 rounded-xl hover:bg-white/10 transition-all flex items-center space-x-2 text-[10px] font-black uppercase tracking-[1px]"
             >
               <ChevronLeft className="w-4 h-4" />
               <span className="hidden md:inline">Dashboard</span>
             </button>
          )}
        </div>
      </header>

      <main className="container mx-auto max-w-7xl pt-32 px-6">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: "circOut" }}
            >
              <UploadZone 
                onImageSelect={handleImageSelect} 
                selectedRegion={region}
                onRegionChange={setRegion}
              />
              <History 
                scans={history} 
                onSelect={handleHistorySelect} 
                onClear={clearHistory}
                isOffline={isOffline}
              />
            </motion.div>
          )}

          {view === 'scanning' && selectedImage && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ScanningLoader image={selectedImage} />
            </motion.div>
          )}

          {view === 'results' && currentResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "backOut" }}
              className="space-y-8"
            >
              <div className="flex justify-end space-x-2 mb-4">
                 <button className="glass p-3 rounded-2xl hover:bg-white/10 transition-all" title="Share Report">
                    <Share2 className="w-5 h-5" />
                 </button>
                 <button className="glass p-3 rounded-2xl hover:bg-white/10 transition-all" title="Download Offline Copy">
                    <Download className="w-5 h-5" />
                 </button>
              </div>
              <BentoDashboard result={currentResult} />
              
              <div className="flex justify-center pb-24">
                <button 
                  onClick={() => setView('landing')}
                  className="px-8 py-4 glass rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Start New Diagnosis
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
