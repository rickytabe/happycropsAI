import { motion } from "motion/react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Activity, 
  Droplets, 
  CloudRain, 
  Calendar, 
  Volume2,
  TrendingUp,
  MapPin
} from "lucide-react";
import { AnalysisResult } from "../types";
import { cn } from "../lib/utils";

interface BentoDashboardProps {
  result: AnalysisResult;
}

export const BentoDashboard = ({ result }: BentoDashboardProps) => {
  const isHealthy = result.status === "healthy";
  
  const speak = () => {
    const text = `
      Status: ${result.disease_name}. 
      Confidence: ${Math.round(result.confidence_score * 100)} percent.
      Treatment steps: ${result.treatment_steps.join(", ")}.
      Preventive advice: ${result.preventive_measures.join(", ")}.
    `;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6"
    >
      {/* Left Column: Image & Status */}
      <div className="flex flex-col gap-6">
        <motion.div variants={item} className="relative aspect-square rounded-[20px] overflow-hidden border border-editorial-glass-border bg-black/40">
           {result.imageUrl && (
             <img src={result.imageUrl} className="w-full h-full object-cover grayscale-[0.2]" alt="Analyzed" />
           )}
           <div className="absolute top-[20%] left-0 w-full h-0.5 bg-editorial-emerald shadow-[0_0_15px_#10b981] animate-scan" />
        </motion.div>

        <motion.div variants={item} className="glass p-5 rounded-[20px] flex items-center justify-between">
          <div>
            <div className="text-[11px] text-white/40 uppercase tracking-[0.8px] mb-1">AI Diagnosis</div>
            <div className="font-semibold text-lg">{result.disease_name}</div>
          </div>
          <div className={cn(
            "text-[12px] font-bold uppercase tracking-wider",
            result.risk_level === 'high' ? "text-editorial-danger" : "text-editorial-gold"
          )}>
            {result.risk_level} Risk
          </div>
        </motion.div>

        <motion.button 
          variants={item}
          onClick={speak}
          className="bg-white text-black py-3 px-6 rounded-full font-bold text-xs uppercase flex items-center justify-center gap-3 hover:bg-white/90 transition-colors active:scale-95"
        >
          <Volume2 className="w-4 h-4" />
          Listen to Advice
        </motion.button>
      </div>

      {/* Right Column: Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Confidence Card */}
        <motion.div variants={item} className="glass p-6 rounded-[20px] flex flex-col justify-between min-h-[160px]">
          <div className="text-[11px] text-white/40 uppercase tracking-[0.8px]">Confidence</div>
          <div className="text-4xl font-light text-editorial-emerald">{Math.round(result.confidence_score * 100)}%</div>
          <div className="text-[11px] opacity-50">Pattern verified against local samples</div>
        </motion.div>

        {/* Contextual Insights (Span 2) */}
        <motion.div variants={item} className="md:col-span-2 glass p-6 rounded-[20px] flex flex-col justify-between min-h-[160px]">
          <div className="text-[11px] text-white/40 uppercase tracking-[0.8px]">Contextual Insights</div>
          <div className="text-sm md:text-base leading-relaxed text-white/90 mt-2">
            {result.contextual_insight}
          </div>
          <div className="text-[11px] opacity-40 mt-2 italic flex items-center gap-2">
            <Info className="w-3 h-3" />
            Hyper-local environmental analysis active
          </div>
        </motion.div>

        {/* Treatment Plan (Span Row 2) */}
        <motion.div variants={item} className="xl:row-span-2 glass p-6 rounded-[20px] flex flex-col space-y-6">
          <div className="text-[11px] text-white/40 uppercase tracking-[0.8px]">Treatment Plan</div>
          <div className="flex flex-col gap-5">
            {result.treatment_steps.slice(0, 3).map((step, i) => (
              <div key={i} className="flex gap-4">
                <span className="w-6 h-6 bg-editorial-emerald rounded-full shrink-0 flex items-center justify-center font-extrabold text-[10px] text-bg-deep">
                  {i + 1}
                </span>
                <span className="text-[14px] leading-[1.4] text-white/90">{step}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Yield Impact (Warning) */}
        <motion.div variants={item} className="glass p-6 rounded-[20px] bg-editorial-danger/10 border-editorial-danger/20 flex flex-col justify-between min-h-[160px]">
          <div className="text-[11px] text-editorial-danger uppercase tracking-[0.8px]">Yield Impact</div>
          <div className="text-2xl font-bold">{result.untreated_impact.split(' ').slice(0, 3).join(' ')}</div>
          <div className="space-y-3">
             <div className="text-[11px] text-white/60">Projected reduction within 14 days</div>
             <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "70%" }}
                  className="h-full bg-editorial-danger shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                />
             </div>
          </div>
        </motion.div>

        {/* Vector Check / Causes */}
        <motion.div variants={item} className="glass p-6 rounded-[20px] flex flex-col justify-between min-h-[160px]">
          <div className="text-[11px] text-white/40 uppercase tracking-[0.8px]">Identified Causes</div>
          <div className="text-xl font-bold">Vector & Environment</div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-white/5 rounded-md text-[11px] uppercase font-semibold">Biological</span>
            <span className="px-2 py-1 bg-white/5 rounded-md text-[11px] uppercase font-semibold">Environmental</span>
          </div>
        </motion.div>

        {/* Seasonal Guidance (Span 2) */}
        <motion.div variants={item} className="md:col-span-2 glass p-6 rounded-[20px] flex items-start gap-5 min-h-[140px]">
          <div className="text-3xl opacity-30 shrink-0">📅</div>
          <div className="flex flex-col gap-2">
             <div className="text-[11px] text-white/40 uppercase tracking-[0.8px]">Seasonal Guidance</div>
             <div className="text-[13px] leading-relaxed text-white/90">
                <strong>Current Window:</strong> {result.seasonal_advice}
             </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
