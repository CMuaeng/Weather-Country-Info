const searchresult = document.querySelector(".content-left");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".bx-search");
const histoBtns = document.querySelector(".histobtn");
const clearBtn = document.querySelector(".bx-trash");
const contentRight = document.getElementById("content-right");
const contentFooter = document.getElementById("content-footer"); // เพิ่มส่วน content-footer

// ฟังก์ชันสำหรับรับข้อมูลสภาพอากาศ
const getWeather = function (country) {
  const req = new XMLHttpRequest();
  req.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=bdcdf19d695a088cee97966de5d8ca23`
  );
  req.send();

  req.addEventListener("load", function () {
    const data = JSON.parse(this.responseText);
    const weather = data.weather[0].description;
    const temperatureKelvin = data.main.temp;
    const temperatureCelsius = temperatureKelvin - 273.15;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const windSpeedKmh = (windSpeed * 3.6).toFixed(2);

    // กำหนดไอคอนสภาพอากาศตามข้อมูลที่ได้รับ
    let weatherIconSrc;

    switch (weather) {
      case "clear sky":
        weatherIconSrc = "./img wether/sun.png";
        break;
      case "overcast clouds":
        weatherIconSrc = "./img wether/over cloudy.png";
        break;
      case "broken clouds":
        weatherIconSrc = "./img wether/clouds.png";
        break;
      case "scattered clouds":
        weatherIconSrc = "./img wether/cloudy.png";
        break;
      case "rain":
        weatherIconSrc = "./img wether/rain.png";
        break;
      case "light intensity shower rain":
        weatherIconSrc = "./img wether/storm.png";
        break;
      case "heavy intensity rain":
        weatherIconSrc = "./img wether/heavy-rain.png";
        break;
      case "moderate rain":
        weatherIconSrc = "./img wether/storm.png";
        break;
      case "light rain":
        weatherIconSrc = "./img wether/light-rain.png";
        break;
      case "snow":
        weatherIconSrc = "./img wether/snowflake.png";
        break;
      case "light snow":
        weatherIconSrc = "./img wether/snowflake.png";
        break;
      case "few clouds":
        weatherIconSrc = "./img wether/cloudy.png";
        break;
      default:
        weatherIconSrc = "cloud.png";
    }

    // สร้าง HTML เพื่อแสดงข้อมูลสภาพอากาศ
    const html = `
    <div class="weather__card">
    <img src="${weatherIconSrc}" class="weather_icon" />
    <p class="weather_row">${weather}</p>
    <p class="weather_row">Temperature: ${temperatureCelsius.toFixed(2)}°C</p>
    <p class="weather_row">Humidity: ${humidity}%</p>
    <p class="weather_row">Wind Speed: ${windSpeedKmh} km/h</p>
    </div>
    `;
    // เลือก element ที่เกี่ยวข้องแล้วแทรก HTML เพื่อแสดงข้อมูลสภาพอากาศ
    const countryElement = document.querySelector(
      `.country[data-name="${country}"]`
    );
    countryElement.querySelector(".country_weather");
    contentRight.innerHTML = "";
    contentRight.insertAdjacentHTML("beforeend", html);
  });
};

// ฟังก์ชันสำหรับรับข้อมูลพยากรณ์อากาศ
const getForecast = function (country) {
  const req = new XMLHttpRequest();
  req.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/forecast?q=${country}&appid=bdcdf19d695a088cee97966de5d8ca23`
  );
  req.send();

  req.addEventListener("load", function () {
    const data = JSON.parse(this.responseText);
    const forecasts = data.list.slice(0, 5);
    // รับข้อมูลพยากรณ์อากาศและสร้าง HTML เพื่อแสดงข้อมูล
    forecasts.forEach((forecast, index) => {
      const forecastTime = new Date(forecast.dt * 1000);
      const forecastWeather = forecast.weather[0].description;
      const forecastTemperatureKelvin = forecast.main.temp;
      const forecastTemperatureCelsius = forecastTemperatureKelvin - 273.15;

      const html = `
        <div class="forecast">
          <h4 class="forecast_title">Forecast ${index + 1}</h4>
          <p class="forecast_time">${forecastTime.toLocaleDateString()}, ${forecastTime.toLocaleTimeString()}</p>
          <p class="forecast_weather">${forecastWeather}</p>
          <p class="forecast_temperature">Temperature: ${forecastTemperatureCelsius.toFixed(
            2
          )}°C</p>
        </div>
      `;

      contentFooter.insertAdjacentHTML("beforeend", html);
    });
  });
};

