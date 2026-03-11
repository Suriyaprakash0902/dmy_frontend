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
        <div className="relative min-h-screen bg-[#013D42] text-[#E3B938] overflow-hidden page-transition">

            {/* Header */}
            <div className="absolute top-0 z-50 w-full bg-gradient-to-b from-black/60 to-transparent pt-8 pb-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/home" onClick={() => playGoldSound()}>
                        <div className="p-2 bg-black/40 backdrop-blur-md rounded-full text-[#E3B938] hover:bg-[#E3B938] hover:text-black transition-all">
                            <ArrowLeft size={20} />
                        </div>
                    </Link>
                    <h1 className="text-xl font-serif text-[#E3B938] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Exclusive</h1>
                </div>
            </div>

            {/* Background Animations */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#013D42] opacity-90" />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 150, ease: "linear" }}
                    className="absolute top-[-30%] left-[-20%] w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(227,185,56,0.15)_0%,transparent_50%)] pointer-events-none"
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
                    <h2 className="text-4xl font-serif text-white tracking-widest mb-2 shadow-black drop-shadow-lg">Offers</h2>
                    <p className="text-sm text-[#E3B938]/80 font-light tracking-widest uppercase">Uncover your hidden treasures</p>
                </motion.div>

                {isLoading ? (
                    <div className="flex-1 flex justify-center items-center pb-20">
                        <div className="w-12 h-12 rounded-full border-2 border-[#E3B938] border-t-transparent animate-spin shadow-[0_0_15px_rgba(227,185,56,0.5)]" />
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
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#E3B938] via-[#B6942C] to-[#E3B938] rounded-[2rem] opacity-20 blur-sm group-hover:opacity-60 transition-opacity duration-500" />

                                <div className="relative p-1.5 bg-gradient-to-br from-[#02444A] to-black rounded-[2rem] overflow-hidden shadow-2xl">
                                    <div className="aspect-[9/16] sm:aspect-[4/5] w-full rounded-[1.75rem] overflow-hidden relative">
                                        <div className="absolute inset-0 bg-[#E3B938]/10 animate-pulse" />
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
                                        <div className="absolute top-6 -right-12 bg-gradient-to-r from-black to-[#E3B938]/80 backdrop-blur-md px-14 py-2 rotate-45 transform shadow-lg z-30">
                                            <span className="text-white text-[10px] uppercase tracking-[0.2em] font-bold shadow-black drop-shadow-md block -ml-4">Featured</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 flex justify-center items-center text-center pb-20 opacity-60">
                        <div>
                            <p className="text-xl font-serif text-[#E3B938] mb-2">Check back soon</p>
                            <p className="text-xs uppercase tracking-widest text-[#E3B938]/60">More offers drop later</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
