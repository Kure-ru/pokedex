//POKEMON NAME SEARCH

//fetch pokemon API from https://pokeapi.co/api/v2/pokemon/
const errorMessage = document.getElementById('error-message')

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

//SELECTION BY POKEMON TYPES
const pokemonTypeList = document.querySelectorAll("#pokemon-type-list li")
const content = document.getElementById("pokemon-filtered-by-type")

//adds event listener to every list in UL element
for(let i = 0; i < pokemonTypeList.length; i++)
{
  pokemonTypeList[i].addEventListener('click', listPokemonsByType)
}

//if the list of pokemons - filtered by type - exist, remove them
function clearDOM(){
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
}

//show list of pokemons after you click on a specific
async function listPokemonsByType(){
  clearDOM()

  //this.value comes from the value of the LI that you clicked on
  let url = `https://pokeapi.co/api/v2/type/${this.value}`
  console.log(this.value)

  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data.pokemon) //this is array of objects

      //create a HTML div template and lists
      generateMarkupForPokemonFilteredByType(data);
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}

//function to generate HTML
function generateMarkupForPokemonFilteredByType(data){
  let divTemplate = `
            <div>
                <h3>${data.name.toUpperCase()} POKEMONS</h3>
                <ul id="pokemon-list">
                </ul>
            </div>
        ` ;
  const markup = document.createRange().createContextualFragment(divTemplate).children[0];
  content.appendChild(markup);

  //select the div that was created on divTemplate
  const pokemonListUl = document.getElementById('pokemon-list');

  //create an array from the json data
  const pokemonLi = data.pokemon.map(item => {
    const listTemplate = `<li><a href="#" data-id="${item.pokemon.url}">${item.pokemon.name} </a></li>`;
    return document.createRange().createContextualFragment(listTemplate).children[0];
  });

  pokemonLi.forEach((item, index) => {
    //create an event listener for every list item, ,
    item.addEventListener('click', getSelectedPokemonDetails);

    //then append to DOM
    pokemonListUl.appendChild(item)
  });
}

//remove the list and shows the detail of the selected pokemon
async function getSelectedPokemonDetails(e){
  //console.log(e.currentTarget);
  console.log(e.currentTarget.firstChild.dataset.id)

  //this is duplicate with fetchPokemonData() with some changes
  
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

    //single pokemon display
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



