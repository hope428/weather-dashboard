var searchInput = document.getElementById("city-input");
var submitForm = document.getElementById("submit");
var cities = JSON.parse(localStorage.getItem("searchedCities")) ?? [];
var searchedCitiesEl = document.querySelector(".searched-cities");
var apiKey = "b90362aa8df79bdd8a26c1d031b51056";
var currentWeatherCard = document.getElementById("today");
var currentDay = dayjs();

//enter city to search
function search(event) {
  event.preventDefault();
  if (searchInput.value) {
    cities.push(searchInput.value);
    localStorage.setItem("searchedCities", JSON.stringify(cities));
    getCities();
    callCity(searchInput.value);
    searchInput.value = "";
  }
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

function createCurrentWeatherCard(weather) {
  currentWeatherCard.innerHTML = `<h2>${weather.name} ${currentDay.format(
    "(M/D/YYYY)"
  )}<img src="http://openweathermap.org/img/wn/${weather.imgIcon}.png"/></h2>
        <p>Temp: ${weather.temp} °F</p>
        <p>Wind: ${weather.windSpeed} MPH</p>
        <p>Humidity: ${weather.humidity}%</p>
    `;
}


function createForecastCards(forecast){

}

//creates array of 5 day forecast data
function getForecast(currentCity) {
  var fiveDayForecast = [];
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${currentCity.lat}&lon=${currentCity.lon}&appid=${apiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (let i = 0; i < 40; i += 8) {
        fiveDayForecast.push({
          date: data.list[i].dt_txt,
          temp: data.list[i].main.temp,
          wind: data.list[i].wind.speed,
          humidity: data.list[i].main.humidity,
        });
      }
      //call to create element on page
      createForecastCards(fiveDayForecast)
    });
}

//gets weather of lat and lon passed in
function getCurrentWeather(currentCity) {
  var weather = {
    name: currentCity.name,
    temp: "",
    windSpeed: "",
    humidity: "",
    imgIcon: "",
  };
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${currentCity.lat}&lon=${currentCity.lon}&appid=${apiKey}&units=imperial`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      weather.temp = data.main.temp;
      weather.windSpeed = data.wind.speed;
      weather.humidity = data.main.humidity;
      weather.imgIcon = data.weather[0].icon;
      createCurrentWeatherCard(weather);
    });
}

//invokes callCity function when any button of a previously
//searched city is clicked
function callPreviousCity(event) {
  var element = event.target;
  if (element.matches("button")) {
    callCity(event.target.textContent);
  }
}

//creates api call when city is clicked from list
function callCity(query) {
  var currentCity = {
    lat: "",
    lon: "",
    name: "",
  };
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
      getCurrentWeather(currentCity);
      getForecast(currentCity);
    });
}

getCities();
searchedCitiesEl.addEventListener("click", callPreviousCity);
submitForm.addEventListener("click", search);
