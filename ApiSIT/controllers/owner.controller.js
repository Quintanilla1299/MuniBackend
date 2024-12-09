import { Owner } from '../models/owner.model.js'; // Modelo renombrado a inglés para consistencia

class OwnerController {
  // Crear un nuevo propietario
  async create(req, res) {
    try {
      const { name, phoneNumber, email } = req.body;

      // Validar campos obligatorios
      if (!name || !phoneNumber || !email) {
        return res.status(400).json({
          message: 'Name, phone number, and email are required fields.',
        });
      }

      const owner = await Owner.create({
        name,
        phoneNumber,
        email,
      });

      res.status(201).json({
        message: `Owner "${name}" created successfully.`,
        data: owner,
      });
    } catch (error) {
      console.error('Error creating owner:', error);
      res.status(500).json({
        message: 'Error creating owner.',
        error: error.message,
      });
    }
  }

  // Actualizar un propietario existente
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, phoneNumber, email } = req.body;

      const owner = await Owner.findByPk(id);
      if (!owner) {
        return res.status(404).json({
          message: `Owner with ID ${id} not found.`,
        });
      }

      owner.name = name;
      owner.phoneNumber = phoneNumber;
      owner.email = email;
      await owner.save();

      res.status(200).json({
        message: 'Owner updated successfully.',
        data: owner,
      });
    } catch (error) {
      console.error('Error updating owner:', error);
      res.status(500).json({
        message: 'Error updating owner.',
        error: error.message,
      });
    }
  }

  // Eliminar un propietario
  async delete(req, res) {
    try {
      const { id } = req.params;

      const owner = await Owner.findByPk(id);
      if (!owner) {
        return res.status(404).json({
          message: `Owner with ID ${id} not found.`,
        });
      }

      await owner.destroy();

      res.status(200).json({
        message: 'Owner deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting owner:', error);
      res.status(500).json({
        message: 'Error deleting owner.',
        error: error.message,
      });
    }
  }

  // Obtener todos los propietarios
  async findAll(req, res) {
    try {
      const owners = await Owner.findAll();
      if (!owners.length) {
        return res.status(404).json({
          message: 'No owners found.',
        });
      }

      res.status(200).json({ data: owners });
    } catch (error) {
      console.error('Error fetching owners:', error);
      res.status(500).json({
        message: 'Error fetching owners.',
        error: error.message,
      });
    }
  }
}

export default new OwnerController();
