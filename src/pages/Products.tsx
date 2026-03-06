import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Check, Minus, Plus, X } from 'lucide-react';
import httpService from '../services/httpService';
import toast from 'react-hot-toast';
import { playGoldSound } from "../utils/sounds";

interface Product {
    id: string;
    jewel_type_id: string;
    jewel_type: string;
    jewel_category_id: string;
    jewel_category: string;
    image: string;
    pro_name: string;
    pro_quantity: string;
    latest_status: string;
}

interface Category {
    id: string;
    jewel_category: string;
    image: string;
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Interest logic state
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [enquiryStatus, setEnquiryStatus] = useState<Record<string, string>>({});
    const [confirmModal, setConfirmModal] = useState<Product | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get('categoryId');
    const navigate = useNavigate();

    // Fetch products and categories
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_LIVE_API_URL}/get_jewel_products`),
                    fetch(`${import.meta.env.VITE_LIVE_API_URL}/get_jewel_category`)
                ]);

                const productsData = await productsRes.json();
                const categoriesData = await categoriesRes.json();

                if (productsData.status) {
                    setProducts(productsData.data);
                }
                if (categoriesData.status) {
                    setCategories(categoriesData.data);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Filter products
    const filteredProducts = categoryId
        ? products.filter(product => product.jewel_category_id === categoryId)
        : products;

    // Handlers
    const handleCategoryClick = (id: string) => {
        if (id === categoryId) {
            navigate('/products'); // Deselect if clicking same
        } else {
            navigate(`/products?categoryId=${id}`);
        }
    };

    const handleQuantity = (id: string, delta: number) => {
        setQuantities(prev => {
            const current = prev[id] || 1;
            const next = current + delta;
            if (next < 1) return prev;
            return { ...prev, [id]: next };
        });
    };

    const triggerEnquire = (product: Product) => {
        setConfirmModal(product);
    };

    const handleEnquire = async () => {
        if (!confirmModal) return;
        const product = confirmModal;
        setConfirmModal(null);

        const qty = quantities[product.id] || 1;

        try {
            setEnquiryStatus(prev => ({ ...prev, [product.id]: 'loading' }));
            await httpService.post('/api/enquiry', {
                item: `${product.pro_name} (${product.jewel_category}) - ${product.pro_quantity}`,
                quantity: qty,
                totalPrice: 0 // Price unavailable from this API, keeping 0 to match DB schema if required
            });

            setEnquiryStatus(prev => ({ ...prev, [product.id]: 'success' }));
            toast.success('Interest Registered Successfully', { style: { background: '#0B0B0B', color: '#D4AF37' } });
            setTimeout(() => {
                setEnquiryStatus(prev => ({ ...prev, [product.id]: '' }));
            }, 3000);
        } catch (error) {
            console.error(error);
            setEnquiryStatus(prev => ({ ...prev, [product.id]: '' }));
            toast.error('Failed to register interest');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#050505] pb-32 font-sans overflow-x-hidden page-transition">
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] bg-gradient-radial from-[#D4AF37] to-transparent opacity-10" />
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
                    <h1 className="text-xl font-serif text-[#D4AF37] ml-4 font-light tracking-widest uppercase">Trending Products</h1>
                    <div className="ml-auto">
                        <img src={import.meta.env.BASE_URL + "logo-main.png"} alt="DMY Jewellers" className="h-8 w-auto filter contrast-125 saturate-150" />
                    </div>
                </motion.div>

                {/* Categories Horizontal Scroll */}
                {!loading && categories.length > 0 && (
                    <div className="w-full overflow-x-auto pb-4 pt-2 -mx-6 px-6 hide-scrollbar flex gap-3 snap-x">
                        <button
                            onClick={() => navigate('/products')}
                            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 snap-center border ${!categoryId
                                ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                : 'bg-[#151515] text-[#888] border-white/5 hover:border-[#D4AF37]/30 hover:text-white'
                                }`}
                        >
                            All Categories
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id)}
                                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 snap-center border ${categoryId === cat.id
                                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                    : 'bg-[#151515] text-[#888] border-white/5 hover:border-[#D4AF37]/30 hover:text-white'
                                    }`}
                            >
                                {cat.jewel_category}
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-10 bg-[#0A0A0A] rounded-3xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <ShoppingBag size={48} className="mx-auto text-white/20 mb-4" />
                        <h3 className="text-xl font-serif italic text-white">No Products Found</h3>
                        <p className="text-[#888] font-sans text-sm mt-2">Check back later or browse other categories.</p>
                        {categoryId && (
                            <button onClick={() => navigate('/products')} className="mt-6 px-6 py-2 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/50 rounded-full hover:bg-[#D4AF37]/20 transition-colors">
                                View All Products
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {filteredProducts.map((product, index) => {
                            const qty = quantities[product.id] || 1;
                            const status = enquiryStatus[product.id];

                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="bg-[#0A0A0A] rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 hover:border-[#D4AF37]/50 transition-all group flex flex-col"
                                >
                                    <div className="w-full aspect-square relative flex items-center justify-center p-2 mb-2">
                                        <img
                                            src={product.image}
                                            alt={product.pro_name}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500 rounded-2xl"
                                        />
                                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-[10px] px-3 py-1.5 rounded-full text-[#D4AF37] border border-[#D4AF37]/30 font-bold tracking-widest">
                                            {product.pro_quantity}
                                        </div>
                                    </div>
                                    <div className="px-4 pb-4 flex-1 flex flex-col justify-end bg-gradient-to-b from-[#111]/0 to-[#0A0A0A]">
                                        <h3 className="font-serif text-white text-[15px] tracking-wide group-hover:text-[#D4AF37] transition-colors line-clamp-1 mb-0.5">{product.pro_name}</h3>
                                        <p className="text-[#888] font-sans text-[11px] italic mb-4">{product.jewel_category}</p>

                                        {/* Quantity Selector */}
                                        <div className="flex items-center justify-between bg-[#151515] border border-white/5 rounded-xl p-1 w-full mb-3">
                                            <button onClick={() => handleQuantity(product.id, -1)} className="p-1.5 rounded-lg text-[#888] hover:text-[#D4AF37] hover:bg-[#222] transition-colors">
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-sans font-bold text-sm text-white w-6 text-center">{qty}</span>
                                            <button onClick={() => handleQuantity(product.id, 1)} className="p-1.5 rounded-lg text-[#888] hover:text-[#D4AF37] hover:bg-[#222] transition-colors">
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        {/* Register Button */}
                                        {status === 'success' ? (
                                            <button disabled className="bg-[#D4AF37] text-black text-[10px] uppercase tracking-widest px-2 py-3 rounded-xl font-bold w-full shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center gap-1">
                                                <Check size={14} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => triggerEnquire(product)}
                                                disabled={status === 'loading'}
                                                className="bg-transparent border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] uppercase tracking-widest px-2 py-3 rounded-xl font-bold hover:bg-[#D4AF37] hover:text-black transition-all w-full focus:outline-none disabled:opacity-50"
                                            >
                                                {status === 'loading' ? 'Processing...' : 'Register'}
                                            </button>
                                        )}

                                        <div className="mt-3 flex items-center justify-center pt-2 border-t border-white/5">
                                            <span className="text-[#D4AF37] text-[9px] uppercase tracking-widest font-bold">{product.jewel_type}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

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

                            <h2 className="text-xl font-serif text-[#D4AF37] mb-4 text-center">Confirm Interest</h2>

                            <div className="mb-6 flex justify-center">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 p-1 bg-black">
                                    <img src={confirmModal.image} alt={confirmModal.pro_name} className="w-full h-full object-contain rounded-xl" />
                                </div>
                            </div>

                            <p className="text-[#A3A3A3] font-sans text-sm mb-8 text-center leading-relaxed">
                                Proceed to register interest for <strong className="text-white">{(quantities[confirmModal.id] || 1)}x {confirmModal.pro_name}</strong> from {confirmModal.jewel_category}?
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleEnquire}
                                    className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B6942C] text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-[0.98] transition-transform"
                                >
                                    Confirm Enquiry
                                </button>
                                <button
                                    onClick={() => setConfirmModal(null)}
                                    className="w-full py-3 bg-transparent text-[#666] font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                            alt="Product Full View"
                            className="max-w-[95vw] max-h-[85vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.15)]"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
            .hide-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .hide-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            `}</style>
        </div>
    );
}
