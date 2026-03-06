import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { playGoldSound } from "../utils/sounds";

interface Category {
    id: string;
    jewel_category: string;
    image: string;
}

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_LIVE_API_URL}/get_jewel_category`);
                const data = await response.json();
                if (data.status) {
                    setCategories(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-[#050505] pb-32 font-sans overflow-x-hidden page-transition">
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] bg-gradient-radial from-[#D4AF37] to-transparent opacity-10" />
            </div>

            <div className="relative z-10 flex flex-col gap-6">
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
                    <h1 className="text-xl font-serif text-[#D4AF37] ml-4 font-light tracking-widest uppercase">Trending Categories</h1>
                    <div className="ml-auto">
                        <img src={import.meta.env.BASE_URL + "logo-main.png"} alt="DMY Jewellers" className="h-8 w-auto filter contrast-125 saturate-150" />
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {categories.map((cat, index) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                onClick={() => navigate(`/products?categoryId=${cat.id}`)}
                                className="bg-[#0A0A0A] rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer group flex flex-col"
                            >
                                <div className="w-full aspect-square relative flex items-center justify-center p-2 mb-2">
                                    <img
                                        src={cat.image}
                                        alt={cat.jewel_category}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedImage(cat.image);
                                        }}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500 rounded-2xl cursor-pointer"
                                    />
                                </div>
                                <div className="px-4 pb-4 flex-1 flex flex-col justify-end bg-gradient-to-b from-[#111]/0 to-[#0A0A0A] text-center">
                                    <h3 className="font-serif italic text-white text-lg tracking-wide group-hover:text-[#D4AF37] transition-colors">{cat.jewel_category}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Image Viewer Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-[#D4AF37]/50 transition-colors z-[105]"
                        >
                            <X size={24} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            src={selectedImage}
                            alt="Category Full View"
                            className="max-w-[95vw] max-h-[85vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.15)]"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
