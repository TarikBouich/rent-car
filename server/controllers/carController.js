const { Car } = require('../models');

const DATE_FIELDS = [
  'circulationDate',
  'visiteTechniqueEndDate',
  'assuranceEndDate',
  'autorisationEndDate',
  'saleDate',
  'withdrawalAuthDate',
  'creditStartDate'
];

const normalizeCarPayload = (payload = {}) => {
  const data = { ...payload };

  DATE_FIELDS.forEach((field) => {
    const value = data[field];
    if (value === '' || value === undefined) {
      data[field] = null;
      return;
    }
    if (value === null) return;
    const t = new Date(value).getTime();
    if (!Number.isFinite(t)) {
      data[field] = null;
    }
  });

  return data;
};

exports.getAll = async (req, res) => {
  try {
    // SECURITY: Only fetch cars that belong to the user's company
    const cars = await Car.findAll({ where: { companyId: req.user.companyId } });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const car = await Car.findOne({ 
      where: { 
        id: req.params.id, 
        companyId: req.user.companyId // Isolation
      } 
    });
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const normalized = normalizeCarPayload(req.body);
    const { id, companyId, ...rest } = normalized;
    const newCarData = { 
      ...rest,
      id: id || `car_${Date.now()}`,
      companyId: req.user.companyId
    };
    
    const car = await Car.create(newCarData);
    res.status(201).json(car);
  } catch (error) {
    console.error('DEBUG_CAR_CREATE:', error.message, error.parent?.sqlMessage);
    res.status(400).json({ message: error.message, detail: error.parent?.sqlMessage });
  }
};

exports.update = async (req, res) => {
  try {
    const sanitized = normalizeCarPayload(req.body);
    const [updatedRows] = await Car.update(sanitized, {
      where: { id: req.params.id, companyId: req.user.companyId }
    });
    if (updatedRows === 0) return res.status(404).json({ message: 'Car not found or unauthorized' });
    
    const updatedCar = await Car.findByPk(req.params.id);
    res.json(updatedCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deletedCount = await Car.destroy({
      where: { id: req.params.id, companyId: req.user.companyId }
    });
    if (deletedCount === 0) return res.status(404).json({ message: 'Car not found or unauthorized' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
