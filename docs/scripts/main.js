import { openChat, closeChat, addMessage, isChatOpen } from "../agent/ui.js";
import { agent } from "../agent/agent.js";
import { sensors } from "../agent/sensors.js";

document.addEventListener("DOMContentLoaded", () => {
  init();
});

function init(){

  const links = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("main .section");



  //====================================
  // CONFIGURACIÓN DEL AGENTE Y EVENTOS 
  //====================================
  // Establecer sección inicial en el body para dar un punto de referencia
  const initialSection = document.querySelector("main .section.active");
  if(initialSection && initialSection.id){
    document.body.setAttribute("data-section", initialSection.id);
  }else{
    //Si no hay opción activa, tomar la primera sección con id
    const firstSection = document.querySelector("main .section[id]");
    if(firstSection){document.body.setAttribute("data-section", firstSection.id);}
  }

  // Botón principal del agente
  const agentBtn = document.getElementById("agent-button");
  agentBtn.addEventListener("click", () => {
      if(isChatOpen()){
          closeChat();
          //Evitar que el loop lo abra nuevamente
          sensors.userClickedAgent = false;
      }else{
          openChat();
          agent.notifyAgentClicked();
      }
  });

  // Botón para cerrar el chat
  const closeBtn = document.getElementById("close-agent-chat");
  if(closeBtn){
    closeBtn.addEventListener("click", (e) =>{
      e.stopPropagation();
      closeChat();
      sensors.userClickedAgent = false;
    });
  }

  // Preguntas pre-cargadas (botones dentro de #agent-questions)
  const questionButtons = document.querySelectorAll("#agent-questions button");
  questionButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      agent.notifyQuestionSelected(id);
    });
  });

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = link.dataset.target;

      // Cambiar sección visible
      sections.forEach(s => s.classList.remove("active"));
      const targetEl = document.getElementById(target);
      if(targetEl) targetEl.classList.add("active");

      // Cambiar link activo
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      // 👉 Actualizar atributo de sección en el body
      document.body.setAttribute("data-section", target);
    });
  });

  agent.start(); 




  // ======================================
  // BOTONES DE HOBBIES
  // ======================================
  // Selecciona todos los links de hobbies
  const hobbyLinks = document.querySelectorAll('.hobby-link');
  const hobbySections = document.querySelectorAll('.hobby-section');
  const sobreMiSection = document.getElementById('sobre-mi');

  // Función para mostrar una sección de hobby
  hobbyLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Oculta la sección "Sobre mí"
      sobreMiSection.classList.remove('active');

      // Oculta todas las secciones de hobbies
      hobbySections.forEach(sec => sec.classList.remove('active'));

      // Muestra la sección clickeada
      const target = document.getElementById(link.dataset.target);
      if(target) target.classList.add('active');
    });
  });

  // Función para regresar a "Sobre mí"
  const backButtons = document.querySelectorAll('.back-to-hobbies');
  backButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Oculta todas las secciones de hobbies
      hobbySections.forEach(sec => sec.classList.remove('active'));

      // Muestra la sección "Sobre mí"
      sobreMiSection.classList.add('active');
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



  /* =============================== */
  /* === HOBBIES: NAV + RIPPLE === */
  /* ============================= */
  // 🧩 Guardamos el contenido original del <main>
  const originalMainHTML = document.querySelector("main").innerHTML;

  // 🎨 Cargar dinámicamente contenido de hobbies (como drawing.html)
  document.querySelectorAll(".hobby-card").forEach(card => {
    card.addEventListener("click", () => {
      const link = card.getAttribute("data-link");
      fetch(link)
        .then(response => response.text())
        .then(html => {
          // Insertamos el contenido de <main> del archivo cargado
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const newContent = doc.querySelector("main") || doc.body;

          const main = document.querySelector("main");

          // Efecto de transición suave
          main.style.opacity = "0";
          setTimeout(() => {
            main.innerHTML = newContent.innerHTML;
            main.style.opacity = "1";

            // 🔙 Restaurar contenido original al hacer clic en Back
            const backBtn = document.getElementById("back-home");
            if (backBtn) {
              backBtn.addEventListener("click", (e) => {
                e.preventDefault();
                main.style.opacity = "0";
                setTimeout(() => {
                  main.innerHTML = originalMainHTML;
                  main.style.opacity = "1";

                  // ⚙️ Volvemos a enlazar los eventos de las hobby-cards
                  restoreHobbyCardEvents();
                }, 300);
              });
            }
          }, 300);
        })
        .catch(err => console.error("Error cargando la página:", err));
    });
  });

  // 🔁 Reasignar eventos a las hobby-cards al regresar
  function restoreHobbyCardEvents() {
    document.querySelectorAll(".hobby-card").forEach(card => {
      card.addEventListener("click", () => {
        const link = card.getAttribute("data-link");
        fetch(link)
          .then(response => response.text())
          .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const newContent = doc.querySelector("main") || doc.body;
            const main = document.querySelector("main");
            main.innerHTML = newContent.innerHTML;

            // Volvemos a enlazar el botón de regreso
            const backBtn = document.getElementById("back-home");
            if (backBtn) {
              backBtn.addEventListener("click", (e) => {
                e.preventDefault();
                main.innerHTML = originalMainHTML;
                restoreHobbyCardEvents();
              });
            }
          });
      });
    });
  }

  // Efecto de agua en hobbies
  document.querySelectorAll('.hobby-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Crear el efecto de agua
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      card.appendChild(ripple);

      // Quitar el efecto después de 600ms
      setTimeout(() => ripple.remove(), 600);

      // Redirigir después del efecto
      setTimeout(() => {
        window.location.href = card.dataset.link;
      }, 300);
    });
  });


  // 🎞️ Cambio automático del GIF al lado del nombre
  const gifElement = document.querySelector('.name-gif');

  // Array de rutas de tus GIFs (ajusta los nombres a los que tengas)
  const gifs = [
    'assets/gifs/link-zelda.gif',
    'assets/gifs/pikachu-running.gif',
    'assets/gifs/cloud-strife.gif',
    'assets/gifs/link-botw.gif',
    'assets/gifs/pixel_charizard.gif'
  ];

  // Cambiar GIF cada 8 segundos
  let currentGifIndex = 0;

  setInterval(() => {
    // Seleccionar siguiente gif
    currentGifIndex = (currentGifIndex + 1) % gifs.length;

    // Aplicar una pequeña transición de opacidad
    gifElement.classList.add('fade-out');
    setTimeout(() => {
      gifElement.src = gifs[currentGifIndex];
      gifElement.classList.remove('fade-out');
    }, 400);
  }, 6000);

}