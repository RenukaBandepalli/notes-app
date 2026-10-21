const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;   // looks like: "Bearer eyJhbGci..."

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised, no token' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;     // remember who this is
    next();                      // let the request continue
  } catch (err) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};