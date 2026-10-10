import { addMessage, setChoices, isChatOpen, clearMessages } from './ui.js';
import { galleryItems, normalize } from '../scripts/galleries.js';

const labels = { home: 'Home', 'sobre-mi': 'About Me', profesional: 'Professional', reading: 'Reading', gaming: 'Gaming', music: 'Music', soccer: 'Soccer', drawing: 'Drawing', 'tv-movies': 'TV Shows & Movies' };
const categories = ['gaming', 'tv-movies', 'music', 'reading', 'drawing', 'soccer'];
let navigate;
let greeted = false;
let preference = null;
let flow = null;
let internalNavigation = false;
let highlighted = null;
let highlightTimer;

function remember(category) {
  preference = category;
  try { localStorage.setItem('jules-preference', category); } catch {}
}
function contextChoices() {
  const section = document.body.dataset.section;
  const choices = [];
  if (categories.includes(section)) choices.push(["What's in this gallery?", `list:${section}`], ['Pick something here', `pick:${section}`]);
  if (section === 'profesional') choices.push(['Python project', 'python'], ['Project tour', 'tour:work']);
  choices.push(['Recommend something', 'recommend'], ['Guided tour', 'tour'], ['Trivia', 'trivia'], ['Help', 'help']);
  if (preference) choices.push(['Forget my preference', 'forget']);
  setChoices(choices);
}
function go(section, element) {
  if (!labels[section]) return;
  internalNavigation = true;
  navigate(section);
  internalNavigation = false;
  document.getElementById(section)?.dispatchEvent(new Event('gallery-reset'));
  if (element) {
    if (highlighted) highlighted.classList.remove('jules-highlight');
    clearTimeout(highlightTimer);
    highlighted = element;
    element.classList.add('jules-highlight');
    element.scrollIntoView({ block: 'center', behavior: 'smooth' });
    highlightTimer = setTimeout(() => element.classList.remove('jules-highlight'), 5000);
  }
}
function projects() {
  return [...document.querySelectorAll('#profesional .card')].map(element => ({ element, name: element.querySelector('h4').textContent, text: element.querySelector('p').textContent.trim().replace(/\s+/g, ' ') }));
}
function pick(category) {
  const items = galleryItems(category);
  if (!items.length) { addMessage('There are no items available in that gallery.'); contextChoices(); return; }
  remember(category);
  const item = items[Math.floor(Math.random() * items.length)];
  go(category, item.element);
  addMessage(`Try exploring ${item.name} from the ${labels[category]} collection. I highlighted it in the gallery. This is a random pick from your chosen category.`);
  setChoices([['Another pick', `pick:${category}`], ['Change category', 'recommend'], ['Back to menu', 'help']]);
}
function tourStep() {
  if (flow.kind === 'work') {
    const items = projects();
    const item = items[flow.index];
    if (!item) return finishTour();
    go('profesional', item.element);
    addMessage(`Project ${flow.index + 1} of ${items.length}: ${item.name}. ${item.text}`);
  } else {
    const steps = ['sobre-mi', 'gaming', 'music', 'soccer', 'drawing', 'tv-movies', 'reading'];
    const section = steps[flow.index];
    if (!section) return finishTour();
    go(section);
    const names = galleryItems(section).map(item => item.name);
    addMessage(`Stop ${flow.index + 1} of ${steps.length}: ${labels[section]}. ${names.length ? `There are ${names.length} items here, including ${names.slice(0, 2).join(' and ')}.` : 'Choose the hobbies you want to explore here.'}`);
  }
  setChoices([['Next', 'next'], ['Stop tour', 'stop']]);
}
function finishTour() { flow = null; addMessage('Tour complete. What would you like to explore next?'); contextChoices(); }
function triviaQuestion() {
  const questions = flow.questions;
  if (flow.index >= questions.length) {
    addMessage(`Trivia complete: ${flow.score} of ${questions.length} answers correct.`);
    flow = null;
    setChoices([['Play again', 'trivia'], ['Back to menu', 'help']]);
    return;
  }
  const q = questions[flow.index];
  addMessage(`Question ${flow.index + 1} of ${questions.length}: ${q.text}`);
  setChoices(q.options.map((answer, index) => [answer, `answer:${index}`]).concat([['Hint', 'hint'], ['Exit trivia', 'stop']]));
}
function startTrivia() {
  flow = { type: 'trivia', index: 0, score: 0, answered: false, questions: [
    { text: 'Which project on this page uses Python to translate Braille?', options: projects().map(p => p.name), correct: projects().findIndex(p => p.name === 'Braille to Text'), hint: 'Its name mentions the writing system it translates.' },
    { text: 'Which artist is featured in Now Playing?', options: ['Twenty One Pilots', 'Paramore', 'Green Day'], correct: 0, hint: 'They also appear in the music gallery and in one of the drawings.' },
    { text: 'Which of these names is in the soccer gallery?', options: ['Pumas UNAM', 'Oasis', 'Joji'], correct: 0, hint: 'Its name includes UNAM.' }
  ] };
  triviaQuestion();
}

