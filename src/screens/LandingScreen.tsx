import { motion } from 'motion/react';
import { UploadZone } from '../components/UploadZone';
import { History } from '../components/History';
import { AnalysisResult, Region } from '../types';

interface LandingScreenProps {
  error: string | null;
  isOffline: boolean;
  region: Region;
  setRegion: (r: Region) => void;
  handleImageSelect: (base64: string) => void;
  history: AnalysisResult[];
  handleHistorySelect: (scan: AnalysisResult) => void;
  clearHistory: () => void;
}

export const LandingScreen = ({
  error, isOffline, region, setRegion, handleImageSelect, history, handleHistorySelect, clearHistory
}: LandingScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 px-6 md:pt-32 md:max-w-7xl mx-auto"
    >
      <div className="max-w-md mx-auto md:max-w-xl">
        {error && (
            <div className="bg-error-container border border-error text-on-error-container p-4 rounded-xl mb-6 text-center shadow-lg text-sm font-bold">
            {error}
            </div>
        )}
        {isOffline && (
            <div className="md:hidden bg-amber-500/10 border border-amber-500/30 text-amber-500 p-4 rounded-xl mb-6 text-center text-xs font-bold uppercase tracking-widest">
            ● Offline Cache Active
            </div>
        )}
        <UploadZone 
            onImageSelect={handleImageSelect} 
            selectedRegion={region}
            onRegionChange={setRegion}
        />
        <div className="max-w-md mx-auto">
          <History 
              scans={history} 
              onSelect={handleHistorySelect} 
              onClear={clearHistory}
              isOffline={isOffline}
          />
        </div>
      </div>
    </motion.div>
  );
};
