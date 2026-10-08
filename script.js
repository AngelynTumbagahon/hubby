const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const quizContainer = document.getElementById('quizContainer');
const successContainer = document.getElementById('successContainer');
const mainEmoji = document.getElementById('mainEmoji');
const warningMessage = document.getElementById('warningMessage');

const envelopeBtn = document.getElementById('envelopeBtn');
const letterModal = document.getElementById('letterModal');
const closeModal = document.getElementById('closeModal');

// Array of angry threats and matching emojis when he tries to click NO
const threats = [
    { text: "Ayusin mo sagot mo! 😤", emoji: "😡" },
    { text: "Subukan mo lang i-click 'to... 🫵", emoji: "🤬" },
    { text: "Sa tingin mo talaga may choice ka? 🤨", emoji: "🙄" },
    { text: "Isa... dalawa... palo sa ulo gusto mo 🥊", emoji: "💥" },
    { text: "Wala kang takas estioco! 🔒😂", emoji: "😈" }
];

let threatIndex = 0;

function moveNoButton() {
    const padding = 24;
    
    // Make the button run away across the entire display viewport area
    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;
    
    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';

    // Cycle through the funny angry warning responses
    warningMessage.innerText = threats[threatIndex].text;
    mainEmoji.innerText = threats[threatIndex].emoji;
    
    threatIndex = (threatIndex + 1) % threats.length;
}

// Attach desktop hover and phone touch run-away listeners
noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});

// YES Button Event
yesBtn.addEventListener('click', () => {
    quizContainer.classList.add('hidden');
    successContainer.classList.remove('hidden');
});

// Monthsary Letter Modal Toggle Controls
envelopeBtn.addEventListener('click', () => {
    letterModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    letterModal.style.display = 'none';
});

// Close modal if user taps outside the white card box surface
window.addEventListener('click', (e) => {
    if (e.target === letterModal) {
        letterModal.style.display = 'none';
    }
});
