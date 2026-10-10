import { openChat, closeChat, isChatOpen } from '../agent/ui.js';
import { agent } from '../agent/agent.js';

function init() {
  const sections = [...document.querySelectorAll('main .section')];
  const links = [...document.querySelectorAll('nav a[data-target]')];
  function showSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    sections.forEach(section => section.classList.toggle('active', section === target));
    links.forEach(link => link.classList.toggle('active', link.dataset.target === id));
    document.body.dataset.section = id;
    agent.notifySectionChanged();
  }
  const initial = sections.find(section => section.classList.contains('active'));
  if (initial) document.body.dataset.section = initial.id;
  if (document.getElementById('agent-button')) agent.start();
  document.addEventListener('click', event => {
    const link = event.target.closest('nav a[data-target]');
    if (link) {
      event.preventDefault();
      showSection(link.dataset.target);
    } else if (event.target.closest('.back-to-hobbies')) showSection('sobre-mi');
    else if (event.target.closest('#agent-button')) {
      if (isChatOpen()) closeChat();
      else { openChat(); agent.notifyAgentClicked(); }
    } else if (event.target.closest('#close-agent-chat')) closeChat();
    else {
      const question = event.target.closest('#agent-questions button');
      if (question) agent.notifyQuestionSelected(Number(question.dataset.id));
    }
  });

  const music = document.getElementById('bg-music');
  const toggle = document.getElementById('toggle-music');
  const vinyl = document.getElementById('vinyl');
  if (music && toggle) {
    function syncMusic() {
      vinyl?.classList.toggle('spinning', !music.paused);
      toggle.textContent = music.paused ? '🎵 Music: Play' : '🎵 Music: Pause';
    }
    function removeStart() {
      document.removeEventListener('click', startMusic);
      document.removeEventListener('keydown', startMusic);
    }
    function playMusic() { music.play().then(removeStart).catch(syncMusic); }
    function startMusic(event) {
      if (!event.target.closest('#toggle-music')) playMusic();
    }
    music.addEventListener('play', syncMusic);
    music.addEventListener('pause', syncMusic);
    syncMusic();
    document.addEventListener('click', startMusic);
    document.addEventListener('keydown', startMusic);
    toggle.addEventListener('click', () => {
      removeStart();
      if (music.paused) playMusic(); else music.pause();
    });
  }

  const light = document.createElement('div');
  light.className = 'cursor-light';
  document.body.appendChild(light);
  let frame = 0, x = 0, y = 0, touchTimer;
  function moveLight(nextX, nextY) {
    x = nextX; y = nextY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      light.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      light.style.opacity = '1';
      frame = 0;
    });
  }
  document.addEventListener('mousemove', event => moveLight(event.clientX, event.clientY), { passive: true });
  document.addEventListener('touchstart', event => {
    const touch = event.touches[0];
    if (!touch) return;
    moveLight(touch.clientX, touch.clientY);
    clearTimeout(touchTimer);
    touchTimer = setTimeout(() => { light.style.opacity = '0'; }, 400);
  }, { passive: true });

  const greeting = document.querySelector('.home-left h2');
  if (greeting) {
    const hour = new Date().getHours();
    greeting.textContent = hour < 12 ? '☀️ ¡You were sleep, time to wake up!' : hour < 19 ? '🌇 In the evening sun...' : '🌙 Good Night, see ya tomorrow';
  }
  const theme = document.getElementById('theme-toggle');
  if (theme) {
    try { document.body.classList.toggle('dark-mode', localStorage.getItem('theme') === 'dark'); } catch {}
    function syncTheme() { theme.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode'; }
    syncTheme();
    theme.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      syncTheme();
      try { localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light'); } catch {}
    });
  }

  const gif = document.querySelector('.name-gif');
  if (gif) {
    const gifs = ['link-zelda.gif', 'pikachu-running.gif', 'cloud-strife.gif', 'link-botw.gif', 'pixel_charizard.gif'];
    let index = 0, timer, fadeTimer;
    function scheduleGif() {
      timer = setTimeout(() => {
        gif.classList.add('fade-out');
        fadeTimer = setTimeout(() => {
          index = (index + 1) % gifs.length;
          gif.src = `assets/gifs/${gifs[index]}`;
          gif.classList.remove('fade-out');
          scheduleGif();
        }, 400);
      }, 5600);
    }
    document.addEventListener('visibilitychange', () => {
      clearTimeout(timer); clearTimeout(fadeTimer);
      gif.classList.remove('fade-out');
      if (!document.hidden) scheduleGif();
    });
    if (!document.hidden) scheduleGif();
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
