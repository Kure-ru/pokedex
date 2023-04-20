//pokemon container
const pokemonContainer = document.querySelector("#pokemon__container");
const pokemonTypeList = document.querySelectorAll("#pokemon-type-list li");
const pokemonFilteredByType = document.getElementById(
  "pokemon-filtered-by-type"
);

//POKEMON NAME SEARCH

//fetch pokemon API from https://pokeapi.co/api/v2/pokemon/
const errorMessage = document.getElementById("error-message");

const searchButton = document.querySelector(".search__button");
searchButton.addEventListener("click", fetchPokemonData);

async function fetchPokemonData() {
  //TODO: error message if wrong input
  const search = document.querySelector("#name").value;
  try {
    //fetch basic data based on pokemon name
    const requestPkm = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${search}`
    );
    const data = await requestPkm.json();
    //fetch pokemon specie
    const requestSpecie = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${search}`
    );
    const speciesData = await requestSpecie.json();
    //fetch evolution chain
    const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionData = await evolutionChainResponse.json();

    let evolutions = [evolutionData.chain.species.name];
    let currentEvolution = evolutionData.chain;

    while (currentEvolution.evolves_to.length > 0) {
      currentEvolution = currentEvolution.evolves_to[0];
      evolutions.push(currentEvolution.species.name);
    }
    displayPokemonData(data, evolutions);
  } catch (err) {
    //display error message
    errorMessage.textContent = `${err}`;
  }
}

//////////////////////////////////DUPLICATE

//remove the list and shows the detail of the selected pokemon
async function getSelectedPokemonDetails(e) {
  //console.log(e.currentTarget);
  console.log(e.currentTarget.firstChild.dataset.id);

  //this is duplicate with fetchPokemonData() with some changes!!!!!

  const requestPkm = await fetch(e.currentTarget.firstChild.dataset.id);
  const data = await requestPkm.json();

  const requestSpecie = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${data.species.name}`
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

  //the code is a duplicate with fetchPokemonData() with some change... need to edit?
}
///////////////////////////////DUPLICATE END

//if the list of pokemons - filtered by type - exist, remove them
function clearDOM(divToClear) {
  while (divToClear.firstChild) {
    divToClear.removeChild(divToClear.firstChild);
  }
}

//SELECTION BY POKEMON TYPES

//adds event listener to every list in UL element
for (let i = 0; i < pokemonTypeList.length; i++) {
  pokemonTypeList[i].addEventListener("click", listPokemonsByType);
}

//show list of pokemons after you click on a specific
async function listPokemonsByType() {
  clearDOM(pokemonContainer);
  clearDOM(pokemonFilteredByType);

  //this.value comes from the value of the LI that you clicked on
  let url = `https://pokeapi.co/api/v2/type/${this.value}`;
  console.log(this.value);

  fetch(url)
    .then((res) => res.json()) // parse response as JSON
    .then((data) => {
      console.log(data.pokemon); //this is array of objects
      //create a HTML div template and lists
      generateMarkupForPokemonFilteredByType(data);
    })
    .catch((err) => {
      //display error message
      errorMessage.textContent = `${err}`;
    });
}

//function to generate HTML
function generateMarkupForPokemonFilteredByType(data) {
  let divTemplate = `
            <div>
                <h3>${data.name.toUpperCase()} POKEMONS</h3>
                <ul id="pokemon-list">
                </ul>
            </div>
        `;
  const markup = document.createRange().createContextualFragment(divTemplate)
    .children[0];
  pokemonFilteredByType.appendChild(markup);

  //select the div that was created on divTemplate
  const pokemonListUl = document.getElementById("pokemon-list");

  //create an array from the json data
  const pokemonLi = data.pokemon.map((item) => {
    const listTemplate = `<li><a href="#" data-id="${item.pokemon.url}">${item.pokemon.name} </a></li>`;
    return document.createRange().createContextualFragment(listTemplate)
      .children[0];
  });

  pokemonLi.forEach((item, index) => {
    //create an event listener for every list item, ,
    item.addEventListener("click", getSelectedPokemonDetails);

    //then append to DOM
    pokemonListUl.appendChild(item);
  });
}
//single pokemon display
function displayPokemonData(data, evolutions) {
  let pokemonTemplate = `
  <div>
    <div class="left-container">
      <img src="">
      <h2>${data.name}</h2>
      <span>#${data.id}</span>
      <span>${data.types[0].type.name}</span>
    </div>

    <div class="right-container">
    <h4>stats</h4>
      <ul id="stats-list"> 
      </ul>
      <h4>abilities</h4>
      <ul id="abilities-list"> 
      </ul>
    </div>

    <div>
      <h4>EVOLUTIONS</h4>
      <div id="evolution-container"></div>
    </div>
  </div>
  `;
  const markup = document
    .createRange()
    .createContextualFragment(pokemonTemplate).children[0];
  pokemonContainer.appendChild(markup);

  //display pkm stats
  data.stats.map((stat) => {
    const statsTemplate = `<li>${stat.stat.name} ${stat.base_stat}</li>`;
    document
      .querySelector("#stats-list")
      .insertAdjacentHTML("beforeend", statsTemplate);
  });

  //display pkm abilities
  data.abilities.map((ability) => {
    const abilitiesTemplate = `<li>${ability.ability.name}</li>`;
    console.log(abilitiesTemplate);
    document
      .querySelector("#abilities-list")
      .insertAdjacentHTML("beforeend", abilitiesTemplate);
  });

  //evolutions
  const evolutionContainer = document.querySelector("#evolution-container");
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
  pokemonContainer.appendChild(evolutionContainer);
}

//get and store data from input form
