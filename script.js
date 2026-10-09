document.addEventListener("DOMContentLoaded", () => {
    // HUD element node target mappings
    const hudPanel = document.getElementById("hudPanel");
    const hudLevel = document.getElementById("hudLevel");
    const hudClock = document.getElementById("hudClock");
    const hudScore = document.getElementById("hudScore");
    
    // Core game framework anchors
    const gameCabinet = document.getElementById("gameCabinet");
    const gameAsset = document.getElementById("gameAsset");
    const gameHeader = document.getElementById("gameHeader");
    const gameLog = document.getElementById("gameLog");
    const seaArena = document.getElementById("seaArena");
    const gameControls = document.getElementById("gameControls");

    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");

    const warnings = [
        "Subukan mo lang i-click yan! 😡",
        "Hoy! Bawal i-click yan sabi eh palo ka sa ulo! 🔪",
        "Sige, ESTIOCO, gigil mo talaga ko! 🤬",
        "Walang choice kundi YES! 😤",
        "Ah ganyan ha? I-YES mo na kasi NGANIIIIII! 💔",
        "Dalian mo inaantok na ko! 🥱"
    ];
    const emojiStates = ["😠", "😾", "😭", "😤", "🤬", "🥱"];
    
    let warningIndex = 0;
    let yesScale = 1;

    let currentQuest = 1;
    let catchScore = 0;
    const goalRequirement = 6;
    let countdownClock = 15;
    
    let tickerInterval = null;
    let creepInterval = null;
    let processingInterval = null;
    
    let meterDirection = 1;
    let meterPosition = 0;
    let cowSatisfactionPercent = 0;

    // --- 8-BIT RETRO BACKGROUND MUSIC CHIPTUNE ENGINE ---
    let audioCtx = null;
    let musicSequenceInterval = null;
    
    // Simple happy retro loop progression note array frequencies (C major / G major scale)
    const retroMelody = [261.63, 293.66, 329.63, 349.23, 392.00, 349.23, 329.63, 293.66];
    let noteStep = 0;

    function initRetroBackgroundMusic() {
        if (audioCtx) return; // Prevent double initialization crash loops
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
            
            // Loop a programmatic 8-bit tracking tick sequence every 250ms (Upbeat tempo)
            musicSequenceInterval = setInterval(() => {
                if (!audioCtx || audioCtx.state === 'suspended') return;
                
                const osc = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                
                // Square waves give that authentic retro GameBoy/Nintendo crunch sound profile
                osc.type = "square"; 
                osc.frequency.setValueAtTime(retroMelody[noteStep], audioCtx.currentTime);
                
                gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime); // Soft background layer volume ceiling
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);
                
                osc.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                
                osc.start();
                osc.stop(audioCtx.currentTime + 0.22);
                
                noteStep = (noteStep + 1) % retroMelody.length;
            }, 250);
        } catch (e) {
            console.log("Audio music platform initializing suppresses safely.");
        }
    }

    function stopRetroBackgroundMusic() {
        if (musicSequenceInterval) clearInterval(musicSequenceInterval);
        if (audioCtx) audioCtx.close();
        musicSequenceInterval = null;
        audioCtx = null;
    }

    // --- STANDARD SOUND LOGIC ---
    function playAudioFrequency(isSpecialKiss) {
        try {
            const ctx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.type = "sine";
            osc.frequency.setValueAtTime(isSpecialKiss ? 850 : 490, ctx.currentTime);
            if (isSpecialKiss) {
                osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.16);
            }
            
            gainNode.gain.setValueAtTime(0.35, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.16);
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.16);
        } catch (e) {}
    }

    function playFailureBuzzer() {
        try {
            const ctx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(125, ctx.currentTime);
            osc.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.18);
        } catch(e){}
    }

    // --- STAGE 1 LOGIC: Teleporting Runaway NO Button ---
    function teleportNoButton() {
        playFailureBuzzer();
        
        const padding = 30;
        const maxX = window.innerWidth - noBtn.offsetWidth - padding;
        const maxY = window.innerHeight - noBtn.offsetHeight - padding;
        
        const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
        const randomY = Math.max(padding, Math.floor(Math.random() * maxY));
        
        noBtn.style.position = "fixed";
        noBtn.style.left = randomX + "px";
        noBtn.style.top = randomY + "px";

        gameLog.textContent = `> ${warnings[warningIndex]}`;
        gameAsset.textContent = emojiStates[warningIndex];
        gameAsset.className = "game-sprite shake";

        warningIndex = (warningIndex + 1) % warnings.length;

        yesScale += 0.55;
        yesBtn.style.transform = `scale(${yesScale})`;
    }

    noBtn.addEventListener("mouseover", teleportNoButton);
    noBtn.addEventListener("click", (e) => { e.preventDefault(); teleportNoButton(); });
    noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); teleportNoButton(); });

    yesBtn.addEventListener("click", (e) => {
        e.preventDefault();
        playAudioFrequency(false);
        noBtn.style.display = "none";
        triggerGetCrabsPromptStage();
    });

    // --- BREAKING POINT: Displays "GET ME CRABS! 🦀" ---
    function triggerGetCrabsPromptStage() {
        yesBtn.style.transform = "scale(1)";
        gameAsset.textContent = "🦀🕸️";
        gameHeader.textContent = "GET ME CRABS ADIIIIIIIIII!";
        gameLog.textContent = "HULIHAN MO KO CRABS GAMIT ANG NET BILISAN MO! TAP START NOW!";
        
        gameControls.innerHTML = `
            <button id="startQuestBtn">START NET QUEST 🕹️</button>
        `;

        document.getElementById("startQuestBtn").addEventListener("click", () => {
            // TRIGGER AUTO-PLAYING TRACK: Activates exactly when Level 1 kicks off!
            initRetroBackgroundMusic();
            runCampaignQuestRouter();
        });
    }

    // --- CENTRAL CAMPAIGN QUEST ROUTER ---
    function runCampaignQuestRouter() {
        catchScore = 0;
        countdownClock = 15;
        seaArena.classList.remove("hidden");
        seaArena.innerHTML = "";
        gameControls.innerHTML = "";

        hudPanel.classList.remove("hidden");
        hudClock.textContent = countdownClock + "s";

        if (currentQuest === 1) {
            hudLevel.textContent = "1 / 3";
            hudScore.textContent = "0 crabs worth";
            gameHeader.textContent = "CRAB HUNTER STAGE";
            gameLog.textContent = "> USE THE NET (🕸️) TO HARVEST THE MOVING SEA CRABS! 🦀";
            startCountdownTimer();
            initializeHighSpeedSeaWildlife("🦀");
        } else if (currentQuest === 2) {
            hudLevel.textContent = "2 / 3";
            hudScore.textContent = "0 shrimp worth";
            gameHeader.textContent = "CATCH A SHRIMP GAME";
            gameLog.textContent = "> CHRONICLE: USE THE NET TO SNATCH ALL HIDDEN MARINE SHRIMPS! 🦐🌊";
            startCountdownTimer();
            initializeHighSpeedSeaWildlife("🦐");
        } else if (currentQuest === 3) {
            clearAllActiveIntervals();
            hudClock.textContent = "INF";
            seaArena.classList.add("hidden");
            gameLog.textContent = "> PRECISION CALIBRATION: PET THE COW UNTIL SATISFACTION LEVEL REACHES 100%! 🐄👋";
            hudScore.textContent = "SATISFACTION: 0%";
            launchCowSatisfactionMeter();
        }
    }

    function startCountdownTimer() {
        if (tickerInterval) clearInterval(tickerInterval);
        tickerInterval = setInterval(() => {
            countdownClock--;
            hudClock.textContent = countdownClock + "s";

            if (countdownClock <= 0) {
                clearInterval(tickerInterval);
                triggerCampaignGameOver();
            }
        }, 1000);
    }

    function triggerCampaignGameOver() {
        clearAllActiveIntervals();
        playFailureBuzzer();

        seaArena.classList.add("hidden");
        
        const deadNode = document.createElement("div");
        deadNode.className = "game-sprite shake";
        deadNode.id = "failAssetNode";
        deadNode.textContent = "💀☠️";
        gameCabinet.insertBefore(deadNode, gameHeader);

        gameHeader.textContent = "GAME OVER!";
        gameLog.textContent = "> INAANTOK NA KO DALIAN MO KASI ESTIOCO! Tap below to restart.";

        gameControls.innerHTML = `
            <button id="retryStageBtn">RESTART LEVEL 🔄</button>
        `;

        document.getElementById("retryStageBtn").addEventListener("click", () => {
            if(document.getElementById("failAssetNode")) document.getElementById("failAssetNode").remove();
            seaArena.classList.remove("hidden");
            runCampaignQuestRouter();
        });
    }

