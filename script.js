const apiObject = {
    baseUrl: "https://api.openweathermap.org/data/2.5/weather",
    apiKey: "f0c5c84628242e5efbc85e1eb471aa63"
}

let getWeatherBtn = document.getElementById("btn");
let outputSection = document.getElementById("output-section");

getWeatherBtn.addEventListener("click", () => {
    let city = document.getElementById("city").value;
    if (validateInputField(city)) {
        let url = `${apiObject.baseUrl}?q=${city}&appid=${apiObject.apiKey}`;
        // console.log(url);
        fetch(url)
        .then(response => {
            // console.log("then with response");
            // console.log(response);
            return response.json();
        })
        .then(data => {
            // console.log("then with actual data");
            // console.log(data);
            extractData(data);
        })
        .catch(() => {
            // console.log("in catch");
            outputSection.style.display = "inline-block";
            outputSection.innerHTML = `<p><strong>Internet connection lost or something went wrong!</strong></p>`;
        });
    }
});

function validateInputField(city) {
    if (city.trim() == "") {
        outputSection.style.display = "inline-block";
        outputSection.innerHTML = `<p><strong>Please enter city.</strong></p>`;
        return false;
    }
    return true;
}

function extractData(data) {
    // console.log("in extractData() function");
    if (data != undefined) {
        let code = data.cod;
        switch (code) {
            case '400':
                outputSection.style.display = "inline-block";
                outputSection.innerHTML = `<p><strong>Please enter city.</strong></p>`;
                break;

            case '404':
                outputSection.style.display = "inline-block";
                outputSection.innerHTML = `<p><strong>${data.message}.</strong></p>`;
                break;
            
            case 200:
                let cityName = data.name;
                let temp = convertKelvinToCelcius(data.main.temp);
                let minTemp = convertKelvinToCelcius(data.main.temp_min);
                let maxTemp = convertKelvinToCelcius(data.main.temp_max);
                let weather = data.weather[0].main;
                let weatherDesc = data.weather[0].description;
                let weatherIcon = data.weather[0].icon;
                let iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
                outputSection.style.display = "inline-block";
                outputSection.innerHTML =
                `<div>
                    <h2>Weather in ${cityName}</h2>
                    <img src="${iconUrl}" alt="${weatherDesc}" />
                    <p><strong>Temperature:</strong> ${temp} &deg;C</p>
                    <p><strong>Min. Temperature:</strong> ${minTemp} &deg;C</p>
                    <p><strong>Max. Temperature:</strong> ${maxTemp} &deg;C</p>
                    <p><strong>Weather:</strong> ${weather}</p>
                    <p><strong>Condition:</strong> ${weatherDesc}</p>
                </div>`;
                // console.log(`City: ${cityName}, Temperature: ${temp} C, Weather: ${weather}, Description: ${weatherDesc}`);
                break;
        
            default:
                // console.log("in default section");
                break;
        }
    } else {
        outputSection.style.display = "inline-block";
        outputSection.innerHTML = `<p><strong>Not able to fetch data. Please try again!</strong></p>`
    }
}

function convertKelvinToCelcius(temp) {
    celsiusTemp = temp - 273.15;
    return Math.round(celsiusTemp);
}