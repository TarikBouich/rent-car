const { AppState } = require('../models');
const stateEventHub = require('../services/stateEventHub');

exports.getAll = async (req, res) => {
  try {
    const keysParam = req.query.keys;
    const where = { companyId: req.user.companyId };
    if (keysParam) {
      where.key = String(keysParam)
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);
    }

    const rows = await AppState.findAll({ where });
    const state = {};
    rows.forEach(r => {
      state[r.key] = r.value;
    });
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getByKey = async (req, res) => {
  try {
    const row = await AppState.findOne({
      where: {
        companyId: req.user.companyId,
        key: req.params.key
      }
    });
    // A missing key is normal on first use (the client falls back to its default).
    // Return 200 with value:null instead of 404 so the console stays clean.
    res.json({ key: req.params.key, value: row ? row.value : null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.upsert = async (req, res) => {
  try {
    const key = req.params.key;
    const value = req.body?.value == null ? null : String(req.body.value);
    const companyId = req.user.companyId;

    const existing = await AppState.findOne({
      where: { companyId, key }
    });

    if (existing) {
      existing.value = value;
      await existing.save();
      stateEventHub.broadcast(companyId, {
        type: 'state_updated',
        key,
        companyId,
        updatedAt: new Date().toISOString()
      });
      return res.json({ key: existing.key, value: existing.value });
    }

    const created = await AppState.create({
      companyId,
      key,
      value
    });
    stateEventHub.broadcast(companyId, {
      type: 'state_updated',
      key,
      companyId,
      updatedAt: new Date().toISOString()
    });
    res.status(201).json({ key: created.key, value: created.value });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const deleted = await AppState.destroy({
      where: {
        companyId,
        key: req.params.key
      }
    });
    if (deleted === 0) return res.status(404).json({ message: 'State key not found' });
    stateEventHub.broadcast(companyId, {
      type: 'state_deleted',
      key: req.params.key,
      companyId,
      updatedAt: new Date().toISOString()
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.stream = async (req, res) => {
  const companyId = req.user.companyId;
  if (!companyId) {
    return res.status(403).json({ message: 'Company context missing for stream' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  if (res.flushHeaders) res.flushHeaders();

  res.write(`data: ${JSON.stringify({ type: 'connected', companyId, at: new Date().toISOString() })}\n\n`);

  const unregister = stateEventHub.register(companyId, res);
  const heartbeat = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: 'heartbeat', at: new Date().toISOString() })}\n\n`);
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    unregister();
  });
};
