import { useState } from "react";
import { ArrowLeft, FileText, Download, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { playGoldSound } from "../utils/sounds";

export default function Invoices() {
    // Dummy Data for now
    const [invoices] = useState([
        {
            id: "DMY-INV-9021",
            date: "12 Oct 2026",
            amount: "S$ 1,240.00",
            status: "PAID",
            type: "Gold Bar 24K - 10g",
        },
        {
            id: "DMY-INV-8834",
            date: "05 Sep 2026",
            amount: "S$ 450.00",
            status: "PAID",
            type: "Scheme Payment",
        },
        {
            id: "DMY-INV-8120",
            date: "14 Aug 2026",
            amount: "S$ 8,200.00",
            status: "PAID",
            type: "Custom Jewellery Order",
        }
    ]);

    const handleDownload = (invoiceId: string) => {
        playGoldSound();
        // Placeholder for real PDF download
        alert(`Downloading invoice ${invoiceId} as PDF...`);
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[var(--color-bg,#050505)] pb-32 font-sans overflow-x-hidden page-transition">

            {/* Background Glare */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
                    className="absolute -top-[10%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] bg-gradient-radial from-[var(--color-primary,#D4AF37)] to-transparent opacity-10"
                />
            </div>

            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative w-full flex items-center p-6 shadow-2xl z-20"
                style={{
                    background: 'linear-gradient(180deg, var(--color-card, rgba(11,43,33,1)) 0%, var(--color-bg, rgba(5,5,5,1)) 100%)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}
            >
                <Link to="/home" onClick={() => playGoldSound()} className="text-[var(--color-primary,#D4AF37)] hover:scale-110 transition-transform">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-xl font-serif text-[var(--color-primary,#D4AF37)] ml-4 font-light tracking-widest uppercase">My Invoices</h1>
                <div className="ml-auto">
                    <img src={import.meta.env.BASE_URL + "logo.png"} alt="DMY Jewellers" className="h-8 w-auto filter contrast-125 saturate-150" />
                </div>
            </motion.div>

            <div className="px-5 mt-6 relative z-10 flex-grow">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-[var(--color-btn,#111)] via-[var(--color-card,#1a1a1a)] to-[var(--color-btn,#111)] border border-white/5 rounded-2xl p-5 mb-8 flex items-center justify-between shadow-2xl"
                >
                    <div>
                        <span className="text-[10px] text-[#A3A3A3] font-inter uppercase tracking-[0.2em] block mb-1">Billing Overview</span>
                        <h2 className="text-base font-serif text-white">Purchase History</h2>
                    </div>
                    <ShieldCheck size={32} className="text-[var(--color-primary,#D4AF37)]/50 drop-shadow-md" />
                </motion.div>

                {invoices.length > 0 ? (
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                        {invoices.map((inv) => (
                            <motion.div
                                variants={itemVariants}
                                key={inv.id}
                                className="bg-[var(--color-card,#0B0B0B)] border border-white/5 hover:border-[var(--color-primary,#D4AF37)]/30 rounded-2xl p-5 shadow-lg relative group transition-colors"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-[var(--color-btn,#151515)] p-2 rounded-lg border border-white/5">
                                            <FileText size={18} className="text-[var(--color-primary,#D4AF37)]" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-serif tracking-wide">{inv.id}</h3>
                                            <p className="text-[#888] text-[10px] uppercase font-sans tracking-widest">{inv.date}</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] uppercase tracking-widest bg-[var(--color-primary,#D4AF37)]/10 text-[var(--color-primary,#D4AF37)] border border-[var(--color-primary,#D4AF37)]/20 px-2 py-1 rounded">
                                        {inv.status}
                                    </span>
                                </div>

                                <div className="bg-[var(--color-btn,#111111)] rounded-xl p-3 mb-4 border border-white/5 flex justify-between items-center">
                                    <div>
                                        <p className="text-[#888] text-[9px] uppercase tracking-widest mb-0.5">Purchased Item</p>
                                        <p className="text-white font-sans text-sm">{inv.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[#888] text-[9px] uppercase tracking-widest mb-0.5">Total Paid</p>
                                        <p className="text-[var(--color-primary,#D4AF37)] font-sans font-bold">{inv.amount}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDownload(inv.id)}
                                    className="w-full flex items-center justify-center gap-2 bg-transparent border border-[var(--color-primary,#D4AF37)]/30 text-[var(--color-primary,#D4AF37)] px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[var(--color-primary,#D4AF37)] hover:text-black transition-all active:scale-[0.98]"
                                >
                                    <Download size={14} /> Download Invoice PDF
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20 text-[#666] font-light flex flex-col items-center">
                        <FileText size={48} className="text-white/10 mb-4" />
                        <p className="text-sm">No invoices found for this account.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
