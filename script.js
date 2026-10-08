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

    // URLs of matching angry/crying cartoon reaction GIFs
    const gifArray = [
        "https://giphy.com", // Angry cute punch
        "https://giphy.com", // Angrily pointing
        "https://giphy.com", // Crying mad tantrum
        "https://giphy.com", // Stomping feet angry
        "https://giphy.com", // Aggressive eyes
        "https://giphy.com"  // Laser madness eyes
    ];
    let warningIndex = 0;

    // --- STAGE 1: Runaway NO button logic ---
    function moveNoButton() {
        const padding = 20;
        
        // Calculate max boundaries keeping it within safe screen bounds
        const maxX = window.innerWidth - noBtn.offsetWidth - padding;
        const maxY = window.innerHeight - noBtn.offsetHeight - padding;
        
        // Generate pseudo-random clean absolute locations
        const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
        const randomY = Math.max(padding, Math.floor(Math.random() * maxY));
        
        // Override container constraints to jump around the viewport
        noBtn.style.position = "fixed";
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;

        // Cycle through dynamic playful warnings and change the image to matching dynamic GIFs
        warningMessage.textContent = warnings[warningIndex];
        mainGif.src = gifArray[warningIndex];
        
        warningIndex = (warningIndex + 1) % warnings.length;
    }

    // Trigger movement on both hover and touch to make it unclickable
    noBtn.addEventListener("mouseover", moveNoButton);
    noBtn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        moveNoButton();
    });

    // --- TRANSITION: Click YES -> Reveal Envelope ---
    yesBtn.addEventListener("click", () => {
        quizContainer.classList.add("hidden");
        if (noBtn.style.position === "fixed") {
            noBtn.style.display = "none"; // Clean up floating button
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

    // --- STAGE 3: Synthesized Kiss Audio Generator ("Muah!") ---
    function playKissSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            
            // Generate a quick pop burst simulating smacking lips
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.type = "sine";
            // Sliding frequencies downward to simulate a wet dynamic sound pattern
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
            
            // Sharp amplitude decay envelope curve
            gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {
            console.log("Audio play suppressed or unsupported by context constraints", e);
        }
    }

    // Play synthesized kiss audio and trigger local visual alert confirmation
    kissBtn.addEventListener("click", () => {
        playKissSound();
        
        // Update the kiss stage GIF to an ultra happy celebration version once clicked!
        kissGif.src = "https://giphy.com";
        
        setTimeout(() => {
            alert("Muah! 💋 I love you so much baby! Happy Monthsary ulit! ❤️✨");
        }, 100);
    });
});
