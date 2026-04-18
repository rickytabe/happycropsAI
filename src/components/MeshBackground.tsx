import { motion } from "motion/react";

export const MeshBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-bg-deep">
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(217, 119, 6, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(6, 26, 18, 1) 0%, rgba(2, 12, 8, 1) 100%)
          `
        }}
      />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
    </div>
  );
};
