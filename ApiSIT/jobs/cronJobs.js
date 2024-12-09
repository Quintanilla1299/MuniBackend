import nodeCron from "node-cron";
import OpenWeather from "../utils/openWeather.js";
import WeatherController from "../controllers/weather.controller.js"; // Importa el controlador directamente

const openWeather = new OpenWeather();

const job = nodeCron.schedule(
  "0 */3 * * *", // Ejecutar cada 3 horas
  async function getWeatherJob() {
    try {
      const weatherData = await openWeather.getWeather();

      if (!weatherData || !weatherData.list || weatherData.list.length === 0) {
        console.log("No se recibieron datos del clima de la API.");
        return;
      }

      // Llama al método del controlador directamente para almacenar los datos
      await WeatherController.upsert(
        { body: weatherData }, // Pasa los datos en el formato esperado por el controlador
        {
          status: (statusCode) => ({
            json: (message) =>
              console.log(`Status: ${statusCode}, Message:`, message),
          }),
        }
      );

      console.log("Datos del clima actualizados correctamente.");
    } catch (err) {
      console.log(
        `Error al obtener o actualizar los datos del clima: ${err.message}`
      );
    }
  }
);

export default job;
