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
  


//get and store data from input form 

//single pokemon display
// add a picture, name, type, moves?, stats, id, evolutions(picture & name)


