export function normalize(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// Each section owns its groups. These organize the existing collection, not ratings.
const filters = {
  reading: { label: 'Search books', placeholder: 'Book title or author', groups: {
    'Technology': ['Cracking the Coding Interview (Gayle Laakmann)'],
    'Personal development': ['12 Nuevas Reglas Para Vivir (Jordan B. Peterson)'],
    'Fiction': ['La Maldición de Hill House (Shirley Jackson)']
  } },
  gaming: { label: 'Search games', placeholder: 'Game title', groups: {
    'Horror': ['Resident Evil 0', 'Resident Evil 1', 'Resident Evil 2', 'Resident Evil 4', 'Resident Evil 5', 'Resident Evil 6', 'Resident Evil 7', 'Resident Evil Village', 'Resident Evil Requiem', 'Silent Hill 2'],
    'Fighting': ['Super Smash Bros Melee', 'Marvel vs Capcom 3'],
    'Action & adventure': ['Titanfall', 'Rise of the Tomb Rider', 'Shadow of the Tomb Rider', "Assasin's Creed Black Flag", 'Borderlands 2', 'Devil May Cry 4', 'The Legend of Zelda: Ocarina of Time'],
    'Role-playing': ['Final Fantasy XV', 'Borderlands 2', 'Stardew Valley'],
    'Sandbox & simulation': ['Minecraft', 'Stardew Valley', 'Terraria']
  } },
  music: { label: 'Search music', placeholder: 'Artist or band name', groups: {
    'Bands & duos': ['Avenged Sevenfold', 'Arctic Monkeys', 'Caifanes', 'Twenty One Pilots', 'Paramore', 'Oasis', 'The Warning', 'The Strokes', 'Green Day'],
    'Solo artists': ['The Weekend', 'José Madero', 'Harry Styles', 'Julian Casablancas', 'Joji', 'Sabrina Carpenter', 'Kanye West', 'Avril Lavigne']
  } },
  soccer: { label: 'Search soccer', placeholder: 'Club or national team name', groups: {
    'Clubs': ['Pumas UNAM', 'Real Madrid', 'AC Milan', 'Borussia Dortmund'],
    'National teams': ['Portugal National Team', 'Mexico National Team']
  } },
  drawing: { label: 'Search drawings', placeholder: 'Artwork title', groups: {
    'Characters': ['Young Link (Ocarina of Time)'],
    'Pixel art': ['Pixel Dragon', 'Pixel Shark'],
    'Music artwork': ["Sabrina Carpenter (Short n' Sweet)", 'Twenty One Pilots (BREACH)', 'José Madero (Sarajevo)']
  } },
  'tv-movies': { label: 'Search movies & TV', placeholder: 'Movie or show title', groups: {
    'Horror & suspense': ['Annabelle Creation', 'The Conjuring', 'LONGLEGS', 'World War Z'],
    'Action & adventure': ['World War Z', 'Drive', 'The Fall Guy', 'The Nice Guys', 'Godzilla'],
    'Drama': ['Blue Valentine', 'Rocky', 'Creed ||', 'Drive', 'The Dirt', 'The Imitation Game'],
    'Comedy': ['The Fall Guy', 'The Nice Guys'],
    'Music & biography': ['The Dirt', 'The Imitation Game']
  } }
};

export function galleryItems(section) {
  if (!Object.hasOwn(filters, section)) return [];
  return [...document.querySelectorAll(`#${section} [data-name]`)].map(element => ({
    name: element.dataset.name, element, section
  }));
}

export function initGalleries() {
  document.querySelectorAll('.hobby-section').forEach(section => {
    const config = filters[section.id];
    const items = galleryItems(section.id);
    if (!config || !items.length) return;
    const controls = document.createElement('div');
    controls.className = 'gallery-filters';
    const searchLabel = document.createElement('label');
    searchLabel.htmlFor = `filter-${section.id}`;
    searchLabel.textContent = config.label;
    const search = document.createElement('input');
    search.type = 'search';
    search.id = searchLabel.htmlFor;
    search.placeholder = config.placeholder;
    const selectLabel = document.createElement('label');
    selectLabel.htmlFor = `category-${section.id}`;
    selectLabel.textContent = 'Category';
    const select = document.createElement('select');
    select.id = selectLabel.htmlFor;
    select.add(new Option('All categories', ''));
    const groups = new Map(Object.entries(config.groups).map(([name, entries]) => [name, new Set(entries.map(normalize))]));
    groups.forEach((entries, name) => select.add(new Option(name, name)));
    const count = document.createElement('span');
    count.setAttribute('role', 'status');
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.textContent = 'Clear filters';
    function filter() {
      const query = normalize(search.value);
      const group = groups.get(select.value);
      let visible = 0;
      items.forEach(item => {
        const name = normalize(item.name);
        item.element.hidden = !(name.includes(query) && (!group || group.has(name)));
        if (!item.element.hidden) visible++;
      });
      count.textContent = visible ? `${visible} of ${items.length}` : 'No results. Try another name or clear the filters.';
    }
    search.addEventListener('input', filter);
    select.addEventListener('change', filter);
    clear.addEventListener('click', () => { search.value = ''; select.value = ''; filter(); });
    section.addEventListener('gallery-reset', () => clear.click());
    const searchField = document.createElement('div');
    const categoryField = document.createElement('div');
    searchField.className = categoryField.className = 'filter-field';
    searchField.append(searchLabel, search);
    categoryField.append(selectLabel, select);
    controls.append(searchField, categoryField, clear, count);
    section.querySelector('[data-name]').parentElement.before(controls);
    filter();
  });
}
