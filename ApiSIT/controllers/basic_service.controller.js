import fs from 'fs';
import path from 'path';
import { BasicService } from '../models/basic_service.model.js';
import { Image } from '../models/image.model.js';

class BasicServiceController {
  // Crear o actualizar un servicio básico
  async createOrUpdate(req, res) {
    const transaction = await BasicService.sequelize.transaction();
    try {
      const { id } = req.params;
      const data = req.body;
      const files = req.files;

      // Validar campos obligatorios
      if (!data.name || !data.description || !data.phoneNumber) {
        return res.status(400).json({
          message: 'Name, description, and phone number are required fields.',
        });
      }

      let basicService;

      if (id) {
        // Actualizar servicio existente
        basicService = await BasicService.findByPk(id, { transaction });
        if (!basicService) {
          return res.status(404).json({ message: 'Basic service not found.' });
        }
        await basicService.update(data, { transaction });

        // Eliminar imágenes viejas si hay nuevas
        if (files && files.length > 0) {
          const oldImages = await Image.findAll({ where: { entityId: id, entityType: 'basicservice' } });
          for (const image of oldImages) {
            const filePath = path.join('images', image.entityType, image.filename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath); // Elimina el archivo del sistema
            }
            await image.destroy({ transaction }); // Elimina el registro de la BD
          }
        }
      } else {
        // Crear nuevo servicio
        basicService = await BasicService.create(data, { transaction });
      }

      // Subir y registrar nuevas imágenes
      if (files && files.length > 0) {
        for (const file of files) {
          await Image.create({
            entityId: basicService.id,
            entityType: 'basicservice',
            filename: file.filename,
          }, { transaction });
        }
      }

      await transaction.commit();
      res.status(201).json({
        message: 'Basic service saved successfully.',
        data: basicService,
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error in createOrUpdate:', error);
      res.status(500).json({ message: 'Error saving basic service.' });
    }
  }

  // Obtener todos los servicios básicos
  async findAll(req, res) {
    try {
      const basicServices = await BasicService.findAll({
        include: [
          {
            model: Image,
            attributes: ['imageId', 'filename', 'url'], // Incluir la URL generada
          },
        ],
      });

      if (!basicServices.length) {
        return res.status(404).json({ message: 'No basic services found.' });
      }

      res.status(200).json({ data: basicServices });
    } catch (error) {
      console.error('Error fetching basic services:', error);
      res.status(500).json({ message: 'Error fetching basic services.' });
    }
  }

  // Eliminar un servicio básico y sus imágenes
  async delete(req, res) {
    try {
      const { id } = req.params;
      const basicService = await BasicService.findByPk(id);
      if (!basicService) {
        return res.status(404).json({ message: 'Basic service not found.' });
      }

      // Eliminar imágenes asociadas
      const images = await Image.findAll({ where: { entityId: id, entityType: 'basicservice' } });
      for (const image of images) {
        const filePath = path.join('images', image.entityType, image.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Elimina el archivo del sistema
        }
        await image.destroy(); // Elimina el registro de la base de datos
      }

      // Eliminar el servicio básico
      await basicService.destroy();

      res.status(200).json({
        message: 'Basic service and associated images deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting basic service:', error);
      res.status(500).json({ message: 'Error deleting basic service.' });
    }
  }
}

export default new BasicServiceController();
