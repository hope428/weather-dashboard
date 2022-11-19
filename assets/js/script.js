var searchInput = document.getElementById("city-input");
var submitForm = document.getElementById("submit");
var cities = JSON.parse(localStorage.getItem("searchedCities")) ?? [];
var searchedCitiesEl = document.querySelector(".searched-cities");
var apiKey = "b90362aa8df79bdd8a26c1d031b51056";

//enter city to search
function search(event) {
  event.preventDefault();
  cities.push(searchInput.value);
  localStorage.setItem("searchedCities", JSON.stringify(cities));
  searchInput.value = "";
  getCities();
}

//creates list of past searched cities
function getCities() {
  searchedCitiesEl.innerHTML = "";
  for (let i = 0; i < cities.length; i++) {
    var cityBtn = document.createElement("button");
    cityBtn.classList.add("btn", "btn-dark", "w-100");
    cityBtn.textContent = cities[i];
    searchedCitiesEl.appendChild(cityBtn);
  }
}

//creates api call when city is clicked from list
function callCity(event) {
  var element = event.target;
  var query;
  var currentCity = {
    lat: "",
    lon: "",
    name: "",
  };
  if (element.matches("button")) {
    query = element.textContent;
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${apiKey}`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        currentCity.lat = data[0].lat;
        currentCity.lon = data[0].lon;
        currentCity.name = data[0].name;
      });
  }
}

getCities();
searchedCitiesEl.addEventListener("click", callCity);
submitForm.addEventListener("click", search);
