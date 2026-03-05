import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, ArrowLeft, CheckCircle2, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import httpService from '../services/httpService';
import toast from 'react-hot-toast';
import { playGoldSound } from '../utils/sounds';

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '', email: '', phone: '', dob: '', gender: '', password: '', confirmPassword: '', agreeTerms: false
    });

    // UI states
    const [verificationMethod, setVerificationMethod] = useState<'email' | 'phone'>('email');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
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
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';
        if (!form.phone || form.phone.length < 8) newErrors.phone = 'Invalid phone';
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
        setErrors({});

        if (verificationMethod === 'email') {
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

        } else if (verificationMethod === 'phone') {
            if (!form.phone || form.phone.length < 8) {
                setErrors({ ...errors, phone: 'Valid phone required' });
                return;
            }
            setIsSubmitting(true);
            try {
                const phoneNo = '+65' + form.phone;
                await httpService.post('/api/auth/register/send-whatsapp-otp', { phone: phoneNo });
                setOtpSent(true);
                toast.success(`WhatsApp verification dispatched to +65 ${form.phone}`);
            } catch (error: any) {
                setErrors({ ...errors, phone: error.message || 'Failed to dispatch code' });
            }
            setIsSubmitting(false);
        }
    };

    const handleVerifyOtp = async () => {
        playGoldSound();
        if (otp.length !== 4) return;
        setIsSubmitting(true);
        try {
            if (verificationMethod === 'email') {
                await httpService.post('/api/auth/register/verify-otp', { email: form.email, otp });
            } else {
                const phoneNo = '+65' + form.phone;
                await httpService.post('/api/auth/register/verify-whatsapp-otp', { phone: phoneNo, otp });
            }
            setOtpVerified(true);
            toast.success('Identity verified.', { style: { background: '#0B0B0B', color: '#D4AF37' } });
        } catch (error: any) {
            setErrors({ ...errors, [verificationMethod]: error.message || 'Invalid code' });
        }
        setIsSubmitting(false);
    };

    const handleSignup = async () => {
        playGoldSound();
        if (validate()) {
            setIsSubmitting(true);
            try {
                // Ensure the exact verified values are passed
                const finalForm = {
                    ...form,
                    phone: '+65' + form.phone
                }
                const data: any = await httpService.post('/api/auth/register', finalForm);
                if (data.token) localStorage.setItem('token', data.token);
                toast.success('Account Created');
                navigate('/home');
            } catch (error: any) {
                const msg = error.message || 'Registration failed due to a server error';
                const fieldError = error.field;

                // Directly assign to the matching column/field from the backend constraints
                if (fieldError) {
                    setErrors(prev => ({ ...prev, [fieldError]: msg }));
                } else {
                    // Fallback check
                    if (msg.toLowerCase().includes('phone')) {
                        setErrors(prev => ({ ...prev, phone: msg }));
                    } else if (msg.toLowerCase().includes('email')) {
                        setErrors(prev => ({ ...prev, email: msg }));
                    } else {
                        toast.error(msg);
                    }
                }
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
                            Create Account
                        </h1>
                        <p className="text-[#888] text-xs tracking-widest uppercase font-light">Create your account</p>
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

                        {/* Verification Selector */}
                        <div>
                            <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-2 block">Verify Identity using</label>
                            <div className="flex bg-[#111] border border-white/5 rounded-full p-1 shadow-inner">
                                <button
                                    type="button"
                                    onClick={() => { playGoldSound(); setVerificationMethod('email'); setOtpSent(false); setOtpVerified(false); setErrors({}); }}
                                    className={`flex-1 py-3 text-xs tracking-widest uppercase rounded-full transition-all duration-300 font-bold ${verificationMethod === 'email'
                                        ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                        : 'text-[#888] hover:text-[#D4AF37]'
                                        }`}
                                >
                                    Email
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { playGoldSound(); setVerificationMethod('phone'); setOtpSent(false); setOtpVerified(false); setErrors({}); }}
                                    className={`flex-1 py-3 text-xs tracking-widest uppercase rounded-full transition-all duration-300 font-bold ${verificationMethod === 'phone'
                                        ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                        : 'text-[#888] hover:text-[#D4AF37]'
                                        }`}
                                >
                                    WhatsApp
                                </button>
                            </div>
                        </div>

                        {/* Email */}
                        {verificationMethod === 'email' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                                            className="px-4 py-3 bg-[#111] border border-[#D4AF37] text-[#D4AF37] text-[10px] tracking-widest uppercase rounded-xl transition-all hover:bg-[#D4AF37] hover:text-black font-bold whitespace-nowrap"
                                        >
                                            {otpSent ? 'Resend' : 'Send Code'}
                                        </button>
                                    )}
                                </div>
                                {errors.email && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.email}</p>}
                            </motion.div>
                        )}

                        {/* Phone */}
                        {verificationMethod === 'phone' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5 block">WhatsApp Number</label>
                                <div className="flex gap-2">
                                    <div className={`flex flex-1 bg-[#151515] border ${errors.phone ? 'border-red-900' : 'border-white/5'} rounded-xl disabled:opacity-50 overflow-hidden focus-within:border-[#D4AF37] transition-colors`}>
                                        <span className="flex items-center justify-center px-3 bg-[#111] border-r border-white/5 text-[#D4AF37] font-bold text-sm">
                                            +65
                                        </span>
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={(e) => { update('phone', e.target.value.replace(/\D/g, '')); setOtpSent(false); setOtpVerified(false); }}
                                            disabled={otpVerified}
                                            placeholder="8765 4321"
                                            className="w-full bg-transparent text-[#D4AF37] placeholder-[#444] px-4 py-3 focus:outline-none font-sans text-sm tracking-wider"
                                        />
                                    </div>
                                    {!otpVerified && (
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={isSubmitting || !form.phone}
                                            className="px-4 py-3 bg-[#111] border border-white/5 text-[#D4AF37] text-[10px] tracking-widest uppercase rounded-xl transition-all hover:bg-[#D4AF37] hover:text-black font-bold whitespace-nowrap"
                                        >
                                            {otpSent ? 'Resend' : 'Send Code'}
                                        </button>
                                    )}
                                </div>
                                {errors.phone && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.phone}</p>}
                            </motion.div>
                        )}


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

                        {/* Always require the other unverified parameter too for DB consistency! */}
                        {verificationMethod === 'email' && (
                            <div>
                                <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5 block">Phone Number</label>
                                <div className={`flex bg-[#151515] border ${errors.phone ? 'border-red-900' : 'border-white/5'} rounded-xl overflow-hidden focus-within:border-[#D4AF37] transition-colors`}>
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
                                {errors.phone && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.phone}</p>}
                            </div>
                        )}

                        {verificationMethod === 'phone' && (
                            <div>
                                <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5 block">Email Address</label>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => update('email', e.target.value)}
                                        placeholder="client@vault.com"
                                        className={`flex-1 bg-[#151515] border ${errors.email ? 'border-red-900' : 'border-white/5'} text-[#D4AF37] placeholder-[#444] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] font-sans text-sm`}
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.email}</p>}
                            </div>
                        )}


                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5 block">Birth Date</label>
                                <input
                                    type="date"
                                    value={form.dob}
                                    max={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => update('dob', e.target.value)}
                                    className="w-full bg-[#151515] border border-white/5 text-[#D4AF37] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] font-sans text-sm appearance-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5 block">Gender</label>
                                <select
                                    value={form.gender}
                                    onChange={(e) => update('gender', e.target.value)}
                                    className="w-full bg-[#151515] border border-white/5 text-[#D4AF37] rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] font-sans text-sm appearance-none"
                                >
                                    <option value="" className="bg-[#111]">Select</option>
                                    <option value="male" className="bg-[#111]">Male</option>
                                    <option value="female" className="bg-[#111]">Female</option>
                                    <option value="other" className="bg-[#111]">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Passwords */}
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5 flex justify-between">
                                    <span>Master Password</span>
                                    {form.password && (
                                        <span className={form.password.length >= 8 ? 'text-green-500' : 'text-red-500'}>
                                            {form.password.length >= 8 ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                        </span>
                                    )}
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => update('password', e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full bg-[#151515] border ${form.password && form.password.length < 8 ? 'border-red-900' : form.password.length >= 8 ? 'border-green-900/50' : 'border-white/5'} text-[#D4AF37] placeholder-[#444] rounded-xl px-4 py-3 tracking-widest focus:outline-none focus:border-[#D4AF37] transition-colors font-sans`}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 bottom-3.5 text-[#666] hover:text-[#D4AF37]">
                                    {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                                </button>
                            </div>
                            <div className="relative">
                                <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-1.5 flex justify-between">
                                    <span>Confirm Password</span>
                                    {form.confirmPassword && (
                                        <span className={form.password === form.confirmPassword && form.password.length >= 8 ? 'text-green-500' : 'text-red-500'}>
                                            {form.password === form.confirmPassword && form.password.length >= 8 ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                        </span>
                                    )}
                                </label>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={form.confirmPassword}
                                    onChange={(e) => update('confirmPassword', e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full bg-[#151515] border ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-900' : form.confirmPassword && form.password === form.confirmPassword && form.password.length >= 8 ? 'border-green-900/50' : 'border-white/5'} text-[#D4AF37] placeholder-[#444] rounded-xl px-4 py-3 tracking-widest focus:outline-none focus:border-[#D4AF37] transition-colors font-sans`}
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
                                I bind myself to the <button onClick={(e) => { e.preventDefault(); playGoldSound(); setShowTermsModal(true); }} className="text-[#D4AF37] underline font-bold hover:text-white transition-colors">Terms & Conditions</button>
                            </span>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSignup}
                            disabled={isSubmitting || !otpVerified}
                            className={`w-full py-4 mt-4 bg-gradient-to-r from-[#D4AF37] to-[#B6942C] text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all ${(!otpVerified || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                        >
                            {isSubmitting ? 'Processing...' : 'Create Account'}
                        </motion.button>

                    </div>
                </motion.div>
            </div>
            <AnimatePresence>
                {showTermsModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-[#0A0A0A] border border-[rgba(212,175,55,0.2)] rounded-3xl w-full max-w-sm flex flex-col shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />
                            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#111]">
                                <h2 className="text-sm tracking-widest uppercase font-bold text-[#D4AF37]">Terms & Conditions</h2>
                                <button onClick={() => setShowTermsModal(false)} className="text-[#666] hover:text-[#D4AF37] transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="p-4 bg-[rgba(212,175,55,0.05)] border border-[rgba(212,175,55,0.2)] rounded-xl">
                                    <p className="font-sans text-sm text-[#CCC] leading-relaxed text-center">
                                        Note: The provided mobile number acts securely as your identifier and will be required to receive One-Time Passwords (OTPs) when you log in in the future.
                                    </p>
                                </div>
                                <button
                                    onClick={() => { playGoldSound(); setForm({ ...form, agreeTerms: true }); setShowTermsModal(false); }}
                                    className="w-full mt-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B6942C] text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.3)] active:scale-95 transition-all"
                                >
                                    I Approve & Accept
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}