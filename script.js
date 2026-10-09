document.addEventListener("DOMContentLoaded", () => {
    // Structural node references
    const stage1 = document.getElementById("stage1");
    const stage2 = document.getElementById("stage2");
    const stage3 = document.getElementById("stage3");
    const stage4 = document.getElementById("stage4");

    // Click targets
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const repeatBtn = document.getElementById("repeatBtn");
    const heartBtn = document.getElementById("heartBtn");

    // Dynamic linear geometry parameters for element morph interaction
    let yesScale = 1;
    let noScale = 1;

    // --- STAGE 1: NO Button Click Logic (Forces YES to expand) ---
    noBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Intensified scaling matrix calculations
        yesScale += 0.45; 
        noScale -= 0.12;

        // Apply dynamic scale modifiers instantly across target styles
        yesBtn.style.transform = `scale(${yesScale})`;
        noBtn.style.transform = `scale(${noScale})`;

        // Clamp values to prevent absolute destruction of target elements
        if (noScale < 0.35) {
            noScale = 0.35;
            noBtn.style.transform = `scale(${noScale})`;
        }
    });

    // --- TRANSITION: YES Tapped -> Display Stage 2 Layout ---
    yesBtn.addEventListener("click", (e) => {
        e.preventDefault();
        stage1.classList.add("hidden");
        stage2.classList.remove("hidden");
    });

    // --- TRANSITION: Ulitin Mo Aba Tapped -> Display Stage 3 Layout ---
    repeatBtn.addEventListener("click", (e) => {
        e.preventDefault();
        stage2.classList.add("hidden");
        stage3.classList.remove("hidden");
    });

    // --- STAGE 4: Web Audio Lip Smacking Synthesis Engine ---
    function playKissSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.type = "sine";
            // Sliding audio profile simulation configuration
            osc.frequency.setValueAtTime(850, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(170, ctx.currentTime + 0.16);
            
            gainNode.gain.setValueAtTime(0.45, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.16);
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.16);
        } catch (err) {
            console.log("Audio systems cleanly containerized under high security policies.");
        }
    }

    // --- TRANSITION: Heart Tapped -> Load Celebration Phase and Trigger Audio ---
    heartBtn.addEventListener("click", (e) => {
        e.preventDefault();
        playKissSound();
        stage3.classList.add("hidden");
        stage4.classList.remove("hidden");
    });
});
