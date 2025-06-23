const {
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
} = require("../services/category.service");

const createCategory = async (req, res) => {
  const { category_name } = req.body;

  if (!category_name) {
    return res.status(400).json({ message: "Thiếu category_name", EC: 1 });
  }

  const result = await createCategoryService({ category_name });
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category_name } = req.body;

  const result = await updateCategoryService(id, { category_name });
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const result = await deleteCategoryService(id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const getAllCategories = async (req, res) => {
  const { page, limit, search } = req.query;

  const result = await getAllCategoriesService({ page, limit, search });
  return res.status(result.EC === 0 ? 200 : 500).json(result);
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;

  const result = await getCategoryByIdService(id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
};
