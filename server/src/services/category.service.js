const { Category, MovieCategory } = require("../models/index");

class CategoryService {
  static async getCategory() {
    try {
      const categories = Category.findAll();
      return categories;
    } catch (error) {
      throw error;
    }
  }
  static async getCategoryById(id) {
    try {
      const category = Category.findByPk(id);
      return category;
    } catch (error) {
      throw error;
    }
  }
  static async getCategoryMoive(id) {
    try {
      const movieCategories = await MovieCategory.findAll({where: {movieId: id}});
      const categoryIds = movieCategories.map(mc => mc.categoryId);
      const categories = await Category.findAll({where: {id: categoryIds}});
      return categories;
    } catch (error) {
      throw error;
    }
  }
  static async createCategory(data, movieId) {
    try {
    const checkid = await this.getCategoryById(data.id);
    if (checkid) {
        return await MovieCategory.create({
            movieId,
            categoryId: checkid.id,
          });
    }
      const newCategory = await Category.create(data);

      if (!newCategory) throw new Error("Cannot create category");

      await MovieCategory.create({
        movieId,
        categoryId: newCategory.id,
      });

      return newCategory;
    } catch (error) {
      throw error;
    }
  }
  static async updateCategory(categoryId, data) {
    try {
      const category = await Category.findByPk(categoryId);
      if (category) {
        await Category.update(data, {
          where: { id: categoryId },
        });
        return data;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = CategoryService;
