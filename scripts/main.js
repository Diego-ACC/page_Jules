const links = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("main .section");

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = link.dataset.target;

    // Cambiar sección visible
    sections.forEach(s => s.classList.remove("active"));
    document.getElementById(target).classList.add("active");

    // Cambiar link activo
    links.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

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
    toggleBtn.textContent = "🎵 Música: Pausar";
  } else {
    music.pause();
    vinyl.classList.remove("spinning");
    toggleBtn.textContent = "🎵 Música: Reproducir";
  }
});
