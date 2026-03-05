import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { playGoldSound } from '../utils/sounds';

export default function Landing() {
    const navigate = useNavigate();

    const handleStart = () => {
        playGoldSound();
        navigate('/login');
    };

    return (
        <div className="relative min-h-screen bg-[#050505] overflow-hidden flex flex-col items-center justify-center font-inter page-transition pb-20">
            {/* Animated Luxury Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                    className="absolute -top-[20%] -right-[20%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
                    style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }}
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
                    className="absolute -bottom-[20%] -left-[20%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-10"
                    style={{ background: 'radial-gradient(circle, #CFB53B 0%, transparent 70%)' }}
                />
            </div>

            <div className="z-10 flex flex-col items-center w-full px-6">

                {/* Logo Reveal */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                    className="mb-12 relative"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                    >
                        <img
                            src={import.meta.env.BASE_URL + "logo-main.png"}
                            alt="DMY Jewellers"
                            className="w-56 md:w-72 h-auto drop-shadow-[0_10px_30px_rgba(212,175,55,0.3)] filter contrast-125"
                        />
                    </motion.div>
                </motion.div>

                {/* Catchphrase */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="text-center space-y-4 max-w-sm"
                >
                    <h1 className="text-3xl font-playfair font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F0E6D2] via-[#D4AF37] to-[#F0E6D2] tracking-wide">
                        Invest in Purity
                    </h1>
                    <p className="text-[#A3A3A3] text-sm font-light leading-relaxed px-4">
                        Secure your future with our exclusive gold savings scheme. Premium pure gold, elevated lifestyle.
                    </p>
                </motion.div>

                {/* Action Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="mt-16 w-full max-w-xs"
                >
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleStart}
                        className="w-full relative overflow-hidden rounded-2xl p-[1px] group"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] via-[#FFF38E] to-[#D4AF37] rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-[pulse_3s_infinite]" />
                        <div className="relative bg-[#0A0A0A] w-full py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 group-hover:bg-[#111111] shadow-[0_0_40px_rgba(212,175,55,0.15)] group-hover:shadow-[0_0_60px_rgba(212,175,55,0.3)]">
                            <span className="font-inter font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E8D08B] to-[#C9A84C] text-[15px] uppercase tracking-widest">
                                Begin Journey
                            </span>
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="text-[#D4AF37]"
                            >
                                →
                            </motion.span>
                        </div>
                    </motion.button>

                </motion.div>

            </div>
        </div>
    );
}