export const agent = {
  start(options) {
    navigate = options.navigate;
    try {
      const saved = localStorage.getItem('jules-preference');
      if (categories.includes(saved)) preference = saved;
    } catch {}
    document.getElementById('agent-form').addEventListener('submit', event => {
      event.preventDefault();
      const input = document.getElementById('agent-input');
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      this.handle(text, text);
    });
    document.getElementById('agent-chat').addEventListener('keydown', event => {
      if (event.key === 'Escape') document.getElementById('close-agent-chat').click();
    });
  },
  notifyAgentClicked() {
    if (!greeted) {
      addMessage("I'm Jules-T800 💀. I can guide you around the blog, show projects and suggest items from its galleries. Try “show drawings”, “tour” or “trivia”.");
      greeted = true;
      contextChoices();
    }
  },
  notifySectionChanged() {
    if (internalNavigation) return;
    if (flow) {
      flow = null;
      if (isChatOpen()) addMessage('I stopped the activity so you can explore this section. You can restart it whenever you like.');
    }
    contextChoices();
  },
  handle(raw, display = raw) {
    addMessage(display, 'You');
    const text = normalize(raw).replace(/^recommend me /, 'recommend ');
    if (text.startsWith('answer:')) {
      if (flow?.type !== 'trivia' || flow.answered) return;
      const answer = Number(text.split(':')[1]);
      const q = flow.questions[flow.index];
      if (!Number.isInteger(answer) || !q.options[answer]) return;
      flow.answered = true;
      const correct = answer === q.correct;
      if (correct) flow.score++;
      addMessage(correct ? 'Correct!' : `The answer is ${q.options[q.correct]}.`);
      setChoices([['Next question', 'next'], ['Exit trivia', 'stop']]);
      return;
    }
    if (text === 'hint' || text === 'pista') {
      if (flow?.type === 'trivia' && !flow.answered) addMessage(flow.questions[flow.index].hint);
      else addMessage('Start a trivia game to ask for a hint.');
      return;
    }
    if (['next', 'siguiente'].includes(text)) {
      if (flow?.type === 'tour') { flow.index++; tourStep(); }
      else if (flow?.type === 'trivia' && flow.answered) { flow.index++; flow.answered = false; triviaQuestion(); }
      else addMessage('Choose an activity first, or answer the current question.');
      return;
    }
    if (['cancel', 'exit', 'stop', 'detener', 'cancelar', 'salir'].includes(text)) {
      flow = null; addMessage('Activity stopped. You choose where to go next.'); contextChoices(); return;
    }
    // Permitir responder una trivia escribiendo el nombre de una opción.
    if (flow?.type === 'trivia' && !flow.answered) {
      const index = flow.questions[flow.index].options.findIndex(option => normalize(option) === text);
      if (index >= 0) { this.handle(`answer:${index}`, 'Answer'); return; }
    }
    if (['what can you do', 'what can you do?', 'help', 'ayuda', 'menu', 'que puedes hacer', '¿que puedes hacer?'].includes(text)) {
      flow = null;
      addMessage('Try “show games”, “show movies”, “show projects”, “tour”, “recommend something”, “trivia”, “pause music” or “dark mode”. I can also search for a title or artist on the blog.');
      contextChoices(); return;
    }
    if (['who are you', 'who are you?', 'quien eres', '¿quien eres?'].includes(text)) {
      addMessage("I'm Jules-T800, your guide to this blog. I answer questions about its content and help you navigate."); return;
    }
    if (['forget my preference', 'forget preferences', 'forget', 'olvidar mi preferencia', 'olvidar preferencias'].includes(text)) {
      preference = null;
      try { localStorage.removeItem('jules-preference'); } catch {}
      addMessage('I forgot your preferred category.'); contextChoices(); return;
    }
    if (['clear chat', 'limpiar chat'].includes(text)) { flow = null; clearMessages(); addMessage('Conversation reset.'); contextChoices(); return; }
    if (['trivia', 'jugar trivia'].includes(text)) { startTrivia(); return; }
    if (['guided tour', 'tour', 'recorrido', 'recorrido guiado'].includes(text)) {
      flow = null; addMessage('Would you like to explore the projects or the hobbies?');
      setChoices([['Projects', 'tour:work'], ['Hobbies', 'tour:hobbies'], ['Cancel', 'stop']]); return;
    }
    if (['tour:work', 'tour:hobbies'].includes(text)) {
      flow = { type: 'tour', kind: text.split(':')[1], index: 0 }; tourStep(); return;
    }
    const recommendationCategories = {
      'recommend a movie': 'tv-movies', 'recommend a game': 'gaming', 'recommend music': 'music', 'recommend a book': 'reading',
      'recomiendame una pelicula': 'tv-movies', 'recomiendame un juego': 'gaming',
      'recomiendame un videojuego': 'gaming', 'recomiendame musica': 'music',
      'recomiendame un libro': 'reading'
    };
    if (recommendationCategories[text]) { flow = null; pick(recommendationCategories[text]); return; }
    if (['recommend something', 'recommend', 'recomiendame algo', 'recomiendame', 'recomendacion'].includes(text)) {
      flow = null;
      addMessage(preference ? `Your last category was ${labels[preference]}. Shall we stay there or try something else?` : 'What would you like to explore? I will pick an item from that collection.');
      const ordered = preference ? [preference, ...categories.filter(id => id !== preference)] : categories;
      setChoices(ordered.map(id => [labels[id], `pick:${id}`]).concat([['Cancel', 'stop']])); return;
    }
    if (text.startsWith('pick:')) { flow = null; pick(text.split(':')[1]); return; }
    if (text.startsWith('list:')) {
      const id = text.split(':')[1];
      addMessage(galleryItems(id).map(item => item.name).join(' · ') || 'There is no gallery in that section.'); return;
    }
    if (text === 'python' || text.includes('proyecto con python') || text === 'python project') {
      flow = null;
      const project = projects().find(p => p.name === 'Braille to Text');
      go('profesional', project.element); addMessage(`${project.name}: ${project.text}`); contextChoices(); return;
    }
    if (['pausar musica', 'pause music', 'reproducir musica', 'play music'].includes(text)) {
      const music = document.getElementById('bg-music');
      if (text.startsWith('paus') || text.startsWith('pause')) { music.pause(); addMessage('Music paused.'); }
      else music.play().then(() => addMessage('Music is playing.')).catch(() => addMessage('I could not play the audio. Try the music button.'));
      return;
    }
    if (['modo oscuro', 'modo claro', 'dark mode', 'light mode'].includes(text)) {
      const dark = text.includes('oscuro') || text === 'dark mode';
      if (document.body.classList.contains('dark-mode') !== dark) document.getElementById('theme-toggle').click();
      addMessage(dark ? 'Dark mode enabled.' : 'Light mode enabled.'); return;
    }
    const aliases = { games:'gaming', movies:'tv-movies', books:'reading', drawings:'drawing', projects:'profesional', football:'soccer', 'about me':'sobre-mi', home:'home', inicio:'home', 'sobre mi':'sobre-mi', hobbies:'sobre-mi', proyectos:'profesional', profesional:'profesional', professional:'profesional', juegos:'gaming', videojuegos:'gaming', gaming:'gaming', musica:'music', music:'music', dibujos:'drawing', drawing:'drawing', futbol:'soccer', soccer:'soccer', libros:'reading', reading:'reading', peliculas:'tv-movies', series:'tv-movies', 'tv shows & movies':'tv-movies' };
    const query = text.replace(/^(ver|mostrar|muestrame|ir a|abrir|show me|show|open|go to)\s+/, '').replace(/^(los|las|mis|tus|the|your)\s+/, '');
    if (aliases[query]) {
      flow = null; go(aliases[query]); addMessage(`Opened ${labels[aliases[query]]}.`); contextChoices(); return;
    }
    const matches = categories.flatMap(galleryItems).filter(item => normalize(item.name).includes(query));
    if (query.length >= 2 && matches.length) {
      flow = null;
      if (matches.length === 1) { go(matches[0].section, matches[0].element); addMessage(`Found ${matches[0].name}. I highlighted it in its gallery.`); contextChoices(); }
      else {
        addMessage(`Found ${matches.length} matches. Choose one:`);
        setChoices(matches.slice(0, 12).map(item => [item.name, item.name]).concat([['Back to menu', 'help']]));
      }
      return;
    }
    addMessage('I did not recognize that request. Try “show drawings”, the name of a gallery item, or “help”.');
  }
};
