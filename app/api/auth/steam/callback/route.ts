import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Steam OpenID URL for verification
const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('openid.mode');
  
  // Handle the response from Steam
  if (mode === 'id_res') {
    // Verify the response
    const isValid = await verifySteamResponse(request);
    
    if (isValid) {
      // Extract Steam ID from the claimed_id
      const claimedId = searchParams.get('openid.claimed_id');
      const steamId = claimedId ? extractSteamId(claimedId) : null;
      
      if (steamId) {
        // Here you would typically:
        // 1. Check if the user exists in your database
        // 2. Create or update the user record
        // 3. Create a session or JWT token
        // 4. Redirect to the user's dashboard or home page
        
        // For now, we'll just redirect to the home page with a success message
        return NextResponse.redirect(new URL('/?auth=success', request.url));
      }
    }
    
    // If verification failed or no Steam ID was found, redirect with an error
    return NextResponse.redirect(new URL('/?auth=error', request.url));
  }
  
  // If the mode is not 'id_res', redirect to the home page
  return NextResponse.redirect(new URL('/', request.url));
}

async function verifySteamResponse(request: NextRequest): Promise<boolean> {
  const searchParams = request.nextUrl.searchParams;
  
  // Get the nonce from the cookie
  const nonce = request.cookies.get('steam_nonce')?.value;
  
  // If there's no nonce in the cookie, verification fails
  if (!nonce) {
    return false;
  }
  
  // Check if the nonce in the response matches the one we sent
  const responseNonce = searchParams.get('openid.nonce');
  if (responseNonce !== nonce) {
    return false;
  }
  
  // In a production environment, you would also verify the signature
  // This is a simplified version and should be enhanced for production use
  
  return true;
}

function extractSteamId(claimedId: string): string | null {
  // The claimed_id from Steam is in the format: https://steamcommunity.com/openid/id/76561198012345678
  const match = claimedId.match(/\/openid\/id\/(\d+)/);
  return match ? match[1] : null;
} 