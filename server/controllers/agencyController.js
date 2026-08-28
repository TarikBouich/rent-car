const { Agency } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const agencies = await Agency.findAll({ where: { companyId: req.user.companyId } });
    res.json(agencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const agency = await Agency.findOne({ 
      where: { id: req.params.id, companyId: req.user.companyId } 
    });
    if (!agency) return res.status(404).json({ message: 'Agency not found' });
    res.json(agency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newAgency = { ...req.body, companyId: req.user.companyId };
    const agency = await Agency.create(newAgency);
    res.status(201).json(agency);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.companyId;

    const [updatedRows] = await Agency.update(updateData, {
      where: { id: req.params.id, companyId: req.user.companyId }
    });
    if (updatedRows === 0) return res.status(404).json({ message: 'Agency not found' });
    
    const updatedAgency = await Agency.findByPk(req.params.id);
    res.json(updatedAgency);
  } catch (error) {
    console.error("DEBUG_AGENCY_UPDATE:", error);
    res.status(400).json({ message: error.message, stack: error.stack });
  }
};

exports.delete = async (req, res) => {
  try {
    const deletedCount = await Agency.destroy({
      where: { id: req.params.id, companyId: req.user.companyId }
    });
    if (deletedCount === 0) return res.status(404).json({ message: 'Agency not found' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
