const Category = require('../../models/event/category');

exports.createCategory = async (req, res) => {
  const { name, desc } = req.body;

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
