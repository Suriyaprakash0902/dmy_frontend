export const playGoldSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const masterGain = ctx.createGain();
        masterGain.connect(ctx.destination);
        masterGain.gain.setValueAtTime(0.5, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

        // Base frequency - metallic "ting" (like a small thick gold coin)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(2200, ctx.currentTime);
        osc1.connect(masterGain);

        // Overtone 1
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(4400, ctx.currentTime);
        const gain2 = ctx.createGain();
        gain2.gain.setValueAtTime(0.2, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc2.connect(gain2);
        gain2.connect(masterGain);

        // Sharp strike click
        const osc3 = ctx.createOscillator();
        osc3.type = 'triangle';
        osc3.frequency.setValueAtTime(8000, ctx.currentTime);
        const gain3 = ctx.createGain();
        gain3.gain.setValueAtTime(0.1, ctx.currentTime);
        gain3.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
        osc3.connect(gain3);
        gain3.connect(masterGain);

        osc1.start();
        osc2.start();
        osc3.start();
        osc1.stop(ctx.currentTime + 1.5);
        osc2.stop(ctx.currentTime + 0.8);
        osc3.stop(ctx.currentTime + 0.1);
    } catch (e) {
        console.warn("Audio context not supported", e);
    }
};
