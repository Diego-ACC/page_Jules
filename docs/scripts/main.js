const links = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("main .section");

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = link.dataset.target;

    //Cambiar sección visible
    sections.forEach(s => s.classList.remove("active"));
    document.getElementById(target).classList.add("active");

    //Cambiar link activo
    links.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});


/* ===================== */
/* === MUSIC BUTTON === */
/* =================== */
// 🎵 Control de música de fondo
const music = document.getElementById("bg-music");
const toggleBtn = document.getElementById("toggle-music");
const vinyl = document.getElementById("vinyl"); // vinilo

// Intentar reproducir automáticamente al cargar
window.addEventListener("DOMContentLoaded", () => {
  const playPromise = music.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => vinyl.classList.add("spinning"))
      .catch(() => {
        console.log("El navegador bloqueó la reproducción automática.");
      });
  }
});

/* ======================= */
/* === MUSIC AUTOPLAY === */
/* ===================== */
// Si el navegador bloquea el autoplay, reproducir en el primer clic o tecla
function startMusicOnce() {
  music.play().then(() => vinyl.classList.add("spinning")).catch(() => {});
  document.removeEventListener("click", startMusicOnce);
  document.removeEventListener("keydown", startMusicOnce);
}
document.addEventListener("click", startMusicOnce);
document.addEventListener("keydown", startMusicOnce);

// Botón para pausar o reproducir manualmente
toggleBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    vinyl.classList.add("spinning");
    toggleBtn.textContent = "🎵 Music: Pause";
  } else {
    music.pause();
    vinyl.classList.remove("spinning");
    toggleBtn.textContent = "🎵 Music: Play";
  }
});

/* ====================================== */
/* === LIGHT FOLLOWING MOUSE / TOUCH === */
/* ==================================== */
const light = document.createElement('div');
light.style.position = 'fixed';
light.style.width = '60px';
light.style.height = '60px';
light.style.borderRadius = '50%';
light.style.pointerEvents = 'none';
light.style.background = 'radial-gradient(circle, #C5191B 0%, rgba(255,255,255,0) 70%)';
light.style.transform = 'translate(-50%, -50%)';
light.style.transition = 'opacity 0.4s ease';
light.style.opacity = '0';
document.body.appendChild(light);

// PC: sigue el cursor
document.addEventListener('mousemove', (e) => {
  light.style.left = e.clientX + 'px';
  light.style.top = e.clientY + 'px';
  light.style.opacity = '1';
});

// Móvil: muestra luz temporal al tocar
document.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  light.style.left = touch.clientX + 'px';
  light.style.top = touch.clientY + 'px';
  light.style.opacity = '1';
  setTimeout(() => light.style.opacity = '0', 400);
});

/* ============================= */
/* === TIME-BASED ANIMATION === */
/* =========================== */
const hour = new Date().getHours();
const greeting = document.querySelector('.home-left h2');

if (hour < 12) {
  greeting.textContent = '☀️ ¡You were sleep, time to wake up!';
  //document.body.style.background = '#fef3c7';
} else if (hour < 19) {
  greeting.textContent = '🌇 In the evening sun...';
  //document.body.style.background = '#fde68a';
} else {
  greeting.textContent = '🌙 Good Night, see ya tomorrow';
  //document.body.style.background = '#1e293b';
  //document.body.style.color = '#e2e8f0';
}

/* ======================== */
/* === LIGHT/DARK MODE === */
/* ====================== */
const toggleTheme = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') document.body.classList.add('dark-mode');

toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  toggleTheme.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});


// 🎞 Lista de GIFs que irán rotando
const gifs = [
  "assets/gifs/pikachu-running.gif",
  "assets/gifs/pixel_charizard.gif"
];

const gifContainer = document.getElementById("gif-container");

// Función para cambiar el GIF aleatoriamente
function changeGif() {
  const randomIndex = Math.floor(Math.random() * gifs.length);
  const gifSrc = gifs[randomIndex];

  gifContainer.innerHTML = `<img src="${gifSrc}" alt="gif animado">`;
}

// Cambiar cada cierto tiempo (por ejemplo, cada 10 segundos)
changeGif();
setInterval(changeGif, 10000);


/* =============================== */
/* === HOBBIES: NAV + RIPPLE === */
/* ============================= */
document.querySelectorAll('.hobby-card').forEach(card => {
  // Ripple en click o toque
  function createRipple(e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = card.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  card.addEventListener('click', e => {
    createRipple(e);
    const link = card.dataset.link;
    setTimeout(() => {
      window.location.href = link;
    }, 400);
  });

  card.addEventListener('touchstart', e => {
    createRipple(e);
  });
});
