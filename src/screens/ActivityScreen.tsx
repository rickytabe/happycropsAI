import { AnalysisResult } from '../types';
import { CountryFlag } from '../components/CountryFlag';

export const ActivityScreen = ({ history, deleteHistory }: { history: AnalysisResult[], deleteHistory: (t: number) => void }) => {
  // Sort history by timestamp descending
  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);


  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="font-headline italic text-4xl text-white font-bold">Activity Log</h1>
      
      <div className="bg-surface-container/30 border border-white/5 rounded-2xl p-8 relative min-h-[400px]">
        <div className="absolute left-10 md:left-14 top-10 bottom-10 w-px bg-white/10 hidden md:block"></div>
        <div className="space-y-12 relative z-10">
          
          {sortedHistory.length > 0 ? (
            sortedHistory.map((scan) => (
              <div key={scan.timestamp} className="flex gap-6 items-start group">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center flex-shrink-0 z-10 shadow-[0_0_15px_rgba(166,215,0,0.2)]">
                   <span className="material-symbols-outlined">analytics</span>
                </div>
                <div>
                  <div className="text-sm text-on-surface-variant font-bold mb-1">
                    {new Date(scan.timestamp).toLocaleString(undefined, { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Performed Diagnostic Scan</h3>
                  <div className="flex items-center gap-2">
                     <CountryFlag countryName={scan.country} size={22} />
                    <p className="text-on-surface-variant">
                      Analyzed <span className="text-primary font-bold">{scan.disease_name}</span> in {scan.country}. 
                      Risk identified as <span className={scan.risk_level === 'high' ? 'text-red-400' : 'text-amber-400'}>{scan.risk_level}</span>.
                    </p>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this activity record?')) deleteHistory(scan.timestamp); }} className="ml-auto opacity-0 group-hover:opacity-100 p-2 text-on-surface-variant hover:text-red-500 transition-all rounded-full" title="Delete record">
                  <span className="material-symbols-outlined text-[24px]">delete</span>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-on-surface-variant italic">
              <span className="material-symbols-outlined text-5xl mb-4 block opacity-20">history_toggle_off</span>
              <p>No recent diagnostic activities recorded yet.</p>
            </div>
          )}

          {/* Constant session start activity */}
          <div className="flex gap-6 items-start group pb-4">
            <div className="w-12 h-12 rounded-full bg-surface-container-highest text-white border border-white/15 flex items-center justify-center flex-shrink-0 z-10">
               <span className="material-symbols-outlined">bolt</span>
            </div>
            <div>
              <div className="text-sm text-on-surface-variant font-bold mb-1">Session Start</div>
              <h3 className="text-xl font-bold text-white mb-2">HappyCrops AI Initialized</h3>
              <p className="text-on-surface-variant">Neural diagnostics engine and regional specialized models loaded.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
