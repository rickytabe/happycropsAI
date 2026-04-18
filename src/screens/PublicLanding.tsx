import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MeshBackground } from '../components/MeshBackground';

export const PublicLanding = () => {
  return (
    <div className="bg-surface min-h-screen text-on-surface font-body relative overflow-hidden">
      <MeshBackground />
      
      {/* Responsive Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 md:px-10 h-20 bg-surface/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-extrabold tracking-tighter text-white">
            🌱 Agri<span className="text-primary">Nova</span> AI
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/auth" className="hidden md:block text-sm font-bold text-on-surface-variant hover:text-white transition-colors">
            Log In
          </Link>
          <Link to="/auth" className="px-5 py-2 bg-primary text-black rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-headline italic text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight max-w-4xl"
        >
          Diagnose crop diseases instantly with <span className="text-primary not-italic">AI precision.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-lg md:text-xl text-on-surface-variant max-w-2xl"
        >
          Offline-first, enterprise-grade botanical intelligence designed for modern agriculture. Protect your yield with real-time field scans.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-col md:flex-row items-center gap-4"
        >
          <Link to="/auth" className="px-8 py-4 bg-primary text-black text-lg rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(166,215,0,0.3)] w-full md:w-auto">
            Get Started
          </Link>
          <Link to="/auth" className="px-8 py-4 bg-white/5 border border-white/10 text-white text-lg rounded-full font-bold hover:bg-white/10 transition-all w-full md:w-auto">
            View Live Demo
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
        >
          {[
            { icon: "wifi_off", title: "Offline First", desc: "Scan fields even without internet connectivity." },
            { icon: "analytics", title: "Deep Analysis", desc: "Get treatment plans, spread factors, and risk levels." },
            { icon: "support_agent", title: "Expert Chat", desc: "Discuss results instantly with our digital Crop Expert." }
          ].map((feature, i) => (
             <div key={i} className="bg-surface-container/50 backdrop-blur-md p-8 rounded-2xl border border-white/5 text-left">
               <span className="material-symbols-outlined text-primary text-4xl mb-4">{feature.icon}</span>
               <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
               <p className="text-on-surface-variant">{feature.desc}</p>
             </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};
