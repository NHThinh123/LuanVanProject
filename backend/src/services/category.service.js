const Category = require("../models/category.model");

const createCategoryService = async (categoryData) => {
  try {
    const { category_name } = categoryData;

    // Kiểm tra tên danh mục đã tồn tại chưa
    const existingCategory = await Category.findOne({ category_name });
    if (existingCategory) {
      return { message: "Tên danh mục đã tồn tại", EC: 1 };
    }

    // Tạo danh mục mới
    const category = await Category.create({ category_name });
    return {
      message: "Tạo danh mục thành công",
      EC: 0,
      data: category,
    };
  } catch (error) {
    console.error("Error in createCategoryService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const updateCategoryService = async (id, categoryData) => {
  try {
    const { category_name } = categoryData;

    // Kiểm tra danh mục có tồn tại không
    const category = await Category.findById(id);
    if (!category) {
      return { message: "Danh mục không tồn tại", EC: 1 };
    }

    // Kiểm tra tên danh mục mới có trùng không
    if (category_name) {
      const existingCategory = await Category.findOne({
        category_name,
        _id: { $ne: id },
      });
      if (existingCategory) {
        return { message: "Tên danh mục đã tồn tại", EC: 1 };
      }
    }

    // Cập nhật danh mục
    category.category_name = category_name || category.category_name;
    await category.save();

    return {
      message: "Cập nhật danh mục thành công",
      EC: 0,
      data: category,
    };
  } catch (error) {
    console.error("Error in updateCategoryService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const deleteCategoryService = async (id) => {
  try {
    // Kiểm tra danh mục có tồn tại không
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return { message: "Danh mục không tồn tại", EC: 1 };
    }

    return {
      message: "Xóa danh mục thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in deleteCategoryService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getAllCategoriesService = async (query) => {
  try {
    const { page = 1, limit = 10, search } = query;
    const filter = {};

    // Tìm kiếm theo tên danh mục nếu có
    if (search) {
      filter.category_name = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    // Lấy danh sách danh mục
    const categories = await Category.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Category.countDocuments(filter);

    return {
      message: "Lấy danh sách danh mục thành công",
      EC: 0,
      data: {
        categories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error in getAllCategoriesService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getCategoryByIdService = async (id) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      return { message: "Danh mục không tồn tại", EC: 1 };
    }

    return {
      message: "Lấy thông tin danh mục thành công",
      EC: 0,
      data: category,
    };
  } catch (error) {
    console.error("Error in getCategoryByIdService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
};
