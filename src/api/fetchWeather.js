import axios from "axios";

const URL = "https://api.weatherapi.com/v1/current.json";
const API_KEY = "42032ea81fa140ef88b113752251801";

// Delay for api to display loading message:
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchWeather = async (cityName) => {
  await delay(1000);
  const { data } = await axios.get(URL, {
    params: {
      q: cityName,
      key: API_KEY,
    },
  });

  return data;
};
