import fs from 'fs';
import path from 'path';
import { SecurityService } from '../models/security_service.model.js';
import { Image } from '../models/image.model.js';

class SecurityServiceController {
  // Crear o actualizar un servicio de seguridad
  async createOrUpdate(req, res) {
    const transaction = await SecurityService.sequelize.transaction();
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

      let securityService;

      if (id) {
        // Actualizar servicio existente
        securityService = await SecurityService.findByPk(id, { transaction });
        if (!securityService) {
          return res.status(404).json({ message: 'Security service not found.' });
        }
        await securityService.update(data, { transaction });

        // Eliminar imágenes viejas si hay nuevas
        if (files && files.length > 0) {
          const oldImages = await Image.findAll({
            where: { entity_id: id, entity_type: 'security_service' },
          });
          for (const image of oldImages) {
            const filePath = path.join('images', image.entity_type, image.filename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath); // Elimina el archivo del sistema
            }
            await image.destroy({ transaction }); // Elimina el registro de la BD
          }
        }
      } else {
        // Crear nuevo servicio
        securityService = await SecurityService.create(data, { transaction });
      }

      // Verificar que el servicio fue creado o actualizado correctamente
      if (!securityService) {
        throw new Error('Failed to create or update security service.');
      }

      // Subir y registrar imágenes
      if (files && files.length > 0) {
        for (const file of files) {
          await Image.create(
            {
              entity_id: securityService.securityServiceId,
              entity_type: 'security_service',
              filename: file.filename,
              url: `/images/security_service/${file.filename}`, // Ruta pública para acceso a imágenes
            },
            { transaction }
          );
        }
      }

      await transaction.commit();
      res.status(201).json({
        message: 'Security service saved successfully.',
        data: securityService,
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error in createOrUpdate:', error);
      res.status(500).json({ message: 'Error saving security service.' });
    }
  }

  // Obtener todos los servicios de seguridad
  async findAll(req, res) {
    try {
      const securityServices = await SecurityService.findAll({
        include: [
          {
            model: Image,
            attributes: ['image_id', 'filename', 'entity_type', 'url'],
          },
        ],
      });

      if (!securityServices.length) {
        return res.status(404).json({ message: 'No security services found.' });
      }

      res.status(200).json({ data: securityServices });
    } catch (error) {
      console.error('Error fetching security services:', error);
      res.status(500).json({ message: 'Error fetching security services.' });
    }
  }

  // Eliminar un servicio de seguridad
  async delete(req, res) {
    try {
      const { id } = req.params;
      const securityService = await SecurityService.findByPk(id);
      if (!securityService) {
        return res.status(404).json({ message: 'Security service not found.' });
      }

      // Eliminar imágenes asociadas
      const images = await Image.findAll({
        where: { entity_id: id, entity_type: 'security_service' },
      });

      for (const image of images) {
        const filePath = path.join('images', image.entity_type, image.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Elimina el archivo del sistema
        }
        await image.destroy(); // Elimina el registro de la base de datos
      }

      // Eliminar el servicio de seguridad
      await securityService.destroy();

      res.status(200).json({
        message: 'Security service and associated images deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting security service:', error);
      res.status(500).json({ message: 'Error deleting security service.' });
    }
  }
}

export default new SecurityServiceController();
