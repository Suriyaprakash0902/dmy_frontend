import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, ShieldCheck, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import httpService from "../services/httpService";
import { playGoldSound } from "../utils/sounds";
import toast from "react-hot-toast";

export default function InvoiceDetail() {
    const { paymentId } = useParams<{ paymentId: string }>();
    const [invoice, setInvoice] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await httpService.get(`/api/payment/${paymentId}`);
                setInvoice(res.payment);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load invoice details");
            } finally {
                setIsLoading(false);
            }
        };
        fetchInvoice();
    }, [paymentId]);

    const handleDownload = () => {
        playGoldSound();
        window.print();
    };

    if (isLoading) {
        return (
            <div className="flex-grow flex items-center justify-center min-h-screen bg-[#050505] print:bg-white">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-8 h-8 rounded-full border-t-2 border-[#D4AF37] border-l-2" />
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="flex-grow flex items-center justify-center min-h-screen bg-[#050505] print:bg-white">
                <div className="text-center">
                    <FileText size={48} className="text-[#A3A3A3] mx-auto opacity-50 mb-4" />
                    <h3 className="text-xl font-serif text-[#D4AF37] italic mb-2">Invoice Not Found</h3>
                    <Link to="/scheme" className="text-[#888] underline text-sm">Return to Schemes</Link>
                </div>
            </div>
        );
    }

    const { scheme, user } = invoice;
    const isPaid = invoice.status === 'PAID';
    const isFailed = invoice.status === 'FAILED';
    const isPending = invoice.status === 'PENDING';

    return (
        <div className="flex flex-col min-h-screen bg-[#050505] pb-32 font-sans overflow-x-hidden print:pb-0 page-transition print:overflow-visible print:absolute print:inset-0 print:w-full print:h-full">
            
            {/* NO-PRINT HEADER */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative w-full flex items-center p-6 shadow-2xl z-20 print:hidden"
                style={{
                    background: 'linear-gradient(180deg, rgba(11,43,33,1) 0%, rgba(5,5,5,1) 100%)',
                    borderBottom: '1px solid rgba(212,175,55,0.1)'
                }}
            >
                <Link to="/scheme" onClick={() => playGoldSound()} className="text-[#D4AF37] hover:scale-110 transition-transform">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-xl font-serif text-[#D4AF37] ml-4 font-light tracking-widest uppercase">Invoice Details</h1>
                <div className="ml-auto">
                    <button onClick={handleDownload} className="text-[#D4AF37] hover:text-white transition-colors bg-[#1A1A1A] p-2 rounded-lg border border-[#333]">
                        <Download size={20} />
                    </button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-5 mt-8 max-w-lg mx-auto w-full z-10 print:mt-0 print:border-none print:shadow-none print:px-0 print:max-w-none print:w-full print:flex print:justify-center"
            >
                <div className="bg-[#111111] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(212,175,55,0.1)] relative overflow-hidden print:border-none print:shadow-none print:rounded-none print:w-full print:p-8">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFF38E] to-[#D4AF37] print:hidden" />
                    
                    {/* INVOICE HEADER */}
                    <div className="flex justify-between items-start mb-8 border-b border-[#333] pb-6">
                        <div>
                            <img src={import.meta.env.BASE_URL + "logo.png"} alt="DMY" className="h-12 w-auto filter contrast-125 saturate-150 mb-4" />
                            <h2 className="text-[#D4AF37] font-serif text-2xl tracking-wide uppercase">Sales Invoice</h2>
                            <p className="text-[#888] text-xs mt-1">Official Receipt of Transaction</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[#A3A3A3] text-[9px] uppercase tracking-widest block mb-1">Invoice Number</span>
                            <span className="text-white font-serif tracking-wider font-bold">{invoice.invoiceNumber || invoice.id.split('-')[0].toUpperCase()}</span>
                            <span className="text-[#A3A3A3] text-[9px] uppercase tracking-widest block mt-3 mb-1">Issue Date</span>
                            <span className="text-white font-sans text-sm">{new Date(invoice.createdAt || invoice.paymentDate).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* STATUS BANNER */}
                    <div className={`rounded-xl p-4 mb-8 flex items-center justify-center gap-3 print:border ${isPaid ? 'bg-[#0A2E12]/40 border border-[#2ECC71]/30 text-[#2ECC71]' : isFailed ? 'bg-[#2E0A0A]/40 border border-[#E74C3C]/30 text-[#E74C3C]' : 'bg-[#2E1A0A]/40 border border-[#FFA500]/30 text-[#FFA500]'}`}>
                        {isPaid && <CheckCircle size={24} />}
                        {isFailed && <XCircle size={24} />}
                        {isPending && <Clock size={24} />}
                        <span className="font-bold tracking-widest uppercase">{isPaid ? 'Payment Confirmed' : isFailed ? 'Payment Failed' : 'Processing Required'}</span>
                    </div>

                    {/* CUSTOMER INFO */}
                    <div className="mb-8 grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-[#A3A3A3] text-[10px] uppercase tracking-widest mb-2">Billed To</h3>
                            <p className="text-white font-serif text-lg leading-tight">{scheme?.name}</p>
                            <p className="text-[#888] text-xs font-sans mt-1">{user?.email}</p>
                            {scheme?.phone && <p className="text-[#888] text-xs font-sans">{scheme.phone}</p>}
                        </div>
                        <div className="text-right">
                            <h3 className="text-[#A3A3A3] text-[10px] uppercase tracking-widest mb-2">Scheme Details</h3>
                            <p className="text-white font-serif">{scheme?.schemeId || scheme?.id?.substring(0,8).toUpperCase()}</p>
                            <p className="text-[#888] text-xs font-sans mt-1">Instalment: {invoice.monthIndex} / {scheme?.period || 12}</p>
                            <p className="text-[#888] text-xs font-sans mt-0.5">{scheme?.amount ? `S$ ${scheme.amount} / mo` : ''}</p>
                        </div>
                    </div>

                    {/* LINE ITEMS */}
                    <div className="mb-8 rounded-xl border border-[#333] overflow-hidden">
                        <div className="bg-[#1A1A1A] px-4 py-2 border-b border-[#333] grid grid-cols-4">
                            <span className="col-span-2 text-[#A3A3A3] text-[9px] uppercase tracking-widest">Description</span>
                            <span className="text-right text-[#A3A3A3] text-[9px] uppercase tracking-widest">Rate / g</span>
                            <span className="text-right text-[#A3A3A3] text-[9px] uppercase tracking-widest">Secured</span>
                        </div>
                        <div className="bg-[#111111] p-4 flex flex-col gap-4">
                            <div className="grid grid-cols-4 items-center">
                                <div className="col-span-2">
                                    <h4 className="text-white font-serif text-sm">22K Pure Gold Allocation</h4>
                                    <p className="text-[#888] text-[10px] mt-0.5 uppercase tracking-wide">Month {invoice.monthIndex} Deposit</p>
                                </div>
                                <div className="text-right text-[#D4AF37] font-sans font-medium">
                                    S$ {Number(invoice.goldRate).toFixed(2)}
                                </div>
                                <div className="text-right text-[#D4AF37] font-bold font-sans">
                                    {Number(invoice.gramAccumulated).toFixed(2)} g
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TOTALS */}
                    <div className="border-t border-[#333] pt-6 flex justify-between items-end">
                        <div>
                            <ShieldCheck size={32} className="text-[#D4AF37] opacity-50 mb-2" />
                            <p className="text-[#555] text-[9px] uppercase tracking-widest w-32">Secured via DMY Authenticated Vault</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[#A3A3A3] text-xs mb-1">Total Amount Paid</p>
                            <p className="text-3xl font-serif text-[#D4AF37]">S$ {Number(invoice.amountPaid).toFixed(2)}</p>
                            <p className="text-[#555] text-[10px] mt-1 uppercase tracking-widest">Currency: SGD</p>
                        </div>
                    </div>

                </div>

                {/* NO-PRINT FOOTER TEXT */}
                <p className="text-center text-[#555] text-xs mt-6 mb-12 italic font-serif print:hidden">
                    "Crafting legacies in pure gold. Thank you for choosing DMY."
                </p>
            </motion.div>
        </div>
    );
}
