import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ScanningLoaderProps {
  image: string;
}

const steps = [
  "Analyzing leaf patterns...",
  "Detecting anomalies...",
  "Querying agricultural database...",
  "Assessing regional climate context...",
  "Generating localized treatment plan..."
];

export const ScanningLoader = ({ image }: ScanningLoaderProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
      <div className="relative w-full max-w-[320px] aspect-square rounded-[20px] overflow-hidden border border-editorial-glass-border p-0 bg-black/40">
        <img 
          src={image} 
          alt="Scanning" 
          className="w-full h-full object-cover grayscale-[0.3]"
        />
        <div className="absolute inset-x-0 h-0.5 bg-editorial-emerald shadow-[0_0_15px_#10b981] z-10 animate-scan" />
        <div className="absolute inset-0 bg-editorial-emerald/5 pointer-events-none" />
      </div>

      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-5 h-5 text-editorial-emerald animate-spin" />
        <AnimatePresence mode="wait">
          <motion.p 
            key={currentStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs font-black uppercase tracking-[2px] text-white/40 text-center"
          >
            {steps[currentStep]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};
