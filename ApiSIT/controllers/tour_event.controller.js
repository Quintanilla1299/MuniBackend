import { TourEvent } from '../models/tour_event.model.js';
import { Image } from '../models/image.model.js';
import fs from 'fs';
import path from 'path';

class TourEventController {
  // Crear o actualizar un evento o tour
  async createOrUpdate(req, res) {
    const transaction = await TourEvent.sequelize.transaction();
    try {
      const { id } = req.params;
      const data = req.body;
      const files = req.files;
  
      // Validar campos obligatorios
      if (!data.type || !data.name || !data.startDate || !data.startTime || !data.location) {
        return res.status(400).json({ message: "Please provide all required fields." });
      }
  
      let tourEvent;
  
      if (id) {
        // Actualizar evento existente
        tourEvent = await TourEvent.findByPk(id, { transaction });
        if (!tourEvent) {
          return res.status(404).json({ message: "Tour or event not found." });
        }
        await tourEvent.update(data, { transaction });
        if (id && files && files.length > 0) {
          // Elimina las imágenes viejas y sus archivos
          const oldImages = await Image.findAll({ where: { entityId: id, entityType:'tourevent'} });
          for (const image of oldImages) {
            const filePath = path.join('images', image.entityType, image.filename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath); // Elimina el archivo del sistema
            }
            await image.destroy(); // Elimina el registro de la BD
          }
        }
        
      } else {
        // Crear nuevo evento
        tourEvent = await TourEvent.create(data, { transaction });
      }
  
      // Manejo de imágenes
      if (files && files.length > 0) {
        for (const file of files) {
          await Image.create({
            entityId: tourEvent.id,
            entityType: "tourevent",
            filename: file.filename,
          }, { transaction });
        }
      }
  
      await transaction.commit();
      res.status(201).json({ message: "Tour or event saved successfully.", data: tourEvent });
    } catch (error) {
      await transaction.rollback();
      console.error("Error in createOrUpdate:", error);
      res.status(500).json({ message: "Error saving tour or event." });
    }
  }
  

  // Obtener todos los eventos o tours
  async findAll(req, res) {
    try {
      const events = await TourEvent.findAll({
        include: [
          {
            model: Image,
            attributes: ["imageId", "filename", "url"], // Incluye la URL generada
          },
        ],
      });
      if (!events.length) {
        return res.status(404).json({ message: "No tours or events found." });
      }
      res.status(200).json({ data: events });
    } catch (error) {
      console.error("Error fetching tours or events:", error);
      res.status(500).json({ message: "Error fetching tours or events." });
    }
  }
  

  // Subir imágenes de un evento o tour
  async uploadImages(req, res) {
    try {
      const tourEventId = req.params.id;
      const files = req.files;

      const tourEvent = await TourEvent.findByPk(tourEventId);
      if (!tourEvent) {
        return res.status(404).json({ message: 'Tour or event not found.' });
      }

      if (files && files.length > 0) {
        try {
          for (const file of files) {
            await Image.create({
              entityId: tourEventId,
              entityType: 'TourEvent',
              filename: file.filename,
            });
          }
          res.status(200).json({ message: 'Images uploaded successfully.' });
        } catch (imageError) {
          console.error('Error saving images:', imageError);
          res.status(500).json({ message: 'Failed to save images.', error: imageError.message });
        }
      } else {
        res.status(400).json({ message: 'No images uploaded.' });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }

  // Eliminar un evento o tour
  async delete(req, res) {
    try {
      const { id } = req.params;
      const tourEvent = await TourEvent.findByPk(id);
      if (!tourEvent) {
        return res.status(404).json({ message: 'Tour or event not found.' });
      }
  
      // Eliminar imágenes asociadas
      const images = await Image.findAll({
        where: { entityId: id, entityType: 'tourevent' },
      });
  
      for (const image of images) {
        const filePath = path.join('images', image.entityType, image.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Elimina el archivo del sistema
        }
        await image.destroy(); // Elimina el registro de la base de datos
      }
  
      // Eliminar el evento turístico
      await tourEvent.destroy();
  
      res.status(200).json({
        message: 'Tour or event and associated images deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting tour or event:', error);
      res.status(500).json({ message: 'Error deleting tour or event.' });
    }
  }
  
}

export default new TourEventController();
