import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MeshBackground } from '../components/MeshBackground';
import { saveSession } from '../services/session';

export const AuthScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Save session to localStorage — swap this for a real API call when backend is ready
    saveSession({
      name: name || email.split('@')[0], // fallback to email prefix if no name
      email,
    });
    onLogin();
    navigate('/dashboard');
  };

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <MeshBackground />
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
        <span className="text-2xl font-extrabold tracking-tighter text-white">
          🌱 Agri<span className="text-primary">Nova</span> AI
        </span>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface-container/60 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl w-full max-w-md relative z-10 shadow-2xl"
      >
        <h2 className="font-headline italic text-4xl font-bold text-white mb-2">
          {isLogin ? "Welcome back." : "Create account."}
        </h2>
        <p className="text-on-surface-variant mb-8">
          {isLogin ? "Log in to access your digital Crop Expert." : "Sign up to protect your yields."}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Full Name</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Jane Doe" />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Email Address</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="name@farm.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Password</label>
            <input required type="password" className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-primary text-black font-bold text-lg py-4 rounded-xl mt-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(166,215,0,0.2)]">
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:underline">
            {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
