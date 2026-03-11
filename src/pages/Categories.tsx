import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Instagram, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { playGoldSound } from "../utils/sounds";

// ✅ உங்கள் Long-Lived Access Token இங்கே paste பண்ணவும்
const INSTAGRAM_TOKEN = "EAAMJDZCuZCjZAUBQwDiXXsbPUwlN4dNFnEOZCsvQWeZB3KIQQ8E3DlI2XXvLwqVcmQZCCmKDbyJ8kBLbHGojwDTpRgYQlNR4zHZBT1bSRZBuRM85dWTRAMoqDXxeydr4nZAQfOojUfZBem0IH4R963kLGirhUmxP3FvimPeZCSlOVa4ugrHkbLEOrsNXXnD1SiKZA7HVFw51AudLYLZA2aNi7eLhjWNBQSXG3OiRUkVlinTCPlu01xykI";
const INSTAGRAM_API = "https://graph.instagram.com";

export default function Categories() {
    const instagramProfile = "https://www.instagram.com/dmyjewellers?igsh=MWowZGNmMDIxczhibw==";
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInstagramPosts();
    }, []);

    const fetchInstagramPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            // Step 1: Get latest 10 media IDs + basic fields
            const mediaRes = await fetch(
                `${INSTAGRAM_API}/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,like_count,comments_count,timestamp&limit=10&access_token=${INSTAGRAM_TOKEN}`
            );
            const mediaData = await mediaRes.json();

            if (mediaData.error) {
                throw new Error(mediaData.error.message);
            }

            // Filter only IMAGE and CAROUSEL types (skip REELS if no thumbnail)
            const imagePosts = mediaData.data.filter(
                // post => post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM"
            ).slice(0, 10);

            setPosts(imagePosts);
        } catch (err) {
            // setError(err.message || "Failed to load Instagram posts");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[var(--color-bg,#050505)] pb-32 font-sans overflow-x-hidden page-transition">
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] bg-gradient-radial from-[#E1306C] to-transparent opacity-10" />
            </div>

            <div className="relative z-10 flex flex-col gap-6">
                {/* Header */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative w-full flex items-center p-6 shadow-2xl z-20"
                    style={{
                        background: 'linear-gradient(180deg, var(--color-card, rgba(11,43,33,1)) 0%, var(--color-bg, rgba(5,5,5,1)) 100%)',
                        borderBottom: '1px solid rgba(225,48,108,0.2)'
                    }}
                >
                    <Link to="/home" onClick={() => playGoldSound()} className="text-[var(--color-primary,#D4AF37)] hover:scale-110 transition-transform">
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="ml-4 flex items-center gap-2 flex-1">
                        <Instagram className="text-[#E1306C]" size={20} />
                        <h1 className="text-xl font-serif text-[var(--color-primary,#D4AF37)] font-light tracking-widest uppercase">Instagram Feed</h1>
                    </div>
                    {/* Refresh Button */}
                    <button
                        onClick={fetchInstagramPosts}
                        className="text-white/40 hover:text-[#E1306C] transition-colors active:scale-90"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                </motion.div>

                <div className="px-6 relative z-10">
                    {/* Profile Card */}
                    <motion.a
                        href={instagramProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] rounded-2xl p-[1px] block shadow-2xl mb-8 group hover:scale-[1.02] transition-transform active:scale-95"
                    >
                        <div className="bg-[var(--color-card,#111)] rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#405DE6] p-[2px]">
                                    <div className="w-full h-full bg-black rounded-full p-1.5 flex items-center justify-center">
                                        <img src={import.meta.env.BASE_URL + "logo.png"} alt="DMY" className="w-full h-full object-contain filter brightness-200" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">@dmyjewellers</h3>
                                    <p className="text-white/60 text-[10px] tracking-widest uppercase">
                                        {loading ? "Loading posts..." : `${posts.length} posts loaded`}
                                    </p>
                                </div>
                            </div>
                            <ExternalLink size={20} className="text-white/80 group-hover:text-white transition-colors" />
                        </div>
                    </motion.a>

                    {/* Error State */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-6 bg-red-900/20 border border-red-500/30 rounded-xl p-4 flex items-start gap-3"
                        >
                            <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-red-300 text-xs font-bold mb-1">Token Error</p>
                                <p className="text-red-400/70 text-[10px] leading-relaxed">{error}</p>
                                <button onClick={fetchInstagramPosts} className="mt-2 text-[10px] text-[#E1306C] underline">Retry</button>
                            </div>
                        </motion.div>
                    )}

                    {/* Loading Skeleton */}
                    {loading && (
                        <div className="grid grid-cols-2 gap-3">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="aspect-square bg-[var(--color-card,#1a1a1a)] rounded-xl animate-pulse border border-white/5" />
                            ))}
                        </div>
                    )}

                    {/* ✅ Real Instagram Image Grid */}
                    {!loading && posts.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                            {posts.map((index) => (
                                <motion.a
                                    // key={post.id}
                                    // href={post.permalink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="aspect-square bg-[var(--color-card,#1a1a1a)] rounded-xl overflow-hidden shadow-lg border border-white/5 hover:border-[#E1306C]/50 transition-all cursor-pointer group relative"
                                >
                                    {/* Real Instagram Image */}
                                    <img
                                        // src={post.media_url}
                                        alt={`DMY Jewellers post ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    // onError={(e) => {
                                    //     // Fallback if image fails
                                    //     e.target.style.display = 'none';
                                    // }}
                                    />

                                    {/* Hover Overlay with real stats */}
                                    {/* <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10 backdrop-blur-sm">
                                        {post.like_count !== undefined && (
                                            <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                                                <Heart size={16} fill="white" /> {post.like_count}
                                            </div>
                                        )}
                                        {post.comments_count !== undefined && (
                                            <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                                                <MessageCircle size={16} fill="white" /> {post.comments_count}
                                            </div>
                                        )}
                                    </div> */}
                                </motion.a>
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && posts.length === 0 && (
                        <div className="text-center py-16 text-white/30">
                            <Instagram size={40} className="mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No posts found</p>
                        </div>
                    )}

                    {/* Token Setup Note */}
                    {/* {INSTAGRAM_TOKEN === "YOUR_LONG_LIVED_ACCESS_TOKEN_HERE" && (
                        <div className="mt-8 text-center bg-yellow-900/20 border border-yellow-500/20 p-4 rounded-xl">
                            <p className="text-[10px] text-yellow-400/70 leading-relaxed italic">
                                ⚠️ <b>Setup Required:</b> INSTAGRAM_TOKEN-ஐ உங்கள் actual token-ஆல் replace பண்ணவும். Meta Developer Console → Instagram Basic Display → Access Token.
                            </p>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
}