// ฟังก์ชันสำหรับรับข้อมูลประเทศ
const getCountry = function (country) {
  const req = new XMLHttpRequest();
  req.open("GET", `https://restcountries.com/v3.1/name/${country}`);
  req.send();

  req.addEventListener("load", function () {
    const [data] = JSON.parse(this.responseText);
    const lang = Object.entries(data.languages);
    const curr = Object.values(data.currencies).map(
      (currency) => `${currency.name} (${currency.symbol})`
    );

    const html = `
      <article class="country" data-name="${data.name.common}">
        <img src="${data.flags.png}" class="country_img" />
        <div class="country_data">
          <h3 class="country_name">${data.name.common}</h3>
          <h4 class="country_region">${data.region}</h4>
          <p class="country_row"><span>🙋</span>${data.population}</p>
          <p class="country_row"><span>💬</span>${lang[0][1]}</p>
          <p class="country_row"><span>💰</span>${curr}</p>
        </div>
        <div class="country_weather"></div>
      </article>
    `;
    searchresult.insertAdjacentHTML("beforeend", html);
    getWeather(data.name.common);
    getForecast(data.name.common); // เรียกใช้ฟังก์ชัน getForecast เพื่อรับข้อมูลพยากรณ์อากาศ
  });
};

searchButton.addEventListener("click", function () {
  const countryName = searchInput.value.trim();
  if (countryName) {
    searchresult.innerHTML = "";
    contentRight.innerHTML = "";
    contentFooter.innerHTML = ""; // เพิ่มบรรทัดนี้เพื่อล้างข้อมูล forecast เมื่อมีการค้นหาประเทศใหม่
    getCountry(countryName);
  }
});
// ล้างข้อมูลเก่าที่แสดงออกทั้งหมด
clearBtn.addEventListener("click", function () {
  searchresult.innerHTML = "";
  contentRight.innerHTML = "";
  contentFooter.innerHTML = ""; // เพิ่มบรรทัดนี้เพื่อล้างข้อมูล forecast เมื่อกดปุ่ม clear
});

const countries = new Set();

searchButton.addEventListener("click", function () {
  const countryName = searchInput.value.trim();
  if (countryName) {
    if (countries.size >= 4) {
      const oldestCountry = Array.from(countries.values())[0];
      countries.delete(oldestCountry);
    }
    countries.add(countryName);
    updatehistoButtons();
  }
});
// ฟังก์ชันสำหรับการอัปเดตปุ่มประวัติการค้นหา
function updatehistoButtons() {
  histoBtns.innerHTML = "";
  countries.forEach((countryName) => {
    const btn = document.createElement("button");
    btn.classList.add("histo_btn");
    btn.textContent = countryName;
    histoBtns.appendChild(btn);
    btn.addEventListener("click", function () {
      searchresult.innerHTML = "";
      contentRight.innerHTML = "";
      contentFooter.innerHTML = ""; // เพิ่มบรรทัดนี้เพื่อล้างข้อมูล forecast เมื่อคลิกปุ่มประเทศในประวัติการค้นหา
      getCountry(countryName);
    });
  });
}

updatehistoButtons(); // อัปเดตปุ่มประวัติการค้นหาเมื่อโหลดหน้าเว็บ
