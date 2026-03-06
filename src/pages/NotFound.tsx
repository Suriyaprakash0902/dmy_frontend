import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import { playGoldSound } from '../utils/sounds';

export default function NotFound() {
    return (
        <div className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white overflow-x-hidden page-transition">

            {/* Background Animated Glare */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
                    className="absolute -top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] bg-gradient-radial from-[#D4AF37] to-transparent opacity-10"
                />
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 flex flex-col items-center text-center -mt-10"
            >
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-[#D4AF37] blur-[30px] opacity-20 rounded-full" />
                    <div className="w-24 h-24 rounded-full border border-[rgba(212,175,55,0.3)] bg-gradient-to-br from-[#111] to-[#0A0A0A] shadow-[inset_0_0_20px_rgba(212,175,55,0.1)] flex items-center justify-center relative z-10">
                        <AlertTriangle size={40} className="text-[#D4AF37]" strokeWidth={1.5} />
                    </div>

                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        className="absolute -inset-4 border border-dashed border-[#D4AF37]/30 rounded-full"
                    />
                </div>

                <h1 className="text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-[#F0E6D2] to-[#D4AF37] mb-2 drop-shadow-lg">404</h1>
                <h2 className="text-2xl font-serif italic text-white mb-4">Lost in the Vault</h2>
                <p className="text-[#888] font-sans text-sm max-w-xs mb-10 leading-relaxed uppercase tracking-widest">
                    The precious page you are looking for has been misplaced or does not exist.
                </p>

                <Link
                    to="/home"
                    onClick={() => playGoldSound()}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B6942C] text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all active:scale-[0.98]"
                >
                    <Home size={18} />
                    Return to Home
                </Link>
            </motion.div>
        </div>
    );
}
