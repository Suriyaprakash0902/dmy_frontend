import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { playGoldSound } from '../utils/sounds';

interface OfferBanner {
    id: string;
    image: string;
}

export default function ExclusiveOffers() {
    const [offers, setOffers] = useState<OfferBanner[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await fetch('https://dmyjewellers.sg/api/get_offer_banners');
                const data = await response.json();
                if (data.status) {
                    setOffers(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch custom offers:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOffers();
    }, []);

    return (
        <div className="relative min-h-screen bg-[#050505] text-[#D4AF37] overflow-hidden page-transition">

            {/* Header */}
            <div className="absolute top-0 z-50 w-full bg-gradient-to-b from-black/80 to-transparent pt-8 pb-4 px-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link to="/home" onClick={() => playGoldSound()}>
                        <div className="p-2 bg-[#1A1A1A] border border-[#333333] rounded-full text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all">
                            <ArrowLeft size={20} />
                        </div>
                    </Link>
                    <h1 className="text-xl font-serif text-[#D4AF37] tracking-widest uppercase">Exclusive</h1>
                </div>
            </div>

            {/* Background Animations */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#050505]" />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 150, ease: "linear" }}
                    className="absolute top-[-30%] left-[-20%] w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_50%)] pointer-events-none"
                />
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 h-screen flex flex-col pt-32 pb-10 px-6">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <h2 className="text-4xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F0E6D2] to-[#D4AF37] mb-2">Offers</h2>
                    <p className="text-sm text-[#A3A3A3] font-light tracking-widest uppercase">Uncover your hidden treasures</p>
                </motion.div>

                {isLoading ? (
                    <div className="flex-1 flex justify-center items-center pb-20">
                        <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                    </div>
                ) : offers.length > 0 ? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10 space-y-8">
                        {offers.map((offer, index) => (
                            <motion.div
                                key={offer.id}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.15, type: 'spring', bounce: 0.4 }}
                                className="relative group cursor-pointer"
                                onClick={() => playGoldSound()}
                            >
                                {/* Ribbon background effect */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] via-[#FFF38E] to-[#D4AF37] rounded-[2rem] opacity-20 blur-sm group-hover:opacity-40 transition-opacity duration-500" />

                                <div className="relative bg-[#111111] border border-[#D4AF37]/30 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col p-2">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFF38E] to-[#D4AF37] z-30" />
                                    <div className="aspect-[9/16] sm:aspect-[4/5] w-full rounded-[1.75rem] overflow-hidden relative">
                                        <div className="absolute inset-0 bg-[#D4AF37]/10 animate-pulse" />
                                        <img
                                            src={offer.image}
                                            alt={`Exclusive Offer ${offer.id}`}
                                            className="w-full h-full object-cover relative z-10 transform scale-100 group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                                            onLoad={(e) => {
                                                (e.target as HTMLImageElement).previousElementSibling?.remove();
                                            }}
                                        />
                                        {/* Luxury Inner Shadow Overlay */}
                                        <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.6)] z-20 pointer-events-none" />

                                        {/* Fake Premium Ribbon / Tag */}
                                        <div className="absolute top-6 -right-12 bg-gradient-to-r from-[#D4AF37] to-[#8A6D1C] px-14 py-2 rotate-45 transform shadow-[0_0_15px_rgba(212,175,55,0.4)] z-30">
                                            <span className="text-[#0A0A0A] text-[10px] uppercase tracking-[0.2em] font-bold block -ml-4">Featured</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 flex justify-center items-center text-center pb-20 opacity-60">
                        <div>
                            <p className="text-xl font-serif text-[#D4AF37] mb-2">Check back soon</p>
                            <p className="text-xs uppercase tracking-widest text-[#D4AF37]/60">More offers drop later</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
