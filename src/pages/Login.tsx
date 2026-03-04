import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDownIcon, Mail, Phone } from 'lucide-react';
import httpService from '../services/httpService';
import toast from 'react-hot-toast';

export default function Login() {
    const navigate = useNavigate();
    const [loginMethod, setLoginMethod] = useState<'whatsapp' | 'email'>('whatsapp');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{
        phone?: string;
        email?: string;
        otp?: string;
    }>({});

    const handleSendOtp = async () => {
        if (loginMethod === 'whatsapp' && !phone) {
            setErrors({ phone: 'Phone number is required' });
            return;
        }
        if (loginMethod === 'email' && !email) {
            setErrors({ email: 'Email is required' });
            return;
        }
        setIsSubmitting(true);
        try {
            if (loginMethod === 'whatsapp') {
                await httpService.post('/api/auth/login/whatsapp-otp', { phone });
                toast.success(`A WhatsApp OTP has been sent to ${phone}`);
            } else {
                await httpService.post('/api/auth/login/email-otp', { email });
                toast.success(`An Email OTP has been sent to ${email}`);
            }
            setOtpSent(true);
            setErrors({});
        } catch (error: any) {
            console.error(error);
            setErrors({
                ...(loginMethod === 'whatsapp' ? { phone: error.message || 'Failed to send OTP' } : { email: error.message || 'Failed to send OTP' })
            });
        }
        setIsSubmitting(false);
    };

    const handleLogin = async () => {
        if (!otp) {
            setErrors({ otp: 'OTP is required' });
            return;
        }
        setIsSubmitting(true);
        try {
            let data: any;
            if (loginMethod === 'whatsapp') {
                data = await httpService.post('/api/auth/login/verify-otp', { phone, otp });
            } else {
                data = await httpService.post('/api/auth/login/verify-email-otp', { email, otp });
            }
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            navigate('/home');
        } catch (error: any) {
            console.error(error);
            setErrors({ otp: error.message || 'Invalid OTP' });
        }
        setIsSubmitting(false);
    };

    return (
        <div className="relative w-full min-h-screen bg-white page-transition flex flex-col">
            {/* Black curved header */}
            <div
                className="relative w-full flex flex-col items-center pt-10 pb-10 flex-shrink-0"
                style={{
                    backgroundColor: '#0A0A0A',
                    borderRadius: '0 0 50% 50% / 0 0 40px 40px',
                    zIndex: 10
                }}>

                {/* DMY Logo */}
                <div className="text-center">
                    <img src="/logo-main.png" alt="DMY Jewellers" className="w-40 md:w-56 h-auto drop-shadow-xl" />
                </div>
            </div>

            {/* White body */}
            <div className="px-6 pt-8 pb-6 flex-grow flex flex-col relative z-20">
                {/* Heading */}
                <div className="mb-6">
                    <h1
                        className="font-playfair font-black text-4xl text-black leading-tight gold-cursor"
                        style={{
                            color: '#0A0A0A'
                        }}>
                        Hello
                    </h1>
                    <p className="font-inter text-gray-500 text-base mt-1">
                        Log in to your account
                    </p>
                </div>

                {/* Form card */}
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-5 border border-gray-100 mb-8 z-20 bg-opacity-95 backdrop-blur-sm">

                    {/* Login Method Toggle */}
                    {!otpSent && (
                        <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                            <button
                                onClick={() => {
                                    setLoginMethod('whatsapp');
                                    setErrors({});
                                }}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${loginMethod === 'whatsapp' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Phone size={16} /> WhatsApp
                            </button>
                            <button
                                onClick={() => {
                                    setLoginMethod('email');
                                    setErrors({});
                                }}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${loginMethod === 'email' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Mail size={16} /> Email
                            </button>
                        </div>
                    )}

                    {/* Phone field */}
                    {loginMethod === 'whatsapp' && (
                        <div className="mb-4">
                            <label className="font-inter text-sm font-medium text-gray-700 mb-1.5 block">
                                Phone Number
                            </label>
                            <div
                                className="flex items-center rounded-xl border border-gray-200 overflow-hidden focus-within:ring-1 focus-within:ring-[#C9A84C] focus-within:border-[#C9A84C]"
                                style={{
                                    backgroundColor: '#FAFAFA'
                                }}>

                                <div className="flex items-center gap-1 px-3 py-3 border-r border-gray-200 bg-gray-50">
                                    <span className="font-inter text-sm text-gray-700 font-medium">
                                        +65
                                    </span>
                                    <ChevronDownIcon size={14} className="text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => { setPhone(e.target.value); setOtpSent(false); }}
                                    disabled={otpSent}
                                    placeholder="8123 4567"
                                    className="flex-1 w-full px-3 py-3 font-inter text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none disabled:text-gray-400" />
                            </div>

                            {errors.phone &&
                                <p className="text-red-500 text-xs mt-1 font-inter">
                                    {errors.phone}
                                </p>
                            }
                        </div>
                    )}

                    {/* Email field */}
                    {loginMethod === 'email' && (
                        <div className="mb-4">
                            <label className="font-inter text-sm font-medium text-gray-700 mb-1.5 block">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setOtpSent(false); }}
                                disabled={otpSent}
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 font-inter text-sm text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#C9A84C] focus:border-[#C9A84C]"
                                style={{ backgroundColor: '#FAFAFA' }} />

                            {errors.email &&
                                <p className="text-red-500 text-xs mt-1 font-inter">
                                    {errors.email}
                                </p>
                            }
                        </div>
                    )}

                    {/* OTP */}
                    {otpSent && (
                        <div className="mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <label className="font-inter text-sm font-medium text-gray-700 mb-1.5 block">
                                {loginMethod === 'whatsapp' ? 'WhatsApp OTP' : 'Email OTP'}
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 4-digit OTP"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 font-inter text-sm text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#C9A84C] focus:border-[#C9A84C]"
                                style={{ backgroundColor: '#FAFAFA' }} />
                            {errors.otp &&
                                <p className="text-red-500 text-xs mt-1 font-inter">
                                    {errors.otp}
                                </p>
                            }

                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={() => { setOtpSent(false); setOtp(''); }}
                                    className="text-xs text-[#C9A84C] font-medium hover:underline focus:outline-none"
                                >
                                    Change {loginMethod === 'whatsapp' ? 'phone number' : 'email'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Login / Send OTP button */}
                    {!otpSent ? (
                        <button
                            onClick={handleSendOtp}
                            disabled={isSubmitting}
                            className="w-full py-4 rounded-xl font-inter font-semibold text-base text-white transition-all duration-200 active:scale-[0.98] focus:outline-none disabled:opacity-70 mt-2"
                            style={{ backgroundColor: '#0A0A0A' }}>
                            {isSubmitting ? 'Sending...' : 'Send OTP'}
                        </button>
                    ) : (
                        <button
                            onClick={handleLogin}
                            disabled={isSubmitting}
                            className="w-full py-4 rounded-xl font-inter font-semibold text-base text-white transition-all duration-200 active:scale-[0.98] focus:outline-none disabled:opacity-70 mt-2"
                            style={{ backgroundColor: '#C9A84C' }}>
                            {isSubmitting ? 'Verifying...' : 'Log in'}
                        </button>
                    )}

                    {/* Create account link */}
                    <p className="text-center font-inter text-xs text-gray-500 mt-6 relative z-10">
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="font-semibold underline focus:outline-none"
                            style={{
                                color: '#0A0A0A'
                            }}>
                            Create account
                        </Link>
                    </p>
                </div>
            </div>

            {/* Bottom image - adjusted positioning to prevent overlapping the form */}
            <div className="w-full absolute bottom-0 left-0 right-0 z-0 opacity-80" style={{ height: '35vh' }}>
                <img
                    src="/WhatsApp_Image_2026-02-28_at_4.48.43_PM_(6).jpeg"
                    alt="Diamond ring"
                    className="w-full h-full object-cover object-top"
                    style={{
                        filter: 'brightness(0.7)'
                    }} />
                {/* Gradient overlay to make form readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white"></div>
            </div>
        </div>
    );
}