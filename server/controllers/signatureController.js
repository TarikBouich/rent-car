const { SignatureSession } = require('../models');

// Same contract as the dev-only relay in vite.config.js:
//   POST { action: CREATE | VERIFY | UPDATE | DELETE, token, pin, dataUrl }
//   GET  ?token=... -> { status, dataUrl } | null
// Sessions are persisted in MySQL and never expire by time; they only stop
// accepting a signature once status is 'signed' (or are deleted by the agency).

exports.handlePost = async (req, res) => {
  try {
    const { action, token, pin, dataUrl } = req.body || {};
    if (!token) return res.status(400).json({ error: 'token required' });

    if (action === 'CREATE') {
      if (!pin) return res.status(400).json({ error: 'pin required' });
      await SignatureSession.findOrCreate({
        where: { token },
        defaults: { token, pin: String(pin), status: 'pending', dataUrl: null }
      });
      return res.json({ success: true });
    }

    const session = await SignatureSession.findOne({ where: { token } });

    if (action === 'VERIFY') {
      if (!session || session.pin !== String(pin)) {
        return res.status(401).json({ success: false, error: 'Invalid PIN' });
      }
      return res.json({ success: true });
    }

    if (action === 'UPDATE') {
      if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
      session.status = 'signed';
      session.dataUrl = dataUrl || null;
      await session.save();
      return res.json({ success: true });
    }

    if (action === 'DELETE') {
      if (session) await session.destroy();
      return res.json({ success: true });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (error) {
    console.error('Signature POST error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getSession = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.json(null);

    const session = await SignatureSession.findOne({ where: { token } });
    if (!session) return res.json(null);

    // Never leak the PIN or internal fields.
    return res.json({ status: session.status, dataUrl: session.dataUrl });
  } catch (error) {
    console.error('Signature GET error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
