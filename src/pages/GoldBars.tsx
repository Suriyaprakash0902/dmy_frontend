import { useState, useEffect } from "react";
import { ArrowLeft, Check, Minus, Plus, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import httpService from "../services/httpService";
import toast from 'react-hot-toast';
import { playGoldSound } from "../utils/sounds";

interface Bullion {
    id: string;
    bullion_name: string;
    bullion_quantity: string;
    image: string;
}

export default function GoldBars() {
    const [karat, setKarat] = useState<'22' | '24'>('24');
    const [dynamicRate22k, setDynamicRate22k] = useState<number>(0);
    const [dynamicRate24k, setDynamicRate24k] = useState<number>(0);
    const [bullions, setBullions] = useState<Bullion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch rate
                try {
                    const rateData: any = await httpService.get('/api/gold-rates/today');
                    if (rateData.rate) {
                        if (rateData.rate.rate22k) setDynamicRate22k(rateData.rate.rate22k);
                        if (rateData.rate.rate24k) setDynamicRate24k(rateData.rate.rate24k);
                    }
                } catch (e) {
                    console.error("Failed to fetch gold rate", e);
                }

                // Fetch bullion gallery
                const response = await fetch(`${import.meta.env.VITE_LIVE_API_URL}/get_bullion_gallery`);
                const data = await response.json();
                if (data.status) {
                    // Filter or use directly
                    setBullions(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch bullion gallery:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Helper to parse weights mathematically
    const parseWeight = (quantityStr: string) => {
        const s = quantityStr.toLowerCase();
        if (s.includes('½') || s.includes('1/2 ounce')) return 15.5515;
        if (s.includes('1 ounce')) return 31.1035;

        const match = s.match(/[\d.]+/);
        if (match) {
            let num = parseFloat(match[0]);
            if (s.includes('ounce')) num *= 31.1035;
            return num;
        }
        return 1; // Default fallback to 1g
    };

    const ratePerGram = karat === '24' ? dynamicRate24k : dynamicRate22k;

    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [enquiryStatus, setEnquiryStatus] = useState<Record<string, string>>({});
    const [confirmModal, setConfirmModal] = useState<Bullion | null>(null);

    const handleQuantity = (id: string, delta: number) => {
        playGoldSound();
        setQuantities(prev => {
            const current = prev[id] || 1;
            const next = current + delta;
            if (next < 1) return prev;
            return { ...prev, [id]: next };
        });
    };

    const triggerEnquire = (product: Bullion) => {
        playGoldSound();
        setConfirmModal(product);
    };

    const handleEnquire = async () => {
        playGoldSound();
        if (!confirmModal) return;
        const product = confirmModal;
        setConfirmModal(null);

        const qty = quantities[product.id] || 1;
        const weight = parseWeight(product.bullion_quantity);
        const totalPrice = qty * weight * ratePerGram;

        try {
            setEnquiryStatus(prev => ({ ...prev, [product.id]: 'loading' }));
            await httpService.post('/api/enquiry', {
                item: `${product.bullion_name} - ${product.bullion_quantity} (${karat}K)`,
                quantity: qty,
                totalPrice: totalPrice
            });

            setEnquiryStatus(prev => ({ ...prev, [product.id]: 'success' }));
            toast.success('Enquiry Registered', { style: { background: '#0B0B0B', color: '#D4AF37' } });
            setTimeout(() => {
                setEnquiryStatus(prev => ({ ...prev, [product.id]: '' }));
            }, 3000);
        } catch (error) {
            console.error(error);
            setEnquiryStatus(prev => ({ ...prev, [product.id]: '' }));
            toast.error('Failed to Enquiry');
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
        <div className="flex flex-col min-h-screen bg-[#050505] pb-32 font-sans overflow-x-hidden page-transition">

            {/* Background Glare */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
                    className="absolute -top-[10%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] bg-gradient-radial from-[#D4AF37] to-transparent opacity-10"
                />
            </div>

            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative w-full flex items-center p-6 shadow-2xl z-20"
                style={{
                    background: 'linear-gradient(180deg, rgba(11,43,33,1) 0%, rgba(5,5,5,1) 100%)',
                    borderBottom: '1px solid rgba(212,175,55,0.1)'
                }}
            >
                <Link to="/home" onClick={() => playGoldSound()} className="text-[#D4AF37] hover:scale-110 transition-transform">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-xl font-serif text-[#D4AF37] ml-4 font-light tracking-widest uppercase">Bullion & Coins</h1>
                <div className="ml-auto">
                    <img src={import.meta.env.BASE_URL + "logo.png"} alt="DMY Jewellers" className="h-8 w-auto filter contrast-125 saturate-150" />
                </div>
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
                    <span className="text-[10px] text-[#A3A3A3] font-inter uppercase tracking-[0.2em] block mb-1">Current Indicative Rate</span>
                    <h2 className="text-xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#F0E6D2] to-[#D4AF37]">S$ {ratePerGram.toFixed(2)} /g</h2>
                </div>
                <ShieldCheck size={32} className="text-[#D4AF37]/50 drop-shadow-[0_0_10px_rgba(212,175,55,0.2)]" />
            </motion.div>

            {loading ? (
                <div className="flex justify-center items-center h-40 relative z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
                </div>
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 gap-x-4 gap-y-12 mb-10 relative z-10 p-2">
                    {bullions.filter(p => {
                        const name = p.bullion_name?.toLowerCase() || '';
                        if (karat === '22') return name.includes('coin');
                        if (karat === '24') return name.includes('bar');
                        return true;
                    }).map((p) => {
                        const qty = quantities[p.id] || 1;
                        const weight = parseWeight(p.bullion_quantity);
                        const price = weight * ratePerGram;
                        const status = enquiryStatus[p.id];

                        const isCoin = karat === '22';

                        return (
                            <motion.div variants={itemVariants} key={p.id} className="bg-[#0B0B0B] rounded-[24px] shadow-2xl p-4 flex flex-col items-center relative mt-8 border border-white/5 hover:border-[#D4AF37]/30 transition-colors group">

                                {/* Visual Representation (Floating Coin/Bar) instead of API image */}
                                <div className="absolute -top-10 flex flex-col items-center justify-center filter drop-shadow-[0_10px_20px_rgba(212,175,55,0.2)] group-hover:-translate-y-2 transition-transform duration-300">
                                    <motion.div
                                        animate={{ rotateY: [0, 10, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                        className={`${isCoin ? 'w-20 h-20 rounded-full' : 'w-16 h-24 rounded-md'} bg-gradient-to-br from-[#FFF5D1] via-[#D4AF37] to-[#8A6D1C] flex items-center justify-center border-4 border-[#050505] shadow-[inset_0_0_20px_rgba(255,255,255,0.5)]`}
                                    >
                                        <div className="flex flex-col items-center justify-center opacity-80 mix-blend-multiply">
                                            {isCoin ? (
                                                <>
                                                    <span className="text-[14px] font-serif font-black tracking-tighter leading-none text-[#8A6D1C]">DMY</span>
                                                    <span className="text-[10px] font-sans font-bold leading-none text-[#5c4710] tracking-widest mt-0.5">{karat}K</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-[12px] font-serif font-black tracking-tighter leading-none text-[#8A6D1C]">DMY</span>
                                                    <span className="text-[8px] font-sans font-bold leading-none text-[#5c4710] tracking-widest mt-1">FINE GOLD</span>
                                                    <span className="text-[9px] font-sans font-bold leading-none text-[#5c4710] tracking-widest mt-1">999.9</span>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="mt-10 text-center w-full">
                                    <h3 className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D1] to-[#D4AF37] text-lg mb-1">{p.bullion_name}</h3>
                                    <p className="text-[#888] text-[10px] font-sans uppercase tracking-[0.2em] mb-4">{p.bullion_quantity} • {karat}K</p>

                                    <div className="bg-[#111] border border-[rgba(212,175,55,0.1)] rounded-xl py-2 mb-4">
                                        <span className="text-[9px] uppercase tracking-widest text-[#666] block mb-0.5">Estimated Value</span>
                                        <p className="text-white font-sans font-bold text-sm tracking-wider">S$ {(price * qty).toFixed(2)}</p>
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
                                            {status === 'loading' ? 'Processing...' : 'Enquiry'}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

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
                            <p className="text-[#A3A3A3] font-sans text-sm mb-4 text-center leading-relaxed">
                                Proceed with securing interest for <strong className="text-white">{(quantities[confirmModal.id] || 1)}x {confirmModal.bullion_name} - {confirmModal.bullion_quantity} ({karat}K)</strong>?
                            </p>

                            <div className="bg-[#111] border border-[rgba(212,175,55,0.1)] rounded-xl py-3 px-4 mb-3 flex justify-between items-center text-center">
                                <span className="text-[10px] uppercase tracking-widest text-[#666] block">Total Estimated Value</span>
                                <span className="text-[#D4AF37] font-sans font-bold tracking-wider">S$ {((quantities[confirmModal.id] || 1) * parseWeight(confirmModal.bullion_quantity) * ratePerGram).toFixed(2)}</span>
                            </div>

                            <p className="text-[#A3A3A3] font-sans text-[10px] mb-6 text-center italic bg-white/5 p-2 rounded-lg border border-white/10">
                                <b>Note:</b> The estimated value shown is for indication only. The final billable amount will be based on the exact base gold rate fixed at the time of final confirmation or collection, which may differ.
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
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
