require('dotenv').config({ path: '.env.local' });
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const cors = require('cors');

const app = express();
const PORT = process.env.AUTH_PORT || 3001;
const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL || 'http://localhost:3001';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

console.log('Starting auth server with:');
console.log('AUTH_SERVER_URL:', AUTH_SERVER_URL);
console.log('FRONTEND_URL:', FRONTEND_URL);
console.log('Steam API Key provided:', !!process.env.STEAM_API_KEY);

// Configure CORS to allow requests from your frontend
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// Set up session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true, // Changed to true to ensure session is always created
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Steam Strategy
passport.use(new SteamStrategy({
  returnURL: `${AUTH_SERVER_URL}/auth/steam/return`,
  realm: AUTH_SERVER_URL,
  apiKey: process.env.STEAM_API_KEY || ''  // Even if not used for authentication, provide empty string
}, (identifier, profile, done) => {
  console.log('Steam authentication successful');
  console.log('Identifier:', identifier);
  console.log('Profile:', JSON.stringify(profile, null, 2));
  
  // You can store user in database here if needed
  return done(null, profile);
}));

// Serialize user
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.id);
  done(null, user);
});

// Deserialize user
passport.deserializeUser((obj, done) => {
  console.log('Deserializing user:', obj.id);
  done(null, obj);
});

// Debug route to test if server is running
app.get('/', (req, res) => {
  res.send('Auth server is running. Visit /auth/steam to authenticate with Steam.');
});

// Steam auth routes with better error handling
app.get('/auth/steam', (req, res, next) => {
  console.log('Starting Steam authentication...');
  passport.authenticate('steam', (err) => {
    if (err) {
      console.error('Error in /auth/steam route:', err);
      return res.redirect(`${FRONTEND_URL}/auth-error?message=${encodeURIComponent(err.message)}`);
    }
  })(req, res, next);
});

app.get('/auth/steam/return', (req, res, next) => {
  console.log('Received callback from Steam');
  console.log('Query params:', req.query);
  
  passport.authenticate('steam', { failureRedirect: `${FRONTEND_URL}/auth-error` }, (err, user, info) => {
    if (err) {
      console.error('Authentication error in return route:', err);
      return res.redirect(`${FRONTEND_URL}/auth-error?message=${encodeURIComponent(err.message)}`);
    }
    
    if (!user) {
      console.error('No user returned from authentication');
      return res.redirect(`${FRONTEND_URL}/auth-error?message=No%20user%20data%20returned`);
    }
    
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error during login:', err);
        return res.redirect(`${FRONTEND_URL}/auth-error?message=${encodeURIComponent(err.message)}`);
      }
      console.log('Authentication successful, redirecting to frontend');
      return res.redirect(`${FRONTEND_URL}/auth-success`);
    });
  })(req, res, next);
});

// Create an auth error page endpoint
app.get('/auth-error', (req, res) => {
  const errorMsg = req.query.message || 'Unknown authentication error';
  console.error('Auth error:', errorMsg);
  res.status(401).json({ error: 'Authentication failed', message: errorMsg });
});

// User data endpoint
app.get('/api/user', (req, res) => {
  console.log('User data requested, authenticated:', req.isAuthenticated());
  if (req.isAuthenticated()) {
    return res.json({
      user: req.user,
      isAuthenticated: true
    });
  }
  return res.json({
    user: null,
    isAuthenticated: false
  });
});

// Logout route
app.get('/auth/logout', (req, res, next) => {
  console.log('Logging out user');
  req.logout(function(err) {
    if (err) { 
      console.error('Error during logout:', err);
      return next(err); 
    }
    res.redirect(FRONTEND_URL);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Authentication failed', 
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
  console.log(`Auth server URL: ${AUTH_SERVER_URL}`);
  console.log(`Return URL: ${AUTH_SERVER_URL}/auth/steam/return`);
}); 