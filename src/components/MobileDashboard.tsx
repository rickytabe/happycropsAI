import { useState, useEffect, useRef } from "react";
import { AnalysisResult } from "../types";
import { cn } from "../lib/utils";
import { AgronomistChat } from "./AgronomistChat";

interface MobileDashboardProps {
  result: AnalysisResult;
}

export const MobileDashboard = ({ result }: MobileDashboardProps) => {
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

  const confidencePercent = Math.round(result.confidence_score * 100);

  return (
    <>
      <section className={getGlow('header', "relative h-[45vh] w-full overflow-hidden", "ring-4 ring-primary ring-inset")}>
        {result.imageUrl ? (
           <img alt={result.disease_name} className="w-full h-full object-cover" src={result.imageUrl}/>
        ) : (
           <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant">No Image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1512] via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full px-6 pb-8">
          <div className="flex items-center gap-2 mb-2">
            {!isHealthy ? (
               <>
                 <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-error">Critical Alert</span>
               </>
            ) : (
               <>
                 <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Healthy Status</span>
               </>
            )}
          </div>
          <h2 className="font-headline text-4xl font-medium leading-tight text-on-surface">{result.disease_name}</h2>
          <p className="text-primary mt-1 italic font-headline text-lg line-clamp-2">{result.contextual_insight}</p>
        </div>
      </section>

      <main className="px-4 space-y-6 max-w-md mx-auto -mt-4 relative z-10 pb-6">
        <section>
          <button 
             onClick={toggleSpeech}
             className={cn(
               "w-full flex items-center justify-center gap-3 border py-4 rounded-xl font-bold shadow-xl active:scale-95 transition-all text-sm",
               isSpeaking ? "bg-primary text-on-primary border-primary shadow-primary/20" : "bg-surface-container-high border-outline-variant/30 text-on-surface"
             )}
          >
            <span className={cn("material-symbols-outlined", isSpeaking ? "text-on-primary" : "text-primary")} style={{ fontVariationSettings: "'FILL' 1" }}>
              {isSpeaking ? "volume_off" : "volume_up"}
            </span>
            <span>{isSpeaking ? "Stop Audio Guide" : "Listen to Audio Guide"}</span>
          </button>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Confidence</span>
            <div className="mt-4">
              <span className="text-4xl font-headline text-primary">{confidencePercent}%</span>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-primary h-full transition-all" style={{ width: `${confidencePercent}%` }}></div>
              </div>
            </div>
          </div>

          <div className={getGlow('impact', "bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 flex flex-col justify-between", "ring-2 ring-tertiary")}>
            <span className={cn("text-xs uppercase tracking-widest font-bold", isHealthy ? "text-primary" : "text-tertiary")}>
               {isHealthy ? "Yield Status" : "Potential Loss"}
            </span>
            <div className="mt-4">
              <span className={cn("text-4xl font-headline", isHealthy ? "text-primary" : "text-tertiary")}>
                {isHealthy ? "Optimal" : result.untreated_impact.value_lost}
              </span>
              <p className="text-[10px] text-on-surface-variant leading-tight mt-1">
                 {isHealthy ? "No impact expected" : result.untreated_impact.description}
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-xl bg-surface-container-low group border border-outline-variant/10">
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-surface-dim/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
               Evidence #1
            </span>
          </div>
          {result.imageUrl ? (
             <img alt="Evidence" className="w-full aspect-video object-cover" src={result.imageUrl}/>
          ) : (
             <div className="w-full aspect-video flex content-center justify-center text-on-surface-variant items-center bg-surface-container">No Image available</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-transparent to-transparent opacity-60"></div>
          <div className="absolute bottom-4 left-4 right-4 z-10 text-xs text-on-surface">
             {result.image_analysis.description}
          </div>
        </section>

        <section className={getGlow('spread', "bg-surface-container rounded-xl p-6", "ring-2 ring-secondary")}>
          <h3 className="font-headline text-xl mb-4 text-on-surface italic">How it spreads</h3>
          <div className="grid grid-cols-2 gap-4">
             {result.spread_factors.map((factor, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex flex-shrink-0 items-center justify-center">
                    <span className="material-symbols-outlined text-secondary">{factor.icon_name}</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant leading-tight">{factor.title}</span>
                </div>
             ))}
          </div>
        </section>

        <section className={getGlow('treatment', "space-y-4", "ring-2 ring-primary p-4 -m-4 bg-surface-container-lowest rounded-xl")}>
          <h3 className="font-headline text-2xl text-on-surface">What to do now</h3>
          <div className="space-y-3">
             {result.treatment_steps.map((step, i) => (
               <div key={i} className={cn("flex gap-4 items-start p-4 bg-surface-container-high rounded-xl", i === 0 ? "border-l-4 border-primary" : "")}>
                 <span className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold", i === 0 ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface")}>
                   {i + 1}
                 </span>
                 <div>
                   <h4 className="font-bold text-on-surface text-sm">{step.title}</h4>
                   <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{step.description}</p>
                 </div>
               </div>
             ))}
          </div>
          <button className="w-full bg-gradient-to-br from-primary to-on-primary-container py-5 rounded-full text-on-primary font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all mt-4">
              Order Treatment Supplies
          </button>
        </section>

        <section className={getGlow('preven', "bg-surface-container-low p-6 rounded-xl border border-outline-variant/10", "ring-2 ring-primary")}>
          <h3 className="font-headline text-xl mb-4 text-on-surface italic">How to prevent</h3>
          <ul className="space-y-4">
             {result.preventive_measures.map((measure, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="text-sm text-on-surface-variant leading-tight mt-0.5">{measure}</span>
                </li>
             ))}
          </ul>
        </section>

        <section className="bg-surface-container-highest rounded-2xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-headline text-xl text-on-surface mb-2">Need an expert's second opinion?</h3>
            <p className="text-sm text-on-surface-variant mb-4">A licensed Crop Expert can review your scan within 2 hours.</p>
            <button 
              onClick={() => setChatOpen(true)}
              className="flex items-center justify-center gap-2 w-full border border-outline-variant bg-surface/50 backdrop-blur-md py-4 rounded-full text-on-surface font-bold transition-all active:scale-95 text-sm"
            >
              <span className="material-symbols-outlined text-primary">chat_bubble</span>
              Talk to an Crop Expert
            </button>
          </div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        </section>
      </main>

      {chatOpen ? <AgronomistChat result={result} forceOpen={true} onClose={() => setChatOpen(false)} /> : <AgronomistChat result={result} />}
    </>
  );
};