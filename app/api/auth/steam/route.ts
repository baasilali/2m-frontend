import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Steam OpenID URL
const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login';

// Your website's domain (used for return URL)
const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  // Generate a random nonce for security
  const nonce = crypto.randomBytes(16).toString('hex');
  
  // Store the nonce in a cookie or session for verification later
  // For simplicity, we'll use a cookie
  const response = NextResponse.redirect(buildSteamAuthUrl(nonce));
  response.cookies.set('steam_nonce', nonce, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10 // 10 minutes
  });
  
  return response;
}

function buildSteamAuthUrl(nonce: string): string {
  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': `${SITE_DOMAIN}/api/auth/steam/callback`,
    'openid.realm': SITE_DOMAIN,
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.ns.sreg': 'http://openid.net/extensions/sreg/1.1',
    'openid.sreg.required': 'nickname,email',
    'openid.ns.ax': 'http://openid.net/srv/ax/1.0',
    'openid.ax.mode': 'fetch_request',
    'openid.ax.required': 'steamid',
    'openid.ax.type.steamid': 'http://axschema.org/namePerson/first',
    'openid.ax.if_available': 'steamid',
    'openid.nonce': nonce
  });

  return `${STEAM_OPENID_URL}?${params.toString()}`;
} 