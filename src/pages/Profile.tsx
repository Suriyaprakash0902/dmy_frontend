import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Settings, Bell, Heart, CreditCard, ChevronRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import httpService from "../services/httpService";
import toast from "react-hot-toast";
import { playGoldSound } from "../utils/sounds";

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await httpService.get('/api/user/myprofile');
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = async () => {
        playGoldSound();
        try {
            await httpService.post('/api/auth/logout');
        } catch (error) {
            console.error('Logout API failed', error);
        } finally {
            localStorage.removeItem('token');
            toast.success('Securely Logged Out', { style: { background: '#0B0B0B', color: '#D4AF37' } });
            navigate('/login');
        }
    };

    const menuItems = [
        { icon: User, label: "Vault Identity" },
        { icon: Heart, label: "Acquisition List" },
        { icon: CreditCard, label: "Funding sources" },
        { icon: Bell, label: "Signals" },
        { icon: Settings, label: "Preferences" }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    return (
        <div className="w-full min-h-screen bg-[#050505] text-[#D4AF37] pb-24 font-sans overflow-hidden page-transition">
            {/* Background Animations */}
            <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
                    className="absolute -top-[10%] left-[20%] w-[600px] h-[600px] rounded-full blur-[150px] bg-gradient-radial from-[#D4AF37] to-transparent"
                />
            </div>

            {/* Header section */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative w-full bg-[#0A0A0A] pt-16 pb-12 px-6 rounded-b-[40px] shadow-2xl flex flex-col items-center border-b border-[rgba(212,175,55,0.15)] z-10 overflow-hidden"
            >
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />

                <div className="relative w-28 h-28 flex items-center justify-center mb-5">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/40"
                    />
                    <div className="absolute inset-2 bg-gradient-to-br from-[#D4AF37] to-[#8A6D1C] rounded-full shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center justify-center overflow-hidden border-2 border-black">
                        <User size={48} className="text-black drop-shadow-md" />
                    </div>
                </div>

                <h1 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#F0E6D2] via-[#D4AF37] to-[#F0E6D2] mb-1 font-light tracking-wide text-center">
                    {isLoading ? "Authenticating..." : (user?.name || "Vault Member")}
                </h1>

                <p className="text-[#888] font-inter text-xs tracking-widest uppercase mb-5">
                    {user?.createdAt ? `Granted Access ${new Date(user.createdAt).getFullYear()}` : "Access Granted 2026"}
                </p>

                <div className="flex items-center gap-2 bg-[#111] border border-[rgba(212,175,55,0.3)] px-4 py-2 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                    <ShieldCheck size={14} className="text-[#D4AF37]" />
                    <span className="text-[#D4AF37] font-inter text-[10px] font-bold tracking-[0.2em] uppercase">Elite Tier</span>
                </div>
            </motion.div>

            {/* Menu Items */}
            <div className="px-6 mt-10 relative z-10">
                <motion.h2
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    className="text-[10px] font-sans font-bold text-[#666] uppercase tracking-[0.2em] mb-5 pl-2"
                >
                    Vault Settings
                </motion.h2>

                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
                    {menuItems.map((item, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <button onClick={() => playGoldSound()} className="w-full bg-[#0B0B0B] p-4 rounded-2xl shadow-lg border border-white/5 flex items-center justify-between active:scale-[0.98] transition-all group hover:border-[rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] relative overflow-hidden">
                                <span className="absolute inset-0 bg-gradient-to-r from-[rgba(212,175,55,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-[#111] border border-white/5 flex items-center justify-center group-hover:border-[#D4AF37]/50 transition-colors shadow-inner">
                                        <item.icon size={18} className="text-[#888] group-hover:text-[#D4AF37] transition-colors" />
                                    </div>
                                    <span className="font-sans font-bold text-sm tracking-widest text-[#CCC] group-hover:text-white uppercase transition-colors">{item.label}</span>
                                </div>
                                <ChevronRight size={18} className="text-[#444] group-hover:text-[#D4AF37] relative z-10 transition-colors" />
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Logout section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                className="px-6 mt-12 mb-8 relative z-10"
            >
                <button
                    onClick={handleLogout}
                    className="w-full bg-[#111] p-4 rounded-xl border border-white/10 flex items-center justify-center gap-2 text-[#888] active:scale-[0.98] transition-all shadow-md hover:text-white hover:bg-[#1A1A1A] hover:border-white/20"
                >
                    <LogOut size={18} />
                    <span className="font-sans font-bold text-xs tracking-widest uppercase">Revoke Access</span>
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                className="text-center text-[10px] text-[#444] font-sans tracking-[0.2em] relative z-10 uppercase"
            >
                System v1.0.0
            </motion.div>
        </div>
    );
}
