import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { countries } from '../lib/countries';

export const SettingsScreen = ({ isOffline }: { isOffline: boolean }) => {
  const [offlineSync, setOfflineSync] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [defaultCountry, setDefaultCountry] = useState("United States");

  useEffect(() => {
    const saved = localStorage.getItem('default_country');
    if (saved) setDefaultCountry(saved);
  }, []);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setDefaultCountry(val);
    localStorage.setItem('default_country', val);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="font-headline italic text-4xl text-white font-bold">App Settings</h1>

      <div className="space-y-6">
         {/* Preferences */}
         <section className="bg-surface-container/30 border border-white/5 rounded-2xl p-6 md:p-8">
           <h2 className="text-xl font-bold text-[#A6D700] mb-6 flex items-center gap-2">
             <span className="material-symbols-outlined">tune</span> Preferences
           </h2>
           
           <div className="space-y-6">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                 <h3 className="font-bold text-white text-lg">Default Country</h3>
                 <p className="text-sm text-on-surface-variant max-w-sm">Automatically select this country when scanning crops, allowing AI to recommend localized commercial treatments instantly.</p>
               </div>
               <div className="relative w-full md:w-64 shrink-0">
                 <select 
                    value={defaultCountry}
                    onChange={handleCountryChange}
                    className="w-full appearance-none bg-surface-container border border-outline-variant/30 text-white py-3 px-4 rounded-xl font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer shadow-lg"
                 >
                   {countries.map(c => (
                      <option key={c.code} value={c.name}>{c.flag || c.code} {c.name}</option>
                   ))}
                 </select>
                 <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">expand_more</span>
               </div>
             </div>
           </div>
         </section>

         {/* Network & Sync */}
         <section className="bg-surface-container/30 border border-white/5 rounded-2xl p-6 md:p-8">
           <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
             <span className="material-symbols-outlined">wifi</span> Network & Sync
           </h2>
           
           <div className="space-y-6">
             <div className="flex items-center justify-between">
               <div>
                 <h3 className="font-bold text-white text-lg">Current Status</h3>
                 <p className="text-sm text-on-surface-variant">
                   {isOffline ? "You are disconnected. Using offline AI models." : "Connected to Live AI Network."}
                 </p>
               </div>
               <div className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest", isOffline ? "bg-amber-500/10 text-amber-500" : "bg-primary/20 text-primary")}>
                 {isOffline ? "Offline" : "Online"}
               </div>
             </div>

             <div className="flex items-center justify-between">
               <div>
                 <h3 className="font-bold text-white text-lg">Background Sync</h3>
                 <p className="text-sm text-on-surface-variant max-w-sm">Automatically sync diagnostic history and download updated regional AI weights when on Wi-Fi.</p>
               </div>
               <button 
                 onClick={() => setOfflineSync(!offlineSync)}
                 className={cn("w-14 h-8 rounded-full transition-colors relative flex items-center", offlineSync ? "bg-primary" : "bg-surface-container-highest")}
               >
                 <div className={cn("w-6 h-6 rounded-full bg-white transition-all shadow-md mx-1", offlineSync ? "ml-7" : "")}></div>
               </button>
             </div>
             
             <div className="flex items-center justify-between">
               <div>
                 <h3 className="font-bold text-white text-lg">Data Saver Mode</h3>
                 <p className="text-sm text-on-surface-variant max-w-sm">Compress images before sending to AI servers. Saves bandwidth but slightly reduces accuracy.</p>
               </div>
               <button 
                 onClick={() => setDataSaver(!dataSaver)}
                 className={cn("w-14 h-8 rounded-full transition-colors relative flex items-center", dataSaver ? "bg-primary" : "bg-surface-container-highest")}
               >
                 <div className={cn("w-6 h-6 rounded-full bg-white transition-all shadow-md mx-1", dataSaver ? "ml-7" : "")}></div>
               </button>
             </div>
           </div>
         </section>

         {/* Account */}
         <section className="bg-surface-container/30 border border-white/5 rounded-2xl p-6 md:p-8">
           <h2 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
             <span className="material-symbols-outlined">person</span> Profile
           </h2>
           
           <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-surface-container-highest border border-white/15 overflow-hidden">
                <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVltvsmDoV3tZLLyVyhcNXyIN7tDNAW_v1ODAVK5ubsPO0R_EaqpaNr3ghWRZ7VLSXAdqRc_qa37yM_6vqHZAjaEMMWgYpmz7BNZ-EAQKblKk37PnxjA3tzIkHCi9MyxaRUWa1Zcy2wcZoo6Bs973loIxGoGC10r08UzjTAizJ5TaSWM07d-HkcxlH5esQMt_RbYlTv6v50E77SjwW_G1u_vQ8gtUNC6-ZDfpPk16wvCCEZYpY97lT5_r-6Z6DO-wour7gaxpf8zVt"/>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Guest Crop Expert</h3>
                <p className="text-on-surface-variant">guest@agrinova.ai</p>
                <div className="mt-2 text-xs font-bold text-primary uppercase tracking-widest">Enterprise Plan</div>
              </div>
           </div>
           
           <button className="px-6 py-3 border border-white/10 text-white rounded-xl font-bold hover:bg-white/5 transition-colors">
             Edit Profile Details
           </button>
         </section>
      </div>

    </div>
  );
};
