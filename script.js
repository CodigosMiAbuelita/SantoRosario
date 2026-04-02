const audio = new Audio();
let currentPlaylist = [];
let currentTrackIndex = 0;
let isPlaying = false;

// Elementos del DOM
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');
const trackTitle = document.getElementById('track-title');
const mysteryTitle = document.getElementById('mystery-title');
const coverImage = document.getElementById('cover-image');
const mysterySelect = document.getElementById('mystery-select');

// Plantilla de la secuencia de reproducción
const buildPlaylist = (prefix) => {
    return [
        { src: `./Audio/${prefix}_intro.mp3`, title: '1er Misterio (Introducción)' },
        { src: './Audio/Decade.mp3', title: '10 Avemarías' },
        { src: `./Audio/${prefix}2.mp3`, title: '2do Misterio' },
        { src: './Audio/Decade.mp3', title: '10 Avemarías' },
        { src: `./Audio/${prefix}3.mp3`, title: '3er Misterio' },
        { src: './Audio/Decade.mp3', title: '10 Avemarías' },
        { src: `./Audio/${prefix}4.mp3`, title: '4to Misterio' },
        { src: './Audio/Decade.mp3', title: '10 Avemarías' },
        { src: `./Audio/${prefix}5.mp3`, title: '5to Misterio' },
        { src: './Audio/Decade.mp3', title: '10 Avemarías' },
        { src: './Audio/Litany.mp3', title: 'Letanías (Final)' }
    ];
};

// Diccionario de misterios y sus prefijos de archivo correspondientes
const mysteriesData = {
    gozosos: { name: 'Misterios Gozosos', prefix: 'Joy', img: './Images/gozosos.jpg' },
    luminosos: { name: 'Misterios Luminosos', prefix: 'Luminous', img: './Images/luminosos.jpg' },
    dolorosos: { name: 'Misterios Dolorosos', prefix: 'Sorrow', img: './Images/dolorosos.jpg' },
    gloriosos: { name: 'Misterios Gloriosos', prefix: 'Glory', img: './Images/gloriosos.jpg' }
};

function loadMysteryType(type) {
    const data = mysteriesData[type];
    currentPlaylist = buildPlaylist(data.prefix);
    mysteryTitle.textContent = data.name;
    coverImage.src = data.img;
    currentTrackIndex = 0;
    loadTrack(currentTrackIndex);
}

function loadTrack(index) {
    const track = currentPlaylist[index];
    audio.src = track.src;
    trackTitle.textContent = track.title;
    
    // Si ya estaba reproduciendo, o si no es la primera pista que se carga por defecto
    if (isPlaying) {
        audio.play();
    }
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

function nextTrack() {
    if (currentTrackIndex < currentPlaylist.length - 1) {
        currentTrackIndex++;
    } else {
        currentTrackIndex = 0; // Vuelve al inicio si terminó el rosario
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
    loadTrack(currentTrackIndex);
}

function prevTrack() {
    if (audio.currentTime > 3) {
        // Si han pasado más de 3 segundos, reiniciar la pista actual
        audio.currentTime = 0;
    } else if (currentTrackIndex > 0) {
        // Sino, ir a la pista anterior
        currentTrackIndex--;
        loadTrack(currentTrackIndex);
    }
}

function updateProgress() {
    const { duration, currentTime } = audio;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
        currentTimeEl.textContent = formatTime(currentTime);
        durationTimeEl.textContent = formatTime(duration);
    }
}

function setProgress(e) {
    const width = progressBar.max;
    const clickX = e.target.value;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
audio.addEventListener('timeupdate', updateProgress);
progressBar.addEventListener('input', setProgress);

// Pasar a la siguiente pista automáticamente cuando termina el audio
audio.addEventListener('ended', nextTrack);

// Cambiar el tipo de misterio desde el menú desplegable
mysterySelect.addEventListener('change', (e) => {
    // Pausar si estaba sonando
    if(isPlaying) {
        togglePlay();
    }
    loadMysteryType(e.target.value);
});

// Inicialización
window.addEventListener('load', () => {
    loadMysteryType(mysterySelect.value);
});