require('dotenv').config({ path: '.env.local' });
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const cors = require('cors');
const axios = require('axios');

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

// Steam inventory endpoint
app.get('/api/steam/inventory/:steamId', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { steamId } = req.params;
  
  // Verify the steamId in params matches the authenticated user
  if (req.user.id !== steamId) {
    return res.status(403).json({ error: 'Forbidden - You can only access your own inventory' });
  }

  try {
    console.log(`Fetching inventory for Steam ID: ${steamId}`);
    
    // CS2/CS:GO App ID is 730, context ID is 2
    const steamApiUrl = `https://steamcommunity.com/inventory/${steamId}/730/2`;
    
    // Fetch inventory from Steam API
    const response = await axios.get(steamApiUrl, {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
      }
    });

    // Check if the response was successful
    if (response.data && response.data.success) {
      const { assets, descriptions } = response.data;
      
      // Handle case where no assets or descriptions are returned
      if (!assets || !descriptions) {
        console.log('No assets or descriptions found in the response');
        return res.json({ success: true, items: [] });
      }
      
      console.log(`Processing ${assets.length} assets and ${descriptions.length} descriptions`);
      
      // Process the inventory items
      const items = assets.map(asset => {
        try {
          // Find the description for this asset
          const description = descriptions.find(desc => 
            desc.classid === asset.classid && desc.instanceid === asset.instanceid
          );
          
          if (!description) {
            console.log(`No description found for asset: ${asset.assetid}`);
            return null;
          }

          // Get item details
          const marketName = description.market_hash_name || description.name || 'Unknown Item';
          const name = description.market_name || description.name || 'Unknown Item';
          const type = getItemType(description);
          const rarity = getItemRarity(description);
          const exterior = getItemExterior(marketName);
          
          // Get item image
          const imageUrlBase = 'https://community.cloudflare.steamstatic.com/economy/image/';
          const image = description.icon_url ? `${imageUrlBase}${description.icon_url}` : '';
          
          return {
            id: asset.assetid,
            classid: asset.classid,
            instanceid: asset.instanceid,
            name,
            marketName,
            image,
            type,
            rarity,
            exterior,
            tradable: description.tradable === 1,
            marketable: description.marketable === 1
          };
        } catch (itemError) {
          console.error('Error processing item:', itemError);
          return null;
        }
      }).filter(Boolean) // Remove null items
        .filter(item => item.tradable); // Only keep tradable items
      
      return res.json({ success: true, items });
    } else {
      console.error('Steam API returned an error:', response.data);
      return res.status(500).json({ 
        error: 'Failed to fetch inventory from Steam', 
        details: response.data 
      });
    }
  } catch (error) {
    console.error('Error fetching Steam inventory:', error.message);
    
    // Handle private inventory case
    if (error.response && error.response.status === 403) {
      return res.status(403).json({ 
        error: 'Inventory is private', 
        message: 'Your Steam inventory is set to private. Please change your privacy settings to public to view your items.'
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to fetch inventory', 
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
});

// Helper function to determine item type
function getItemType(description) {
  const tags = description.tags || [];
  const typeTag = tags.find(tag => tag.category === 'Type');
  
  if (typeTag && typeTag.name) {
    const type = typeTag.name.toLowerCase();
    
    if (type.includes('knife')) return 'Knife';
    if (type.includes('glove')) return 'Glove';
    if (type.includes('rifle') || type === 'sniper rifle') return 'Rifle';
    if (type.includes('pistol')) return 'Pistol';
    if (type.includes('smg')) return 'SMG';
    if (type.includes('shotgun')) return 'Shotgun';
    if (type.includes('machinegun')) return 'Machinegun';
    
    return typeTag.name;
  }
  
  return 'Other';
}

// Helper function to determine item rarity
function getItemRarity(description) {
  const tags = description.tags || [];
  const rarityTag = tags.find(tag => tag.category === 'Rarity');
  
  return (rarityTag && rarityTag.name) ? rarityTag.name.replace('Rarity_', '') : 'Common';
}

// Helper function to extract item exterior (wear)
function getItemExterior(marketName) {
  const exteriors = [
    'Factory New',
    'Minimal Wear',
    'Field-Tested',
    'Well-Worn',
    'Battle-Scarred'
  ];
  
  for (const exterior of exteriors) {
    if (marketName.includes(`(${exterior})`)) {
      return exterior;
    }
  }
  
  return null;
}

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