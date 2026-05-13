const crypto = require('crypto');
const User   = require('../models/User');

let admin = null;
try { admin = require('../firebaseAdmin'); } catch {}

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];

    let uid, email, name;

    if (admin) {
      // Production: cryptographic verification using Firebase public keys
      const decoded = await admin.auth().verifyIdToken(token);
      uid   = decoded.uid;
      email = decoded.email;
      name  = decoded.name;
    } else {
      // Dev fallback: decode JWT payload without signature verification
      // ⚠️  NOT secure — only acceptable without FIREBASE_PRIVATE_KEY in local dev
      const parts = token.split('.');
      if (parts.length !== 3) return res.status(401).json({ error: 'Invalid token format' });
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
      uid   = payload.user_id || payload.sub;
      email = payload.email;
      name  = payload.name;
    }

    if (!uid) return res.status(401).json({ error: 'Invalid token' });

    // Look up user by Firebase UID
    let user = await User.findOne({ firebaseUid: uid });

    if (!user && email) {
      // Legacy user created via email/password route — link their Firebase UID
      user = await User.findOne({ email });
      if (user && !user.firebaseUid) {
        user.firebaseUid = uid;
        await user.save();
      }
    }

    if (!user) {
      // First Firebase login — auto-create a minimal profile
      const base = (name || email?.split('@')[0] || uid.slice(0, 8))
        .replace(/[^a-zA-Z0-9_]/g, '_')
        .slice(0, 18);
      const username = `${base}_${uid.slice(0, 5)}`;
      user = await User.create({
        firebaseUid: uid,
        email:       email || `${uid}@firebase.local`,
        username,
        country:     'Other',
        password:    crypto.randomBytes(32).toString('hex'),
      });
    }

    if (!user.isActive) return res.status(401).json({ error: 'Account suspended' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

exports.requireResolver = (req, res, next) => {
  if (!req.user || !['admin', 'resolver'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Resolver access required' });
  }
  next();
};

exports.requireKYC = (req, res, next) => {
  if (!req.user || req.user.kyc?.status !== 'approved') {
    return res.status(403).json({ error: 'KYC approval required to place bets' });
  }
  next();
};
