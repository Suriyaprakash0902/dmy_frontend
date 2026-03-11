import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import { Link } from 'react-router-dom';
import httpService from '../services/httpService';
import toast from 'react-hot-toast';
import { playGoldSound } from '../utils/sounds';

export default function ThemeSettings() {
    const [theme, setTheme] = useState({
        primaryColor: '#E3B938',
        backgroundColor: '#013D42',
        cardColor: '#02444A',
        buttonColor: '#011C1E',
        textColor: '#FFFFFF',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchTheme();
    }, []);

    const fetchTheme = async () => {
        try {
            const data: any = await httpService.get('/api/theme');
            if (data) {
                setTheme({
                    primaryColor: data.primaryColor || '#E3B938',
                    backgroundColor: data.backgroundColor || '#013D42',
                    cardColor: data.cardColor || '#02444A',
                    buttonColor: data.buttonColor || '#011C1E',
                    textColor: data.textColor || '#FFFFFF',
                });
            }
        } catch (error) {
            console.error('Failed to fetch theme', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        playGoldSound();
        setIsSaving(true);
        try {
            await httpService.patch('/api/theme', theme);
            toast.success('Theme Settings Saved Globally!');
            // Reload window to easily apply root theme provider styles
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            toast.error('Failed to save theme settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTheme(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        playGoldSound();
        setTheme({
            primaryColor: '#E3B938',
            backgroundColor: '#013D42',
            cardColor: '#02444A',
            buttonColor: '#011C1E',
            textColor: '#FFFFFF',
        });
    };

    const applyPresetTheme = (mode: 'RED' | 'TEAL' | 'MAGENTA') => {
        playGoldSound();
        if (mode === 'RED') {
            setTheme({
                primaryColor: '#E3B938',
                backgroundColor: '#5D0A14',
                cardColor: '#750E1A',
                buttonColor: '#3A050C',
                textColor: '#FFFFFF',
            });
        } else if (mode === 'TEAL') {
            setTheme({
                primaryColor: '#E3B938',
                backgroundColor: '#013D42',
                cardColor: '#02444A',
                buttonColor: '#011C1E',
                textColor: '#FFFFFF',
            });
        } else if (mode === 'MAGENTA') {
            setTheme({
                primaryColor: '#E3B938',
                backgroundColor: '#5C0632',
                cardColor: '#8D0A4E',
                buttonColor: '#4A0327',
                textColor: '#FFFFFF',
            });
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center bg-[var(--color-bg,#013D42)] text-[var(--color-primary,#E3B938)]">Loading...</div>;
    }

    return (
        <div className="relative min-h-screen bg-[var(--color-bg,#050505)] text-[var(--color-text,#D4AF37)] overflow-y-auto pb-24 page-transition custom-scrollbar text-white">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-[var(--color-bg,#050505)]/80 backdrop-blur-xl border-b border-white/5 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/profile" onClick={() => playGoldSound()}>
                        <div className="p-2 bg-white/5 rounded-full text-[var(--color-primary,#D4AF37)] hover:bg-[var(--color-primary,#D4AF37)] hover:text-black transition-colors">
                            <ArrowLeft size={20} />
                        </div>
                    </Link>
                    <h1 className="text-xl font-serif text-[var(--color-primary,#D4AF37)] tracking-wide">Theme Settings</h1>
                </div>
                <button
                    onClick={handleReset}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="Reset to Default"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            <div className="px-6 py-6 space-y-8 max-w-md mx-auto">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-sm tracking-widest uppercase font-light text-gray-400">Quick Presets</h2>
                        <p className="text-xs text-gray-500">Click a preset below to instantly load its colors, then click save to apply globally.</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => applyPresetTheme('RED')} className="w-14 h-14 rounded-full border-2 border-white/20 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all" style={{ backgroundColor: '#5D0A14' }} title="Ruby Red" />
                        <button onClick={() => applyPresetTheme('TEAL')} className="w-14 h-14 rounded-full border-2 border-white/20 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all" style={{ backgroundColor: '#013D42' }} title="Marine Teal" />
                        <button onClick={() => applyPresetTheme('MAGENTA')} className="w-14 h-14 rounded-full border-2 border-white/20 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all" style={{ backgroundColor: '#5C0632' }} title="Dark Magenta" />
                    </div>
                </div>

                <div className="space-y-2 mt-8">
                    <h2 className="text-sm tracking-widest uppercase font-light text-gray-400">Custom Global Styling Controls</h2>
                    <p className="text-xs text-gray-500">Pick your custom brand colors. They will be applied instantly to all app views upon saving.</p>
                </div>

                <div className="space-y-6 bg-[var(--color-card,#0A0A0A)] border border-white/5 rounded-3xl p-6 shadow-2xl">

                    {/* Primary Color */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3]">Primary Color (Gold / Brand)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                name="primaryColor"
                                value={theme.primaryColor}
                                onChange={handleChange}
                                className="w-14 h-14 rounded-xl cursor-pointer border-0 bg-transparent"
                            />
                            <div className="flex-1 bg-[var(--color-btn,#111111)] border border-white/5 rounded-xl px-4 py-3 font-mono text-sm tracking-wider">
                                {theme.primaryColor.toUpperCase()}
                            </div>
                        </div>
                    </div>

                    {/* Background Color */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3]">Main Background Color</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                name="backgroundColor"
                                value={theme.backgroundColor}
                                onChange={handleChange}
                                className="w-14 h-14 rounded-xl cursor-pointer border-0 bg-transparent"
                            />
                            <div className="flex-1 bg-[var(--color-btn,#111111)] border border-white/5 rounded-xl px-4 py-3 font-mono text-sm tracking-wider">
                                {theme.backgroundColor.toUpperCase()}
                            </div>
                        </div>
                    </div>

                    {/* Card Color */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3]">Cards & Modal Background</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                name="cardColor"
                                value={theme.cardColor}
                                onChange={handleChange}
                                className="w-14 h-14 rounded-xl cursor-pointer border-0 bg-transparent"
                            />
                            <div className="flex-1 bg-[var(--color-btn,#111111)] border border-white/5 rounded-xl px-4 py-3 font-mono text-sm tracking-wider">
                                {theme.cardColor.toUpperCase()}
                            </div>
                        </div>
                    </div>

                    {/* Button Color */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-[10px] tracking-widest uppercase text-[#A3A3A3]">Input & Secondary Buttons</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                name="buttonColor"
                                value={theme.buttonColor}
                                onChange={handleChange}
                                className="w-14 h-14 rounded-xl cursor-pointer border-0 bg-transparent"
                            />
                            <div className="flex-1 bg-[var(--color-btn,#111111)] border border-white/5 rounded-xl px-4 py-3 font-mono text-sm tracking-wider">
                                {theme.buttonColor.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="mt-8 space-y-4">
                    <h3 className="text-[10px] tracking-widest uppercase text-[#A3A3A3]">Live Preview Example</h3>
                    <div
                        style={{ backgroundColor: theme.cardColor }}
                        className="rounded-3xl p-6 border border-white/5 shadow-2xl relative overflow-hidden"
                    >
                        <div
                            style={{ backgroundColor: theme.backgroundColor }}
                            className="absolute -right-4 -top-4 w-20 h-20 rounded-full blur-[20px] opacity-50"
                        />
                        <h4 style={{ color: theme.primaryColor }} className="text-xl font-serif mb-2 relative z-10">Vault Access</h4>
                        <p style={{ color: theme.textColor }} className="text-sm opacity-75 mb-6 relative z-10">Ensure your settings read beautifully across both light and dark variations.</p>
                        <button
                            style={{ backgroundColor: theme.primaryColor, color: theme.backgroundColor }}
                            className="w-full py-4 text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg relative z-10"
                        >
                            Interactive Button
                        </button>
                    </div>
                </div>

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-4 mt-8 flex items-center justify-center gap-2 bg-[var(--color-primary,#D4AF37)] text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
                >
                    <Save size={16} />
                    {isSaving ? 'Syncing...' : 'Save Theme Globally'}
                </motion.button>
            </div>
        </div>
    );
}
