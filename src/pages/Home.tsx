import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Coins, Database, TrendingUp, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playGoldSound } from '../utils/sounds';

interface Banner {
  id: string;
  image: string;
}

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_LIVE_API_URL}/get_banner`);
        const data = await response.json();
        if (data.status) {
          setBanners(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIdx((prev) => (prev + 1) % banners.length);
    }, 4000); // changes banner every 4 seconds
    return () => clearInterval(interval);
  }, [banners.length]);

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
    <div className="relative w-full min-h-screen bg-[var(--color-bg,#050505)] overflow-x-hidden font-sans page-transition transition-colors duration-500">

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
        className="relative w-full flex flex-col items-center pt-5 pb-5 z-10"
      >
        <div className="text-center mt-2 relative">
          <div className="absolute inset-0 bg-[#D4AF37] blur-[40px] opacity-20 rounded-full" />
          <img src={import.meta.env.BASE_URL + "logo.png"} alt="DMY Jewellers" className="w-48 md:w-64 h-auto relative filter contrast-125 saturate-150 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
        </div>
        {/* 
        <h2 className="mt-6 text-transparent bg-clip-text bg-gradient-to-r from-[#F0E6D2] via-[#D4AF37] to-[#F0E6D2] font-serif italic text-xl tracking-widest font-light">
          Welcome to DMY
        </h2> */}
      </motion.div>

      {/* Dynamic Banner Slider */}
      {banners.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="px-6 mb-8 relative z-10"
        >
          <div className="w-full aspect-[21/8] rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[rgba(212,175,55,0.2)] relative bg-black">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentBannerIdx}
                src={banners[currentBannerIdx].image}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full object-cover"
                alt={`Banner ${currentBannerIdx + 1}`}
              />
            </AnimatePresence>

            {/* Banner Overlay Gradient for Text/Dots visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
              {banners.map((_, idx) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentBannerIdx ? 'w-5 bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,1)]' : 'w-1.5 bg-white/40'}`} />
              ))}
            </div>
          </div>
        </motion.div>
      )}

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
            <Link to="/scheme" onClick={() => playGoldSound()} className="bg-white rounded-3xl shadow-[0_0_30px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] p-6 flex flex-col items-center justify-center text-center aspect-square border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all active:scale-[0.98] group overflow-hidden relative">
              <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37]/50 via-[#FFF38E]/50 to-[#D4AF37]/50 opacity-40 group-hover:opacity-100 transition-opacity z-10" />
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] relative z-10 bg-[#050505] border border-[#D4AF37]/20">
                <Coins size={32} className="text-[#D4AF37] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-serif italic text-[#050505] text-lg tracking-wide transition-all relative z-10 font-bold">Wealth<br /><span className="text-[#050505] font-sans font-medium not-italic text-[10px] uppercase tracking-[0.2em] mt-1 block">Scheme</span></h3>
            </Link>
          </motion.div>

          {/* Gold Coins */}
          <motion.div variants={itemVariants}>
            <Link to="/gold-bars" onClick={() => playGoldSound()} className="bg-white rounded-3xl shadow-[0_0_30px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] p-6 flex flex-col items-center justify-center text-center aspect-square border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all active:scale-[0.98] group overflow-hidden relative">
              <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37]/50 via-[#FFF38E]/50 to-[#D4AF37]/50 opacity-40 group-hover:opacity-100 transition-opacity z-10" />
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] relative z-10 bg-[#050505] border border-[#D4AF37]/20">
                <Database size={32} className="text-[#D4AF37] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-serif italic text-[#050505] text-lg tracking-wide transition-all relative z-10 font-bold">Bullion<br /><span className="text-[#050505] font-sans font-medium not-italic text-[10px] uppercase tracking-[0.2em] mt-1 block">& Coins</span></h3>
            </Link>
          </motion.div>

          {/* Trending Categories */}
          <motion.div variants={itemVariants}>
            <Link to="/categories" onClick={() => playGoldSound()} className="bg-white rounded-3xl shadow-[0_0_30px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] p-6 flex flex-col items-center justify-center text-center aspect-square border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all active:scale-[0.98] group overflow-hidden relative">
              <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37]/50 via-[#FFF38E]/50 to-[#D4AF37]/50 opacity-40 group-hover:opacity-100 transition-opacity z-10" />
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] relative z-10 bg-[#050505] border border-[#D4AF37]/20">
                <TrendingUp size={32} className="text-[#D4AF37] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-serif italic text-[#050505] text-lg tracking-wide transition-all relative z-10 font-bold">Trending<br /><span className="text-[#050505] font-sans font-medium not-italic text-[10px] uppercase tracking-[0.2em] mt-1 block">Categories</span></h3>
            </Link>
          </motion.div>

          {/* Trending Products */}
          <motion.div variants={itemVariants}>
            <Link to="/exclusive-offers" onClick={() => playGoldSound()} className="bg-white rounded-3xl shadow-[0_0_30px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] p-6 flex flex-col items-center justify-center text-center aspect-square border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all active:scale-[0.98] group overflow-hidden relative">
              <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37]/50 via-[#FFF38E]/50 to-[#D4AF37]/50 opacity-40 group-hover:opacity-100 transition-opacity z-10" />
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] relative z-10 bg-[#050505] border border-[#D4AF37]/20">
                <ShoppingBag size={32} className="text-[#D4AF37] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-serif italic text-[#050505] text-lg tracking-wide transition-all relative z-10 font-bold">Exclusive<br />
                <span className="text-[#050505] font-sans font-medium not-italic text-[10px] uppercase tracking-[0.2em] mt-1 block">Offers</span></h3>
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}