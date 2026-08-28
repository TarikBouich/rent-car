const { Brand, CarModel } = require('../models');

// We share brands across all tenants, so there is no companyId filter here
exports.getAll = async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json(brand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.id;

    const [updatedRows] = await Brand.update(updateData, {
      where: { id: req.params.id }
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    const updatedBrand = await Brand.findByPk(req.params.id);
    res.json(updatedBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    // Cascade delete: remove all models assigned to this brand first
    await CarModel.destroy({ where: { brandId: req.params.id } });

    const deletedCount = await Brand.destroy({ where: { id: req.params.id } });
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
