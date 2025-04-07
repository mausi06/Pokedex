function templateCard(pokemonData, typesString, currentIndex) {
    let type = pokemonData.types[0].type.name; 
  let bgColor = typeColors[type] || '#FFFFFF';

  return `<div class="overPokemonCard" onclick="overlayOpen(${currentIndex})">
              <div class="pokemonCard">
              
                <div class="pokemonName">${pokemonData.name}</div>

                <div class="pokemonIMGdiv" style="background-color: ${bgColor};">
                <img class="pokemonIMG" src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${pokemonData.name}">
                </div>

                <div class="pokemonType">${typesString}</div>

              </div>
          </div>
          `;
}

function singlePokemon(pokemonData, typesString) {
  return `<div id="pop-up" onclick="overlayClose(event)">
            <div class="pop-up-header">${pokemonData.name}</div>
            <div class="pokemonIMGdiv">
              <img class="pokemonIMG" src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${pokemonData.name}">
            </div>
            <div class="pop-up-typesdiv">
            ${typesString}
            </div>
            <div id="properties">
              <div class="tab" onclick="selectTab('main')"><p>Main</p></div>
              <div class="tab" onclick="selectTab('stats')"><p>Stats</p></div>
              <div class="tab" onclick="selectTab('evo')"><p>Evo Chain</p></div>
            </div>

            <div id="propertiesDetails">
              <div class="d-none" id="main">
                <div id="mainSection"></div>
              </div>
              <div class="d-none" id="stats">
                <div id="statsSection"></div>
              </div>
              <div class="d-none" id="evo">
                <div id="evoSelection"></div>
              </div>
            </div>

            <div class="buttons-contener">
              <button onclick="prevImage()">&#8656;</button>

              <button onclick="nextImage()">&#8658;</button>
            </div>  
          </div>`;
}

function showMains(pokemonData) {
  return `<table>
    <tr>
      <td class="unity">Height</td>
      <td class="unityinfo">${pokemonData.height} m</td>
    </tr>
    <tr>
      <td class="unity">Weight</td>
      <td class="unityinfo">${pokemonData.weight} kg</td>
    </tr>
    <tr>
      <td class="unity">Types</td>
      <td class="unityinfo">${pokemonData.types.map(type => type.type.name).join(', ')}</td>
    </tr>
  </table>`;
}

function showStats(pokemonData) {
  return `<table>
    <tr><td>HP</td><td>${pokemonData.stats[0].base_stat}</td></tr>
    <tr><td>Attack</td><td>${pokemonData.stats[1].base_stat}</td></tr>
    <tr><td>Defense</td><td>${pokemonData.stats[2].base_stat}</td></tr>
    <tr><td>Special Attack</td><td>${pokemonData.stats[3].base_stat}</td></tr>
    <tr><td>Special Defense</td><td>${pokemonData.stats[4].base_stat}</td></tr>
    <tr><td>Speed</td><td>${pokemonData.stats[5].base_stat}</td></tr>
  </table>`;
}


function showEvolution(pokemonData) {
  // Wenn die Evolution nicht verfügbar ist, kannst du eine Nachricht anzeigen.
  if (!pokemonData.evolution_chain) {
    return `<p>No evolution data available.</p>`;
  }
  
  // Beispielhafte Darstellung der Evolution (evtl. anpassen)
  return `<p>Evolution chain: To be implemented</p>`;
}

function showEvoChain(pokeData){
  return `
        <div class="evo-stage">
          <img src="${pokeData.sprites.other['official-artwork'].front_default}" alt="${name}" class="evo-img">
          <div class="evo-name">${pokeData.name}</div>
        </div>
      `
}