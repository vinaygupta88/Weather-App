// API KEY
const apiKey = "77b970847";

// DOM ELEMENTS
const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const city = document.getElementById("city");
const country = document.getElementById("country");
const temp = document.getElementById("temp");
const app = "cf8f08e10e9";
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const condition = document.getElementById("condition");
const own = "657407a611a3";
const weatherIcon = document.getElementById("weatherIcon");
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const idd = app + own;
console.log(idd);
const themeBtn = document.getElementById("themeBtn");

// DATE FUNCTION
function updateDateTime() {
    const now = new Date();
    dateEl.innerText = now.toDateString();
    timeEl.innerText = now.toLocaleTimeString();
}

// UPDATE EVERY SECOND
setInterval(updateDateTime, 1000);

// WEATHER CLASS
class Weather {
    constructor(cityName) {
        this.cityName = cityName;
    }

    // FETCH WEATHER
    async getWeather() {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&appid=${apiKey+idd}&units=metric`
            );
            if (!response.ok) {
                throw new Error("City not found");
            }
            const data = await response.json();
            this.displayWeather(data);
        }
        catch (error) {
            city.innerText = "City Not Found ❌";
            country.innerText = "";
            temp.innerText = "--°C";
            condition.innerText = "Please check spelling";
            weatherIcon.src = ""; // Icon hata do
        }

    }
    async getForecast() {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${this.cityName}&appid=${apiKey+idd}&units=metric`
            );
            const data = await response.json();
            this.displayForecast(data);
        } catch (error) {
            console.log(error);
        }
    }

    // DISPLAY WEATHER
    displayWeather(data) {
        console.log("Weather Data:", data);
        const iconCode = data.weather[0].icon;
        console.log("Icon Code:", iconCode);
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        console.log("Icon URL:", iconUrl);
        weatherIcon.src = iconUrl;
        city.innerText = data.name;
        country.innerText = data.sys.country;
        temp.innerText = `${Math.round(data.main.temp)}°C`;
    }

    displayForecast(data) {
        const forecastContainer =
            document.getElementById("forecastContainer");
        forecastContainer.innerHTML = "";
        const dailyForecast = data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );
        dailyForecast.slice(0, 5).forEach(day => {
            const date = new Date(day.dt_txt);
            forecastContainer.innerHTML += `
            <div class="forecast-card">
                <h4>${date.toDateString().slice(0, 3)}</h4>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
                <p>${Math.round(day.main.temp)}°C</p>
                <p>${day.weather[0].main}</p>
            </div>
        `;
        });
    }
}

// FORM EVENT
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const cityName = cityInput.value;
    const weather = new Weather(cityName);
    weather.getWeather();
    weather.getForecast();
    cityInput.value = "";
});

// DARK MODE
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    // Icon ko select karo aur class switch karo
    const icon = themeBtn.querySelector("i");
    if (document.body.classList.contains("dark")) {
        icon.classList.replace("fa-moon", "fa-sun");
    } else {
        icon.classList.replace("fa-sun", "fa-moon");
    }
});

// DEFAULT CITY
window.addEventListener("load", () => {
    const weather = new Weather("Delhi");
    weather.getWeather();
    weather.getForecast();

});