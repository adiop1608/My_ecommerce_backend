const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Load public key for JWT verification
const publicKey = fs.readFileSync(path.resolve(__dirname, '../public.key'), 'utf-8');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
    console.log(decoded);
    req.user = decoded // 👈 Important
    next()
  } catch (err) {
    console.error('JWT Error:', err.message)
    res.status(401).json({ error: 'Invalid token' })
  }
}

// Optional: Admin-only middleware
const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role === 'Admin') {
      next();
    }
    return res.status(403).json({ error: 'Admin access required' });
  });
};

module.exports = { auth, adminAuth };