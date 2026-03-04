import { useState, useEffect } from "react";
import { ArrowLeft, Check, Minus, Plus, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import httpService from "../services/httpService";
import toast from 'react-hot-toast';
import { playGoldSound } from "../utils/sounds";

export default function GoldBars() {
    const [karat, setKarat] = useState<'22' | '24'>('24');
    const [dynamicRate22k, setDynamicRate22k] = useState<number>(125.30);
    const [dynamicRate24k, setDynamicRate24k] = useState<number>(175.30);

    useEffect(() => {
        const fetchGoldRate = async () => {
            try {
                const data: any = await httpService.get('/api/gold-rates/today');
                if (data.rate) {
                    if (data.rate.rate22k) setDynamicRate22k(data.rate.rate22k);
                    if (data.rate.rate24k) setDynamicRate24k(data.rate.rate24k);
                }
            } catch (error) {
                console.error('Failed to fetch gold rate', error);
            }
        };
        fetchGoldRate();
    }, []);

    // Dynamic price based on karat
    const ratePerGram = karat === '24' ? dynamicRate24k : dynamicRate22k;

    const productsList = [
        { id: 1, title: "Gold Coin", weightGram: 1, name: "1 Gram" },
        { id: 2, title: "Gold Coin", weightGram: 2, name: "2 Grams" },
        { id: 3, title: "Gold Coin", weightGram: 4, name: "4 Grams" },
        { id: 4, title: "Gold Coin", weightGram: 8, name: "8 Grams" },
        { id: 5, title: "Gold Bar", weightGram: 10, name: "10 Grams" },
        { id: 6, title: "Gold Bar", weightGram: 20, name: "20 Grams" },
        { id: 7, title: "Gold Bar", weightGram: 50, name: "50 Grams" },
        { id: 8, title: "Gold Bar", weightGram: 100, name: "100 Grams" },
    ];

    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [enquiryStatus, setEnquiryStatus] = useState<Record<number, string>>({});
    const [confirmModal, setConfirmModal] = useState<any>(null);

    const handleQuantity = (id: number, delta: number) => {
        playGoldSound();
        setQuantities(prev => {
            const current = prev[id] || 1;
            const next = current + delta;
            if (next < 1) return prev;
            return { ...prev, [id]: next };
        });
    };

    const triggerEnquire = (product: any) => {
        playGoldSound();
        setConfirmModal(product);
    };

    const handleEnquire = async () => {
        playGoldSound();
        if (!confirmModal) return;
        const product = confirmModal;
        setConfirmModal(null);

        const qty = quantities[product.id] || 1;
        const totalPrice = qty * product.weightGram * ratePerGram;

        try {
            setEnquiryStatus(prev => ({ ...prev, [product.id]: 'loading' }));
            await httpService.post('/api/enquiry', {
                item: `${product.title} ${product.name} - ${karat}K`,
                quantity: qty,
                totalPrice: totalPrice
            });

            setEnquiryStatus(prev => ({ ...prev, [product.id]: 'success' }));
            toast.success('Interest Registered', { style: { background: '#0B0B0B', color: '#D4AF37' } });
            setTimeout(() => {
                setEnquiryStatus(prev => ({ ...prev, [product.id]: '' }));
            }, 3000);
        } catch (error) {
            console.error(error);
            setEnquiryStatus(prev => ({ ...prev, [product.id]: '' }));
            toast.error('Failed to register interest');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen bg-[#050505] font-sans px-5 pt-8 pb-32 text-[#D4AF37] relative overflow-x-hidden page-transition">

            {/* Background Glare */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
                    className="absolute -top-[10%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] bg-gradient-radial from-[#D4AF37] to-transparent opacity-10"
                />
            </div>

            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center space-x-4 mb-8 pt-2 relative z-10"
            >
                <Link to="/home" onClick={() => playGoldSound()} className="text-[#D4AF37] hover:scale-110 transition-transform">
                    <ArrowLeft size={26} strokeWidth={2.5} />
                </Link>
                <h1 className="text-[22px] font-serif italic tracking-widest text-[#D4AF37]">Bullion & Coins</h1>
            </motion.div>

            {/* Karat Selection */}
            <div className="flex w-full bg-[#0A0A0A] border border-[rgba(212,175,55,0.2)] rounded-xl p-1 mb-10 shadow-inner relative z-10">
                <button
                    onClick={() => { playGoldSound(); setKarat('22'); }}
                    className={`flex-1 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all duration-300 ${karat === '22' ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'text-[#666] hover:text-[#D4AF37]'}`}
                >
                    22 Karat
                </button>
                <button
                    onClick={() => { playGoldSound(); setKarat('24'); }}
                    className={`flex-1 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all duration-300 ${karat === '24' ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'text-[#666] hover:text-[#D4AF37]'}`}
                >
                    24 Karat
                </button>
            </div>

            {/* Rates Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-[#111] via-[#1a1a1a] to-[#111] border border-[rgba(212,175,55,0.15)] rounded-2xl p-4 mb-10 flex items-center justify-between relative z-10 shadow-2xl"
            >
                <div>
                    <span className="text-[10px] text-[#A3A3A3] font-inter uppercase tracking-[0.2em] block mb-1">Current Base Rate</span>
                    <h2 className="text-xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#F0E6D2] to-[#D4AF37]">S$ {ratePerGram.toFixed(2)} /g</h2>
                </div>
                <ShieldCheck size={32} className="text-[#D4AF37]/50 drop-shadow-[0_0_10px_rgba(212,175,55,0.2)]" />
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 gap-x-4 gap-y-12 mb-10 relative z-10">
                {productsList.map((p) => {
                    const qty = quantities[p.id] || 1;
                    const price = p.weightGram * ratePerGram;
                    const status = enquiryStatus[p.id];

                    return (
                        <motion.div variants={itemVariants} key={p.id} className="bg-[#0B0B0B] rounded-[24px] shadow-2xl p-4 flex flex-col items-center relative mt-8 border border-white/5 hover:border-[#D4AF37]/30 transition-colors group">

                            {/* Visual Representation (Floating Coin/Bar) */}
                            <div className="absolute -top-10 flex flex-col items-center justify-center filter drop-shadow-[0_10px_20px_rgba(212,175,55,0.2)] group-hover:-translate-y-2 transition-transform duration-300">
                                <motion.div
                                    animate={{ rotateY: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                    className={`w-20 h-20 rounded-full bg-gradient-to-br from-[#FFF5D1] via-[#D4AF37] to-[#8A6D1C] flex items-center justify-center border-4 border-[#050505] shadow-[inset_0_0_20px_rgba(255,255,255,0.5)]`}
                                >
                                    <div className="flex flex-col items-center justify-center opacity-80 mix-blend-multiply">
                                        <span className="text-[14px] font-serif font-black tracking-tighter leading-none text-[#8A6D1C]">DMY</span>
                                        <span className="text-[10px] font-sans font-bold leading-none text-[#5c4710] tracking-widest mt-0.5">{karat}K</span>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="mt-10 text-center w-full">
                                <h3 className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D1] to-[#D4AF37] text-lg mb-1">{p.title}</h3>
                                <p className="text-[#888] text-[10px] font-sans uppercase tracking-[0.2em] mb-4">{p.name} • {karat}K</p>

                                <div className="bg-[#111] border border-[rgba(212,175,55,0.1)] rounded-xl py-2 mb-4">
                                    <span className="text-[9px] uppercase tracking-widest text-[#666] block mb-0.5">Estimated Value</span>
                                    <p className="text-white font-sans font-bold text-sm tracking-wider">S$ {price.toFixed(2)}</p>
                                </div>

                                {/* Quantity Selector */}
                                <div className="flex items-center justify-between bg-[#151515] border border-white/5 rounded-xl p-1 mb-4">
                                    <button onClick={() => handleQuantity(p.id, -1)} className="p-2 rounded-lg text-[#888] hover:text-[#D4AF37] hover:bg-[#222] transition-colors focus:outline-none focus:ring-1 focus:ring-[#D4AF37]">
                                        <Minus size={14} />
                                    </button>
                                    <span className="font-sans font-bold text-sm text-white w-6 text-center">{qty}</span>
                                    <button onClick={() => handleQuantity(p.id, 1)} className="p-2 rounded-lg text-[#888] hover:text-[#D4AF37] hover:bg-[#222] transition-colors focus:outline-none focus:ring-1 focus:ring-[#D4AF37]">
                                        <Plus size={14} />
                                    </button>
                                </div>

                                {/* Enquire Button */}
                                {status === 'success' ? (
                                    <button disabled className="bg-[#D4AF37] text-black text-[10px] uppercase tracking-widest px-2 py-3.5 rounded-xl font-bold w-full shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center gap-1">
                                        <Check size={14} /> Registered
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => triggerEnquire(p)}
                                        disabled={status === 'loading'}
                                        className="bg-transparent border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] uppercase tracking-widest px-2 py-3.5 rounded-xl font-bold hover:bg-[#D4AF37] hover:text-black transition-all w-full focus:outline-none disabled:opacity-50"
                                    >
                                        {status === 'loading' ? 'Processing...' : 'Register Interest'}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0B0B0B] border border-white/10 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />

                            <h2 className="text-xl font-serif text-[#D4AF37] mb-4 text-center">Confirm Acquisition</h2>
                            <p className="text-[#A3A3A3] font-sans text-sm mb-8 text-center leading-relaxed">
                                Proceed with securing interest for <strong className="text-white">{(quantities[confirmModal.id] || 1)}x {confirmModal.title} {confirmModal.name} ({karat}K)</strong> from the vault?
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleEnquire}
                                    className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B6942C] text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-[0.98] transition-transform"
                                >
                                    Confirm Interest
                                </button>
                                <button
                                    onClick={() => { playGoldSound(); setConfirmModal(null); }}
                                    className="w-full py-3 bg-transparent text-[#666] font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
                                >
                                    Revoke
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
