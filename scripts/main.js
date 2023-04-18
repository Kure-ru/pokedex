//POKEMON NAME SEARCH

//fetch pokemon API from https://pokeapi.co/api/v2/pokemon/
const searchButton = document.querySelector(".search__button");
searchButton.addEventListener("click", fetchPokemonData);

async function fetchPokemonData() {
  const search = document.querySelector("#name").value;
  const requestPkm = await fetch(`https://pokeapi.co/api/v2/pokemon/${search}`);
  const data = await requestPkm.json();

  const requestSpecie = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${search}`
  );
  const speciesData = await requestSpecie.json();

  const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
  const evolutionData = await evolutionChainResponse.json();

  let evolutions = [evolutionData.chain.species.name];
  let currentEvolution = evolutionData.chain;

  while (currentEvolution.evolves_to.length > 0) {
    currentEvolution = currentEvolution.evolves_to[0];
    evolutions.push(currentEvolution.species.name);
  }

  displayPokemonData(data, evolutions);
}

function displayPokemonData(data, evolutions) {
  console.log(data);
  //pokemon container
  let pokemonContainer = document.querySelector("#pokemon__container");
  //name
  let pokemonName = document.createElement("h1");
  pokemonName.textContent = data.name;
  //id
  let pokemonId = document.createElement("p");
  pokemonId.textContent = `#${data.id}`;

  //img
  let pokemonPic = document.createElement("img");
  pokemonPic.src = data.sprites.front_default;

  //type
  let pokemonType = document.createElement("p");
  pokemonType.textContent = data.types[0].type.name;

  //stats
  let statsList = document.createElement("ul");
  data.stats.forEach((stat) => {
    let statItem = document.createElement("li");
    statItem.textContent = `${stat.stat.name} : ${stat.base_stat}`;
    statsList.appendChild(statItem);
  });
  //stats
  let abilitiesList = document.createElement("ul");
  data.abilities.forEach((ability) => {
    let abilityItem = document.createElement("li");
    abilityItem.textContent = ability.ability.name;
    abilitiesList.appendChild(abilityItem);
  });

  //evolutions
  const evolutionContainer = document.createElement("div");

  evolutions.forEach(async (pokemon) => {
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon}`
    );
    const pokemonData = await pokemonResponse.json();

    const pokemonName = document.createElement("p");
    pokemonName.textContent = pokemonData.name;

    const pokemonImage = document.createElement("img");
    pokemonImage.src = pokemonData.sprites.front_default;

    evolutionContainer.appendChild(pokemonName);
    evolutionContainer.appendChild(pokemonImage);
  });

  // Clear previous search results
  pokemonContainer.innerHTML = "";
  //append to container
  pokemonContainer.appendChild(pokemonName);
  pokemonContainer.appendChild(pokemonId);
  pokemonContainer.appendChild(pokemonPic);
  pokemonContainer.appendChild(pokemonType);
  pokemonContainer.appendChild(abilitiesList);
  pokemonContainer.appendChild(statsList);
  pokemonContainer.appendChild(evolutionContainer);
}

//get and store data from input form

//single pokemon display
// add a picture, name, type, moves?, stats, id, evolutions(picture & name)
