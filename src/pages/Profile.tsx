import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Settings, Bell, Heart, CreditCard, ChevronRight } from "lucide-react";
import httpService from "../services/httpService";
import toast from "react-hot-toast";

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await httpService.get('/api/user/myprofile');
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
            await httpService.post('/api/auth/logout');
        } catch (error) {
            console.error('Logout API failed', error);
        } finally {
            localStorage.removeItem('token');
            toast.success('Logged out successfully');
            navigate('/login');
        }
    };

    const menuItems = [
        { icon: User, label: "Edit Profile" },
        { icon: Heart, label: "Wishlist" },
        { icon: CreditCard, label: "Payment Methods" },
        { icon: Bell, label: "Notifications" },
        { icon: Settings, label: "Settings" }
    ];

    return (
        <div className="w-full bg-[#FAFAFA] min-h-full pb-20 fade-in">
            {/* Header section with gradient */}
            <div className="w-full bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A] pt-12 pb-8 px-6 rounded-b-[40px] shadow-lg flex flex-col items-center">
                <div className="w-24 h-24 bg-[#C9A84C] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.5)] border-4 border-white mb-4 overflow-hidden">
                    <User size={48} className="text-white" />
                </div>
                <h1 className="text-2xl font-playfair font-bold text-white mb-1">
                    {isLoading ? "Loading..." : (user?.name || "DMY User")}
                </h1>
                <p className="text-gray-400 font-inter text-sm mb-4">
                    {user?.createdAt ? `Member since ${new Date(user.createdAt).getFullYear()}` : "Member since 2026"}
                </p>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-[#C9A84C] font-inter text-sm font-semibold tracking-wider">
                    GOLD TIER
                </div>
            </div>

            {/* Menu Items */}
            <div className="px-6 mt-8 space-y-3">
                <h2 className="text-sm font-inter font-bold text-gray-500 uppercase tracking-wider mb-4 pl-2">Account</h2>

                {menuItems.map((item, index) => (
                    <button key={index} className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-transform group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#FFFBF0] transition-colors">
                                <item.icon size={20} className="text-gray-600 group-hover:text-[#C9A84C] transition-colors" />
                            </div>
                            <span className="font-inter font-medium text-gray-800">{item.label}</span>
                        </div>
                        <ChevronRight size={20} className="text-gray-300 group-hover:text-[#C9A84C] transition-colors" />
                    </button>
                ))}
            </div>

            {/* Logout section */}
            <div className="px-6 mt-10 mb-8">
                <button
                    onClick={handleLogout}
                    className="w-full bg-white p-4 rounded-2xl shadow-sm border border-red-100 flex items-center justify-center gap-2 text-red-600 active:scale-[0.98] transition-transform hover:bg-red-50"
                >
                    <LogOut size={20} />
                    <span className="font-inter font-bold">Log out</span>
                </button>
            </div>

            <div className="text-center text-xs text-gray-400 font-inter mb-4">
                App Version 1.0.0
            </div>
        </div>
    );
}
