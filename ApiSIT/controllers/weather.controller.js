import { Weather } from '../models/weather.model.js'; // Renombrado del modelo para consistencia

class WeatherController {
  async upsert(req, res) {
    const weatherData = req.body;

    if (!weatherData || weatherData.length === 0) {
      return res.status(400).json({
        message: 'No weather data provided.',
      });
    }

    try {
      for (const forecast of weatherData.list) {
        const existingRecord = await Weather.findOne({
          where: { datetime: forecast.dt_txt },
        });

        const weatherInfo = {
          datetime: forecast.dt_txt,
          temperature: forecast.main.temp,
          feels_like: forecast.main.feels_like,
          humidity: forecast.main.humidity,
          description: forecast.weather[0].description,
          icon: forecast.weather[0].icon,
          wind_speed: forecast.wind.speed,
          rain: forecast.rain?.['3h'] || 0,
        };

        if (existingRecord) {
          await existingRecord.update(weatherInfo);
        } else {
          await Weather.create(weatherInfo);
        }
      }

      res.status(200).json({
        message: 'Weather data updated successfully.',
      });
    } catch (error) {
      console.error('Error upserting weather data:', error);
      res.status(500).json({
        message: `Error upserting weather data: ${error.message}`,
      });
    }
  }

  // Obtener todos los registros de clima
  async findAll(req, res) {
    try {
      const weatherData = await Weather.findAll();
      if (!weatherData.length) {
        return res.status(404).json({
          message: 'No weather records found.',
        });
      }
      res.status(200).json({ data: weatherData });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      res.status(500).json({
        message: 'Error fetching weather data.',
      });
    }
  }

  // Obtener un registro de clima por ID
  async findOne(req, res) {
    try {
      const { id } = req.params;
      const weatherRecord = await Weather.findByPk(id);

      if (!weatherRecord) {
        return res.status(404).json({
          message: `Weather record with ID ${id} not found.`,
        });
      }

      res.status(200).json({ data: weatherRecord });
    } catch (error) {
      console.error(`Error fetching weather record with ID ${id}:`, error);
      res.status(500).json({
        message: `Error fetching weather record with ID ${id}.`,
      });
    }
  }

  // Eliminar un registro de clima por ID
  async delete(req, res) {
    try {
      const { id } = req.params;
      const weatherRecord = await Weather.findByPk(id);

      if (!weatherRecord) {
        return res.status(404).json({
          message: `Weather record with ID ${id} not found.`,
        });
      }

      await weatherRecord.destroy();
      res.status(200).json({
        message: 'Weather record deleted successfully.',
      });
    } catch (error) {
      console.error(`Error deleting weather record with ID ${id}:`, error);
      res.status(500).json({
        message: `Error deleting weather record with ID ${id}.`,
      });
    }
  }
}

export default new WeatherController();
