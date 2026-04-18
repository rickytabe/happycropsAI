import { AnalysisResult } from '../types';

export const ActivityScreen = ({ history }: { history: AnalysisResult[] }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="font-headline italic text-4xl text-white font-bold">Activity Log</h1>
      
      <div className="bg-surface-container/30 border border-white/5 rounded-2xl p-8 relative">
        <div className="absolute left-10 md:left-14 top-10 bottom-10 w-px bg-white/10 hidden md:block"></div>
        <div className="space-y-12 relative z-10">
          
          <div className="flex gap-6 items-start group">
            <div className="w-12 h-12 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center flex-shrink-0 z-10">
               <span className="material-symbols-outlined">psychology</span>
            </div>
            <div>
              <div className="text-sm text-on-surface-variant font-bold mb-1">Today, 10:45 AM</div>
              <h3 className="text-xl font-bold text-white mb-2">Crop Expert Consultation</h3>
              <p className="text-on-surface-variant">Discussed prevention measures for Late Blight in Plot 4B with Dr. Aris.</p>
            </div>
          </div>

          <div className="flex gap-6 items-start group">
            <div className="w-12 h-12 rounded-full bg-secondary/20 text-secondary border border-secondary/30 flex items-center justify-center flex-shrink-0 z-10">
               <span className="material-symbols-outlined">download</span>
            </div>
            <div>
              <div className="text-sm text-on-surface-variant font-bold mb-1">Yesterday, 14:20 PM</div>
              <h3 className="text-xl font-bold text-white mb-2">Downloaded Regional Models</h3>
              <p className="text-on-surface-variant">Offline inference models for 'East Africa' updated to latest version.</p>
            </div>
          </div>

          {history.length > 0 && (
             <div className="flex gap-6 items-start group">
               <div className="w-12 h-12 rounded-full bg-surface-container-highest text-white border border-white/15 flex items-center justify-center flex-shrink-0 z-10">
                  <span className="material-symbols-outlined">analytics</span>
               </div>
               <div>
                 <div className="text-sm text-on-surface-variant font-bold mb-1">{new Date(history[0].timestamp).toLocaleDateString()}</div>
                 <h3 className="text-xl font-bold text-white mb-2">Performed Diagnostic Scan</h3>
                 <p className="text-on-surface-variant">Analyzed {history[0].disease_name} in {history[0].country}.</p>
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};
