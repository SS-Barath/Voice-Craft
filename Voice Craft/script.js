const text = document.getElementById("textToConvert");
const convertBtn = document.getElementById("convertBtn");
const voiceSelect = document.getElementById("voiceSelect");

const speechSynth = window.speechSynthesis;
let voices = [];

function populateVoices() {
    voices = speechSynth.getVoices();
    voiceSelect.innerHTML = voices
        .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
        .join('');
}

speechSynth.onvoiceschanged = populateVoices;

convertBtn.addEventListener('click', function () {
    const enteredText = text.value;
    const error = document.querySelector('.error-para');
    const selectedVoiceName = voiceSelect.value;

    if (!speechSynth.speaking && !enteredText.trim().length) {
        error.textContent = `Nothing to Convert! Enter text in the text area.`;
        return;
    }

    if (!selectedVoiceName) {
        error.textContent = `Please select a voice.`;
        return;
    }

    error.textContent = "";
    const newUtterance = new SpeechSynthesisUtterance(enteredText);
    newUtterance.voice = voices.find(voice => voice.name === selectedVoiceName);
    speechSynth.speak(newUtterance);

    convertBtn.textContent = "Sound is Playing...";

    newUtterance.onend = () => {
        convertBtn.textContent = "Listen";
    };
});

populateVoices();

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const textOutput = document.getElementById('textOutput');

let recognition;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
} else {
    alert('Your browser does not support Speech Recognition. Please use Google Chrome or a compatible browser.');
}

if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        startBtn.disabled = true;
        stopBtn.disabled = false;
    };

    recognition.onresult = (event) => {
        textOutput.value = event.results[0][0].transcript;
    };

    recognition.onerror = (event) => {
        alert('Error occurred in recognition: ' + event.error);
    };

    recognition.onend = () => {
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };

    startBtn.addEventListener('click', () => {
        textOutput.value = '';
        recognition.start();
    });

    stopBtn.addEventListener('click', () => {
        recognition.stop();
    });
}

function showPage(pageId) {
    document.querySelectorAll('.app-container').forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'flex';
}
