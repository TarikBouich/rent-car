const { Facture } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const factures = await Facture.findAll({ where: { companyId: req.user.companyId } });
    res.json(factures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const facture = await Facture.findOne({
      where: { id: req.params.id, companyId: req.user.companyId }
    });
    if (!facture) return res.status(404).json({ message: 'Facture not found' });
    res.json(facture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { id, companyId, ...rest } = req.body;
    
    // Convert Dates properly if needed
    if (rest.issueDate === '') rest.issueDate = null;

    const newFactureData = {
      ...rest,
      id: id || `facture_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      companyId: req.user.companyId
    };
    
    const facture = await Facture.create(newFactureData);
    res.status(201).json(facture);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.companyId;

    if (updateData.issueDate === '') updateData.issueDate = null;

    const [updatedRows] = await Facture.update(updateData, {
      where: { id: req.params.id, companyId: req.user.companyId }
    });
    if (updatedRows === 0) return res.status(404).json({ message: 'Facture not found' });

    const updatedFacture = await Facture.findByPk(req.params.id);
    res.json(updatedFacture);
  } catch (error) {
    res.status(400).json({
      message: error.message,
      detail: error.parent?.sqlMessage || null
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const deletedCount = await Facture.destroy({
      where: { id: req.params.id, companyId: req.user.companyId }
    });
    if (deletedCount === 0) return res.status(404).json({ message: 'Facture not found' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
