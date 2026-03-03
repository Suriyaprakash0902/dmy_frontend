import { useState } from 'react';
import { EyeIcon, EyeOffIcon, ChevronDownIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import httpService from '../services/httpService';
import toast from 'react-hot-toast';

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Email OTP states
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const update = (field: string, value: string | boolean) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
        if (errors[field])
            setErrors((prev) => ({
                ...prev,
                [field]: ''
            }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.name) newErrors.name = 'Name is required';
        if (!form.email) newErrors.email = 'Email is required'; else
            if (!/\S+@\S+\.\S+/.test(form.email))
                newErrors.email = 'Enter a valid email';
        if (!form.phone) newErrors.phone = 'Phone number is required';
        if (!form.dob) newErrors.dob = 'Date of birth is required';
        if (!form.gender) newErrors.gender = 'Please select gender';
        if (!form.password) newErrors.password = 'Password is required'; else
            if (form.password.length < 8)
                newErrors.password = 'Minimum 8 characters required';
        if (!form.confirmPassword)
            newErrors.confirmPassword = 'Please confirm your password'; else
            if (form.password !== form.confirmPassword)
                newErrors.confirmPassword = 'Passwords must match';
        if (!otpVerified)
            newErrors.email = 'Please verify your email with OTP';
        if (!form.agreeTerms)
            newErrors.agreeTerms = 'You must agree to terms & conditions';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = async () => {
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
            setErrors({ ...errors, email: 'Enter a valid email first' });
            return;
        }
        setIsSubmitting(true);
        try {
            await httpService.post('/api/auth/register/send-otp', { email: form.email });
            setOtpSent(true);
            toast.success(`An OTP has been sent to ${form.email}. Please check your inbox.`);
        } catch (error: any) {
            console.error(error);
            setErrors({ ...errors, email: error.message || 'Failed to send OTP' });
        }
        setIsSubmitting(false);
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 4) {
            setErrors((prev) => ({ ...prev, email: 'Enter valid 4-digit OTP' }));
            return;
        }
        setIsSubmitting(true);
        try {
            await httpService.post('/api/auth/register/verify-otp', { email: form.email, otp });
            setOtpVerified(true);
            setErrors((prev) => ({ ...prev, email: '' }));
            toast.success('Email verified successfully!');
        } catch (error: any) {
            console.error(error);
            setErrors((prev) => ({ ...prev, email: error.message || 'Invalid OTP' }));
        }
        setIsSubmitting(false);
    };

    const handleSignup = async () => {
        if (validate()) {
            setIsSubmitting(true);
            try {
                const data: any = await httpService.post('/api/auth/register', form);
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                navigate('/home');
            } catch (error: any) {
                console.error(error);
                setErrors({ ...errors, email: error.message || 'Verification failed' });
            }
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-white page-transition">
            {/* Black curved header */}
            <div
                className="relative w-full flex flex-col items-center pt-10 pb-10"
                style={{
                    backgroundColor: '#0A0A0A',
                    borderRadius: '0 0 50% 50% / 0 0 40px 40px'
                }}>

                <div className="text-center">
                    <div
                        className="font-playfair font-black leading-none"
                        style={{
                            fontSize: '42px',
                            color: '#C9A84C',
                            letterSpacing: '0.08em'
                        }}>
                        DMY
                    </div>
                    <div
                        className="font-playfair font-bold tracking-[0.35em] text-white"
                        style={{
                            fontSize: '12px'
                        }}>
                        JEWELLERS
                    </div>
                    <div
                        className="font-inter font-light tracking-[0.3em] mt-0.5"
                        style={{
                            fontSize: '9px',
                            color: 'rgba(255,255,255,0.6)'
                        }}>
                        SINGAPORE
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-6 pt-6 pb-8">
                <div className="mb-6">
                    <h1
                        className="font-playfair font-black text-4xl leading-tight"
                        style={{
                            color: '#0A0A0A'
                        }}>
                        Welcome
                    </h1>
                    <p className="font-inter text-gray-500 text-base mt-1">
                        Sign up for your account
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="font-inter text-sm font-medium text-gray-700 mb-1.5 block">
                            Name
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => update('name', e.target.value)}
                            placeholder="eg: Robert Joe"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 font-inter text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C9A84C] focus:border-[#C9A84C]"
                            style={{
                                backgroundColor: '#FAFAFA'
                            }} />

                        {errors.name &&
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        }
                    </div>

                    {/* Email */}
                    <div>
                        <label className="font-inter text-sm font-medium text-gray-700 mb-1.5 block">
                            Email ID
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => {
                                    update('email', e.target.value);
                                    setOtpSent(false);
                                    setOtpVerified(false);
                                }}
                                disabled={otpVerified}
                                placeholder="eg: robertjoe3@gmail.com"
                                className={`w-full px-4 py-3 rounded-xl border border-gray-200 font-inter text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C9A84C] focus:border-[#C9A84C] ${otpVerified ? 'bg-gray-100 text-gray-500' : 'bg-[#FAFAFA]'}`}
                            />
                            {!otpVerified && (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={isSubmitting || !form.email}
                                    className="px-4 py-3 bg-[#0A0A0A] text-white text-sm font-inter font-medium rounded-xl whitespace-nowrap active:scale-[0.98] disabled:opacity-50"
                                >
                                    {otpSent ? 'Resend' : 'Send OTP'}
                                </button>
                            )}
                            {otpVerified && (
                                <div className="px-4 py-3 bg-green-50 text-green-600 border border-green-200 text-sm font-inter font-medium rounded-xl whitespace-nowrap flex items-center">
                                    ✓ Verified
                                </div>
                            )}
                        </div>
                        {errors.email &&
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        }
                    </div>

                    {/* OTP Input */}
                    {otpSent && !otpVerified && (
                        <div>
                            <label className="font-inter text-sm font-medium text-gray-700 mb-1.5 block">
                                Enter Email OTP
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter OTP (4 digits)"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 font-inter text-sm text-gray-800 placeholder-gray-400 bg-[#FAFAFA] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
                                />
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={handleVerifyOtp}
                                    className="px-4 py-3 bg-[#C9A84C] text-white text-sm font-inter font-medium rounded-xl whitespace-nowrap active:scale-[0.98] disabled:opacity-70"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Phone */}
                    <div>
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
                                value={form.phone}
                                onChange={(e) => update('phone', e.target.value)}
                                placeholder="12345 67890"
                                className="flex-1 px-3 py-3 font-inter text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none" />

                        </div>
                        {errors.phone &&
                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        }
                    </div>

                    {/* DOB + Gender row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-inter text-sm font-medium text-gray-700 mb-1.5 block">
                                DOB
                            </label>
                            <input
                                type="text"
                                value={form.dob}
                                onChange={(e) => update('dob', e.target.value)}
                                placeholder="DD/MM/YY"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 font-inter text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C9A84C] focus:border-[#C9A84C]"
                                style={{
                                    backgroundColor: '#FAFAFA'
                                }} />

                            {errors.dob &&
                                <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                            }
                        </div>
                        <div>
                            <label className="font-inter text-sm font-medium text-gray-700 mb-1.5 block">
                                Gender
                            </label>
                            <div className="relative">
                                <select
                                    value={form.gender}
                                    onChange={(e) => update('gender', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 font-inter text-sm text-gray-800 appearance-none focus:outline-none focus:ring-1 focus:ring-[#C9A84C] focus:border-[#C9A84C]"
                                    style={{
                                        backgroundColor: '#FAFAFA'
                                    }}>
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                <ChevronDownIcon
                                    size={16}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

                            </div>
                            {errors.gender &&
                                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                            }
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="font-inter text-sm font-medium text-gray-700 mb-1.5 block">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={(e) => update('password', e.target.value)}
                                placeholder="8 characters must be included"
                                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 font-inter text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C9A84C] focus:border-[#C9A84C]"
                                style={{
                                    backgroundColor: '#FAFAFA'
                                }} />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none">
                                {showPassword ?
                                    <EyeOffIcon size={18} /> :
                                    <EyeIcon size={18} />
                                }
                            </button>
                        </div>
                        {errors.password &&
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        }
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="font-inter text-sm font-medium text-gray-700 mb-1.5 block">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={form.confirmPassword}
                                onChange={(e) => update('confirmPassword', e.target.value)}
                                placeholder="both passwords must match"
                                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 font-inter text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C9A84C] focus:border-[#C9A84C]"
                                style={{
                                    backgroundColor: '#FAFAFA'
                                }} />

                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none">
                                {showConfirmPassword ?
                                    <EyeOffIcon size={18} /> :
                                    <EyeIcon size={18} />
                                }
                            </button>
                        </div>
                        {errors.confirmPassword &&
                            <p className="text-red-500 text-xs mt-1">
                                {errors.confirmPassword}
                            </p>
                        }
                    </div>

                    {/* Create Account button */}
                    <button
                        onClick={handleSignup}
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl font-inter font-semibold text-base text-white transition-all duration-200 active:scale-[0.98] mt-2 focus:outline-none disabled:opacity-70"
                        style={{
                            backgroundColor: '#0A0A0A'
                        }}>
                        {isSubmitting ? 'Processing...' : 'Create account'}
                    </button>

                    {/* Terms */}
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            checked={form.agreeTerms}
                            onChange={(e) => update('agreeTerms', e.target.checked)}
                            className="w-3.5 h-3.5 mt-0.5 rounded border-gray-300 flex-shrink-0"
                            style={{
                                accentColor: '#C9A84C'
                            }} />

                        <span className="font-inter text-xs text-gray-500">
                            Agree{' '}
                            <button className="font-semibold underline text-gray-700 focus:outline-none">
                                terms & conditions
                            </button>{' '}
                            to continue
                        </span>
                    </div>
                    {errors.agreeTerms &&
                        <p className="text-red-500 text-xs">{errors.agreeTerms}</p>
                    }
                </div>
            </div>
        </div>
    );
}