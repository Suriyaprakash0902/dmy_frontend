import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import httpService from '../services/httpService';
import toast from 'react-hot-toast';
import { playGoldSound } from '../utils/sounds';

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '', email: '', phone: '', dob: '', gender: '', password: '', confirmPassword: '', agreeTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const update = (field: string, value: string | boolean) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.name) newErrors.name = 'Data required';
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email structure';
        if (!form.phone) newErrors.phone = 'Data required';
        if (!form.dob) newErrors.dob = 'Data required';
        if (!form.gender) newErrors.gender = 'Selection required';
        if (!form.password || form.password.length < 8) newErrors.password = 'Min 8 characters';
        if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Keys mismatch';
        if (!otpVerified) newErrors.email = 'Verification required';
        if (!form.agreeTerms) newErrors.agreeTerms = 'Agreement mandatory';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = async () => {
        playGoldSound();
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
            setErrors({ ...errors, email: 'Valid email required' });
            return;
        }
        setIsSubmitting(true);
        try {
            await httpService.post('/api/auth/register/send-otp', { email: form.email });
            setOtpSent(true);
            toast.success(`Verification code dispatched to ${form.email}`);
        } catch (error: any) {
            setErrors({ ...errors, email: error.message || 'Failed to dispatch code' });
        }
        setIsSubmitting(false);
    };

    const handleVerifyOtp = async () => {
        playGoldSound();
        if (otp.length !== 4) return;
        setIsSubmitting(true);
        try {
            await httpService.post('/api/auth/register/verify-otp', { email: form.email, otp });
            setOtpVerified(true);
            toast.success('Identity verified.', { style: { background: '#0B0B0B', color: '#D4AF37' } });
        } catch (error: any) {
            setErrors({ ...errors, email: error.message || 'Invalid code' });
        }
        setIsSubmitting(false);
    };

    const handleSignup = async () => {
        playGoldSound();
        if (validate()) {
            setIsSubmitting(true);
            try {
                const data: any = await httpService.post('/api/auth/register', form);
                if (data.token) localStorage.setItem('token', data.token);
                toast.success('Vault Access Granted');
                navigate('/home');
            } catch (error: any) {
                setErrors({ ...errors, email: error.message || 'Verification failed' });
            }
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#050505] text-[#D4AF37] overflow-y-auto page-transition custom-scrollbar">
            {/* Background Animations */}
            <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 90, ease: "linear" }}
                    className="absolute top-[10%] right-[10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-gradient-radial from-[#D4AF37] to-transparent"
                />
            </div>

            <div className="relative z-10 px-6 py-10 pb-20">

                {/* Header Back Button & Logo */}
                <div className="flex justify-between items-center mb-10">
                    <Link to="/login" onClick={() => playGoldSound()} className="text-[#D4AF37] hover:scale-110 transition-transform">
                        <ArrowLeft size={24} />
                    </Link>
                    <img src={import.meta.env.BASE_URL + "logo-main.png"} alt="DMY Jewellers" className="h-8 filter contrast-125 opacity-80" />
                </div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                    <div className="mb-8">
                        <h1 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#F0E6D2] via-[#D4AF37] to-[#F0E6D2] tracking-wide mb-2">
                            Initialize Account
                        </h1>
                        <p className="text-[#888] text-xs tracking-widest uppercase font-light">Create your personal vault</p>
                    </div>

                    <div className="bg-[#0B0B0B] border border-white/5 shadow-2xl rounded-3xl p-6 space-y-6 relative overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.3)] to-transparent" />

                        {/* Name */}
                        <div>
                            <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5 block">Full Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => update('name', e.target.value)}
                                placeholder="Legal Name"
                                className={`w-full bg-[#151515] border ${errors.name ? 'border-red-900' : 'border-white/5'} text-[#D4AF37] placeholder-[#444] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] font-sans text-sm tracking-wide`}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5 block">Email Address</label>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => { update('email', e.target.value); setOtpSent(false); setOtpVerified(false); }}
                                    disabled={otpVerified}
                                    placeholder="client@vault.com"
                                    className={`flex-1 bg-[#151515] border ${errors.email ? 'border-red-900' : 'border-white/5'} disabled:opacity-50 text-[#D4AF37] placeholder-[#444] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] font-sans text-sm`}
                                />
                                {!otpVerified && (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={isSubmitting || !form.email}
                                        className="px-4 py-3 bg-[#111] border border-white/5 text-[#D4AF37] text-[10px] tracking-widest uppercase rounded-xl transition-all hover:bg-[#D4AF37] hover:text-black font-bold whitespace-nowrap"
                                    >
                                        {otpSent ? 'Resend' : 'Send Code'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* OTP Input */}
                        {otpSent && !otpVerified && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2">
                                <label className="text-[10px] tracking-widest uppercase text-[#D4AF37] mb-2 block shadow-sm">Secure Code</label>
                                <div className="flex flex-col gap-3">
                                    <input
                                        type="text"
                                        maxLength={4}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        placeholder="••••"
                                        className="w-full bg-[#151515] border border-[#D4AF37]/50 text-[#D4AF37] tracking-[1em] text-center rounded-xl px-4 py-4 focus:outline-none focus:border-[#D4AF37] font-sans text-xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B6942C] text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-transform active:scale-[0.98]"
                                    >
                                        Verify Code
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Phone */}
                        <div>
                            <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5 block">Phone Number</label>
                            <div className="flex bg-[#151515] border border-white/5 rounded-xl overflow-hidden focus-within:border-[#D4AF37] transition-colors">
                                <span className="flex items-center justify-center px-3 bg-[#111] border-r border-white/5 text-[#D4AF37] font-bold text-sm">
                                    +65
                                </span>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))}
                                    placeholder="8765 4321"
                                    className="w-full bg-transparent text-[#D4AF37] placeholder-[#444] px-4 py-3 focus:outline-none font-sans text-sm tracking-wider"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5 block">Birth Date</label>
                                <input
                                    type="date"
                                    value={form.dob}
                                    onChange={(e) => update('dob', e.target.value)}
                                    className="w-full bg-[#151515] border border-white/5 text-[#D4AF37] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] font-sans text-sm appearance-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5 block">Identity</label>
                                <select
                                    value={form.gender}
                                    onChange={(e) => update('gender', e.target.value)}
                                    className="w-full bg-[#151515] border border-white/5 text-[#D4AF37] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] font-sans text-sm appearance-none"
                                >
                                    <option value="" className="bg-[#111]">Select</option>
                                    <option value="male" className="bg-[#111]">Male</option>
                                    <option value="female" className="bg-[#111]">Female</option>
                                </select>
                            </div>
                        </div>

                        {/* Passwords */}
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5 block">Master Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => update('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#151515] border border-white/5 text-[#D4AF37] placeholder-[#444] rounded-xl px-4 py-3 tracking-widest focus:outline-none focus:border-[#D4AF37] transition-colors font-sans"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 bottom-3.5 text-[#666] hover:text-[#D4AF37]">
                                    {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                                </button>
                            </div>
                            <div className="relative">
                                <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5 block">Confirm Password</label>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={form.confirmPassword}
                                    onChange={(e) => update('confirmPassword', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#151515] border border-white/5 text-[#D4AF37] placeholder-[#444] rounded-xl px-4 py-3 tracking-widest focus:outline-none focus:border-[#D4AF37] transition-colors font-sans"
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 bottom-3.5 text-[#666] hover:text-[#D4AF37]">
                                    {showConfirmPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2 flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={form.agreeTerms}
                                onChange={(e) => update('agreeTerms', e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-gray-600 bg-black checked:bg-[#D4AF37] focus:ring-0 accent-[#D4AF37]"
                            />
                            <span className="text-[#888] text-[10px] uppercase tracking-wider leading-relaxed">
                                I bind myself to the <button onClick={(e) => e.preventDefault()} className="text-[#D4AF37] underline font-bold">Terms of Vault</button>
                            </span>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSignup}
                            disabled={isSubmitting}
                            className="w-full py-4 mt-4 bg-gradient-to-r from-[#D4AF37] to-[#B6942C] text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50"
                        >
                            {isSubmitting ? 'Processing...' : 'Secure Account'}
                        </motion.button>

                    </div>
                </motion.div>
            </div>
        </div>
    );
}