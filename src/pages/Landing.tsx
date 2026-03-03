import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <div className="relative w-full h-screen min-h-[700px] flex flex-col overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0">
                <img
                    src="/WhatsApp_Image_2026-02-28_at_4.48.43_PM_(3).jpeg"
                    alt="Gold rings on stone"
                    className="w-full h-full object-cover object-center" />

                {/* Gradient overlay - transparent top, dark bottom */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0.95) 100%)'
                    }} />

            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Logo - centered vertically in upper portion */}
                <div className="flex-1 flex flex-col items-center justify-end pb-12">
                    {/* DMY Logo */}
                    <div className="text-center">
                        <div
                            className="font-playfair font-black leading-none tracking-widest"
                            style={{
                                fontSize: '72px',
                                color: '#C9A84C',
                                textShadow: '0 2px 20px rgba(201, 168, 76, 0.4)',
                                letterSpacing: '0.08em'
                            }}>
                            DMY
                        </div>
                        <div
                            className="font-playfair font-bold tracking-[0.4em] text-white"
                            style={{
                                fontSize: '18px',
                                letterSpacing: '0.45em'
                            }}>
                            JEWELLERS
                        </div>
                        <div
                            className="font-inter font-light tracking-[0.35em] mt-1"
                            style={{
                                fontSize: '11px',
                                color: 'rgba(255,255,255,0.7)',
                                letterSpacing: '0.4em'
                            }}>
                            SINGAPORE
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="px-8 pb-12 space-y-3 flex flex-col">
                    <Link
                        to="/signup"
                        className="w-full text-center py-4 rounded-full font-inter font-semibold text-base transition-all duration-200 active:scale-[0.98]"
                        style={{
                            backgroundColor: '#0A0A0A',
                            color: '#FFFFFF',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                        Create account
                    </Link>
                    <Link
                        to="/login"
                        className="w-full text-center py-4 rounded-full font-inter font-semibold text-base transition-all duration-200 active:scale-[0.98]"
                        style={{
                            backgroundColor: 'transparent',
                            color: '#FFFFFF',
                            border: '1.5px solid rgba(255,255,255,0.7)'
                        }}>
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
}