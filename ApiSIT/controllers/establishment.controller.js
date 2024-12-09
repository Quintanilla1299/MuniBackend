import { Category } from "../models/category.model.js";
import { Establishment } from "../models/establishment.model.js";
import { Image } from "../models/image.model.js";
import { Owner } from "../models/owner.model.js";
import fs from 'fs';
import path from 'path';

class EstablishmentController {
  // Crear o actualizar un establecimiento
  async createOrUpdate(req, res) {
    const transaction = await Establishment.sequelize.transaction();
    try {
      const { id } = req.params;
      const data = req.body;
      const files = req.files;
  
      // Validar campos obligatorios
      if (!data.name || !data.address || !data.ownerId || !data.categoryId) {
        return res.status(400).json({ message: "Please provide all required fields." });
      }
  
      let establishment;
  
      if (id) {
        // Actualizar establecimiento existente
        establishment = await Establishment.findByPk(id, { transaction });
        if (!establishment) {
          return res.status(404).json({ message: "Establishment not found." });
        }
        await establishment.update(data, { transaction });
        if (id && files && files.length > 0) {
          // Elimina las imágenes viejas y sus archivos
          const oldImages = await Image.findAll({ where: { entityId: id, entityType: 'establishment' } });
          for (const image of oldImages) {
            const filePath = path.join('images', image.entityType, image.filename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath); // Elimina el archivo del sistema
            }
            await image.destroy(); // Elimina el registro de la BD
          }
        }
        
      } else {
        // Crear nuevo establecimiento
        establishment = await Establishment.create(data, { transaction });
      }
  
      // Verificar que el establecimiento fue creado o actualizado correctamente
      if (!establishment) {
        throw new Error("Failed to create or fetch establishment.");
      }
  
      // Subir y registrar imágenes
      if (files && files.length > 0) {
        for (const file of files) {
          await Image.create({
            entity_id: establishment.establishmentId,
            entity_type: "establishment",
            filename: file.filename,
          }, { transaction });
        }
      }
  
      await transaction.commit();
      res.status(201).json({ message: "Establishment saved successfully.", data: establishment });
    } catch (error) {
      await transaction.rollback();
      console.error("Error in createOrUpdate:", error);
      res.status(500).json({ message: "Error saving establishment." });
    }
  }  

  // Obtener todos los establecimientos
  async findAll(req, res) {
    try {
      const establishments = await Establishment.findAll({
        include: [
          {
            model: Image,
            attributes: ["image_id", "filename", "entity_type", "url"], // Incluye entity_type aquí
          },
          {
            model: Owner,
            as: "owner",
            attributes: ["ownerId", "name", "phoneNumber", "email"],
          },
          {
            model: Category,
            as: "category",
            attributes: ["categoryId", "name"],
          },
        ],
      });
      if (!establishments.length) {
        return res.status(404).json({ message: "No establishments found." });
      }
      res.status(200).json({ data: establishments });
    } catch (error) {
      console.error("Error fetching establishments:", error);
      res.status(500).json({ message: "Error fetching establishments." });
    }
  }

  // Eliminar un establecimiento y sus imágenes
  async delete(req, res) {
    try {
      const { id } = req.params;
      const establishment = await Establishment.findByPk(id);
      if (!establishment) {
        return res.status(404).json({ message: "Establishment not found." });
      }
  
      // Eliminar imágenes asociadas
      const images = await Image.findAll({
        where: { entity_id: id, entity_type: "establishment" },
      });
  
      for (const image of images) {
        const filePath = path.join('images', image.entity_type, image.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Elimina el archivo del sistema
        }
        await image.destroy(); // Elimina el registro de la base de datos
      }
  
      // Eliminar el establecimiento
      await establishment.destroy();
  
      res.status(200).json({
        message: "Establishment and associated images deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting establishment:", error);
      res.status(500).json({ message: "Error deleting establishment." });
    }
  }
  
}

export default new EstablishmentController();
