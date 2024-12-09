import axios from "axios";

class OpenWheater {
  constructor() {
    this.apiKey = "60544bf0351cb363d087a64f2eeab484";
    this.lat = "11.0708272";
    this.long = "-85.6306396";
    this.baseUrl = `https://api.openweathermap.org/data/2.5/`;
  }

  async getWeather() {
    try {
      const response = await axios.get(`${this.baseUrl}forecast`, {
        params: {
          lat: this.lat,
          lon: this.long,
          units:'metric',
          appid:this.apiKey,
          lang:'sp'
        },
      });
      return response.data;
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }
}
export default OpenWheater;
