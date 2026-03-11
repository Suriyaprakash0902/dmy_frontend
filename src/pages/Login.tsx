import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, EyeIcon, EyeOffIcon } from "lucide-react";
import { motion } from 'framer-motion';
import httpService from '../services/httpService';
import toast from 'react-hot-toast';
import { playGoldSound } from '../utils/sounds';

export default function Login() {
    const navigate = useNavigate();
    const [loginMethod, setLoginMethod] = useState<'password' | 'email' | 'phone'>('password');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        emailOtp: '',
        phone: '',
        phoneOtp: ''
    });

    // UI states

    const [otpSent, setOtpSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const updateFormData = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // --- PASSWORD LOGIN FLOW ---
    const handlePasswordLogin = async () => {
        playGoldSound();
        if (!formData.email && !formData.phone) {
            toast.error('Please enter an Email or Phone number');
            return;
        }
        if (!formData.password) {
            toast.error('Please enter your password');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload: any = { password: formData.password };

            // Auto detect if they entered an email or phone
            if (formData.email.includes('@')) {
                payload.email = formData.email;
            } else {
                // Formatting for phone if it doesn't have an @
                const cleanPhone = formData.email.replace(/\D/g, '');
                payload.phone = cleanPhone.startsWith('65') ? '+' + cleanPhone : '+65' + cleanPhone;
            }

            const data: any = await httpService.post('/api/auth/login/password', payload);
            localStorage.setItem('token', data.token);
            toast.success('Access Granted.', { style: { background: '#0B0B0B', color: '#D4AF37' } });
            navigate('/home');
        } catch (error: any) {
            toast.error(error.message || 'Login failed, check credentials.');
        }
        setIsSubmitting(false);
    };

    // --- EMAIL LOGIN (OTP Flow) ---
    const handleEmailOtpLogin = async () => {
        playGoldSound();
        if (!formData.email) {
            toast.error('Email is required');
            return;
        }
        setIsSubmitting(true);
        try {
            await httpService.post('/api/auth/login/email-otp', {
                email: formData.email
            });
            setOtpSent(true);
            toast.success('Verification code sent to your email.');
        } catch (error: any) {
            toast.error(error.message || 'Login failed, check credentials.');
        }
        setIsSubmitting(false);
    };

    const handleVerifyEmailOtp = async () => {
        playGoldSound();
        if (formData.emailOtp.length !== 4) {
            toast.error('Enter valid 4-digit OTP');
            return;
        }
        setIsSubmitting(true);
        try {
            const data: any = await httpService.post('/api/auth/login/verify-email-otp', {
                email: formData.email,
                otp: formData.emailOtp
            });
            localStorage.setItem('token', data.token);
            toast.success('Access Granted.', { style: { background: '#0B0B0B', color: '#D4AF37' } });
            navigate('/home');
        } catch (error: any) {
            toast.error(error.message || 'Verification Failed');
        }
        setIsSubmitting(false);
    };

    // --- PHONE WHATSAPP LOGIN FLOW ---
    const handlePhoneLogin = async () => {
        playGoldSound();
        const phoneNo = '+65' + formData.phone;
        if (!formData.phone || formData.phone.length < 8) {
            toast.error('Enter a valid phone number');
            return;
        }
        setIsSubmitting(true);
        try {
            await httpService.post('/api/auth/login/phone-otp', { phone: phoneNo });
            setOtpSent(true);
            toast.success('WhatsApp OTP Dispatched');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send WhatsApp OTP');
        }
        setIsSubmitting(false);
    };

    const handleVerifyPhoneOtp = async () => {
        playGoldSound();
        const phoneNo = '+65' + formData.phone;
        if (formData.phoneOtp.length !== 4) {
            toast.error('Enter valid 4-digit OTP');
            return;
        }
        setIsSubmitting(true);
        try {
            const data: any = await httpService.post('/api/auth/login/verify-phone-otp', {
                phone: phoneNo,
                otp: formData.phoneOtp
            });
            localStorage.setItem('token', data.token);
            toast.success('Access Granted.', { style: { background: '#0B0B0B', color: '#D4AF37' } });
            navigate('/home');
        } catch (error: any) {
            toast.error(error.message || 'Verification Failed');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="relative min-h-screen bg-[#050505] text-[#D4AF37] overflow-x-hidden page-transition">
            {/* Background Animations */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
                    className="absolute -top-[30%] -left-[10%] w-[800px] h-[800px] rounded-full blur-[150px] bg-gradient-radial from-[#D4AF37] to-transparent"
                />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-10">

                {/* Header Back Button & Logo */}
                <div className="absolute top-8 left-6 right-6 flex justify-between items-center">
                    <Link to="/" onClick={() => playGoldSound()} className="text-[#D4AF37] hover:scale-110 transition-transform">
                        <ArrowLeft size={24} />
                    </Link>
                    <img src={import.meta.env.BASE_URL + "logo.png"} alt="DMY Jewellers" className="h-8 filter contrast-125 opacity-80" />
                </div>

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-sm mt-12"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#F0E6D2] via-[#D4AF37] to-[#F0E6D2] tracking-wide mb-2">
                            Login
                        </h1>
                        <p className="text-[#888] text-sm tracking-widest uppercase font-light">Access your wealth</p>
                    </div>

                    {/* Method Toggle */}
                    <div className="flex bg-[#111] border border-white/5 rounded-full p-1 mb-8 shadow-inner">
                        <button
                            onClick={() => { playGoldSound(); setLoginMethod('password'); setOtpSent(false); }}
                            className={`flex-[1.2] py-3 text-[10px] tracking-widest uppercase rounded-full transition-all duration-300 font-bold ${loginMethod === 'password'
                                ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                : 'text-[#888] hover:text-[#D4AF37]'
                                }`}
                        >
                            Password
                        </button>
                        <button
                            onClick={() => { playGoldSound(); setLoginMethod('email'); setOtpSent(false); }}
                            className={`flex-[0.9] py-3 text-[10px] tracking-widest uppercase rounded-full transition-all duration-300 font-bold ${loginMethod === 'email'
                                ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                : 'text-[#888] hover:text-[#D4AF37]'
                                }`}
                        >
                            Email
                        </button>
                        <button
                            onClick={() => { playGoldSound(); setLoginMethod('phone'); setOtpSent(false); }}
                            className={`flex-1 py-3 text-[10px] tracking-widest uppercase rounded-full transition-all duration-300 font-bold ${loginMethod === 'phone'
                                ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                : 'text-[#888] hover:text-[#D4AF37]'
                                }`}
                        >
                            WhatsApp
                        </button>
                    </div>

                    <div className="bg-[#0A0A0A] border border-[rgba(212,175,55,0.15)] rounded-3xl p-6 shadow-2xl relative overflow-hidden">

                        {/* Shimmer effect inside card */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white to-transparent rotate-45 animate-shimmer" />
                        </div>

                        {loginMethod === 'password' && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
                                <div>
                                    <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-2 block">Email or Phone Number</label>
                                    <input
                                        type="text"
                                        placeholder="client@vault.com or 87654321"
                                        value={formData.email} // Reusing formData.email as a generic identifier field
                                        onChange={(e) => updateFormData('email', e.target.value)}
                                        className="w-full bg-[#151515] border border-white/5 text-[#D4AF37] placeholder-[#444] rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#D4AF37] transition-colors font-sans text-sm"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-2 block">Master Password</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => updateFormData('password', e.target.value)}
                                        className="w-full bg-[#151515] border border-white/5 text-[#D4AF37] placeholder-[#444] rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#D4AF37] transition-colors font-sans tracking-widest"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 bottom-4 text-[#666] hover:text-[#D4AF37]">
                                        {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                                    </button>
                                </div>

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handlePasswordLogin}
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B6942C] text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] mt-2"
                                >
                                    {isSubmitting ? 'Authenticating...' : 'Login Securely'}
                                </motion.button>
                            </motion.div>
                        )}

                        {loginMethod === 'email' && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                                <div>
                                    <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-2 block">Registered Email</label>
                                    <input
                                        type="email"
                                        placeholder="client@vault.com"
                                        disabled={otpSent}
                                        value={formData.email}
                                        onChange={(e) => updateFormData('email', e.target.value)}
                                        className="w-full bg-[#151515] border border-white/5 disabled:opacity-50 text-[#D4AF37] placeholder-[#444] rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#D4AF37] transition-colors font-sans text-sm"
                                    />
                                </div>

                                {!otpSent && (
                                    <>
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleEmailOtpLogin}
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B6942C] text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] mt-2"
                                        >
                                            {isSubmitting ? 'Sending Request...' : 'Send Access Code'}
                                        </motion.button>
                                    </>
                                )}

                                {otpSent && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                                        <div>
                                            <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-2 block">Security OTP Sent</label>
                                            <input
                                                type="text"
                                                placeholder="••••"
                                                maxLength={4}
                                                value={formData.emailOtp}
                                                onChange={(e) => updateFormData('emailOtp', e.target.value.replace(/\D/g, ''))}
                                                className="w-full bg-[#151515] border border-[#D4AF37]/50 text-white rounded-xl px-4 py-4 text-center tracking-[1em] text-xl focus:outline-none focus:border-[#D4AF37] transition-colors"
                                            />
                                        </div>
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleVerifyEmailOtp}
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-2"
                                        >
                                            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                                        </motion.button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {loginMethod === 'phone' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                                <div>
                                    <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-2 block">WhatsApp Number</label>
                                    <div className="flex bg-[#151515] border border-white/5 rounded-xl disabled:opacity-50 overflow-hidden focus-within:border-[#D4AF37] transition-colors">
                                        <span className="flex items-center justify-center px-4 bg-[#111] border-r border-white/5 text-[#D4AF37] font-bold text-sm">
                                            +65
                                        </span>
                                        <input
                                            type="tel"
                                            placeholder="8765 4321"
                                            disabled={otpSent}
                                            value={formData.phone}
                                            onChange={(e) => updateFormData('phone', e.target.value.replace(/\D/g, ''))}
                                            className="w-full bg-transparent text-[#D4AF37] placeholder-[#444] px-4 py-3.5 focus:outline-none font-sans text-sm tracking-wider"
                                        />
                                    </div>
                                </div>

                                {!otpSent ? (
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handlePhoneLogin}
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B6942C] text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] mt-2"
                                    >
                                        {isSubmitting ? 'Connecting...' : 'Send WhatsApp OTP'}
                                    </motion.button>
                                ) : (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                                        <div>
                                            <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3] mb-2 block">WhatsApp OTP</label>
                                            <input
                                                type="text"
                                                placeholder="••••"
                                                maxLength={4}
                                                value={formData.phoneOtp}
                                                onChange={(e) => updateFormData('phoneOtp', e.target.value.replace(/\D/g, ''))}
                                                className="w-full bg-[#151515] border border-[#D4AF37]/50 text-white rounded-xl px-4 py-4 text-center tracking-[1em] text-xl focus:outline-none focus:border-[#D4AF37] transition-colors"
                                            />
                                        </div>
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleVerifyPhoneOtp}
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-2"
                                        >
                                            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                                        </motion.button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    <div className="mt-8 text-center bg-[#111]/50 py-4 rounded-xl border border-white/5 backdrop-blur-sm">
                        <span className="text-[#666] text-xs font-sans tracking-wide">
                            New User?{' '}
                            <Link to="/signup" onClick={() => playGoldSound()} className="text-[#D4AF37] font-bold uppercase tracking-widest hover:text-[#FFF] transition-colors ml-1">
                                Sign Up
                            </Link>
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
