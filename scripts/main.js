//POKEMON NAME SEARCH

//fetch pokemon API from https://pokeapi.co/api/v2/pokemon/
document.querySelector('.search__button').addEventListener('click', getFetch)

function getFetch(){
    const search = document.querySelector('#name').value
    console.log(search)
    const url = `https://pokeapi.co/api/v2/pokemon/${search}`
  
    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
          console.log(data)
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
  }
  

//SELECTION BY POKEMON TYPES

const pokemonTypeList = document.querySelectorAll("#pokemon-type-list li")
const content = document.getElementById("pokemon-type-render")

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

//show list of pokemons after you select the type
async function listPokemonsByType(){
  clearDOM()

  //this.value comes from the value of the LI that you clicked on
  let url = `https://pokeapi.co/api/v2/type/${this.value}`
  console.log(this.value)

  fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
          let store = [...data.pokemon]
          console.log(data)
          
          //create a div template
          let divTemplate = `
            <div>
                <h3>${data.name.toUpperCase()} POKEMONS</h3>
                <ul id="pokemon-list">
                </ul>
            </div>
        ` ;
          const markup = document.createRange().createContextualFragment(divTemplate).children[0];
          content.appendChild(markup);

          
          //select the div that was created on the lines above
          const friendListUl = document.getElementById('pokemon-list');


          //create an array from the json data
          const friendElements = dataFormatter(store)
          
          friendElements.forEach((item, index) => {
            //create an event listener for every list item, ,
            item.addEventListener('click', getSelectedPokemonDetails);
            
            //then append to DOM
            friendListUl.appendChild(item)
          });
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}

function dataFormatter(data) {

  const markup = data.map(item => {
      const listTemplate = `
      <li><a href="#" data-id="${item.pokemon.url}">${item.pokemon.name} </a></li>
  `;
      return document.createRange().createContextualFragment(listTemplate).children[0];
  });
  return markup;
}

//remove the list and shows the detail of the selected pokemon
async function getSelectedPokemonDetails(e)
    {
        //console.log(e.currentTarget);


        //get data from json
        fetch(`${e.currentTarget.firstChild.dataset.id}`)
            .then(response => response.json()) //returns a promise
            .then(data => {
                let store = {...data};
                console.log(data)
                clearDOM();

                const template = `
                <div>
                    <div>
                        <img src="${store.sprites.front_default}" />
                        <h2>${store.name} </h2>
                        <ul>
                            <li>${store.stats[0]}</li>
                        </ul>
                    </div>
                    <p>
                        Weight: ${store.weight}
                    </p>
                </div>
                
                `;

                const docFragment = document.createRange().createContextualFragment(template).children[0];
                content.appendChild(docFragment);

            });
    }

//get and store data from input form 

//single pokemon display
// add a picture, name, type, moves?, stats, id, evolutions(picture & name)


