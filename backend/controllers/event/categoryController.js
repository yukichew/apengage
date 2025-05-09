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
  const userRole = req.user.role;
  let categories;
  let count;

  if (userRole === 'admin') {
    categories = await Category.find({}).sort({ createdAt: -1 });
    count = await Category.countDocuments();
  } else {
    categories = await Category.find({ isActive: true }).sort({
      createdAt: -1,
    });
    count = await Category.countDocuments({ isActive: true });
  }

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

exports.updateCategoryStatus = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid category id');

  const category = await Category.findById(id);
  if (!category) return sendError(res, 404, 'Category not found');

  if (action === 'activate') {
    category.isActive = true;
    await category.save();
    return res.json({ message: 'Category activated' });
  }

  if (action === 'deactivate') {
    category.isActive = false;
    await category.save();
    return res.json({ message: 'Category deactivated' });
  }

  res.status(400).json({ message: 'Invalid action' });
};
