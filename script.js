document.addEventListener("DOMContentLoaded", () => {
    // Stage wrappers
    const stage1 = document.getElementById("stage1");
    const stage2 = document.getElementById("stage2");
    const stage3 = document.getElementById("stage3");
    const stage4 = document.getElementById("stage4");

    // Interactive targets
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const repeatBtn = document.getElementById("repeatBtn");
    const heartBtn = document.getElementById("heartBtn");

    // Scaling variables for button morph interaction
    let yesScale = 1;
    let noScale = 1;

    // --- STAGE 1: NO Button Click Logic (Makes YES bigger) ---
    noBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Boost size parameters continuously 
        yesScale += 0.35;
        noScale -= 0.12;

        // Apply scale matrices smoothly via transitions
        yesBtn.style.transform = `scale(${yesScale})`;
        noBtn.style.transform = `scale(${noScale})`;

        // Hard cap scale reduction floor so button remains responsive
        if (noScale < 0.4) {
            noScale = 0.4;
            noBtn.style.transform = `scale(${noScale})`;
        }
    });

    // --- TRANSITION: Click YES -> Advance to Stage 2 ---
    yesBtn.addEventListener("click", (e) => {
        e.preventDefault();
        stage1.classList.add("hidden");
        stage2.classList.remove("hidden");
    });

    // --- TRANSITION: Click Ulitin Mo Aba -> Advance to Stage 3 ---
    repeatBtn.addEventListener("click", (e) => {
        e.preventDefault();
        stage2.classList.add("hidden");
        stage3.classList.remove("hidden");
    });

    // --- STAGE 4: Sound effect synthesis on final activation loop ---
    function playKissSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.type = "sine";
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
            
            gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (err) {
            console.log("Web Audio systems safely bypassed or constrained by interaction policies.");
        }
    }

    // --- TRANSITION: Click Heart Icon -> Show Final Outburst and Play Audio ---
    heartBtn.addEventListener("click", (e) => {
        e.preventDefault();
        playKissSound();
        stage3.classList.add("hidden");
        stage4.classList.remove("hidden");
    });
});
