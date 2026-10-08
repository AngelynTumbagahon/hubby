document.addEventListener("DOMContentLoaded", () => {
    // Stage 1 elements
    const quizContainer = document.getElementById("quizContainer");
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const mainGif = document.getElementById("mainGif");
    const warningMessage = document.getElementById("warningMessage");

    // Stage 2 elements
    const envelopeStage = document.getElementById("envelopeStage");
    const envelopeBtn = document.getElementById("envelopeBtn");

    // Modal elements
    const letterModal = document.getElementById("letterModal");
    const closeModal = document.getElementById("closeModal");

    // Stage 3 elements
    const kissStage = document.getElementById("kissStage");
    const kissBtn = document.getElementById("kissBtn");
    const kissGif = document.getElementById("kissGif");

    // Array of threats/warnings for the escaping NO button
    const warnings = [
        "Subukan mo lang i-click yan! 😡",
        "Hoy! Bawal i-click yan sabi eh palo ka sa ulo! 🔪",
        "Sige, subukan mo, gigil mo talaga ko! 🤬",
        "Walang choice kundi YES! 😤",
        "Ah ganyan ha? I-YES mo na kasi! 💔",
        "Hinding-hindi mo yan mapipindot! 🤪"
    ];

    // FIXED STABLE LINKS: Proxy bypass links for smooth cross-origin asset loading
    const gifArray = [
        "https://moeyy.xyz", // Angry cute hit
        "https://moeyy.xyz", // Angry pointing
        "https://moeyy.xyz", // Angrily crying tantrum
        "https://moeyy.xyz", // Sulking angry
        "https://moeyy.xyz", // Aggressive look
        "https://moeyy.xyz"  // Tantrum kicking
    ];
    let warningIndex = 0;

    // --- STAGE 1: Runaway NO button logic ---
    function moveNoButton() {
        const padding = 20;
        
        const maxX = window.innerWidth - noBtn.offsetWidth - padding;
        const maxY = window.innerHeight - noBtn.offsetHeight - padding;
        
        const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
        const randomY = Math.max(padding, Math.floor(Math.random() * maxY));
        
        noBtn.style.position = "fixed";
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;

        warningMessage.textContent = warnings[warningIndex];
        mainGif.src = gifArray[warningIndex];
        
        warningIndex = (warningIndex + 1) % warnings.length;
    }

    noBtn.addEventListener("mouseover", moveNoButton);
    noBtn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        moveNoButton();
    });

    // --- TRANSITION: Click YES -> Reveal Envelope ---
    yesBtn.addEventListener("click", () => {
        quizContainer.classList.add("hidden");
        if (noBtn.style.position === "fixed") {
            noBtn.style.display = "none";
        }
        envelopeStage.classList.remove("hidden");
    });

    // --- STAGE 2: Envelope Open -> Reveal Modal Message ---
    envelopeBtn.addEventListener("click", () => {
        letterModal.style.display = "flex";
    });

    // --- TRANSITION: Close Modal Message -> Reveal Kiss Box ---
    closeModal.addEventListener("click", () => {
        letterModal.style.display = "none";
        envelopeStage.classList.add("hidden");
        kissStage.classList.remove("hidden");
    });

    // --- STAGE 3: Synthesized Kiss Audio Generator ---
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
        } catch (e) {
            console.log("Audio constraints block", e);
        }
    }

    kissBtn.addEventListener("click", () => {
        playKissSound();
        
        // FIXED STABLE LINK: Dynamic happy jump kiss animation loop upon completion
        kissGif.src = "https://moeyy.xyz";
        
        setTimeout(() => {
            alert("Muah! 💋 I love you so much baby! Happy Monthsary ulit! ❤️✨");
        }, 150);
    });
});
