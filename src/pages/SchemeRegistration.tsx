import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import httpService from "../services/httpService";
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { playGoldSound } from "../utils/sounds";
import PaymentModal from "../components/PaymentModal";

export default function SchemeRegistration() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [nric, setNric] = useState('');
    const [showNric, setShowNric] = useState(false);
    const [isNricFocused, setIsNricFocused] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    const [blockNo, setBlockNo] = useState('');
    const [floorNo, setFloorNo] = useState('');
    const [unitNo, setUnitNo] = useState('');
    const [street, setStreet] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [anniversary, setAnniversary] = useState('');
    const [amount, setAmount] = useState('100');
    const [agreeTerm, setAgreeTerm] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentParams, setPaymentParams] = useState<any>(null);

    const todayStr = new Date().toISOString().split('T')[0];

    const formatNric = (val: string) => {
        if (!val) return '';
        if (showNric || isNricFocused) return val;
        if (val.length <= 4) return val;
        return '*'.repeat(val.length - 4) + val.slice(-4);
    };

    const handleNricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNric(e.target.value.toUpperCase());
    };

    const finalizedRef = useRef<boolean>(false);

    const handleFinalizeScheme = async () => {
        if (finalizedRef.current) return;
        finalizedRef.current = true;
        
        setIsSubmitting(true);
        try {
            const payload = {
                name, nric, blockNo, floorNo, unitNo, street, postalCode, country: 'Singapore',
                phone, dob, anniversary, period: 12, amount: Number(amount)
            };

            await httpService.post('/api/schemes/apply', payload);
            playGoldSound(true);
            confetti({
                particleCount: 200,
                spread: 90,
                origin: { y: 0.5 },
                colors: ['#FFD700', '#D4AF37', '#FFF8DC']
            });
            toast.success("Scheme Contract Signed Successfully", { style: { background: '#0B0B0B', color: '#D4AF37' } });
            navigate('/scheme');
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to finalize contract");
        }
        setIsSubmitting(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreeTerm) {
            toast.error("You must agree to the Scheme Terms to proceed.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Initiate Airwallex Payment Intent
            const intentResponse: any = await httpService.post('/api/payment/create-intent', { amount: Number(amount) });
            const paymentData = intentResponse.data || intentResponse;

            if (paymentData && paymentData.client_secret) {
                setPaymentParams(paymentData);
                setShowPaymentModal(true);
            } else {
                toast.error("Failed to initialize payment gateway");
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to initialize payment");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="relative min-h-screen bg-[#050505] text-[#D4AF37] pb-10 font-sans page-transition overflow-x-hidden">
            {/* Background Animations */}
            <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 90, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full blur-[100px] bg-gradient-radial from-[#D4AF37] to-transparent"
                />
            </div>

            {/* Top Bar */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center space-x-4 p-6 relative z-10 border-b border-white/5 bg-[#0B0B0B]"
            >
                <Link to="/scheme" onClick={() => playGoldSound()} className="text-[#D4AF37] hover:scale-110 transition-transform">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-lg font-serif tracking-widest uppercase text-[#D4AF37]">Scheme Registration</h1>
            </motion.div>

            <div className="px-5 mt-8 flex-grow relative z-10">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-[#111111] border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] p-8 rounded-2xl relative overflow-hidden max-w-lg mx-auto"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFF38E] to-[#D4AF37]" />

                    <div className="mb-6 flex flex-col items-center">
                        <ShieldCheck className="text-[#D4AF37] mb-3" size={32} />
                        <h2 className="text-[#D4AF37] text-xl font-serif italic text-center drop-shadow-md">Contract Details</h2>
                        <span className="text-[#666] text-[10px] uppercase tracking-widest mt-1">Official Registration</span>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>

                        <div>
                            <label className="block text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5">Legal Name (As in ID)</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="ROBERT JOE" className="w-full bg-[#1A1A1A] border border-[#333333] text-[#D4AF37] placeholder-[#444] rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#D4AF37] font-sans text-sm tracking-wide uppercase transition-colors" />
                        </div>

                        <div>
                            <label className="block text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5">NRIC No / Fin</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formatNric(nric)}
                                    onChange={handleNricChange}
                                    onFocus={() => setIsNricFocused(true)}
                                    onBlur={() => setIsNricFocused(false)}
                                    required
                                    placeholder="S1234567A"
                                    className="w-full bg-[#1A1A1A] border border-[#333333] text-[#D4AF37] placeholder-[#444] rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#D4AF37] font-sans text-sm tracking-wide transition-colors pr-12 uppercase"
                                />
                                <button type="button" onClick={() => setShowNric(!showNric)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#D4AF37] transition-colors">
                                    {showNric ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5 border-b border-transparent">Block</label>
                                <input type="text" value={blockNo} onChange={(e) => setBlockNo(e.target.value)} required placeholder="104" className="w-full bg-[#1A1A1A] border border-[#333333] text-[#D4AF37] placeholder-[#444] rounded-xl px-3 py-3 focus:outline-none focus:border-[#D4AF37] font-sans text-sm transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5 border-b border-transparent">Floor</label>
                                <input type="text" value={floorNo} onChange={(e) => setFloorNo(e.target.value)} required placeholder="#10" className="w-full bg-[#1A1A1A] border border-[#333333] text-[#D4AF37] placeholder-[#444] rounded-xl px-3 py-3 focus:outline-none focus:border-[#D4AF37] font-sans text-sm transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5 border-b border-transparent">Unit</label>
                                <input type="text" value={unitNo} onChange={(e) => setUnitNo(e.target.value)} required placeholder="123" className="w-full bg-[#1A1A1A] border border-[#333333] text-[#D4AF37] placeholder-[#444] rounded-xl px-3 py-3 focus:outline-none focus:border-[#D4AF37] font-sans text-sm transition-colors" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5">Street Address</label>
                            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} required placeholder="Orchard Road" className="w-full bg-[#1A1A1A] border border-[#333333] text-[#D4AF37] placeholder-[#444] rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#D4AF37] font-sans text-sm transition-colors" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5">Region</label>
                                <input type="text" value="Singapore" readOnly className="w-full bg-[#111111] border border-[#333333] text-[#666] rounded-xl px-4 py-3 font-sans text-sm outline-none cursor-not-allowed uppercase tracking-wider" />
                            </div>
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5">Postal Code</label>
                                <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))} required placeholder="123456" className="w-full bg-[#1A1A1A] border border-[#333333] text-[#D4AF37] placeholder-[#444] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] font-sans text-sm tracking-widest transition-colors" />
                            </div>
                        </div>

                        <div className="flex space-x-3 w-full">
                            <div className="w-1/3">
                                <label className="block text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5">Dial</label>
                                <select className="w-full bg-[#111111] border border-[#333333] text-[#666] rounded-xl px-4 py-3 font-sans text-sm outline-none appearance-none text-center cursor-not-allowed">
                                    <option>+65</option>
                                </select>
                            </div>
                            <div className="w-2/3">
                                <label className="block text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5">Mobile Number</label>
                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} required placeholder="8765 4321" className="w-full bg-[#1A1A1A] border border-[#333333] text-[#D4AF37] placeholder-[#444] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] font-sans text-sm tracking-wider transition-colors" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5">Birth Date</label>
                                <input type="date" value={dob} max={todayStr} onChange={(e) => setDob(e.target.value)} required className="w-full bg-[#1A1A1A] border border-[#333333] text-[#D4AF37] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] font-sans text-sm appearance-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5">Anniversary</label>
                                <input type="date" value={anniversary} max={todayStr} min={dob ? dob : undefined} onChange={(e) => setAnniversary(e.target.value)} className="w-full bg-[#1A1A1A] border border-[#333333] text-[#D4AF37] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] font-sans text-sm appearance-none transition-colors" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5">Duration</label>
                                <select className="w-full bg-[#111111] border border-[#333333] text-[#666] rounded-xl px-4 py-3 font-sans text-sm outline-none appearance-none text-center cursor-not-allowed tracking-widest uppercase">
                                    <option value="12">12 Months</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase text-[#D4AF37] mb-1.5 drop-shadow-sm border-b border-[#D4AF37]/30 pb-0.5 inline-block">Mthly Pledge (S$)</label>
                                <select value={amount} onChange={(e) => { playGoldSound(); setAmount(e.target.value); }} className="w-full bg-[#1A1A1A] border border-[#D4AF37]/50 text-[#D4AF37] rounded-xl px-4 py-3 text-center focus:outline-none focus:border-[#D4AF37] font-sans text-lg font-bold appearance-none transition-colors shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                                    {[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(val => (
                                        <option key={val} value={val} className="bg-black text-[#D4AF37]">S$ {val}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input type="checkbox" checked={agreeTerm} onChange={(e) => { if (e.target.checked) playGoldSound(); setAgreeTerm(e.target.checked); }} className="mt-1 w-4 h-4 rounded border-gray-600 bg-black checked:bg-[#D4AF37] focus:ring-0 accent-[#D4AF37]" />
                                <span className="text-[10px] uppercase tracking-wider text-[#888] leading-relaxed group-hover:text-[#AAA] transition-colors">
                                    I acknowledge and consent to the <button onClick={(e) => { e.preventDefault(); playGoldSound(); setShowTerms(true); }} className="text-[#D4AF37] font-bold border-b border-[#D4AF37]/50 hover:border-[#D4AF37] transition-colors ml-1">Scheme Regulations & Terms</button>
                                </span>
                            </label>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C9A84C] text-[#0A0A0A] py-4 mt-6 rounded-xl font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 transition-all hover:opacity-90 active:scale-[0.98]"
                        >
                            {isSubmitting ? 'Finalizing...' : 'Sign Contract'}
                        </motion.button>

                    </form>
                </motion.div>
            </div>

            {/* T&C Modal */}
            <AnimatePresence>
                {showTerms && (
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
                            className="bg-[#111111] border border-[#D4AF37]/30 rounded-2xl w-full max-w-sm max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFF38E] to-[#D4AF37]" />

                            <div className="p-4 sm:p-5 border-b border-[#333] flex justify-between items-center bg-[#1A1A1A] shrink-0 z-10">
                                <h2 className="text-sm tracking-widest uppercase font-bold text-[#D4AF37]">Scheme Charter</h2>
                                <button onClick={() => setShowTerms(false)} className="text-[#666] hover:text-[#D4AF37] transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-4 sm:p-5 overflow-y-auto font-sans text-xs text-[#888] space-y-4 flex-grow leading-relaxed custom-scrollbar">
                                <p className="font-bold text-[#D4AF37] uppercase tracking-wider mb-2">Notice of Agreement</p>
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

                            <div className="p-4 sm:p-5 border-t border-[#333] bg-[#1A1A1A] shrink-0 z-10 w-full">
                                <button
                                    onClick={() => { playGoldSound(); setAgreeTerm(true); setShowTerms(false); }}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C9A84C] text-[#0A0A0A] font-bold uppercase tracking-widest text-xs shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-transform hover:opacity-90 active:scale-[0.98]">
                                    I Accord
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {showPaymentModal && paymentParams && (
                <PaymentModal
                    clientSecret={paymentParams.client_secret}
                    currency={paymentParams.currency}
                    amount={paymentParams.amount}
                    intentId={paymentParams.intent_id}
                    environment={paymentParams.environment}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={() => {
                        setShowPaymentModal(false);
                        handleFinalizeScheme();
                    }}
                />
            )}            
        </div>
    );
}
