let baseURL = 'https://pokeapi.co/api/v2/pokemon';
let currentOffset = 0;
let allPokemon = [];
let currentIndex = null;
let searchTimeout;

const typeSymbols = {
  fire: '🔥',
  water: '💧',
  electric: '⚡',
  grass: '🌿',
  bug: '🐞',
  poison: '☠️',
  ground: '🌍',
  normal: '⚪',
  flying: '🕊️',
  psychic: '🧠',
  ice: '❄️',
  dragon: '🐉',
  ghost: '👻',
  dark: '🌑',
  steel: '🔩',
  fairy: '🧚',
  fighting: '🥊',
  rock: '⛰️'
};

const typeColors = {
  fire: '#FF5733',
  water: '#33B5FF',
  electric: '#FFEB3B',
  grass: '#4CAF50',
  bug: '#8BC34A',
  poison: '#9C27B0',
  ground: '#795548',
  normal: '#9E9E9E',
  flying: '#0288D1',
  psychic: '#8E24AA',
  ice: '#03A9F4',
  dragon: '#E91E63',
  ghost: '#673AB7',
  dark: '#212121',
  steel: '#B0BEC5',
  fairy: '#F48FB1' 
};

function init() {
  loadData(currentOffset, 20);
  setupSearch();
}

function showLoadingSpinner() {
  let spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.style.display = 'block';
  }
}

function hideLoadingSpinner() {
  let spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.style.display = 'none';
  }
}

async function loadPokemonData(pokemonURL) {
  let pokemonResponse = await fetch(pokemonURL);
  let pokemonData = await pokemonResponse.json();

  pokemonData.baseExperience = pokemonData.base_experience;
  pokemonData.abilitiesList = pokemonData.abilities.map(ability => ability.ability.name).join(', ');

  return pokemonData;
}

function generateTypesString(types) {
  let typesString = "";

  for (let i = 0; i < types.length; i++) {
    let typeName = types[i].type.name;
    let typeSymbol = typeSymbols[typeName];

    if (typesString !== "") {
      typesString += " ";
    }

    typesString += typeSymbol;
  }

  return typesString;
}

function createPokemonCard(pokemonData, typesString, currentIndex) {
  return templateCard(pokemonData, typesString, currentIndex);
}

async function loadData(offset, limit) {
  let content = document.getElementById('content');
  let moreButtonRef = document.getElementById('morebutton');

  if (moreButtonRef) {
    showLoadingSpinner();
    moreButtonRef.setAttribute('disabled', '');
  }

  setTimeout(async () => {
    try {
      let response = await fetch(`${baseURL}?offset=${offset}&limit=${limit}`);
      let responseJSON = await response.json();

      let pokemonCards = '';

      for (let i = 0; i < responseJSON.results.length; i++) {
        let pokemonURL = responseJSON.results[i].url;

        let pokemonData = await loadPokemonData(pokemonURL);

        let typesString = generateTypesString(pokemonData.types);
        let currentIndex = allPokemon.length;

        pokemonCards += createPokemonCard(pokemonData, typesString, currentIndex);

        allPokemon.push(pokemonData);
      }

      content.innerHTML += pokemonCards;
    } catch (error) {
      content.innerHTML = '<p>Fehler beim Laden der Pokémon-Daten. Bitte versuche es später erneut.</p>';
    } finally {
      hideLoadingSpinner();

      if (moreButtonRef) {
        moreButtonRef.removeAttribute('disabled');
      }
    }

    currentOffset += limit;
  }, 2000);
}

function setupSearch() {
  document.getElementById('searchInput').addEventListener('input', function(event) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchPokemon(event.target.value);
    }, 500);
  });
}

function searchPokemon(searchTerm) {
  searchTerm = searchTerm.toLowerCase().trim();

  if (searchTerm.length < 3) {
    displayAllPokemon();
    return;
  }

  const filteredPokemon = allPokemon.filter(pokemon => pokemon.name.toLowerCase().startsWith(searchTerm));

  displayFilteredPokemon(filteredPokemon);
}

function displayAllPokemon() {
  let content = document.getElementById('content');
  content.innerHTML = '';

  let pokemonCards = '';
  allPokemon.forEach((pokemon, index) => {
    let typesString = getTypesString(pokemon);
    pokemonCards += templateCard(pokemon, typesString, index);
  });

  content.innerHTML = pokemonCards;
}

function displayFilteredPokemon(pokemonList) {
  let content = document.getElementById('content');
  content.innerHTML = ''; // Leere den Inhalt

  let pokemonCards = '';
  pokemonList.forEach((pokemon, index) => {
    // Wir übergeben den globalen Index, der durch das Filtern korrekt gesetzt wird
    let typesString = getTypesString(pokemon);
    pokemonCards += templateCard(pokemon, typesString, allPokemon.findIndex(p => p.name === pokemon.name));  // Hier den globalen Index übergeben
  });

  content.innerHTML = pokemonCards;
}

