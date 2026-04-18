import { motion } from "motion/react";
import { History as HistoryIcon, WifiOff, Trash2 } from "lucide-react";
import { AnalysisResult } from "../types";
import { cn } from "../lib/utils";

interface HistoryProps {
  scans: AnalysisResult[];
  onSelect: (scan: AnalysisResult) => void;
  onClear: () => void;
  isOffline: boolean;
}

export const History = ({ scans, onSelect, onClear, isOffline }: HistoryProps) => {
  if (scans.length === 0) return null;

  return (
    <div className="space-y-6 pt-12 pb-24 border-t border-white/5">
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center space-x-3">
          <HistoryIcon className="w-4 h-4 text-editorial-emerald" />
          <h2 className="text-sm font-black uppercase tracking-[2px] opacity-40">Recent Activity</h2>
          {isOffline && (
             <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-editorial-gold/10 text-editorial-gold border border-editorial-gold/20 text-[9px] font-black uppercase tracking-wider">
               <WifiOff className="w-3 h-3" />
               <span>Offline</span>
             </div>
          )}
        </div>
        <button 
          onClick={onClear}
          className="p-2 text-emerald-100/40 hover:text-red-400 transition-colors"
          title="Clear History"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-6 px-4 scrollbar-hide">
        {scans.map((scan, i) => (
          <motion.div
            key={scan.timestamp}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(scan)}
            className="flex-shrink-0 w-64 glass rounded-[20px] p-4 cursor-pointer hover:bg-white/10 transition-all group"
          >
            <div className="aspect-video rounded-xl overflow-hidden mb-4 relative">
              <img 
                src={scan.imageUrl} 
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" 
                alt="Scan" 
              />
              <div className={cn(
                "absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase shadow-lg tracking-wider",
                scan.status === 'healthy' ? "bg-editorial-emerald text-bg-deep" : "bg-editorial-danger text-white"
              )}>
                {scan.status}
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm truncate">{scan.disease_name}</h4>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-[1px]">
                {new Date(scan.timestamp).toLocaleDateString()} • {scan.risk_level} risk
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
