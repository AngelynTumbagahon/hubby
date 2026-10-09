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

    // Dynamic error speech matrix parameters
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
    let noScale = 1;

    // Game State Engine Trackers
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

    // Web Audio Core Arcade Synth Modules
    function playAudioFrequency(isSpecialKiss) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
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
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(125, ctx.currentTime);
            osc.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.18);
        } catch(e){}
    }

    // --- STAGE 1 SELECTION PANELS: NO Button Morphing ---
    noBtn.addEventListener("click", (e) => {
        e.preventDefault();
        playFailureBuzzer();
        
        gameLog.textContent = `> ${warnings[warningIndex]}`;
        gameAsset.textContent = emojiStates[warningIndex];
        gameAsset.className = "game-sprite shake";

        warningIndex = (warningIndex + 1) % warnings.length;
        
        // Morph dimensions: YES button scales massively, NO button shrinks
        yesScale += 0.55;
        noScale -= 0.12;

        yesBtn.style.transform = `scale(${yesScale})`;
        noBtn.style.transform = `scale(${noScale})`;

        if (noScale < 0.35) {
            noScale = 0.35;
            noBtn.style.transform = `scale(${noScale})`;
        }
    });

    yesBtn.addEventListener("click", (e) => {
        e.preventDefault();
        playAudioFrequency(false);
        triggerGetCrabsPromptStage();
    });

    // --- LEVEL 1 PROMPT: Displays "GET ME CRABS! 🦀" ---
    function triggerGetCrabsPromptStage() {
        // Reset old scale morphs from buttons
        yesBtn.style.transform = "scale(1)";
        noBtn.style.transform = "scale(1)";

        gameAsset.textContent = "🦀🕸️";
        gameHeader.textContent = "GET ME CRABS!";
        gameLog.textContent = "HULIHAN MO KO CRABS GAMIT ANG NET BILISAN MO! TAP START NOW!";
        
        gameControls.innerHTML = `
            <button id="startQuestBtn">START CORE NET QUEST 🕹️</button>
        `;

        document.getElementById("startQuestBtn").addEventListener("click", runCampaignQuestRouter);
    }

    // --- CENTRAL CAMPAIGN ROUTER ENVIRONMENT ---
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

    // --- GAME COUNTDOWN TIMEOUT SYSTEM ---
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

    function clearAllActiveIntervals() {
        if(tickerInterval) clearInterval(tickerInterval);
        if(creepInterval) clearInterval(creepInterval);
        if(processingInterval) clearInterval(processingInterval);
    }

    // --- MARINE BIOME CHALLENGE FRAMEWORK (Levels 1 & 2) ---
    function initializeHighSpeedSeaWildlife(emoji) {
        if (creepInterval) clearInterval(creepInterval);
        seaArena.innerHTML = "";

        // Instantiates goal collection array structures immediately inside bounds
        for (let i = 0; i < goalRequirement + 3; i++) {
            const item = document.createElement("div");
            item.className = "spawn-item";
            item.textContent = emoji;
            
            const maxX = seaArena.clientWidth - 45;
            const maxY = seaArena.clientHeight - 45;
            item.style.left = Math.floor(Math.random() * maxX) + "px";
            item.style.top = Math.floor(Math.random() * maxY) + "px";

            // Click intercept handler hooks
            item.addEventListener("click", () => {
                playAudioFrequency(false);
                catchScore++;
                
                // Dynamically evaluate text strings based on requested flow
                const itemLabel = (emoji === "🦀") ? "crabs" : "shrimp";
                hudScore.textContent = `He loves me: ${catchScore} ${itemLabel} worth!`;
                item.remove();

                if (catchScore >= goalRequirement) {
                    clearAllActiveIntervals();
                    routeToNextMilestoneCheckpoint();
                }
            });

            seaArena.appendChild(item);
        }

        // Active drift vector computations simulating crawling or jumping organisms
        creepInterval = setInterval(() => {
            const children = seaArena.getElementsByClassName("spawn-item");
            for (let item of children) {
                const curLeft = parseFloat(item.style.left);
                const curTop = parseFloat(item.style.top);
                
                let nextLeft = curLeft + ((Math.random() * 45) - 22);
                let nextTop = curTop + ((Math.random() * 45) - 22);

                if (nextLeft < 0) nextLeft = 10;
