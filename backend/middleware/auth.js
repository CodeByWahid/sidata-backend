const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization') || req.header('authorization');
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid token format' });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
};
