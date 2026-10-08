const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const quizContainer = document.getElementById('quizContainer');
const mainEmoji = document.getElementById('mainEmoji');
const warningMessage = document.getElementById('warningMessage');

const envelopeStage = document.getElementById('envelopeStage');
const envelopeBtn = document.getElementById('envelopeBtn');
const letterModal = document.getElementById('letterModal');
const closeModal = document.getElementById('closeModal');

const kissStage = document.getElementById('kissStage');
const kissBtn = document.getElementById('kissBtn');

// Web Audio API tool to generate a realistic crisp synthetic kissing noise completely offline without lag
function playKissSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create an instance of noise burst for the lip smack impact sound 
    const bufferSize = audioCtx.sampleRate * 0.12; 
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;

    // Filter sound settings to make it sound soft like a wet kiss smack element
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    noiseNode.start();
}

const threats = [
    { text: "Ayusin mo sagot mo! 😤", emoji: "😡" },
    { text: "Subukan mo lang i-click 'to... 🫵", emoji: "🤬" },
    { text: "Sa tingin mo talaga may choice ka? 🤨", emoji: "🙄" },
    { text: "Isa... Palo ulo Gusto? 🥊", emoji: "💥" },
    { text: "Ayusin mo Estioco! 🔒", emoji: "😈" }
];
let threatIndex = 0;

function moveNoButton() {
    const padding = 24;
    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;
    
    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';

    warningMessage.innerText = threats[threatIndex].text;
    mainEmoji.innerText = threats[threatIndex].emoji;
    threatIndex = (threatIndex + 1) % threats.length;
}

noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});

// YES Action: Hide quiz card container, pop open stage 2 envelope display banner
yesBtn.addEventListener('click', () => {
    quizContainer.classList.add('hidden');
    envelopeStage.classList.remove('hidden');
});

// Click envelope: display secret text box message
envelopeBtn.addEventListener('click', () => {
    letterModal.style.display = 'flex';
});

// Close Message Letter: move automatically forward directly onto the Kiss Game section
closeModal.addEventListener('click', () => {
    letterModal.style.display = 'none';
    envelopeStage.classList.add('hidden');
    kissStage.classList.remove('hidden');
});

// Kiss Action: trigger kissing audio playback sound loop burst sequence
kissBtn.addEventListener('click', () => {
    playKissSound();
    
    // Add micro haptic button click animations feedback on success click burst loop
    kissBtn.style.transform = 'scale(1.15)';
    setTimeout(() => {
        kissBtn.style.transform = 'scale(1)';
    }, 100);
});
