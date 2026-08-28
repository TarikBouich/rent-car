const { CarModel, Car } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const models = await CarModel.findAll();
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getByBrand = async (req, res) => {
  try {
    const models = await CarModel.findAll({ where: { brandId: req.params.brandId } });
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const model = await CarModel.create(req.body);
    res.status(201).json(model);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.id;

    const [updatedRows] = await CarModel.update(updateData, {
      where: { id: req.params.id }
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Model not found' });
    }

    const updatedModel = await CarModel.findByPk(req.params.id);
    res.json(updatedModel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const linkedCarsCount = await Car.count({ where: { modelId: req.params.id } });
    if (linkedCarsCount > 0) {
      return res.status(409).json({
        message: 'Impossible de supprimer ce modèle car des voitures y sont encore liées.'
      });
    }

    const deletedCount = await CarModel.destroy({ where: { id: req.params.id } });
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Model not found' });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
