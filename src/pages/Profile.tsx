import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Heart, ChevronRight, ShieldCheck, Box, TrendingUp, X, Mail, Phone, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import httpService from "../services/httpService";
import toast from "react-hot-toast";
import { playGoldSound } from "../utils/sounds";

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [goldHistory, setGoldHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [userData, enquiriesData, goldData] = await Promise.all([
                    httpService.get('/api/user/myprofile'),
                    httpService.get('/api/enquiry'),
                    httpService.get('/api/gold-rates/history')
                ]);

                setUser(userData);
                if (enquiriesData && enquiriesData.enquiries) {
                    setEnquiries(enquiriesData.enquiries);
                }
                if (goldData && goldData.history) {
                    // Format history for recharts
                    const formatted = goldData.history.map((h: any) => ({
                        date: new Date(h.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
                        rate22k: h.rate22k,
                        rate24k: h.rate24k
                    }));
                    setGoldHistory(formatted);
                }
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
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
        { icon: User, label: "My Profile" },
        // { icon: Palette, label: "Theme Settings", action: () => { playGoldSound(); navigate('/theme-settings'); } }
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
        <div className="w-full min-h-screen bg-[#050505] text-[#D4AF37] pb-24 font-sans overflow-x-hidden page-transition">
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
                    {isLoading ? "Authenticating..." : (user?.name || "DMY Member")}
                </h1>

                <p className="text-[#888] font-inter text-xs tracking-widest uppercase mb-5">
                    {user?.createdAt ? `Granted Access ${new Date(user.createdAt).getFullYear()}` : "Access Granted 2026"}
                </p>

                <div className="flex items-center gap-2 bg-[#111111] border border-[rgba(212,175,55,0.3)] px-4 py-2 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                    <ShieldCheck size={14} className="text-[#D4AF37]" />
                    <span className="text-[#D4AF37] font-inter text-[10px] font-bold tracking-[0.2em] uppercase">Elite Tier</span>
                </div>
            </motion.div>

            {/* Gold Rate History Chart */}
            {goldHistory.length > 0 && (
                <div className="px-6 mt-10 relative z-10 w-full overflow-hidden">
                    <motion.div className="flex items-center justify-between mb-5 pl-2">
                        <h2 className="text-[10px] font-sans font-bold text-[#666] uppercase tracking-[0.2em] flex items-center gap-2">
                            <TrendingUp size={14} className="text-[#D4AF37]" />
                            Market Rate History
                        </h2>
                        <span className="text-[10px] bg-[#1A1A1A] border border-[#333333] px-2 py-1 rounded-full text-[#888]">30 Days</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#111111] p-5 rounded-3xl border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] relative w-full overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFF38E] to-[#D4AF37]" />
                        <h3 className="text-white font-serif italic mb-6 text-sm flex justify-between">
                            Gold Bullion (S$/g)
                            <div className="flex gap-3 items-center">
                                <span className="flex items-center gap-1 text-[10px] font-sans not-italic text-[#888] tracking-widest uppercase"><div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div> 22K</span>
                                <span className="flex items-center gap-1 text-[10px] font-sans not-italic text-[#888] tracking-widest uppercase"><div className="w-2 h-2 rounded-full bg-[#FFF5D1]"></div> 24K</span>
                            </div>
                        </h3>

                        <div className="w-full h-48 -ml-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={goldHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="color22k" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="color24k" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FFF5D1" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#FFF5D1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke="#444" fontSize={9} tickLine={false} axisLine={false} tickMargin={10} minTickGap={20} />
                                    <YAxis stroke="#444" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} domain={['auto', 'auto']} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111111', borderColor: 'rgba(212,175,55,0.3)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#D4AF37', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="rate24k" name="24K Rate" stroke="#FFF5D1" strokeWidth={2} fillOpacity={1} fill="url(#color24k)" />
                                    <Area type="monotone" dataKey="rate22k" name="22K Rate" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#color22k)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Acquisition History */}
            <div className="px-6 mt-10 relative z-10 w-full overflow-hidden">
                <motion.div className="flex items-center justify-between mb-5 pl-2">
                    <h2 className="text-[10px] font-sans font-bold text-[#666] uppercase tracking-[0.2em] flex items-center gap-2">
                        <Heart size={14} className="text-[#D4AF37]" />
                        Acquisition History
                    </h2>
                    <span className="text-[10px] bg-[#1A1A1A] border border-[#333333] px-2 py-1 rounded-full text-[#888]">{enquiries.length} Requests</span>
                </motion.div>

                {enquiries.length > 0 ? (
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3 w-full max-w-[100vw] overflow-hidden">
                        {enquiries.map((enquiry, index) => (
                            <motion.div key={enquiry.id || index} variants={itemVariants} className="bg-[#111111] p-4 rounded-3xl border border-[#D4AF37]/30 shadow-[0_0_30px_rgba(212,175,55,0.1)] relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFF38E] to-[#D4AF37] opacity-50" />
                                <div className="flex items-start justify-between gap-2 overflow-hidden">
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#111111] transition-colors">
                                            <Box size={20} className="text-[#D4AF37]/70" />
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <h3 className="font-serif italic text-white text-[15px] truncate max-w-full drop-shadow-md pr-2">{enquiry.item}</h3>
                                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-lg border border-[#D4AF37]/30 whitespace-nowrap">
                                                    QTY: {enquiry.quantity}
                                                </span>
                                                {enquiry.totalPrice > 0 && (
                                                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#888] whitespace-nowrap">
                                                        S$ {Number(enquiry.totalPrice).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        <span className={`text-[9px] font-sans font-bold uppercase tracking-widest px-2 py-1 rounded-md mt-1 ${enquiry.status === 'PENDING' ? 'text-[#D4AF37] bg-black border border-[#D4AF37]/30' :
                                            enquiry.status === 'COMPLETED' ? 'text-green-500 bg-green-500/10 border border-green-500/30' :
                                                'text-[#888] bg-[#1A1A1A] border border-[#333333]'
                                            }`}>
                                            {enquiry.status || 'PENDING'}
                                        </span>
                                        <span className="text-[9px] text-[#444] tracking-wider whitespace-nowrap">
                                            {new Date(enquiry.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="bg-[#111111] p-6 rounded-3xl border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] text-center flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFF38E] to-[#D4AF37]" />
                        <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-3">
                            <Heart size={20} className="text-[#A3A3A3]" />
                        </div>
                        <p className="text-[#888] text-xs font-sans uppercase tracking-[0.2em]">No Active Requests</p>
                    </div>
                )}
            </div>

            {/* Menu Items */}
            <div className="px-6 mt-10 relative z-10">
                <motion.h2
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    className="text-[10px] font-sans font-bold text-[#666] uppercase tracking-[0.2em] mb-5 pl-2"
                >
                    Profile Settings
                </motion.h2>

                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
                    {menuItems.map((item, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <button onClick={() => { if (item.label === 'My Profile') { setShowProfileModal(true); } }} className="w-full bg-[#111111] p-4 rounded-2xl shadow-[0_0_15px_rgba(212,175,55,0.05)] hover:shadow-[0_0_25px_rgba(212,175,55,0.1)] border border-[#333333] flex items-center justify-between active:scale-[0.98] transition-all group hover:border-[#D4AF37]/50 relative overflow-hidden">
                                <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37]/50 via-[#FFF38E]/50 to-[#D4AF37]/50 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#333333] flex items-center justify-center group-hover:border-[#D4AF37]/50 transition-colors shadow-inner">
                                        <item.icon size={18} className="text-[#A3A3A3] group-hover:text-[#D4AF37] transition-colors" />
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
                    className="w-full bg-[#111111] p-4 rounded-xl border border-[#333333] flex items-center justify-center gap-2 text-[#888] active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(212,175,55,0.05)] hover:text-white hover:bg-[#1A1A1A] hover:border-[#D4AF37]/50"
                >
                    <LogOut size={18} />
                    <span className="font-sans font-bold text-xs tracking-widest uppercase">Logout</span>
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                className="text-center text-[10px] text-[#444] font-sans tracking-[0.2em] relative z-10 uppercase"
            >
                System v1.0.0
            </motion.div>

            {/* User Profile Details Modal */}
            <AnimatePresence>
                {showProfileModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-[#111111] border border-[#D4AF37]/30 rounded-2xl w-full max-w-sm max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(212,175,55,0.15)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFF38E] to-[#D4AF37] z-10" />
                            <div className="p-4 sm:p-5 border-b border-[#333333] flex justify-between items-center bg-[#1A1A1A] shrink-0 z-20">
                                <h2 className="text-sm uppercase tracking-widest font-bold text-[#D4AF37]">Identity Verification</h2>
                                <button onClick={() => setShowProfileModal(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="overflow-y-auto w-full flex-grow custom-scrollbar">
                                <div className="p-6 flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8A6D1C] flex items-center justify-center border-4 border-black mb-4 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                                        <User size={36} className="text-black" />
                                    </div>
                                    <h3 className="text-2xl font-serif text-white tracking-wide">{user?.name}</h3>
                                    <p className="text-[#D4AF37] text-xs font-sans font-bold tracking-widest uppercase mt-1">Elite Tier Member</p>
                                </div>

                                <div className="px-6 pb-6 space-y-4">
                                    <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#333333] flex items-center gap-4">
                                        <Mail size={18} className="text-[#A3A3A3]" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9px] text-[#888] tracking-widest uppercase mb-1">Email</p>
                                            <p className="text-[#D4AF37] text-sm truncate font-sans">{user?.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#333333] flex items-center gap-4">
                                        <Phone size={18} className="text-[#A3A3A3]" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9px] text-[#888] tracking-widest uppercase mb-1">Phone</p>
                                            <p className="text-[#D4AF37] text-sm truncate font-sans">{user?.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#333333] flex items-center gap-4">
                                        <Calendar size={18} className="text-[#A3A3A3]" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9px] text-[#888] tracking-widest uppercase mb-1">Access Granted</p>
                                            <p className="text-[#D4AF37] text-sm truncate font-sans">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
