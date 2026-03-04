import { Link } from 'react-router-dom';
import { Coins, Database, TrendingUp, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { playGoldSound } from '../utils/sounds';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#050505] overflow-x-hidden font-sans page-transition">

      {/* Background Animated Glare */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
          className="absolute -top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] bg-gradient-radial from-[#D4AF37] to-transparent opacity-10"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-gradient-radial from-[#D4AF37] to-transparent opacity-10"
        />
      </div>

      {/* Header Profile Area */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full flex flex-col items-center pt-8 pb-12 z-10"
      >
        <div className="text-center mt-2 relative">
          <div className="absolute inset-0 bg-[#D4AF37] blur-[40px] opacity-20 rounded-full" />
          <img src={import.meta.env.BASE_URL + "logo-main.png"} alt="DMY Jewellers" className="w-48 md:w-64 h-auto relative filter contrast-125 saturate-150 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
        </div>

        <h2 className="mt-8 text-transparent bg-clip-text bg-gradient-to-r from-[#F0E6D2] via-[#D4AF37] to-[#F0E6D2] font-serif italic text-xl tracking-widest font-light">
          Welcome to DMY
        </h2>
      </motion.div>

      {/* Grid of 4 categories */}
      <div className="px-6 -mt-2 relative z-10 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-4"
        >

          {/* Scheme */}
          <motion.div variants={itemVariants}>
            <Link to="/scheme" onClick={() => playGoldSound()} className="bg-[#0A0A0A] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-6 flex flex-col items-center justify-center text-center aspect-square border border-white/10 hover:border-[#D4AF37]/50 transition-all active:scale-[0.98] group overflow-hidden relative">
              <span className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#111] to-[#1a1a1a] flex items-center justify-center mb-4 border border-[rgba(212,175,55,0.2)] shadow-[inset_0_0_15px_rgba(212,175,55,0.1)] group-hover:shadow-[inset_0_0_25px_rgba(212,175,55,0.3)] transition-shadow">
                <Coins size={32} className="text-[#D4AF37] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-serif italic text-white text-lg tracking-wide group-hover:text-[#D4AF37] transition-colors">Wealth<br /><span className="text-[#888] font-sans font-light not-italic text-sm uppercase tracking-widest mt-1 block">Vault</span></h3>
            </Link>
          </motion.div>

          {/* Gold Coins */}
          <motion.div variants={itemVariants}>
            <Link to="/gold-bars" onClick={() => playGoldSound()} className="bg-[#0A0A0A] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-6 flex flex-col items-center justify-center text-center aspect-square border border-white/10 hover:border-[#D4AF37]/50 transition-all active:scale-[0.98] group overflow-hidden relative">
              <span className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#111] to-[#1a1a1a] flex items-center justify-center mb-4 border border-[rgba(212,175,55,0.2)] shadow-[inset_0_0_15px_rgba(212,175,55,0.1)] group-hover:shadow-[inset_0_0_25px_rgba(212,175,55,0.3)] transition-shadow">
                <Database size={32} className="text-[#D4AF37] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-serif italic text-white text-lg tracking-wide group-hover:text-[#D4AF37] transition-colors">Bullion<br /><span className="text-[#888] font-sans font-light not-italic text-sm uppercase tracking-widest mt-1 block">& Coins</span></h3>
            </Link>
          </motion.div>

          {/* Trending Categories */}
          <motion.div variants={itemVariants}>
            <Link to="/categories" onClick={() => playGoldSound()} className="bg-[#0A0A0A] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-6 flex flex-col items-center justify-center text-center aspect-square border border-white/10 hover:border-[#D4AF37]/50 transition-all active:scale-[0.98] group overflow-hidden relative">
              <span className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#111] to-[#1a1a1a] flex items-center justify-center mb-4 border border-[rgba(212,175,55,0.2)] shadow-[inset_0_0_15px_rgba(212,175,55,0.1)] group-hover:shadow-[inset_0_0_25px_rgba(212,175,55,0.3)] transition-shadow">
                <TrendingUp size={32} className="text-[#D4AF37] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-serif italic text-white text-lg tracking-wide group-hover:text-[#D4AF37] transition-colors">Trending<br /><span className="text-[#888] font-sans font-light not-italic text-sm uppercase tracking-widest mt-1 block">Categories</span></h3>
            </Link>
          </motion.div>

          {/* Trending Products */}
          <motion.div variants={itemVariants}>
            <Link to="/products" onClick={() => playGoldSound()} className="bg-[#0A0A0A] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-6 flex flex-col items-center justify-center text-center aspect-square border border-white/10 hover:border-[#D4AF37]/50 transition-all active:scale-[0.98] group overflow-hidden relative">
              <span className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#111] to-[#1a1a1a] flex items-center justify-center mb-4 border border-[rgba(212,175,55,0.2)] shadow-[inset_0_0_15px_rgba(212,175,55,0.1)] group-hover:shadow-[inset_0_0_25px_rgba(212,175,55,0.3)] transition-shadow">
                <ShoppingBag size={32} className="text-[#D4AF37] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-serif italic text-white text-lg tracking-wide group-hover:text-[#D4AF37] transition-colors">Exclusive<br /><span className="text-[#888] font-sans font-light not-italic text-sm uppercase tracking-widest mt-1 block">Products</span></h3>
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}