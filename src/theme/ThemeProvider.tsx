import React, { useEffect, useState } from 'react';
import httpService from '../services/httpService';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchAndApplyTheme = async () => {
            try {
                const data: any = await httpService.get('/api/theme');
                if (data) {
                    const primary = data.primaryColor || '#E3B938';
                    const bg = data.backgroundColor || '#013D42';
                    const card = data.cardColor || '#02444A';
                    const btn = data.buttonColor || '#011C1E';
                    const text = data.textColor || '#FFFFFF';

                    const styleEl = document.createElement('style');
                    styleEl.id = 'dynamic-theme';
                    styleEl.innerHTML = `
                        :root {
                            --color-primary: ${primary};
                            --color-bg: ${bg};
                            --color-card: ${card};
                            --color-btn: ${btn};
                            --color-text: ${text};
                        }

                        /* Override all hardcoded Tailwind dark mode values project-wide */
                        
                        /* Backgrounds */
                        .bg-\\[\\#050505\\] { 
                            background-color: var(--color-bg) !important; 
                            background-image: 
                                radial-gradient(ellipse at top right, rgba(255,255,255,0.08) 0%, transparent 40%),
                                radial-gradient(ellipse at bottom left, rgba(0,0,0,0.6) 0%, transparent 60%),
                                linear-gradient(120deg, rgba(255,255,255,0.03) 0%, transparent 20%, rgba(0,0,0,0.15) 50%, transparent 80%, rgba(255,255,255,0.03) 100%) !important;
                        }
                        .bg-\\[\\#0A0A0A\\] { background-color: var(--color-card) !important; }
                        .bg-\\[\\#0B0B0B\\] { background-color: var(--color-card) !important; }
                        .bg-\\[\\#111\\] { background-color: var(--color-btn) !important; }
                        .bg-\\[\\#111111\\] { background-color: var(--color-btn) !important; }
                        .bg-\\[\\#151515\\] { background-color: var(--color-btn) !important; filter: brightness(1.2); }
                        .bg-\\[\\#D4AF37\\] { background-color: var(--color-primary) !important; }
                        
                        /* Text Colors */
                        .text-\\[\\#D4AF37\\] { color: var(--color-primary) !important; }
                        .text-\\[\\#050505\\] { color: var(--color-bg) !important; }
                        
                        /* Force Grey/Dim Text to High Contrast White for dark themes */
                        .text-\\[\\#888\\] { color: #F0F0F0 !important; }
                        .text-\\[\\#999\\] { color: #FFFFFF !important; }
                        .text-\\[\\#A3A3A3\\] { color: #FFFFFF !important; }
                        .text-\\[\\#666\\] { color: #EFEFEF !important; }
                        .text-\\[\\#444\\] { color: #DFDFDF !important; }
                        .text-\\[\\#CCC\\] { color: #FFFFFF !important; }
                        .text-\\[\\#AAA\\] { color: #FFFFFF !important; }
                        
                        /* Borders */
                        .border-\\[\\#D4AF37\\] { border-color: var(--color-primary) !important; }
                        
                        /* Gradients (Gold usually used #D4AF37) */
                        .from-\\[\\#D4AF37\\] { --tw-gradient-from: var(--color-primary) var(--tw-gradient-from-position) !important; }
                        .to-\\[\\#D4AF37\\] { --tw-gradient-to: var(--color-primary) var(--tw-gradient-to-position) !important; }
                        .via-\\[\\#D4AF37\\] { --tw-gradient-via: var(--color-primary) var(--tw-gradient-via-position) !important; }
                        
                        /* Accents */
                        .accent-\\[\\#D4AF37\\] { accent-color: var(--color-primary) !important; }

                        /* Other random hardcoded golds using slightly lighter tint */
                        .from-\\[\\#F0E6D2\\] { --tw-gradient-from: var(--color-primary) var(--tw-gradient-from-position) !important; }
                        .to-\\[\\#F0E6D2\\] { --tw-gradient-to: var(--color-primary) var(--tw-gradient-to-position) !important; }
                        .to-\\[\\#B6942C\\] { --tw-gradient-to: var(--color-primary) var(--tw-gradient-to-position) !important; filter: brightness(0.8); }
                    `;

                    // replace if exists
                    const existing = document.getElementById('dynamic-theme');
                    if (existing) {
                        existing.replaceWith(styleEl);
                    } else {
                        document.head.appendChild(styleEl);
                    }
                }
            } catch (error) {
                console.error("Could not fetch custom theme from backend. Using defaults.", error);
            } finally {
                setIsLoaded(true);
            }
        };

        fetchAndApplyTheme();
    }, []);

    // We can block rendering until theme loads safely because it creates a flash of unstyled otherwise
    if (!isLoaded) return <div style={{ backgroundColor: '#013D42', minHeight: '100vh' }} />;

    return <>{children}</>;
};
