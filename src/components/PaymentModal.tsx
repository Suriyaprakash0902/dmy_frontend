import { useEffect, useRef, useState } from 'react';
import { loadAirwallex, createElement } from 'airwallex-payment-elements';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentModalProps {
    clientSecret: string;
    currency: string;
    amount: number;
    intentId: string;
    environment: 'demo' | 'prod';
    onClose: () => void;
    onSuccess: () => void;
}

export default function PaymentModal({ clientSecret, currency, amount, intentId, environment, onClose, onSuccess }: PaymentModalProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const dropInId = useRef(`airwallex-dropin-${Date.now()}`);
    const successTriggered = useRef<boolean>(false);

    useEffect(() => {
        let dropIn: any;
        const initializeAirwallex = async () => {
            try {
                await loadAirwallex({
                    env: environment,
                    origin: window.location.origin,
                });

                if (containerRef.current) {
                    dropIn = createElement('dropIn', {
                        intent_id: intentId,
                        client_secret: clientSecret,
                        currency: currency,
                    });

                    dropIn.mount(dropInId.current);
                    setIsLoaded(true);

                    const handleSuccess = (event: any) => {
                        if (successTriggered.current) return;
                        successTriggered.current = true;

                        console.log('Payment successful', event.detail);
                        onSuccess();
                    };

                    const handleError = (event: any) => {
                        console.error('Payment error', event.detail);
                    };

                    window.addEventListener('onSuccess', handleSuccess as EventListener);
                    window.addEventListener('onError', handleError as EventListener);

                    return () => {
                        window.removeEventListener('onSuccess', handleSuccess as EventListener);
                        window.removeEventListener('onError', handleError as EventListener);
                    };
                }
            } catch (error) {
                console.error("Airwallex initialization error:", error);
            }
        };

        const cleanup = initializeAirwallex();

        return () => {
            cleanup.then(cleanupFn => cleanupFn && cleanupFn());
            if (dropIn) {
                try { dropIn.unmount(); } catch (e) { }
            }
        };
    }, [clientSecret, intentId, currency, environment, onSuccess]);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#1A1A1A] border border-[#D4AF37]/50 rounded-2xl w-full max-w-lg relative flex flex-col shadow-[0_0_30px_rgba(212,175,55,0.2)] max-h-[95vh] overflow-hidden"
            >
                <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#111] shrink-0 z-10">
                    <h2 className="text-lg font-serif text-[#D4AF37] uppercase tracking-wide">Secure Payment</h2>
                    <button onClick={onClose} className="text-[#666] hover:text-[#D4AF37] transition-colors focus:outline-none">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 bg-white/5 flex-grow w-full overflow-y-auto custom-scrollbar" style={{ minHeight: 'min(70vh, 500px)' }}>
                    <div className="mb-4 text-center">
                        <p className="text-[10px] uppercase tracking-widest text-[#A3A3A3]">Total Amount</p>
                        <p className="text-2xl font-bold text-[#D4AF37]">S$ {amount.toFixed(2)}</p>
                    </div>

                    {!isLoaded && (
                        <div className="flex justify-center items-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D4AF37]"></div>
                        </div>
                    )}
                    <div id={dropInId.current} ref={containerRef} className="w-full bg-white rounded-lg p-2 min-h-[400px]" />
                </div>
                <div className="p-3 border-t border-[#333] bg-[#111] text-center shrink-0 z-10">
                    <p className="text-[10px] text-[#666] uppercase tracking-widest">Powered by <span className="text-[#A3A3A3] font-bold">Airwallex</span></p>
                </div>
            </motion.div>
        </div>
    );
}
