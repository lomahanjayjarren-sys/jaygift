const envelope = document.getElementById('envelope');
const letterSection = document.getElementById('letter');
const openInvitation = document.getElementById('openInvitation');
const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function openLetter() {
  envelope.classList.add('open');
  window.setTimeout(() => letterSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 280);
}
envelope.addEventListener('click', openLetter);
openInvitation.addEventListener('click', () => {
  document.getElementById('surprise').scrollIntoView({ behavior: 'smooth' });
  window.setTimeout(() => envelope.focus(), 550);
});

document.getElementById('saveLetter').addEventListener('click', () => {
  const value = document.getElementById('letterInput').value.trim();
  if (!value) return showToast('Write your message in the box first ♡');
  const display = document.getElementById('letterDisplay');
  display.replaceChildren(...value.split(/\n\s*\n/).filter(Boolean).map(line => {
    const p = document.createElement('p');
    p.textContent = line;
    return p;
  }));
  showToast('Your birthday letter has been updated ♡');
});

document.getElementById('photoUpload').addEventListener('change', event => {
  const files = Array.from(event.target.files || []);
  const gallery = document.getElementById('gallery');
  files.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    const figure = document.createElement('figure');
    figure.className = 'memory-card';
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'A photo added to the birthday memories';
    const caption = document.createElement('figcaption');
    caption.textContent = '♡ A new memory';
    figure.append(img, caption);
    gallery.appendChild(figure);
  });
  if (files.length) showToast(`${files.length} photo${files.length === 1 ? '' : 's'} added to your gallery ♡`);
  event.target.value = '';
});

const musicToggle = document.getElementById('musicToggle');
let audioContext, oscillator, gain;
let playing = false;
musicToggle.addEventListener('click', () => {
  // A soft, original two-note ambient tone generated in the browser; no external audio file.
  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return showToast('Audio is not supported in this browser.');
    audioContext = new AudioContext();
    oscillator = audioContext.createOscillator();
    gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 261.63;
    gain.gain.value = 0;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
  }
  if (audioContext.state === 'suspended') audioContext.resume();
  playing = !playing;
  gain.gain.setTargetAtTime(playing ? 0.018 : 0, audioContext.currentTime, 0.2);
  musicToggle.innerHTML = playing ? '♫ <span>Music on</span>' : '♪ <span>Music</span>';
  showToast(playing ? 'A soft birthday melody is on ♡' : 'Music paused');
});
