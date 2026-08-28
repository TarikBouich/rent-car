const companyClients = new Map();

function register(companyId, res) {
  if (!companyClients.has(companyId)) {
    companyClients.set(companyId, new Set());
  }
  const clients = companyClients.get(companyId);
  clients.add(res);

  return () => {
    const target = companyClients.get(companyId);
    if (!target) return;
    target.delete(res);
    if (target.size === 0) {
      companyClients.delete(companyId);
    }
  };
}

function broadcast(companyId, payload) {
  const clients = companyClients.get(companyId);
  if (!clients || clients.size === 0) return;

  const body = `data: ${JSON.stringify(payload)}\n\n`;

  for (const res of clients) {
    try {
      res.write(body);
    } catch (_error) {
      clients.delete(res);
    }
  }

  if (clients.size === 0) {
    companyClients.delete(companyId);
  }
}

module.exports = {
  register,
  broadcast
};
