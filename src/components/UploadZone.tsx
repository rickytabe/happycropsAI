import { motion } from "motion/react";
import { Camera, Upload, Image as ImageIcon, Globe } from "lucide-react";
import { Region } from "../types";
import { cn } from "../lib/utils";
import { ChangeEvent } from "react";

interface UploadZoneProps {
  onImageSelect: (base64: string) => void;
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
}

const regions: Region[] = ["West Africa", "East Africa", "Southern Africa", "South Asia", "Latin America"];

export const UploadZone = ({ onImageSelect, selectedRegion, onRegionChange }: UploadZoneProps) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-16 py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-3xl"
      >
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9]">
          Snap. Diagnose. <br />
          <span className="text-editorial-emerald">Protect your crops.</span>
        </h1>
        <p className="text-lg md:text-xl text-white/50 font-medium max-w-xl mx-auto">
          Production-grade AI Crop Expert for smallholder farmers. Precise diagnosis with localized environmental context.
        </p>
      </motion.div>

      <div className="w-full max-w-xl space-y-10">
        {/* Region Selector */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white/40 font-bold uppercase tracking-[1px] text-[10px]">
            <Globe className="w-3 h-3 text-editorial-emerald" />
            <span>Select Deployment Region</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => onRegionChange(region)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                  selectedRegion === region 
                    ? "bg-editorial-emerald text-bg-deep shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                    : "glass text-white/40 hover:text-white"
                )}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Interaction Cards */}
        <div className="grid grid-cols-2 gap-4">
          <label className="group relative flex flex-col items-center justify-center space-y-4 p-10 glass rounded-[20px] cursor-pointer hover:bg-white/10 transition-all duration-300 active:scale-95 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-editorial-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
            <div className="p-4 rounded-full bg-editorial-emerald/10 text-editorial-emerald transition-transform group-hover:scale-110">
              <Camera className="w-8 h-8" />
            </div>
            <span className="font-bold uppercase tracking-[1.5px] text-[10px] text-white/60 group-hover:text-white">Active Camera</span>
          </label>

          <label className="group relative flex flex-col items-center justify-center space-y-4 p-10 glass rounded-[20px] cursor-pointer hover:bg-white/10 transition-all duration-300 active:scale-95 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-editorial-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <div className="p-4 rounded-full bg-editorial-gold/10 text-editorial-gold transition-transform group-hover:scale-110">
              <Upload className="w-8 h-8" />
            </div>
            <span className="font-bold uppercase tracking-[1.5px] text-[10px] text-white/60 group-hover:text-white">Image Library</span>
          </label>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center space-x-4 text-white/20 text-[10px] font-black uppercase tracking-[2px] pt-4"
        >
          <div className="w-12 h-px bg-white/5" />
          <span>LMM Engine Ready</span>
          <div className="w-12 h-px bg-white/5" />
        </motion.div>
      </div>
    </div>
  );
};
