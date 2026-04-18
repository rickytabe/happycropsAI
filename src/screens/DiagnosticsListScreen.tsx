import { AnalysisResult } from '../types';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { countries } from '../lib/countries';

export const DiagnosticsListScreen = ({ history }: { history: AnalysisResult[] }) => {
  const navigate = useNavigate();

  const getFlag = (countryName: string) => {
    return countries.find(c => c.name === countryName)?.flag || "";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline italic text-4xl text-white font-bold">Diagnostics History</h1>
        <div className="px-4 py-2 bg-surface-container-high rounded-full border border-white/10 text-sm font-bold text-on-surface-variant">
          Total Logs: {history.length}
        </div>
      </div>
      
      <div className="space-y-4">
        {history.length === 0 ? (
           <div className="p-12 text-center text-on-surface-variant bg-surface-container/50 border border-white/5 rounded-2xl">
             No diagnostics history available yet.
           </div>
        ) : (
           history.map((scan, i) => {
             const isHealthy = scan.status === 'healthy';
             const iconColor = isHealthy ? 'text-primary' : (scan.risk_level === 'high' ? 'text-tertiary' : 'text-on-tertiary-container');
             const iconName = isHealthy ? 'check_circle' : 'warning';

             return (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.05 }}
                 key={scan.timestamp} 
                 onClick={() => navigate(`/dashboard/diagnostic/${scan.timestamp}`)} 
                 className="flex flex-col md:flex-row items-center gap-6 p-4 md:p-6 bg-surface-container/50 hover:bg-surface-container transition-colors rounded-2xl cursor-pointer border border-white/5 hover:border-white/20 group"
               >
                 <div className="w-full md:w-32 h-32 md:h-24 rounded-xl overflow-hidden flex-shrink-0 relative bg-surface-container-highest">
                   {scan.imageUrl && (
                      <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={scan.imageUrl} alt={scan.disease_name} />
                   )}
                 </div>
                 
                 <div className="flex-grow w-full md:w-auto">
                   <div className="flex items-start justify-between mb-1">
                     <div className="flex flex-col">
                       <h3 className="font-headline text-2xl font-bold text-white">{scan.disease_name}</h3>
                       <div className="flex items-center gap-1.5 text-on-surface-variant font-bold text-xs uppercase tracking-widest mt-0.5">
                         <span>{getFlag(scan.country)}</span>
                         <span>{scan.country}</span>
                       </div>
                     </div>
                     <span className="text-sm font-bold text-on-surface-variant">{new Date(scan.timestamp).toLocaleDateString()}</span>
                   </div>
                   <p className="text-sm text-on-surface-variant mb-3 line-clamp-1">{scan.contextual_insight}</p>
                   <div className="flex items-center gap-3">
                     <span className={cn("text-xs font-bold uppercase tracking-widest px-2 py-1 rounded bg-surface/50 border border-white/10 flex items-center gap-1", iconColor)}>
                       <span className="material-symbols-outlined text-[14px]">{iconName}</span>
                       {isHealthy ? "Healthy" : scan.risk_level + " Risk"}
                     </span>
                     <span className="text-xs font-bold text-on-surface-variant bg-surface/50 px-2 py-1 rounded border border-white/10">
                       {Math.round(scan.confidence_score * 100)}% Confidence
                     </span>
                   </div>
                 </div>
                 <div className="hidden md:flex flex-shrink-0 items-center justify-center p-4">
                   <span className="material-symbols-outlined text-white/20 group-hover:text-primary transition-colors">arrow_forward_ios</span>
                 </div>
               </motion.div>
             )
           })
        )}
      </div>
    </div>
  );
};
