import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { AnalysisResult } from '../types';
import { Share2, Printer, ArrowLeft } from 'lucide-react';
import { DesktopDashboard } from '../components/DesktopDashboard';
import { MobileDashboard } from '../components/MobileDashboard';
import { useParams, useNavigate } from 'react-router-dom';

interface ResultsScreenProps {
  history: AnalysisResult[];
  deleteHistory: (timestamp: number) => void;
}

export const ResultsScreen = ({ history, deleteHistory }: ResultsScreenProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shareToast, setShareToast] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const result = history.find(h => h.timestamp.toString() === id);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-6">
        <h2 className="font-headline text-3xl font-bold text-white">Diagnostic Not Found</h2>
        <p className="text-on-surface-variant">The requested log does not exist or has been removed.</p>
        <button onClick={() => navigate('/dashboard/diagnostics')} className="px-6 py-3 bg-primary text-black font-bold rounded-full">
          Return to Diagnostics
        </button>
      </div>
    );
  }

  // ── Share ─────────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setShareToast(msg);
    setTimeout(() => setShareToast(null), 3000);
  };

  const handleShare = async () => {
    const text = `🌱 HappyCrops AI Diagnosis\n\nCrop: ${result.disease_name}\nRisk: ${result.risk_level.toUpperCase()}\nCountry: ${result.country}\n\n${result.contextual_insight}\n\nView full report: ${window.location.href}`;

    // 1. Try native Web Share API (mobile browsers)
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `Crop Diagnosis: ${result.disease_name}`,
          text,
          url: window.location.href,
        });
        return;
      } catch (err: any) {
        // User cancelled — do nothing
        if (err?.name === 'AbortError') return;
      }
    }

    // 2. Fallback — copy URL to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Report link copied to clipboard!');
    } catch {
      // 3. Last resort — execCommand (old browsers / no permissions)
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        showToast('Report link copied to clipboard!');
      } catch {
        showToast('Copy this URL: ' + window.location.href);
      }
      document.body.removeChild(textArea);
    }
  };

  // ── PDF Export via Print ───────────────────────────────────────────
  const handleDownloadPDF = () => {
    // We'll use a class on the body to trigger the print-only CSS overrides
    document.body.classList.add('is-printing-report');

    const restore = () => {
      document.body.classList.remove('is-printing-report');
      window.removeEventListener('afterprint', restore);
    };

    window.addEventListener('afterprint', restore);

    // Small delay to allow browser to reflow layout to desktop based on the new class
    setTimeout(() => {
      window.print();
      
      // Secondary fallback for mobile browsers that don't trigger afterprint
      setTimeout(restore, 500);
    }, 250);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Toast notification */}
      {shareToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-surface-container border border-white/10 text-white text-sm font-bold px-5 py-3 rounded-full shadow-2xl backdrop-blur-xl flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
          {shareToast}
        </div>
      )}

      {/* Action bar — hidden when printing via [data-print="hide"] */}
      <div data-print="hide" className="flex items-center justify-between mb-6 md:mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold">Back</span>
        </button>
        <div className="flex space-x-2">
          <button
            onClick={handleShare}
            className="bg-surface-container border border-white/10 p-3 rounded-2xl hover:bg-white/10 transition-all text-white"
            title="Share Report"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-surface-container border border-white/10 p-3 rounded-2xl hover:bg-white/10 transition-all text-white flex items-center gap-2"
            title="Download as PDF"
          >
            <Printer className="w-5 h-5" />
            <span className="hidden md:inline text-sm font-bold">Download PDF</span>
          </button>
          <button
            onClick={() => { if (window.confirm('Delete this diagnostic report?')) { deleteHistory(result.timestamp); navigate('/dashboard/diagnostics'); } }}
            className="bg-surface-container border border-white/10 p-3 rounded-2xl hover:bg-white/10 transition-all text-on-surface-variant hover:text-red-500"
            title="Delete Report"
          >
            <span className="material-symbols-outlined flex items-center justify-center" style={{ fontSize: '20px' }}>delete</span>
          </button>
        </div>
      </div>

      {/* Captured content */}
      <div ref={contentRef}>
        {/* Desktop layout — id used by handleDownloadPDF to force-show before printing */}
        <div id="pdf-desktop-view" className="hidden md:block">
          <DesktopDashboard result={result} />
        </div>
        {/* Mobile layout — id used by handleDownloadPDF to force-hide before printing */}
        <div id="pdf-mobile-view" className="block md:hidden">
          <MobileDashboard result={result} />
        </div>
      </div>
    </motion.div>
  );
};
