var searchInput = document.getElementById('city-input')
var submitForm = document.getElementById('submit')
var cities = JSON.parse(localStorage.getItem('searchedCities')) ?? []
var searchedCitiesEl = document.querySelector('.searched-cities')

function search(event){
    event.preventDefault()
    cities.push(searchInput.value)
    localStorage.setItem('searchedCities', JSON.stringify(cities))
    searchInput.value = ""
}

function getCities(){
    for(let i = 0; i < cities.length; i++){
        var cityBtn = document.createElement('button')
        cityBtn.classList.add("btn", "btn-dark", "w-100")
        cityBtn.textContent = cities[i]
        searchedCitiesEl.appendChild(cityBtn)
    }
}

function callCity(event){
    var element = event.target
    if(element.matches('button')){
        console.log(element.textContent)
    }
}

getCities()
searchedCitiesEl.addEventListener('click', callCity)
submitForm.addEventListener('click', search)