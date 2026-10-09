document.addEventListener("DOMContentLoaded", () => {
    const quizContainer = document.getElementById("quizContainer");
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const mainEmoji = document.getElementById("mainEmoji");
    const warningMessage = document.getElementById("warningMessage");

    const envelopeStage = document.getElementById("envelopeStage");
    const envelopeBtn = document.getElementById("envelopeBtn");

    const letterModal = document.getElementById("letterModal");
    const closeModal = document.getElementById("closeModal");

    const kissStage = document.getElementById("kissStage");
    const kissBtn = document.getElementById("kissBtn");
    const kissEmoji = document.getElementById("kissEmoji");

    const warnings = [
        "Subukan mo lang i-click yan! 😡",
        "Hoy! Bawal i-click yan sabi eh palo ka sa ulo! 🔪",
        "Sige, ESTIOCO, gigil mo talaga ko! 🤬",
        "Walang choice kundi YES! 😤",
        "Ah ganyan ha? I-YES mo na NGANIIIIII! 💔",
        "Dalian mo inaantok na ko! 🥱"
    ];

    const emojiStates = ["😠", "😾", "😭", "😤", "🤬", "🥱"];
    let warningIndex = 0;

    // --- STAGE 1: Bounding-Safe Runaway Translate Logic ---
    function moveNoButton(e) {
        if(e) e.preventDefault();
        
        // Obtains boundary details relative strictly to the viewport viewable safe dimensions
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        
        // Generates fluid offsets across a broad pixel matrix coordinate space
        const randomX = (Math.random() * (winWidth * 0.7)) - (winWidth * 0.35);
        const randomY = (Math.random() * (winHeight * 0.6)) - (winHeight * 0.3);
        
        // Moves the button safely via translate transformations without creating blocking elements
        noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;

        warningMessage.textContent = warnings[warningIndex];
        mainEmoji.textContent = emojiStates[warningIndex];
        mainEmoji.className = "emoji-display angry-animation";
        
        warningIndex = (warningIndex + 1) % warnings.length;
    }

    noBtn.addEventListener("mouseover", moveNoButton);
    noBtn.addEventListener("touchstart", moveNoButton, {passive: false});

    // --- TRANSITION: Click YES -> Reveal Envelope ---
    yesBtn.addEventListener("click", (e) => {
        e.preventDefault();
        quizContainer.classList.add("hidden");
        noBtn.style.display = "none"; 
        envelopeStage.classList.remove("hidden");
    });

    // --- STAGE 2: Envelope Open -> Reveal Modal ---
    envelopeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        letterModal.style.display = "flex";
    });

    // --- TRANSITION: Close Modal Message -> Reveal Kiss Box ---
    closeModal.addEventListener("click", (e) => {
        e.preventDefault();
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
        } catch (err) {
            console.log("Audio systems initialized.");
        }
    }

    kissBtn.addEventListener("click", (e) => {
        e.preventDefault();
        playKissSound();
        kissEmoji.textContent = "🥰💋"; 
        
        setTimeout(() => {
            alert("Muah! 💋 I love you so much my love! Happy Monthsary ulit! ❤️✨");
        }, 150);
    });
});
