// EDIT YOUR CUSTOM INFORMATION HERE:
const MY_NAME = "Your Name";       // Change to your name
const BF_NAME = "ESTIOCO";        // Set default to Estioco
const TIME_CELEBRATION = "Happy Monthsary!"; // Change if needed

document.addEventListener("DOMContentLoaded", () => {
    const quizContainer = document.getElementById("quizContainer");
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const mainEmoji = document.getElementById("mainEmoji");
    const warningMessage = document.getElementById("warningMessage");
    const letterMessage = document.getElementById("letterMessage");

    const envelopeStage = document.getElementById("envelopeStage");
    const envelopeBtn = document.getElementById("envelopeBtn");

    const letterModal = document.getElementById("letterModal");
    const closeModal = document.getElementById("closeModal");

    const kissStage = document.getElementById("kissStage");
    const kissBtn = document.getElementById("kissBtn");
    const kissEmoji = document.getElementById("kissEmoji");

    // Apply custom text settings dynamically
    letterMessage.innerHTML = `${TIME_CELEBRATION} <br> I love you so much ${BF_NAME}! 💌✨`;

    // UPDATED: Injected your exact custom lines here
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

    // --- STAGE 1: Runaway NO Button Logic (Teleports away) ---
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
        mainEmoji.textContent = emojiStates[warningIndex];
        mainEmoji.className = "emoji-display angry-animation";
        
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

    // --- STAGE 2: Envelope Open -> Reveal Modal ---
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
            console.log("Audio systems initialized.");
        }
    }

    kissBtn.addEventListener("click", () => {
        playKissSound();
        kissEmoji.textContent = "🥰💋"; 
        
        setTimeout(() => {
            alert(`Muah! 💋 I love you so much baby! ${TIME_CELEBRATION} ulit! ❤️✨`);
        }, 150);
    });
});
