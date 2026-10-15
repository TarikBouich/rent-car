const { Company, AppState } = require('../models');
const SUPERADMIN_COMPANY_ID = 'COMP-SUPERADMIN';
const SUPPORT_CONTACT_KEY = 'support_contact_info';

exports.getAll = async (req, res) => {
  try {
    const companies = await Company.findAll();
    // Assuming superadmins can see all, but normal users can only see their own
    if (req.user.role === 'superadmin') {
      res.json(companies);
    } else {
      res.json(companies.filter(c => c.id === req.user.companyId));
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    let company = await Company.findByPk(req.params.id);

    if (!company && req.params.id === SUPERADMIN_COMPANY_ID && req.user.role === 'superadmin') {
      company = await Company.create({
        id: SUPERADMIN_COMPANY_ID,
        name: 'SuperAdmin System',
        email: 'superadmin@rentcar.com',
        planId: 'entreprise',
        status: 'active'
      });
    }

    if (!company) return res.status(404).json({ message: 'Company not found' });
    
    // Security check
    if (req.user.role !== 'superadmin' && req.user.companyId !== company.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createTenantAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Forbidden - superadmin role required' });
    }

    const { companyId, email, password, name } = req.body;

    if (!companyId || !email || !password) {
      return res.status(400).json({ message: 'companyId, email, and password are required' });
    }

    const { User } = require('../models');

    // Check if company exists
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create tenant admin user
    const userId = `usr_${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const defaultModules = [
      'Tableau de bord', 'Agences', 'Clients', 'Voitures', 'Visites Techniques',
      'Assurances', 'Entretiens', 'Tâches', 'Contrats', 'Réservations',
      'Factures', 'Accidents', 'Versements', 'Financements', 'Traites', 'Comptabilité',
      'Statistiques', 'Rapports généraux', 'Employés', 'Paramètres'
    ];
    const permissionsMap = {};
    defaultModules.forEach(mod => { permissionsMap[mod] = true });

    const user = await User.create({
      id: userId,
      name: name || `Admin ${company.name}`,
      email,
      password,
      role: 'admin',
      companyId,
      agencyId: null,
      permissions: permissionsMap,
      isActive: true
    });

    res.status(201).json({
      message: 'Tenant admin user created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        companyId: user.companyId,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error creating tenant admin:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    // Only superadmin or the company's admin can update
    if (req.user.role !== 'superadmin' && req.user.companyId !== req.params.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const updateData = { ...req.body };
    delete updateData.id;

    let [updatedRows] = await Company.update(updateData, {
      where: { id: req.params.id }
    });
    
    if (updatedRows === 0 && req.params.id === SUPERADMIN_COMPANY_ID && req.user.role === 'superadmin') {
      await Company.create({
        id: SUPERADMIN_COMPANY_ID,
        name: 'SuperAdmin System',
        email: updateData.email || 'superadmin@rentcar.com',
        planId: 'entreprise',
        status: updateData.status || 'active'
      });
      updatedRows = 1;
    }

    if (updatedRows === 0) return res.status(404).json({ message: 'Company not found' });
    
    const updatedCompany = await Company.findByPk(req.params.id);
    res.json(updatedCompany);
  } catch (error) {
    console.error("DEBUG_COMPANY_UPDATE:", error);
    res.status(400).json({ message: error.message, stack: error.stack });
  }
};

exports.getSupportContact = async (req, res) => {
  try {
    const stateRow = await AppState.findOne({
      where: {
        companyId: SUPERADMIN_COMPANY_ID,
        key: SUPPORT_CONTACT_KEY
      }
    });

    if (stateRow?.value) {
      try {
        const parsed = JSON.parse(stateRow.value);
        if (parsed?.email) {
          return res.json({
            email: parsed.email,
            phone: parsed.phone || '',
            companyId: SUPERADMIN_COMPANY_ID
          });
        }
      } catch (e) {
        console.error('Failed parsing support contact state:', e);
      }
    }

    const supportCompany = await Company.findByPk(SUPERADMIN_COMPANY_ID);
    if (!supportCompany) {
      return res.json({
        email: 'superadmin@rentcar.com',
        phone: '',
        companyId: SUPERADMIN_COMPANY_ID
      });
    }

    return res.json({
      email: supportCompany.email || 'superadmin@rentcar.com',
      phone: supportCompany.phone || '',
      companyId: supportCompany.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSupportContact = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const email = (req.body?.email || '').trim();
    const phone = (req.body?.phone || '').trim();

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    await AppState.upsert({
      companyId: SUPERADMIN_COMPANY_ID,
      key: SUPPORT_CONTACT_KEY,
      value: JSON.stringify({ email, phone })
    });

    const [supportCompany] = await Company.findOrCreate({
      where: { id: SUPERADMIN_COMPANY_ID },
      defaults: {
        id: SUPERADMIN_COMPANY_ID,
        name: 'SuperAdmin System',
        email,
        planId: 'entreprise',
        status: 'active'
      }
    });

    // Keep company email aligned for compatibility with old screens.
    await supportCompany.update({ email });

    // Best-effort: persist phone on Company if column exists in current schema.
    try {
      await supportCompany.update({ phone });
    } catch (schemaError) {
      console.warn('Company.phone not available yet, using app_state only:', schemaError.message);
    }

    return res.json({
      email,
      phone: phone || '',
      companyId: supportCompany.id
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
