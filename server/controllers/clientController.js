const { Client, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const clients = await Client.findAll({ where: { companyId: req.user.companyId } });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const client = await Client.findOne({
      where: { id: req.params.id, companyId: req.user.companyId }
    });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { id, companyId, ...rest } = req.body;
    const requester = await User.findByPk(req.user.id);

    // Force non-admin users to create clients only in their own agency
    let agencyId = rest.agencyId;
    if (requester && requester.role !== 'admin' && requester.role !== 'superadmin') {
      agencyId = requester.agencyId || null;
    }

    const newClientData = {
      ...rest,
      agencyId,
      id: id || `client_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      companyId: req.user.companyId
    };
    const client = await Client.create(newClientData);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.companyId;

    // Normalize empty date inputs for MySQL DATE columns
    const dateFields = ['birthDate', 'cnieIssueDate', 'cnieExpiryDate'];
    for (const field of dateFields) {
      if (updateData[field] === '' || updateData[field] === 'Invalid date') {
        updateData[field] = null;
      }
    }

    // Normalize empty agency value
    if (updateData.agencyId === '') {
      updateData.agencyId = null;
    }

    const [updatedRows] = await Client.update(updateData, {
      where: { id: req.params.id, companyId: req.user.companyId }
    });
    if (updatedRows === 0) return res.status(404).json({ message: 'Client not found' });

    const updatedClient = await Client.findByPk(req.params.id);
    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({
      message: error.message,
      detail: error.parent?.sqlMessage || null
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const deletedCount = await Client.destroy({
      where: { id: req.params.id, companyId: req.user.companyId }
    });
    if (deletedCount === 0) return res.status(404).json({ message: 'Client not found' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
