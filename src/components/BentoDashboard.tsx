import { useState, useEffect, useRef } from "react";
import { AnalysisResult } from "../types";
import { cn } from "../lib/utils";
import { AgronomistChat } from "./AgronomistChat";

interface BentoDashboardProps {
  result: AnalysisResult;
}

export const BentoDashboard = ({ result }: BentoDashboardProps) => {
  const [chatOpen, setChatOpen] = useState(false);
  const isHealthy = result.status === "healthy";
  
  // Audio state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const cancelRef = useRef(false);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
         window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (isSpeaking) {
      cancelRef.current = true;
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSection(null);
    } else {
      cancelRef.current = false;
      startSequence();
    }
  };

  const startSequence = () => {
    setIsSpeaking(true);
    const playlist = [
      { id: 'header', text: `Diagnostic. ${result.disease_name}. Risk level is ${result.risk_level}. ${result.contextual_insight}` },
      { id: 'impact', text: `If ignored: ${result.untreated_impact.value_lost}. ${result.untreated_impact.description}.` },
      { id: 'spread', text: `How it spreads. ${result.spread_factors.map(f => `${f.title}. ${f.description}`).join(' ')}` },
      { id: 'treatment', text: `What to do now. ${result.treatment_steps.map(s => `${s.title}. ${s.description}`).join(' ')}` },
      { id: 'preven', text: `How to prevent this. ${result.preventive_measures.join('. ')}.` }
    ];

    let currentIndex = 0;

    const playNext = () => {
      if (cancelRef.current) return;
      if (currentIndex >= playlist.length) {
        setIsSpeaking(false);
        setActiveSection(null);
        return;
      }

      const item = playlist[currentIndex];
      setActiveSection(item.id);

      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.rate = 1.0;
      utterance.onend = () => {
        if (!cancelRef.current) {
          currentIndex++;
          playNext();
        }
      };
      utterance.onerror = () => {
        if (!cancelRef.current) {
          setIsSpeaking(false);
          setActiveSection(null);
        }
      };
      window.speechSynthesis.speak(utterance);
    };
    playNext();
  };

  const getGlow = (id: string, baseClasses: string, activeGlow: string) => {
    if (!isSpeaking) return baseClasses;
    return activeSection === id 
      ? cn(baseClasses, "transition-all duration-500", activeGlow) 
      : cn(baseClasses, "transition-all duration-500 opacity-40 saturate-50");
  };

  // Calculate dynamic dash offset for the circle
  const confidencePercent = Math.round(result.confidence_score * 100);
  const strokeDashoffset = 364.4 - (364.4 * result.confidence_score);
  
  // Determine header risk class
  const alertBg = isHealthy ? "bg-primary-container text-on-primary-container" : "bg-error-container text-on-error-container";
  const alertText = isHealthy ? "Healthy" : "High Alert";

  return (
    <>
      {/* Header & Primary Status */}
      <header className={getGlow('header', "grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-end", "bg-primary/5 rounded-2xl ring-2 ring-primary/30 p-6 -mx-6 shadow-[0_0_40px_rgba(166,215,0,0.15)]")}>
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest", alertBg)}>
              {alertText}
            </span>
            <span className="text-on-surface-variant text-sm tracking-wide">Field Sector: {result.field_sector}</span>
          </div>
          <h1 className="font-headline text-6xl md:text-7xl font-light text-on-surface mb-4">
            {result.disease_name} {isHealthy ? "" : "Detected"}
          </h1>
          <p className="font-headline italic text-2xl text-on-surface-variant max-w-2xl leading-relaxed">
            {result.contextual_insight}
          </p>
          
          <button 
            onClick={toggleSpeech}
            className={cn(
              "mt-8 px-6 py-3 rounded-full font-bold flex items-center justify-center gap-3 transition-all active:scale-95 max-w-fit",
              isSpeaking 
                ? "bg-primary text-on-primary shadow-[0_0_20px_rgba(166,215,0,0.4)]" 
                : "border border-outline-variant hover:bg-white/5 text-on-surface"
            )}
          >
            <span className="material-symbols-outlined">
              {isSpeaking ? "volume_off" : "volume_up"}
            </span>
            {isSpeaking ? "Stop Audio Guide" : "Listen to Audio Guide"}
          </button>
        </div>
        <div className="lg:col-span-4 flex flex-col items-end gap-6">
          {/* Confidence Gauge */}
          <div className="bg-surface-container-high p-8 rounded-xl w-full flex flex-col items-center justify-center text-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-surface-container-highest" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-primary transition-all duration-1000 ease-out" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset={strokeDashoffset} strokeWidth="8"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-on-surface">{confidencePercent}%</span>
              </div>
            </div>
            <span className="text-xs uppercase tracking-widest text-on-surface-variant">Confidence Level</span>
          </div>
        </div>
      </header>

      {/* Bento Grid Diagnostic Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Big Clear Image Card */}
        <div className="lg:col-span-2 lg:row-span-2 relative overflow-hidden rounded-xl bg-surface-container group">
          {result.imageUrl && (
             <img className="w-full h-full object-cover min-h-[400px] opacity-80 group-hover:opacity-100 transition-opacity duration-700 absolute" src={result.imageUrl} alt="Analysis Result"/>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 text-on-surface z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">center_focus_strong</span>
              <span className="text-sm font-bold tracking-widest uppercase">Evidence Photo {result.image_analysis.photo_id}</span>
            </div>
            <p className="text-on-surface-variant max-w-lg">{result.image_analysis.description}</p>
          </div>
        </div>

        {/* Danger / Loss Card */}
        <div className={getGlow('impact', cn("p-8 rounded-xl flex flex-col justify-between border-l-4", isHealthy ? "bg-primary-container border-primary" : "bg-error-container border-error"), "ring-2 ring-error shadow-[0_0_30px_rgba(255,180,171,0.2)]")}>
          <div>
            <h3 className={cn("text-xs uppercase tracking-[0.2em] mb-6 font-bold", isHealthy ? "text-on-primary-container/80" : "text-on-error-container/80")}>
              {isHealthy ? "Yield Status" : "Money lost if ignored"}
            </h3>
            <div className={cn("font-headline text-5xl font-bold mb-2", isHealthy ? "text-primary" : "text-on-error-container")}>
              {isHealthy ? "Optimal" : result.untreated_impact.value_lost}
            </div>
            <p className={cn("leading-relaxed", isHealthy ? "text-on-primary-container/80" : "text-on-error-container/80")}>
              {isHealthy ? "Your crop shows no visual signs of infection. Yield prospects are stable." : result.untreated_impact.description}
            </p>
          </div>
          {!isHealthy && (
            <div className="mt-8">
              <div className="h-2 w-full bg-on-error-container/20 rounded-full overflow-hidden">
                <div className="h-full bg-on-error-container transition-all" style={{ width: `${result.untreated_impact.risk_percentage}%` }}></div>
              </div>
              <span className="text-xs mt-2 block text-on-error-container font-bold italic">{result.untreated_impact.risk_label}</span>
            </div>
          )}
        </div>

        {/* Spread Pattern Card */}
        <div className={getGlow('spread', "bg-surface-container-high p-8 rounded-xl text-on-surface", "ring-2 ring-secondary shadow-[0_0_30px_rgba(171,207,184,0.1)]")}>
          <h3 className="text-xs uppercase tracking-[0.2em] text-secondary mb-6 font-bold">
            {isHealthy ? "Favorable Conditions" : "How it spreads"}
          </h3>
          <div className="space-y-6">
            {result.spread_factors.map((factor, i) => (
               <div key={i} className="flex gap-4">
                 <span className="material-symbols-outlined text-secondary">{factor.icon_name}</span>
                 <div>
                   <span className="block text-on-surface font-bold">{factor.title}</span>
                   <p className="text-sm text-on-surface-variant">{factor.description}</p>
                 </div>
               </div>
            ))}
          </div>
        </div>

        {/* Immediate Steps / Treatment */}
        <div className={getGlow('treatment', "lg:col-span-2 bg-surface-container-highest p-10 rounded-xl relative overflow-hidden text-on-surface", "ring-2 ring-primary shadow-[0_0_30px_rgba(166,215,0,0.15)]")}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <h2 className="font-headline text-4xl mb-8">What to do now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8 relative z-10">
               {result.treatment_steps.map((step, i) => (
                  <div className="flex items-start gap-4" key={i}>
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">{i + 1}</span>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{step.title}</h4>
                      <p className="text-on-surface-variant">{step.description}</p>
                    </div>
                  </div>
               ))}
            </div>
            <div className="flex flex-col justify-center relative z-10">
              <button className="bg-primary text-on-primary py-5 px-8 rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95">
                <span className="material-symbols-outlined">medication</span>
                Order Treatment Supplies
              </button>
              <p className="text-center mt-4 text-sm text-on-surface-variant italic">Next day delivery available for your region</p>
            </div>
          </div>
        </div>

        {/* Prevention / Safe Card */}
        <div className={getGlow('preven', "bg-surface-container p-8 rounded-xl border border-outline-variant/10 text-on-surface", "ring-2 ring-primary shadow-[0_0_30px_rgba(166,215,0,0.15)]")}>
          <h3 className="text-xs uppercase tracking-[0.2em] text-primary mb-6 font-bold">How to prevent</h3>
          <ul className="space-y-4">
            {result.preventive_measures.map((measure, i) => (
               <li key={i} className="flex items-center gap-3 text-sm text-on-surface-variant">
                 <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                 {measure}
               </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Expert Consultation Link */}
      <section className="mt-12 bg-secondary-container/30 backdrop-blur-md rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-on-surface">
        <div className="flex items-center gap-6">
          <img className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKZPSY6Xbv5uFzapEEpvhDAhmuMFo75O0_LXOZIP5tbCC6LRvntZNWaCjD9Cvf0s_6cHAUQg2YJt93yLMtHS2HOPMDciqULUK-8QYDj9V041-ywbtPp9UbiJZ40qo6A3DE8uDqYfFXVZR0jIGnSnm_k8ICVOr5falQIbMt4zrbFeFipw3-Nf4xcs8BdWcnLAIfPqnx8px0rChEbz6Gr1ckv-IAVWMj_BxF0lWXGPCk4VNqRNV0sG07sSY9eepvAoX4owXMrMqS1PL3" alt="Agronomist" />
          <div>
            <h4 className="font-headline text-2xl">Need an expert's second opinion?</h4>
            <p className="text-on-surface-variant">Dr. Aris is online and familiar with potato blight in your local county.</p>
          </div>
        </div>
        <button 
           onClick={() => setChatOpen(true)}
           className="border border-outline-variant hover:bg-white/5 px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">chat_bubble</span>
          Talk to an Agronomist
        </button>
      </section>

      {/* Render the global chatbot but force it open if requested via this button */}
      {chatOpen ? <AgronomistChat result={result} forceOpen={true} onClose={() => setChatOpen(false)} /> : <AgronomistChat result={result} />}
    </>
  );
};