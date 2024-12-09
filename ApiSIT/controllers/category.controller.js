import { Category } from '../models/category.model.js'; // Modelo renombrado a inglés para consistencia

class CategoryController {
  // Crear una nueva categoría
  async create(req, res) {
    try {
      const { name } = req.body;

      // Validar campos obligatorios
      if (!name) {
        return res.status(400).json({ message: 'Category name is required.' });
      }

      const category = await Category.create({ name });
      res.status(201).json({
        message: `Category "${name}" created successfully.`,
        data: category,
      });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({
        message: 'Error creating category.',
        error: error.message,
      });
    }
  }

  // Actualizar una categoría existente
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({
          message: `Category with ID ${id} not found.`,
        });
      }

      category.name = name;
      await category.save();

      res.status(200).json({
        message: 'Category updated successfully.',
        data: category,
      });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({
        message: 'Error updating category.',
        error: error.message,
      });
    }
  }

  // Eliminar una categoría
  async delete(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({
          message: `Category with ID ${id} not found.`,
        });
      }

      await category.destroy();

      res.status(200).json({
        message: 'Category deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({
        message: 'Error deleting category.',
        error: error.message,
      });
    }
  }

  // Obtener todas las categorías
  async findAll(req, res) {
    try {
      const categories = await Category.findAll();
      if (!categories.length) {
        return res.status(404).json({
          message: 'No categories found.',
        });
      }
      res.status(200).json({ data: categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        message: 'Error fetching categories.',
        error: error.message,
      });
    }
  }
}

export default new CategoryController();
