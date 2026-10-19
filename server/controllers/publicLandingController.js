const { Agency, Car, User, Brand, CarModel, AppState } = require('../models');

const PUBLIC_CAR_FIELDS = [
  'id',
  'name',
  'brandId',
  'modelId',
  'year',
  'seats',
  'color',
  'fuelType',
  'transmission',
  'category',
  'pricePerDay',
  'status',
  'image',
  'images',
  'agencyId'
];

const findByIds = async (Model, ids, attributes) => {
  if (!ids.length) return [];
  return Model.findAll({ where: { id: ids }, attributes });
};

exports.getLanding = async (req, res) => {
  try {
    const agency = await Agency.findOne({ where: { id: req.params.agencyId } });
    if (!agency) return res.status(404).json({ message: 'Agency not found' });

    const companyId = agency.get('companyId');
    if (!companyId) return res.status(404).json({ message: 'Agency not found' });

    const [cars, staffCount, manager, stateRow] = await Promise.all([
      Car.findAll({
        where: { agencyId: agency.id, companyId },
        attributes: PUBLIC_CAR_FIELDS,
        order: [['createdAt', 'ASC']]
      }),
      User.count({ where: { agencyId: agency.id, companyId } }),
      agency.gerantId
        ? User.findOne({
            where: { id: agency.gerantId, companyId },
            attributes: ['id', 'firstName', 'lastName', 'name']
          })
        : null,
      AppState.findOne({ where: { companyId, key: `agency_landing_${agency.id}` } })
    ]);

    if (!stateRow || !stateRow.value) {
      return res.status(404).json({ message: 'Landing page not published' });
    }

    let config;
    try {
      config = JSON.parse(stateRow.value);
    } catch (error) {
      return res.status(500).json({ message: 'Invalid landing configuration' });
    }

    const brandIds = [...new Set(cars.map(car => car.brandId).filter(Boolean))];
    const modelIds = [...new Set(cars.map(car => car.modelId).filter(Boolean))];

    const [brands, models] = await Promise.all([
      findByIds(Brand, brandIds, ['id', 'name']),
      findByIds(CarModel, modelIds, ['id', 'name'])
    ]);

    const managerName = manager
      ? ([manager.firstName, manager.lastName].filter(Boolean).join(' ') || manager.name || '')
      : '';

    res.json({
      agency: {
        id: agency.id,
        name: agency.name,
        ville: agency.ville,
        location: agency.location,
        address: agency.address,
        phone: agency.phone,
        email: agency.email,
        if: agency.if,
        rc: agency.rc,
        patente: agency.patente,
        ice: agency.ice,
        documents: agency.documents,
        status: agency.status
      },
      cars,
      brands,
      models,
      staffCount,
      managerName,
      config
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
