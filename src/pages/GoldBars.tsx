import { useState } from "react";
import { ArrowLeft, Check, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import httpService from "../services/httpService";
import toast from 'react-hot-toast';

export default function GoldBars() {
    const [karat, setKarat] = useState<'22' | '24'>('24');

    // Mock prices based on karat
    const ratePerGram = karat === '24' ? 145 : 125;

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
        setQuantities(prev => {
            const current = prev[id] || 1;
            const next = current + delta;
            if (next < 1) return prev;
            return { ...prev, [id]: next };
        });
    };

    const triggerEnquire = (product: any) => {
        setConfirmModal(product);
    };

    const handleEnquire = async () => {
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
            setTimeout(() => {
                setEnquiryStatus(prev => ({ ...prev, [product.id]: '' }));
            }, 3000);
        } catch (error) {
            console.error(error);
            setEnquiryStatus(prev => ({ ...prev, [product.id]: '' }));
            toast.error('Failed to send enquiry');
        }
    };

    return (
        <div className="min-h-full bg-gray-50 font-sans px-5 pt-8 pb-32">
            <div className="flex items-center space-x-3 mb-6 pt-2">
                <Link to="/home" className="text-black font-bold">
                    <ArrowLeft size={26} strokeWidth={2.5} />
                </Link>
                <h1 className="text-[22px] font-bold font-sans text-black">Gold bars & Coins</h1>
            </div>

            {/* Karat Selection */}
            <div className="flex w-full bg-gray-200 rounded-xl p-1 mb-8">
                <button
                    onClick={() => setKarat('22')}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${karat === '22' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    22 Karat
                </button>
                <button
                    onClick={() => setKarat('24')}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${karat === '24' ? 'bg-[#1a1a1a] shadow-sm text-[#C9A84C]' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    24 Karat
                </button>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-12 mt-12 mb-10">
                {productsList.map((p) => {
                    const qty = quantities[p.id] || 1;
                    const price = p.weightGram * ratePerGram;
                    const status = enquiryStatus[p.id];

                    return (
                        <div key={p.id} className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-3 pb-4 flex flex-col items-center relative mt-6 border border-gray-100">
                            {/* Visual Representation */}
                            <div className="w-[64px] h-[64px] rounded-full bg-yellow-50 flex items-center justify-center absolute -top-8 shadow-sm border-2 border-white">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] via-[#DAA520] to-[#B8860B] shadow-inner flex flex-col items-center justify-center text-white">
                                    <span className="text-[8px] font-black leading-none">DMY</span>
                                    <span className="text-[6px] font-black leading-none text-yellow-900">{karat}K</span>
                                </div>
                            </div>

                            <div className="mt-8 text-center w-full">
                                <h3 className="font-semibold text-gray-800 text-xs mb-0.5">{p.title}</h3>
                                <p className="text-gray-500 text-[10px] mb-1 font-medium">{p.name} • {karat}K</p>
                                <p className="text-[#C9A84C] font-bold text-sm mb-3">S$ {price.toFixed(2)}</p>

                                {/* Quantity Selector */}
                                <div className="flex items-center justify-between border border-gray-200 rounded-lg p-1 mb-3 bg-gray-50">
                                    <button onClick={() => handleQuantity(p.id, -1)} className="p-1 rounded text-gray-600 hover:bg-gray-200 focus:outline-none">
                                        <Minus size={14} />
                                    </button>
                                    <span className="font-bold text-sm w-4 text-center">{qty}</span>
                                    <button onClick={() => handleQuantity(p.id, 1)} className="p-1 rounded text-gray-600 hover:bg-gray-200 focus:outline-none">
                                        <Plus size={14} />
                                    </button>
                                </div>

                                {/* Enquire Button */}
                                {status === 'success' ? (
                                    <button disabled className="bg-green-500 text-white text-[12px] px-2 py-2.5 rounded-xl font-bold w-full shadow-sm flex items-center justify-center gap-1 transition-all">
                                        <Check size={16} /> Sent
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => triggerEnquire(p)}
                                        disabled={status === 'loading'}
                                        className="bg-[#1a1a1a] text-white text-[12px] px-2 py-2.5 rounded-xl font-bold hover:bg-black transition-colors w-full shadow-md focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {status === 'loading' ? 'Sending...' : 'Enquire'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Confirmation Modal */}
            {confirmModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setConfirmModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-900">
                            ✕
                        </button>
                        <h2 className="text-xl font-bold font-serif text-gray-900 mb-2 mt-2">Confirm Enquiry</h2>
                        <p className="text-gray-600 font-inter text-sm mb-6">
                            Are you sure you want to send an enquiry for <strong>{(quantities[confirmModal.id] || 1)}x {confirmModal.title} {confirmModal.name} ({karat}K)</strong> to DMY Jewellers?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmModal(null)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl active:bg-gray-200 transition-colors"
                            >
                                No, Cancel
                            </button>
                            <button
                                onClick={handleEnquire}
                                className="flex-1 py-3 bg-[#C9A84C] text-white font-bold rounded-xl active:bg-[#B39340] transition-colors shadow-md"
                            >
                                Yes, Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
