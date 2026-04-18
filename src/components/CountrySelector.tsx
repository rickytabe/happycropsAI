import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { countries, Country } from "../lib/countries";

interface CountrySelectorProps {
  value: Country;
  onChange: (value: Country) => void;
  className?: string;
}

export const CountrySelector = ({ value, onChange, className }: CountrySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeCountryData = countries.find(c => c.name === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative z-50", className)} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-surface-container-high border border-outline-variant/30 text-white py-3 px-4 rounded-xl font-bold focus:outline-none hover:border-primary/50 transition-colors shadow-lg flex items-center justify-between"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {activeCountryData && (
            <img 
              src={`https://flagcdn.com/w20/${activeCountryData.code.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w40/${activeCountryData.code.toLowerCase()}.png 2x`}
              width="20"
              alt={activeCountryData.name}
              className="shadow-sm rounded-[2px] flex-shrink-0"
            />
          )}
          <span className="truncate">{activeCountryData?.name}</span>
        </div>
        <span className="material-symbols-outlined pointer-events-none text-white/50 flex-shrink-0 ml-3">
          {isOpen ? "expand_less" : "expand_more"}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 w-full bg-surface-container border border-outline-variant/30 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {countries.map(c => (
                <button
                  key={c.code}
                  onClick={() => { onChange(c.name as Country); setIsOpen(false); }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 flex items-center gap-3 rounded-lg transition-colors",
                    value === c.name ? "bg-primary/10 text-primary font-bold" : "text-white hover:bg-white/5"
                  )}
                >
                  <img 
                    src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png 2x`}
                    width="20"
                    alt={c.code}
                    className="shadow-sm rounded-[2px] flex-shrink-0"
                  />
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
