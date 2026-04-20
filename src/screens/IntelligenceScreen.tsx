import { useState, useRef, useEffect } from 'react';
import { AnalysisResult, Country } from '../types';
import { analyzeCropImage } from '../services/gemini';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { countries } from '../lib/countries';
import { ScanningLoader } from '../components/ScanningLoader';
import { CountrySelector } from '../components/CountrySelector';
import { CountryFlag } from '../components/CountryFlag';

interface IntelligenceScreenProps {
  history: AnalysisResult[];
  addHistory: (r: AnalysisResult) => void;
}

export const IntelligenceScreen = ({ history, addHistory }: IntelligenceScreenProps) => {
  const navigate = useNavigate();
  
  const [country, setCountry] = useState<Country>(() => {
    return (localStorage.getItem('default_country') as Country) || "United States";
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const libraryInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setSelectedImage(base64);
      setIsScanning(true);
      setError(null);
      
      try {
        const result = await analyzeCropImage(base64, country);
        addHistory(result);
        navigate(`/dashboard/diagnostic/${result.timestamp}`);
      } catch (err: any) {
        console.error("Analysis failed", err);
        setSelectedImage(null);
        setIsScanning(false);
        if (err?.message === "NOT_A_PLANT") {
           setError("This image does not appear to be a crop or plant. Please upload a clear photo of agricultural leaves or crops.");
        } else {
           setError("Something went wrong with the analysis. Please check your connection.");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
      // reset input value so the exact same file can be chosen again if needed
      e.target.value = '';
    }
  };

  if (isScanning && selectedImage) {
    return (
      <div className="max-w-md mx-auto pt-12">
        <h2 className="font-headline italic text-3xl font-bold mb-8 text-white">Analyzing Crop...</h2>
        <ScanningLoader image={selectedImage} />
      </div>
    );
  }

  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden opacity-30 pointer-events-none rounded-2xl md:rounded-3xl mt-[-80px] md:mt-0">
        <img className="w-full h-full object-cover mix-blend-overlay" alt="deep dark lush forest canopy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuMRhPmFzRySr2TSMfF6s53N_IYt63293e6Ec4cgU3CBNH_UfuuoVxREmhw9eYJaxHW7xUWqR6ro36HkswIoKe_JyLrhH9o-zKxjqtcxRMjRTcUehBd0b0nOQ5iLaN1Un5wvdK3rMCWRZeaO_FMwgHgEdeLdlWujXJh--tyVGLnhRT-C1efm2lrfPlhUnrPjDqw2SXvL_17NcBi2jICIDM5bpqv7Lqb7lQDrHBsOOA6yDkpCRYjQn62NWL6heQgcaGZCnygovcyjDt"/>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background rounded-2xl md:rounded-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-12 md:space-y-16 mt-4 md:mt-8">
        
        {/* Hidden File Inputs */}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          ref={cameraInputRef} 
          className="hidden" 
          onChange={handleFileChange}
        />
        <input 
          type="file" 
          accept="image/*" 
          ref={libraryInputRef} 
          className="hidden" 
          onChange={handleFileChange}
        />

        <section className="max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="font-headline italic text-5xl md:text-7xl font-bold text-on-surface leading-tight tracking-tight mb-4"
          >
            Snap. Diagnose. <br/>
            <span className="text-primary not-italic">Protect your crops.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-on-surface-variant font-body text-lg max-w-xl"
          >
            Deploying neural networks to analyze foliar anomalies in real-time. Precision agriculture, simplified.
          </motion.p>
        </section>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="space-y-4">
           {error && (
            <div className="bg-error-container border border-error text-on-error-container p-4 rounded-xl shadow-lg text-sm font-bold max-w-md">
              {error}
            </div>
           )}
          
           <div className="flex flex-col gap-2 relative z-50">
             <label className="font-label text-sm uppercase tracking-widest text-on-surface-variant font-bold">Location for Crop Data</label>
             <CountrySelector value={country} onChange={setCountry} className="max-w-sm" />
           </div>
        </motion.div>

        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <button onClick={() => cameraInputRef.current?.click()} className="bg-surface-container/60 backdrop-blur-xl p-8 rounded-xl border border-outline-variant/15 hover:bg-surface-container transition-all group flex flex-col justify-between items-start text-left h-48 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
            <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary mb-4 border border-outline-variant/15">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
            </div>
            <div>
              <h3 className="font-headline text-2xl font-bold mb-1 text-on-surface group-hover:text-primary transition-colors">Open Live Camera</h3>
              <p className="text-sm text-on-surface-variant">Real-time field analysis</p>
            </div>
          </button>
          
          <button onClick={() => libraryInputRef.current?.click()} className="bg-surface-container/60 backdrop-blur-xl p-8 rounded-xl border border-outline-variant/15 hover:bg-surface-container transition-all group flex flex-col justify-between items-start text-left h-48 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors"></div>
            <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center text-secondary mb-4 border border-outline-variant/15">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>upload_file</span>
            </div>
            <div>
              <h3 className="font-headline text-2xl font-bold mb-1 text-on-surface group-hover:text-secondary transition-colors">Upload from Library</h3>
              <p className="text-sm text-on-surface-variant">Batch process high-res imagery</p>
            </div>
          </button>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-6">
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-headline italic text-3xl font-bold">Recent Diagnostics</h2>
            <button onClick={() => navigate('/dashboard/diagnostics')} className="text-sm font-label text-primary hover:text-primary-fixed transition-colors flex items-center gap-1 font-bold">
              View Complete Log <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.slice(0, 3).map((scan) => {
              const isHealthy = scan.status === 'healthy';
              const riskColor = isHealthy ? 'text-primary' : (scan.risk_level === 'high' ? 'text-tertiary' : 'text-on-tertiary-container');
              const bgClass = isHealthy ? 'bg-primary' : (scan.risk_level === 'high' ? 'bg-tertiary' : 'bg-on-tertiary-container');
              const iconName = isHealthy ? 'check_circle' : (scan.risk_level === 'high' ? 'warning' : 'info');

              return (
                <div key={scan.timestamp} onClick={() => navigate(`/dashboard/diagnostic/${scan.timestamp}`)} className="bg-surface-container-low rounded-xl overflow-hidden group border border-outline-variant/10 cursor-pointer hover:border-outline-variant/40 transition-colors">
                  <div className="h-40 relative overflow-hidden">
                    {scan.imageUrl ? (
                       <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={scan.disease_name} src={scan.imageUrl}/>
                    ) : (
                       <div className="w-full h-full bg-surface-container flex items-center justify-center">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                    <div className={cn("absolute top-3 left-3 px-2 py-1 backdrop-blur-md rounded border text-xs font-label font-bold flex items-center gap-1", 
                       isHealthy ? "bg-primary/20 border-primary/30 text-primary" : (scan.risk_level === 'high' ? "bg-tertiary/20 border-tertiary/30 text-tertiary" : "bg-on-tertiary-container/20 border-on-tertiary-container/30 text-on-tertiary-container")
                    )}>
                      <span className="material-symbols-outlined text-[14px]">{iconName}</span> 
                      {isHealthy ? "Healthy" : `${scan.risk_level.charAt(0).toUpperCase() + scan.risk_level.slice(1)} Risk`}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-headline text-xl font-bold text-on-surface truncate pr-2">{scan.disease_name}</h4>
                      <span className="text-xs text-on-surface-variant font-label whitespace-nowrap">{new Date(scan.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <CountryFlag countryName={scan.country} size={22} />
                      <p className="text-sm text-on-surface-variant truncate">{scan.country}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-grow bg-surface-container-highest rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", bgClass)} style={{ width: `${scan.confidence_score * 100}%` }}></div>
                      </div>
                      <span className="text-xs font-label text-on-surface font-bold">{Math.round(scan.confidence_score * 100)}% Conf.</span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {history.length === 0 && (
              <div className="col-span-full py-16 text-center text-on-surface-variant bg-surface-container-low rounded-xl border border-outline-variant/10">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">history</span>
                <p>No diagnostics found. Scan a plant to begin.</p>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </>
  );
};
