import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, X, ShieldCheck, Sparkles, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import httpService from "../services/httpService";
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { playGoldSound } from "../utils/sounds";

export default function Scheme() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [hasSchemes, setHasSchemes] = useState(false);
    const [schemes, setSchemes] = useState<any[]>([]);
    const [selectedScheme, setSelectedScheme] = useState<any>(null);

    const [showTerms, setShowTerms] = useState(false);
    const [agreeChecked, setAgreeChecked] = useState(false);
    const [confirmBuyModal, setConfirmBuyModal] = useState(false);

    const [buyMonth, setBuyMonth] = useState('');
    const [currentGoldRate, setCurrentGoldRate] = useState<number>();
    const [isBuying, setIsBuying] = useState(false);

    const fetchSchemeData = () => {
        setIsLoading(true);
        httpService.get('/api/schemes/my-scheme')
            .then((data: any) => {
                if ((data.hasSchemes && data.schemes && data.schemes.length > 0) || (data.hasScheme && data.scheme)) {
                    setHasSchemes(true);

                    const loadedSchemes = data.schemes || [data.scheme];
                    setSchemes(loadedSchemes);

                    // If a scheme was already selected, update its data
                    if (selectedScheme) {
                        const updated = loadedSchemes.find((s: any) => s.id === selectedScheme.id);
                        if (updated) {
                            setSelectedScheme(updated);
                            updateBuyMonth(updated);
                        }
                    }
                } else {
                    setHasSchemes(false);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    };

    const updateBuyMonth = (scheme: any) => {
        const successfulPayments = scheme.payments?.filter((p: any) => !p.status || p.status === 'PAID') || [];
        setBuyMonth(String(successfulPayments.length + 1));
    };

    const handleSelectScheme = (scheme: any) => {
        playGoldSound();
        setSelectedScheme(scheme);
        updateBuyMonth(scheme);
    };

    const fetchGoldRate = () => {
        httpService.get('/api/gold-rates/today')
            .then((data: any) => {
                if (data.rate && data.rate.rate22k) {
                    setCurrentGoldRate(data.rate.rate22k);
                }
            })
            .catch(console.error);
    };

    useEffect(() => {
        fetchGoldRate();
        fetchSchemeData();
    }, []);

    const handleApplyNow = () => {
        playGoldSound();
        setShowTerms(true);
    };

    const handleBuy = () => {
        playGoldSound();
        if (!buyMonth) {
            toast.error('Please select a valid month.');
            return;
        }
        setConfirmBuyModal(true);
    };

    const processBuy = async () => {
        if (!currentGoldRate) {
            toast.error("Live gold rate is unavailable right now. Please try again later.");
            return;
        }
        setConfirmBuyModal(false);
        setIsBuying(true);
        const amount = selectedScheme.amount;
        const gramAccumulated = Number((amount / currentGoldRate).toFixed(2));

        try {
            await httpService.post('/api/schemes/buy', {
                schemeId: selectedScheme.id,
                monthIndex: Number(buyMonth),
                goldRate: currentGoldRate,
                gramAccumulated: gramAccumulated,
                amountPaid: amount,
                status: 'PAID'
            });
            playGoldSound(true);
            confetti({
                particleCount: 200,
                spread: 90,
                origin: { y: 0.5 },
                colors: ['#FFD700', '#D4AF37', '#FFF8DC']
            });
            toast.success('Gold successfully secured in Scheme!', {
                duration: 4000,
                style: { background: '#0B2B21', color: '#D4AF37', border: '1px solid #D4AF37' },
                iconTheme: { primary: '#D4AF37', secondary: '#0B2B21' }
            });
            fetchSchemeData();
        } catch (error: any) {
            // Log as FAILED
            try {
                await httpService.post('/api/schemes/buy', {
                    schemeId: selectedScheme.id,
                    monthIndex: Number(buyMonth),
                    goldRate: currentGoldRate,
                    gramAccumulated: 0,
                    amountPaid: amount,
                    status: 'FAILED'
                });
                fetchSchemeData();
            } catch (e) { }
            toast.error(error.message || 'Failed to complete transaction', { duration: 5000 });
        } finally {
            setIsBuying(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex-grow flex items-center justify-center min-h-screen bg-[#050505]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-12 h-12 border-4 border-[#10241C] border-t-[#D4AF37] rounded-full"
                />
            </div>
        );
    }

    // --- RENDER SINGLE SELECTED SCHEME ---
    if (hasSchemes && selectedScheme) {
        const successfulPayments = selectedScheme.payments?.filter((p: any) => !p.status || p.status === 'PAID') || [];
        const totalGrams = successfulPayments.reduce((acc: number, p: any) => acc + (Number(p.gramAccumulated) || 0), 0) || 0;
        const monthsCompleted = successfulPayments.length || 0;

        return (
            <div className="flex flex-col min-h-screen bg-[#050505] pb-32 font-sans overflow-x-hidden">
                <div className="fixed inset-0 pointer-events-none z-0">
                    <motion.div
                        animate={{ opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] bg-gradient-radial from-[#D4AF37] to-transparent opacity-10"
                    />
                </div>

                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-full flex items-center p-6 shadow-2xl z-20"
                    style={{
                        background: 'linear-gradient(180deg, rgba(11,43,33,1) 0%, rgba(5,5,5,1) 100%)',
                        borderBottom: '1px solid rgba(212,175,55,0.1)'
                    }}
                >
                    <button onClick={() => { playGoldSound(); setSelectedScheme(null); }} className="text-[#D4AF37] hover:scale-110 transition-transform">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-serif text-[#D4AF37] ml-4 font-light tracking-widest uppercase">Scheme Plan</h1>
                    <div className="ml-auto">
                        <img src={import.meta.env.BASE_URL + "logo.png"} alt="DMY Jewellers" className="h-8 w-auto filter contrast-125 saturate-150" />
                    </div>
                </motion.div>

                <div className="px-5 mt-6 flex-grow z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full aspect-[1.6] rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)] border border-[#D4AF37]/30 bg-[#111111]"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFF38E] to-[#D4AF37] z-10" />
                        <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                            className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.05)] to-transparent skew-x-[-30deg]"
                        />

                        <div className="relative z-10 flex justify-between items-start">
                            <ShieldCheck className="text-[#D4AF37]" size={28} />
                            <span className="text-[10px] font-sans tracking-[0.2em] text-[#D4AF37] uppercase bg-black/40 px-3 py-1 rounded-full border border-[#D4AF37]/30">Active Plan</span>
                        </div>

                        <div className="relative z-10 flex flex-col mt-4">
                            <span className="text-gray-400 font-inter text-xs tracking-widest uppercase mb-1 drop-shadow-md">Accumulated Gold</span>
                            <div className="flex items-baseline gap-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                                <h2 className="text-5xl font-serif font-light text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D1] to-[#D4AF37] h-[60px]">
                                    {totalGrams.toFixed(2)}
                                </h2>
                                <span className="text-[#D4AF37] font-bold text-lg tracking-widest flex items-center gap-2">
                                    g <span className="text-[9px] bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] px-1.5 py-0.5 rounded align-middle drop-shadow-none top-[-2px] relative hidden sm:inline-block">22K 916</span>
                                    <span className="text-[9px] bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] px-1.5 py-0.5 rounded align-middle drop-shadow-none ml-1 sm:hidden">22K 916</span>
                                </span>
                            </div>
                        </div>

                        <div className="relative z-10 flex justify-between items-end mt-4">
                            <div>
                                <p className="text-[#888] text-[10px] font-inter uppercase tracking-widest mb-0.5">Gold Rate Today</p>
                                <p className="text-[#E0E0E0] font-sans font-medium">S$ <span className="text-[#D4AF37]">{currentGoldRate ? currentGoldRate.toFixed(2) : '--.--'}</span> /g</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[#888] text-[10px] font-inter uppercase tracking-widest mb-0.5">Progress</p>
                                <p className="text-[#D4AF37] font-serif font-bold">{monthsCompleted} / 12 Months</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-8 bg-[#111111] border border-[#D4AF37]/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(212,175,55,0.1)] relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37]/50 via-[#FFF38E]/50 to-[#D4AF37]/50 opacity-50" />
                        <div className="flex items-center gap-2 mb-4 relative z-10">
                            <Sparkles size={16} className="text-[#D4AF37]" />
                            <h3 className="text-white font-serif tracking-wide text-lg">Acquire Next Instalment</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
                            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-3">
                                <label className="text-[10px] uppercase tracking-widest text-[#888] block mb-1">Month Selected</label>
                                <select
                                    className="w-full bg-transparent text-[#D4AF37] font-bold outline-none font-serif appearance-none"
                                    value={buyMonth}
                                    onChange={(e) => setBuyMonth(e.target.value)}
                                >
                                    <option value="" disabled className="bg-black">Select Month</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
                                        const nextExpectedMonth = monthsCompleted + 1;
                                        const isPaidOrFuture = m !== nextExpectedMonth;
                                        return (
                                            <option key={m} value={m} disabled={isPaidOrFuture} className="bg-black">
                                                Month {m} {m < nextExpectedMonth ? '(Paid)' : ''}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-3 flex flex-col justify-center items-end">
                                <label className="text-[10px] uppercase tracking-widest text-[#888] block mb-1">Cost</label>
                                <span className="text-white font-bold font-sans">S$ {selectedScheme.amount}</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleBuy}
                            disabled={isBuying || monthsCompleted >= 12}
                            className={`w-full relative overflow-hidden rounded-xl p-[1px] group ${isBuying || monthsCompleted >= 12 ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] via-[#FFF38E] to-[#D4AF37] rounded-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="relative bg-[#0A0A0A] w-full py-4 rounded-xl flex items-center justify-center space-x-2 transition-all">
                                {isBuying ? (
                                    <span className="text-[#D4AF37] font-inter text-sm tracking-widest uppercase">Processing</span>
                                ) : (
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8D08B] to-[#C9A84C] font-bold text-sm tracking-widest uppercase">{monthsCompleted >= 12 ? 'Scheme Completed' : `Process S$ ${selectedScheme.amount}`}</span>
                                )}
                            </div>
                        </motion.button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-8 mb-4"
                    >
                        <h3 className="text-white/80 font-serif tracking-widest text-sm uppercase mb-3 ml-2">Receipt History</h3>
                        <div className="space-y-3">
                            {selectedScheme.payments?.slice().reverse().map((p: any, i: number) => {
                                const rawDate = new Date(p.createdAt || p.paymentDate);
                                const isFailed = p.status === 'FAILED';
                                return (
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 + Math.min(i * 0.1, 0.5) }}
                                        key={p.id || i}
                                        className="bg-[#111111] border border-[#D4AF37]/30 rounded-xl p-4 flex justify-between items-center shadow-[0_0_20px_rgba(212,175,55,0.05)] relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-[#D4AF37]/50 to-transparent" />
                                        <div className="pl-2">
                                            <p className="text-white font-bold font-serif mb-1 flex items-center gap-2">
                                                Month {p.monthIndex}
                                                <span className={`text-[9px] font-sans px-2 py-0.5 rounded-sm tracking-widest uppercase ${isFailed ? 'bg-[#3A1010] text-[#FF4444]' : 'bg-[#102410] text-[#44FF44]'}`}>
                                                    {isFailed ? 'FAILED' : 'PAID'}
                                                </span>
                                            </p>
                                            <p className="text-[#666] text-xs font-sans">{rawDate.toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            {isFailed ? (
                                                <p className="text-[#FF4444] text-[10px] tracking-widest uppercase mt-4">Review required</p>
                                            ) : (
                                                <>
                                                    <p className="text-[#D4AF37] font-bold">{Number(p.gramAccumulated).toFixed(2)} g</p>
                                                    <p className="text-[#888] text-[10px] mt-0.5">@ S$ {Number(p.goldRate).toFixed(2)}/g</p>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {(!selectedScheme.payments || selectedScheme.payments.length === 0) && (
                                <div className="text-center py-8 text-[#555] font-light text-sm italic">
                                    No transactions yet. Secure your first gold portion today.
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {confirmBuyModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-[#111111] border border-[#D4AF37]/30 rounded-2xl w-full max-w-sm p-8 shadow-[0_0_50px_rgba(212,175,55,0.15)] relative overflow-hidden"
                            >
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFF38E] to-[#D4AF37]" />

                                <h2 className="text-2xl font-serif text-[#D4AF37] mb-3 text-center">Confirm Authorization</h2>
                                <p className="text-[#AAA] font-inter text-sm mb-8 text-center leading-relaxed">
                                    Secure <strong className="text-white font-bold">{currentGoldRate ? (selectedScheme.amount / currentGoldRate).toFixed(2) : '--'}g</strong> of pure 22K gold for <strong className="text-white">Month {buyMonth}</strong> at S$ {selectedScheme.amount}?
                                </p>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={processBuy}
                                        className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#C9A84C] text-[#0A0A0A] font-bold uppercase tracking-widest text-sm rounded-xl hover:opacity-90 active:scale-[0.98] transition-transform shadow-lg"
                                    >
                                        Authorize Purchase
                                    </button>
                                    <button
                                        onClick={() => setConfirmBuyModal(false)}
                                        className="w-full py-3 bg-[#1A1A1A] border border-[#333333] text-[#A3A3A3] font-bold text-sm tracking-wider uppercase rounded-xl hover:bg-[#222222] transition-colors"
                                    >
                                        Revoke
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div >
        );
    }

    // --- RENDER SCHEMES LIST ---
    if (hasSchemes && !selectedScheme) {
        return (
            <div className="flex flex-col min-h-screen bg-[#050505] pb-32 font-sans overflow-x-hidden page-transition">
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
                    <h1 className="text-xl font-serif text-[#D4AF37] ml-4 font-light tracking-widest uppercase">My Scheme Plans</h1>
                    <div className="ml-auto">
                        <img src={import.meta.env.BASE_URL + "logo.png"} alt="DMY Jewellers" className="h-8 w-auto filter contrast-125 saturate-150" />
                    </div>
                </motion.div>

                <div className="px-5 mt-8 flex-grow z-10 space-y-4">
                    {schemes.map((scheme, i) => {
                        const successfulPayments = scheme.payments?.filter((p: any) => !p.status || p.status === 'PAID') || [];
                        const monthsCompleted = successfulPayments.length || 0;
                        const totalGrams = successfulPayments.reduce((acc: number, p: any) => acc + (Number(p.gramAccumulated) || 0), 0) || 0;

                        return (
                            <motion.div
                                key={scheme.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => handleSelectScheme(scheme)}
                                className="relative w-full aspect-[1.6] rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.1)] border border-[#D4AF37]/30 bg-[#111111] cursor-pointer group hover:shadow-[0_0_50px_rgba(212,175,55,0.2)] hover:border-[#D4AF37]/60 transition-all"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37]/50 via-[#FFF38E]/50 to-[#D4AF37]/50 opacity-40 group-hover:opacity-100 transition-opacity z-10" />
                                <motion.div
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                                    className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent skew-x-[-30deg]"
                                />

                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <h3 className="text-[#D4AF37] font-serif tracking-wide text-lg drop-shadow-md group-hover:text-[#FFF5D1] transition-colors">{scheme.name || 'Elite Plan'}</h3>
                                        <p className="text-[#666] font-sans text-[10px] tracking-widest uppercase mt-0.5">Scheme ID: {scheme.id.substring(0, 8).toUpperCase()}</p>
                                    </div>
                                    <div className="bg-black/40 border border-[#D4AF37]/30 p-2 rounded-full group-hover:bg-[#D4AF37]/20 transition-colors">
                                        <ChevronRight size={16} className="text-[#D4AF37]" />
                                    </div>
                                </div>

                                <div className="relative z-10 flex flex-col mt-4">
                                    <span className="text-gray-400 font-inter text-xs tracking-widest uppercase mb-1 drop-shadow-md">Total Accumulated</span>
                                    <div className="flex items-baseline gap-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                                        <h2 className="text-5xl font-serif font-light text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D1] to-[#D4AF37] h-[60px]">
                                            {totalGrams.toFixed(2)}
                                        </h2>
                                        <span className="text-[#D4AF37] font-bold text-lg tracking-widest flex items-center gap-2">
                                            g <span className="text-[9px] bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] px-1.5 py-0.5 rounded align-middle drop-shadow-none top-[-2px] relative hidden sm:inline-block">22K 916</span>
                                            <span className="text-[9px] bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] px-1.5 py-0.5 rounded align-middle drop-shadow-none ml-1 sm:hidden">22K 916</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="relative z-10 flex justify-between items-end mt-4">
                                    <div></div>
                                    <div className="text-right">
                                        <p className="text-[#888] text-[10px] font-inter uppercase tracking-widest mb-0.5">Progress</p>
                                        <p className="text-[#D4AF37] font-serif font-bold">{monthsCompleted} / 12 Months</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="pt-6 pb-12"
                    >
                        <button
                            onClick={handleApplyNow}
                            className="w-full bg-[#111111] text-[#D4AF37] border border-[#333333] border-dashed rounded-2xl py-5 flex flex-col items-center justify-center gap-2 hover:bg-[#1A1A1A] hover:border-[#D4AF37]/50 transition-all group active:scale-[0.98]"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Sparkles size={18} />
                            </div>
                            <span className="font-sans font-bold text-xs uppercase tracking-widest">Start Another Scheme Plan</span>
                        </button>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {showTerms && (
                        /* SAME TERMS MODAL AS BEFORE */
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        >
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="bg-[#111111] border border-[#D4AF37]/30 rounded-2xl w-full max-w-[90%] max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden relative"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFF38E] to-[#D4AF37]" />
                                <div className="p-5 border-b border-[#333] flex justify-between items-center bg-[#1A1A1A]">
                                    <h2 className="text-sm uppercase tracking-widest font-bold text-[#D4AF37]">The Agreement</h2>
                                    <button onClick={() => setShowTerms(false)} className="text-gray-500 hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-5 overflow-y-auto font-sans text-xs text-[#999] space-y-4 max-h-[60vh] leading-relaxed custom-scrollbar">
                                    <p>1) Members who fail to make a payment in a given month will have their scheme period extended for the number of months they have not paid.</p>
                                    <p>2) Members who make their monthly payments ahead of time will only receive their 13th month bonus at the end of their plan period.</p>
                                    <p>3) Members discontinuing or pre-closing halfway through the scheme will not be eligible for any benefits.</p>
                                    <p>4) All monthly payments are only redeemable as gold and/or diamond jewellery. No cash refunds or reimbursements will be made under any circumstances.</p>
                                    <p>5) The gold price, at the time of redemption, would be based on the prevailing gold price at DMY Jewellery on the day of purchase.</p>
                                    <p>6) Workmanship and other relevant charges will be levied additionally.</p>
                                    <p>7) Goods and Services Tax (GST) will be applicable on all purchases.</p>
                                    <p>8) Purchase of Pure Gold Bars and 916 Gold Coins are not permitted under this scheme.</p>
                                    <p>9) Members must produce both their active GSS Page on MyDMY App and photo ID for verification.</p>
                                    <p>10) DMY Jewellery Pte Ltd gives full guarantee to members.</p>
                                </div>

                                <div className="p-5 border-t border-[#333] bg-[#1A1A1A]">
                                    <label className="flex items-center gap-3 cursor-pointer mb-5">
                                        <input
                                            type="checkbox"
                                            checked={agreeChecked}
                                            onChange={(e) => setAgreeChecked(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-600 bg-black checked:bg-[#D4AF37] focus:ring-0 accent-[#D4AF37]"
                                        />
                                        <span className="font-medium text-[#BBB] text-xs uppercase tracking-wider">I Accept the terms</span>
                                    </label>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowTerms(false)}
                                            className="flex-1 py-3 text-xs tracking-widest uppercase rounded-xl border border-white/10 text-[#888] font-bold hover:bg-white/5 transition-colors"
                                        >
                                            Decline
                                        </button>
                                        <button
                                            onClick={() => {
                                                playGoldSound();
                                                if (agreeChecked) navigate('/scheme/apply');
                                            }}
                                            disabled={!agreeChecked}
                                            className="flex-1 py-3 text-xs tracking-widest uppercase rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C9A84C] text-[#0A0A0A] font-bold disabled:opacity-30 transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:shadow-none hover:opacity-90 active:scale-[0.98]"
                                        >
                                            Proceed
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // --- RENDER ZERO SCHEMES / APPLY ---
    return (
        <div className="flex flex-col min-h-screen bg-[#050505] pb-32 font-sans relative overflow-x-hidden page-transition">
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                    className="absolute -top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] bg-gradient-radial from-[#1A1A00] to-transparent opacity-50"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full flex items-center p-6 z-10"
            >
                <Link to="/home" className="text-[#D4AF37] hover:scale-110 transition-transform">
                    <ArrowLeft size={24} />
                </Link>
                <div className="ml-auto">
                    <img src={import.meta.env.BASE_URL + "logo.png"} alt="DMY Jewellers" className="h-8 w-auto filter contrast-125 saturate-150" />
                </div>
            </motion.div>

            <div className="px-5 flex-grow flex flex-col items-center justify-center z-10">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="w-full max-w-sm rounded-2xl relative p-[1px] overflow-hidden"
                >
                    <span className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] via-transparent to-[#D4AF37] rounded-2xl opacity-30" />

                    <div className="bg-[#111111] p-8 rounded-2xl relative z-10 flex flex-col items-center border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFF38E] to-[#D4AF37]" />
                        <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B6942C] rounded-full flex items-center justify-center mb-6 mt-4 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                            <Sparkles className="text-black" size={28} />
                        </div>

                        <h2 className="text-3xl font-serif text-[#D4AF37] italic mb-3 text-center">
                            Elite Gold Scheme
                        </h2>

                        <p className="text-center text-[#888] text-sm leading-relaxed mb-8">
                            Join the most exclusive 12-month wealth accumulation plan. Secure pure 22K gold systematically with no making charges at maturity.
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleApplyNow}
                            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C9A84C] text-[#0A0A0A] font-bold uppercase tracking-widest text-sm py-4 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:opacity-90"
                        >
                            Begin Journey
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {showTerms && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-[#111111] border border-[#D4AF37]/30 rounded-2xl w-full max-w-[90%] max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFF38E] to-[#D4AF37]" />
                            <div className="p-5 border-b border-[#333] flex justify-between items-center bg-[#1A1A1A]">
                                <h2 className="text-sm uppercase tracking-widest font-bold text-[#D4AF37]">The Agreement</h2>
                                <button onClick={() => setShowTerms(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-5 overflow-y-auto font-sans text-xs text-[#999] space-y-4 max-h-[60vh] leading-relaxed custom-scrollbar">
                                <p>1) Members who fail to make a payment in a given month will have their scheme period extended for the number of months they have not paid.</p>
                                <p>2) Members who make their monthly payments ahead of time will only receive their 13th month bonus at the end of their plan period.</p>
                                <p>3) Members discontinuing or pre-closing halfway through the scheme will not be eligible for any benefits.</p>
                                <p>4) All monthly payments are only redeemable as gold and/or diamond jewellery. No cash refunds or reimbursements will be made under any circumstances.</p>
                                <p>5) The gold price, at the time of redemption, would be based on the prevailing gold price at DMY Jewellery on the day of purchase.</p>
                                <p>6) Workmanship and other relevant charges will be levied additionally.</p>
                                <p>7) Goods and Services Tax (GST) will be applicable on all purchases.</p>
                                <p>8) Purchase of Pure Gold Bars and 916 Gold Coins are not permitted under this scheme.</p>
                                <p>9) Members must produce both their active GSS Page on MyDMY App and photo ID for verification.</p>
                                <p>10) DMY Jewellery Pte Ltd gives full guarantee to members.</p>
                            </div>

                            <div className="p-5 border-t border-[#333] bg-[#1A1A1A]">
                                <label className="flex items-center gap-3 cursor-pointer mb-5">
                                    <input
                                        type="checkbox"
                                        checked={agreeChecked}
                                        onChange={(e) => setAgreeChecked(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-600 bg-black checked:bg-[#D4AF37] focus:ring-0 accent-[#D4AF37]"
                                    />
                                    <span className="font-medium text-[#BBB] text-xs uppercase tracking-wider">I Accept the terms</span>
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowTerms(false)}
                                        className="flex-1 py-3 text-xs tracking-widest uppercase rounded-xl border border-white/10 text-[#888] font-bold hover:bg-white/5 transition-colors"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={() => {
                                            playGoldSound();
                                            if (agreeChecked) navigate('/scheme/apply');
                                        }}
                                        disabled={!agreeChecked}
                                        className="flex-1 py-3 text-xs tracking-widest uppercase rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C9A84C] text-[#0A0A0A] font-bold disabled:opacity-30 transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:shadow-none hover:opacity-90 active:scale-[0.98]"
                                    >
                                        Proceed
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
