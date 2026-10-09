document.addEventListener("DOMContentLoaded", () => {
    // Hardware cabinet mapping loops
    const gameCabinet = document.getElementById("gameCabinet");
    const gameAsset = document.getElementById("gameAsset");
    const gameHeader = document.getElementById("gameHeader");
    const gameLog = document.getElementById("gameLog");
    const gameControls = document.getElementById("gameControls");

    // HUD instrumentation
    const hpLevel = document.getElementById("hpLevel");
    const rejectCount = document.getElementById("rejectCount");

    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");

    // Dynamic gameplay dialog matrix loops
    const logFails = [
        "Subukan mo lang i-click yan! 😡",
        "Hoy! Bawal i-click yan sabi eh palo ka sa ulo! 🔪",
        "Sige, ESTIOCO, gigil mo talaga ko! 🤬",
        "Walang choice kundi YES! 😤",
        "Ah ganyan ha? I-YES mo na kasi NGANIIIIII! 💔",
        "Dalian mo inaantok na ko! 🥱"
    ];

    const spriteFails = ["👹", "💥", "👻", "🌶️", "💀", "💤"];
    
    let clickTrack = 0;
    let playerHealth = 100;
    let buttonGrowthScale = 1;
    let buttonShrinkScale = 1;

    // Custom Web Audio Arcade Beep/Buzzer Generator Modules
    function triggerBuzzerSound(isError) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = isError ? "sawtooth" : "sine";
            osc.frequency.setValueAtTime(isError ? 130 : 900, ctx.currentTime);
            if (!isError) {
                osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.16);
            }
            
            gain.gain.setValueAtTime(0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.16);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.16);
        } catch (e) {
            console.log("Synthesizer platform ready.");
        }
    }

    // --- STAGE 1 LOGIC: Hit NO -> Deduct Health, log attempts, grow YES ---
    noBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        clickTrack++;
        rejectCount.textContent = clickTrack;

        // Deduct player HUD health units dynamically
        playerHealth -= 15;
        if (playerHealth < 10) playerHealth = 10; 
        hpLevel.style.width = playerHealth + "%";

        // Feed information loops dynamically into log boxes and sprites
        gameLog.textContent = `> ${logFails[cycleIndex()]}`;
        gameAsset.textContent = spriteFails[cycleIndex()];
        gameAsset.className = "game-sprite glitch-shake";
        triggerBuzzerSound(true);

        // Radical layout matrix mutation calculations
        buttonGrowthScale += 0.55;
        buttonShrinkScale -= 0.12;

        yesBtn.style.transform = `scale(${buttonGrowthScale})`;
        noBtn.style.transform = `scale(${buttonShrinkScale})`;

        if (buttonShrinkScale < 0.35) {
            buttonShrinkScale = 0.35;
            noBtn.style.transform = `scale(${buttonShrinkScale})`;
        }
    });

    function cycleIndex() {
        return (clickTrack - 1) % logFails.length;
    }

    // --- TRANSITION: YES Clicked -> Advance into Shock Outburst Panel ---
    yesBtn.addEventListener("click", (e) => {
        e.preventDefault();
        triggerBuzzerSound(false);

        // Reset HUD parameters to perfect values
        playerHealth = 100;
        hpLevel.style.width = "100%";

        gameAsset.textContent = "🤯🚨";
        gameAsset.className = "game-sprite glitch-shake";
        gameHeader.textContent = "ahhhhhhhhhhhhhhhhhhhhh you love me??????";
        gameHeader.style.fontSize = "20px";
        gameLog.textContent = "> QUEST UPDATE: ACCIDENTAL CONFESSION UNLOCKED.";

        gameControls.innerHTML = `
            <button id="arcadeQuestBtn" style="background: linear-gradient(135deg, #00f3ff, #00a8ff); color: #000; font-weight:900;">
                ulitin mo aba 🔄
            </button>
        `;

        document.getElementById("arcadeQuestBtn").addEventListener("click", loadHeartQuestStage);
    });

    // --- TRANSITION: Ulitin Mo Aba Clicked -> Advance into Heart Tap Challenge ---
    function loadHeartQuestStage(e) {
        e.preventDefault();
        triggerBuzzerSound(false);

        gameHeader.remove();
        gameLog.textContent = "> MISSION: TRIGGER ULTIMATE CORE HEART ACTIVATION CODE.";
        gameAsset.className = "game-sprite pulse-fast";
        gameAsset.textContent = "🎮⚡";
        gameAsset.style.fontSize = "45px";

        gameControls.innerHTML = `
            <div class="giant-pixel-heart" id="pixelHeartCore">❤️</div>
        `;

        document.getElementById("pixelHeartCore").addEventListener("click", loadVictoryDeclarationStage);
    }

    // --- TRANSITION: Heart Core Clicked -> Ultimate Cinematic Victory Outburst Stage ---
    function loadVictoryDeclarationStage(e) {
        e.preventDefault();
        
        triggerBuzzerSound(false);
        setTimeout(() => triggerBuzzerSound(false), 80);

        gameLog.remove();
        gameAsset.className = "game-sprite pulse-fast";
        gameAsset.textContent = "👑🏆";

        gameControls.innerHTML = `
            <h1 style="font-size: 19px; color: var(--neon-pink); line-height: 1.5; word-break: break-word; font-weight:900; letter-spacing:0px;">
                ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh you love me nganiiiiiiiii
            </h1>
        `;
    }
});
