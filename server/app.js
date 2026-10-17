const express = require('express');
const cors = require('cors');

const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const brandRoutes = require('./routes/brandRoutes');
const modelRoutes = require('./routes/modelRoutes');
const agencyRoutes = require('./routes/agencyRoutes');
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const clientRoutes = require('./routes/clientRoutes');
const stateRoutes = require('./routes/stateRoutes');
const factureRoutes = require('./routes/factureRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/agencies', agencyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/state', stateRoutes);
app.use('/api/factures', factureRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

module.exports = { app, sequelize };
