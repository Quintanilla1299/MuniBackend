import { TourEvent } from "../models/tour_event.model.js";
import { Image } from "../models/image.model.js";
import fs from "fs";
import path from "path";

class TourEventController {
  // Crear o actualizar un evento o tour
  async createOrUpdate(req, res) {
    const transaction = await TourEvent.sequelize.transaction();
    try {
      const { id } = req.params;
      const data = req.body;
      const files = req.files;
      // Validar campos obligatorios
      if (!data.name || !data.type || !data.startDate || !data.startTime || !data.location) {
        return res.status(400).json({ message: "Please provide all required fields." });
      }

      let tourEvent;

      if (id) {
        // Actualizar evento existente
        tourEvent = await TourEvent.findByPk(id, { transaction });
        if (!tourEvent) {
          return res.status(404).json({ message: "Tour event not found." });
        }
        await tourEvent.update(data, { transaction });

        // Eliminar imágenes viejas si hay nuevas
        if (files && files.length > 0) {
          const oldImages = await Image.findAll({
            where: { entity_id: id, entity_type: "tour_event" },
          });
          for (const image of oldImages) {
            const filePath = path.join("images", image.entity_type, image.filename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath); // Elimina el archivo del sistema
            }
            await image.destroy({ transaction }); // Elimina el registro de la BD
          }
        }
      } else {
        // Crear nuevo evento
        tourEvent = await TourEvent.create(data, { transaction });
      }

      // Verificar que el evento fue creado o actualizado correctamente
      if (!tourEvent) {
        throw new Error("Failed to create or fetch tour event.");
      }

      // Subir y registrar imágenes
      if (files && files.length > 0) {
        for (const file of files) {
          await Image.create(
            {
              entity_id: tourEvent.tourEventId,
              entity_type: "tour_event",
              filename: file.filename,
            },
            { transaction }
          );
        }
      }

      await transaction.commit();
      res.status(201).json({ message: "Tour event saved successfully.", data: tourEvent });
    } catch (error) {
      await transaction.rollback();
      console.error("Error in createOrUpdate:", error);
      res.status(500).json({ message: "Error saving tour event." });
    }
  }

  // Obtener todos los eventos o tours
  async findAll(req, res) {
    try {
      const tourEvents = await TourEvent.findAll({
        include: [
          {
            model: Image,
            attributes: ["image_id", "filename", "entity_type", "url"],
          },
        ],
      });
      if (!tourEvents.length) {
        return res.status(404).json({ message: "No tour events found." });
      }
      res.status(200).json({ data: tourEvents });
    } catch (error) {
      console.error("Error fetching tour events:", error);
      res.status(500).json({ message: "Error fetching tour events." });
    }
  }

  // Eliminar un evento o tour y sus imágenes
  async delete(req, res) {
    try {
      const { id } = req.params;
      const tourEvent = await TourEvent.findByPk(id);
      if (!tourEvent) {
        return res.status(404).json({ message: "Tour event not found." });
      }

      // Eliminar imágenes asociadas
      const images = await Image.findAll({
        where: { entity_id: id, entity_type: "tour_event" },
      });

      for (const image of images) {
        const filePath = path.join("images", image.entity_type, image.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Elimina el archivo del sistema
        }
        await image.destroy(); // Elimina el registro de la base de datos
      }

      // Eliminar el evento
      await tourEvent.destroy();

      res.status(200).json({
        message: "Tour event and associated images deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting tour event:", error);
      res.status(500).json({ message: "Error deleting tour event." });
    }
  }
}

export default new TourEventController();
