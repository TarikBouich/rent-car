const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const queryToken = req.query?.token;
  
  // Bearer TOKEN
  const bearerToken = authHeader && authHeader.split(' ')[1];
  const token = bearerToken || queryToken;
  
  if (!token) return res.status(401).json({ message: 'Accès refusé. Token manquant.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide ou expiré.' });
    
    req.user = user; // Set payload to req.user (id, email, role, companyId)
    next();
  });
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Privilèges insuffisants pour cette action.' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole
};
