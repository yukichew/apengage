const { isValidObjectId } = require('mongoose');
const { sendError } = require('../../helpers/error');
const Category = require('../../models/event/category');

exports.createCategory = async (req, res) => {
  const { name, desc } = req.body;

  const category = await Category.findOne({ name });
  if (category) {
    return res.status(400).json({ error: 'Category name already exists' });
  }

  const newCategory = new Category({
    name,
    desc,
  });

  await newCategory.save();

  res.json({
    category: {
      id: newCategory._id,
      name: newCategory.name,
      desc: newCategory.desc,
    },
  });
};

exports.updateCategory = async (req, res) => {
  const { name, desc } = req.body;
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid category id');

  const category = await Category.findById(id);
  if (!category) return sendError(res, 404, 'Category not found');

  category.name = name;
  category.desc = desc;

  await category.save();

  res.json({
    category: {
      id: category._id,
      name: category.name,
      desc: category.desc,
    },
  });
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid category id');

  const category = await Category.findById(id);
  if (!category) return sendError(res, 404, 'Category not found');

  await Category.findByIdAndDelete(id);

  res.json({ message: 'Category deleted' });
};

exports.getCategories = async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 });
  const count = await Category.countDocuments();
  res.json({
    categories: categories.map((category) => {
      return {
        id: category._id,
        name: category.name,
        desc: category.desc,
        status: category.isActive ? 'Active' : 'Inactive',
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      };
    }),
    count,
  });
};

exports.getCategory = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid category id');

  const category = await Category.findById(id);
  if (!category) return sendError(res, 404, 'Category not found');

  res.json({
    category: {
      id: category._id,
      name: category.name,
      desc: category.desc,
      status: category.isActive ? 'Active' : 'Inactive',
    },
  });
};

exports.searchCategory = async (req, res) => {
  const { name } = req.query;

  const result = await Category.find({
    name: { $regex: name, $options: 'i' },
  });

  res.json({
    categories: result.map((category) => {
      return {
        id: category._id,
        name: category.name,
        desc: category.desc,
        status: category.isActive ? 'Active' : 'Inactive',
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      };
    }),
  });
};
