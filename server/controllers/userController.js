const { User } = require('../models');

const resolveCompanyId = async (req) => {
  if (req.user?.companyId) return req.user.companyId;
  if (!req.user?.id) return null;
  const requester = await User.findByPk(req.user.id, { attributes: ['companyId'] });
  return requester?.companyId || null;
};

exports.getAll = async (req, res) => {
  try {
    const companyId = await resolveCompanyId(req);
    if (!companyId) return res.status(403).json({ message: 'Company context missing for current user' });
    const users = await User.findAll({ where: { companyId } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const companyId = await resolveCompanyId(req);
    if (!companyId) return res.status(403).json({ message: 'Company context missing for current user' });
    const user = await User.findOne({ 
      where: { id: req.params.id, companyId } 
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const companyId = await resolveCompanyId(req);
    if (!companyId) return res.status(403).json({ message: 'Company context missing for current user' });
    const newUserData = { ...req.body, companyId };
    
    // Auto-generate ID if not provided
    if (!newUserData.id) {
      newUserData.id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    }

    // Auto-generate aggregated name if not provided
    if (!newUserData.name && newUserData.firstName && newUserData.lastName) {
      newUserData.name = `${newUserData.firstName} ${newUserData.lastName}`;
    }

    const user = await User.create(newUserData);
    res.status(201).json(user);
  } catch (error) {
    console.error("DEBUG_USER_CREATE:", error);
    res.status(400).json({ message: error.message, stack: error.stack });
  }
};

exports.update = async (req, res) => {
  try {
    const companyId = await resolveCompanyId(req);
    if (!companyId) return res.status(403).json({ message: 'Company context missing for current user' });
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.companyId;

    // Auto-update aggregated name
    if (updateData.firstName && updateData.lastName && !updateData.name) {
      updateData.name = `${updateData.firstName} ${updateData.lastName}`;
    }

    const [updatedRows] = await User.update(updateData, {
      where: { id: req.params.id, companyId }
    });
    
    if (updatedRows === 0) return res.status(404).json({ message: 'User not found' });
    
    const updatedUser = await User.findByPk(req.params.id);
    res.json(updatedUser);
  } catch (error) {
    console.error("DEBUG_USER_UPDATE:", error);
    res.status(400).json({ message: error.message, stack: error.stack });
  }
};

exports.delete = async (req, res) => {
  try {
    const companyId = await resolveCompanyId(req);
    if (!companyId) return res.status(403).json({ message: 'Company context missing for current user' });
    const deletedCount = await User.destroy({
      where: { id: req.params.id, companyId }
    });
    if (deletedCount === 0) return res.status(404).json({ message: 'User not found' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
