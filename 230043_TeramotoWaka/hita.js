// OpenWeatherMap API settings
const API_KEY_WEATHER = '9fc4dc1d51045f1b567e15ec6a7928f2'; // Replace with your own API key
const CITY = 'Hita,JP'; // Target city (Hita, Japan)
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

const WEATHER_URL = `${BASE_URL}weather?q=${CITY}&appid=${API_KEY_WEATHER}&units=metric`;
const FORECAST_URL = `${BASE_URL}forecast?q=${CITY}&appid=${API_KEY_WEATHER}&units=metric`;

// Function to get current date and time
function getCurrentDateTime() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

// Function to map weather descriptions to Japanese
function translateWeatherToJapanese(weather) {
    const weatherMap = {
        Clear: '晴れ',
        Clouds: '曇り',
        Rain: '雨',
        Drizzle: '霧雨',
        Thunderstorm: '雷雨',
        Snow: '雪',
        Mist: '霧',
        Smoke: '煙',
        Haze: 'もや',
        Dust: 'ほこり',
        Fog: '霧',
        Sand: '砂嵐',
        Ash: '火山灰',
        Squall: 'スコール',
        Tornado: '竜巻',
    };
    return weatherMap[weather] || '不明';
}

// Function to fetch and display weather data
async function fetchWeather() {
    try {
        // Current weather
        const weatherResponse = await fetch(WEATHER_URL);
        if (!weatherResponse.ok) {
            throw new Error('現在の天気データの取得に失敗しました。');
        }
        const weatherData = await weatherResponse.json();

        // Forecast data (for precipitation probability)
        const forecastResponse = await fetch(FORECAST_URL);
        if (!forecastResponse.ok) {
            throw new Error('予報データの取得に失敗しました。');
        }
        const forecastData = await forecastResponse.json();
        const pop = forecastData.list[0].pop || 0; // Precipitation probability (from the first forecast entry)

        const datetime = getCurrentDateTime();
        const weather = weatherData.weather[0].main; // Weather (in English)
        const weatherJapanese = translateWeatherToJapanese(weather); // Weather (translated to Japanese)
        const tempMax = weatherData.main.temp_max; // Maximum temperature
        const tempMin = weatherData.main.temp_min; // 最低気温


        // Display data in HTML
        document.getElementById('weather').innerHTML = `
            <p>日時: ${datetime}</p>
            <p>天気: ${weatherJapanese} (${weather})</p>
            <p>最高気温: ${tempMax}℃</p>
            <p>降水確率: ${(pop * 100).toFixed(1)}%</p>
        `;
    } catch (error) {
        document.getElementById('weather').innerHTML = `<p>エラー: ${error.message}</p>`;
        console.error(error);
    }
}

// Execute the function
fetchWeather();