function getTypesString(pokemonData) {
  let typesArray = [];
  for (let i = 0; i < pokemonData.types.length; i++) {
    let type = pokemonData.types[i].type.name;
    if (typeSymbols[type]) {
      typesArray.push(typeSymbols[type]);
    }
  }
  return typesArray.join('');
}

function overlayOpen(index) {
  if (index < 0 || index >= allPokemon.length) {
    return;
  }

  currentIndex = index;
  const pokemonData = allPokemon[index];

  if (!pokemonData || !pokemonData.types) {
    return;
  }

  const typesString = getTypesString(pokemonData);
  const overlayElement = document.getElementById('overlay');

  overlayElement.innerHTML = singlePokemon(pokemonData, typesString);
  overlayElement.classList.remove('d_none');

  selectTab('main');

  document.body.classList.add('no-scroll');
}

function overlayClose(event) {
  const targetID = event.currentTarget.id;
  const refOverlay = document.getElementById('overlay');
  
  if (targetID === 'overlay') {
    event.stopPropagation();
    refOverlay.classList.add('d_none');
    document.body.classList.remove('no-scroll');
  } else {
    event.stopPropagation();
  }
}

function prevImage() {
  if (currentIndex <= 0) {
    overlayOpen(allPokemon.length - 1);
  } else {
    overlayOpen(currentIndex - 1);
  }
}

function nextImage() {
  if (currentIndex >= allPokemon.length - 1) {
    overlayOpen(0);
  } else {
    overlayOpen(currentIndex + 1);
  }
}

function showTab(showKey, hideyKey1, hideyKey2) {
  let showTab = document.getElementById(showKey);
  showTab.classList.remove('d-none');
  
  let hideTab1 = document.getElementById(hideyKey1);
  hideTab1.classList.add('d-none');
  
  let hideTab2 = document.getElementById(hideyKey2);
  hideTab2.classList.add('d-none');
}

function selectTab(tabName) {
  const allTabs = ['main', 'stats', 'evo'];
  const hideTabs = [];

  for (let i = 0; i < allTabs.length; i++) {
    if (allTabs[i] !== tabName) {
      hideTabs.push(allTabs[i]);
    }
  }

  showTab(tabName, hideTabs[0], hideTabs[1]);

  const pokemonData = allPokemon[currentIndex];

  if (tabName === 'main') {
    document.getElementById('mainSection').innerHTML = showMains(pokemonData);
  } else if (tabName === 'stats') {
    document.getElementById('statsSection').innerHTML = showStats(pokemonData);
  } else if (tabName === 'evo') {
    loadEvolutionChain(pokemonData);
  }
}

async function fetchEvolutionData(speciesUrl) {
  const speciesRes = await fetch(speciesUrl);
  const speciesData = await speciesRes.json();
  const evoRes = await fetch(speciesData.evolution_chain.url);
  const evoData = await evoRes.json();
  return evoData;
}

function extractEvolutionChain(evoData) {
  const evoChain = [];
  let current = evoData.chain;

  while (current) {
    if (current.species && current.species.name) {
      evoChain.push(current.species.name);
    }

    if (current.evolves_to && current.evolves_to.length > 0) {
      current = current.evolves_to[0];
    } else {
      current = null;
    }
  }

  return evoChain;
}

async function createEvolutionHTML(evoChain) {
  let evoHTML = '<div class="evolution-chain">';

  for (let i = 0; i < evoChain.length; i++) {
    const name = evoChain[i];
    const pokeRes = await fetch('https://pokeapi.co/api/v2/pokemon/' + name);
    const pokeData = await pokeRes.json();

    evoHTML += showEvoChain(pokeData);

    if (i < evoChain.length - 1) {
      evoHTML += '<div class="arrow">&#8658;</div>';
    }
  }

  evoHTML += '</div>';
  return evoHTML;
}

async function loadEvolutionChain(pokemonData) {
  const evoContainer = document.getElementById('evoSelection');
  evoContainer.innerHTML = 'Lade Evolutionskette...';

  try {
    const evoData = await fetchEvolutionData(pokemonData.species.url);

    const evoChain = extractEvolutionChain(evoData);

    const evoHTML = await createEvolutionHTML(evoChain);

    evoContainer.innerHTML = evoHTML;
  } catch (error) {
    evoContainer.innerHTML = '<p>Fehler beim Laden der Evolutionskette.</p>';
  }
}

async function loadMore() {
  try {
    await loadData(currentOffset, 20);
  } catch(error){
    console.error('Fehler beim Laden der Pokémon-Daten:', error);
  }
}
