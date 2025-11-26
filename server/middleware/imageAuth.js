import crypto from 'crypto';

const SECRET_KEY = process.env.IMAGE_SECRET_KEY || 'your-secret-key-change-this-in-production';
const TOKEN_EXPIRY = 60000; // 60 seconds

// Generate a temporary token for image access
export function generateImageToken(imageId) {
  const timestamp = Date.now();
  const data = `${imageId}-${timestamp}`;
  const signature = crypto.createHmac('sha256', SECRET_KEY)
    .update(data)
    .digest('hex');
  
  return `${timestamp}.${signature}`;
}

// Verify token middleware
export function verifyImageToken(req, res, next) {
  const token = req.query.token;
  const imageId = req.params.id;

  // Check referer - must come from our application
  const referer = req.get('Referer') || req.get('Origin');
  const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
  ];

  const hasValidReferer = referer && allowedOrigins.some(origin => 
    referer.startsWith(origin)
  );

  // Require both valid token AND valid referer
  if (!token) {
    return res.status(403).json({ error: 'Access denied: Token required' });
  }

  if (!hasValidReferer) {
    return res.status(403).json({ error: 'Access denied: Invalid origin' });
  }

  try {
    const [timestamp, signature] = token.split('.');
    
    // Check if token is expired
    if (Date.now() - parseInt(timestamp) > TOKEN_EXPIRY) {
      return res.status(403).json({ error: 'Token expired' });
    }

    // Verify signature
    const data = `${imageId}-${timestamp}`;
    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY)
      .update(data)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token format' });
  }
}
