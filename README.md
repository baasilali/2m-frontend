# 2M Frontend - Steam Authentication Branch

This branch focuses on implementing Steam authentication for the 2M application, allowing users to sign in with their Steam accounts.

## Current Status

### What Works

- **Particle Background**: The particle background animation has been fixed to properly handle TypeScript null checks.
- **Basic Project Structure**: The Next.js application structure is in place with proper routing.
- **Steam Authentication API Routes**: Basic API routes for Steam authentication have been created:
  - `/api/auth/steam/route.ts`: Initiates the Steam authentication flow
  - `/api/auth/steam/callback/route.ts`: Handles the callback from Steam after authentication
- **User Context**: A basic UserContext has been set up to manage user authentication state

### What's Broken

- **Steam Authentication Flow**: The authentication flow is not fully functional yet
- **User Session Management**: User sessions are not being properly stored or managed

### What Needs to Be Implemented

1. **Steam API Integration**:
   - Complete the Steam OpenID authentication flow
   - Implement proper error handling for authentication failures
   - Add user profile data retrieval from Steam API

2. **User Management**:
   - Create a database schema for storing user information
   - Implement user session persistence
   - Add user profile management features

3. **UI Components**:
   - Design and implement a user profile page
   - Add loading states and error messages for authentication processes

4. **Security**:
   - Implement proper session management with secure cookies
   - Set up proper environment variable handling

5. **Testing**:
   - Add unit tests for authentication flows
   - Implement integration tests for the complete authentication process
   - Add end-to-end tests for the user journey

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Steam Web API Key (for production)

### Installation

1. Clone the repository
2. Checkout the signin branch: `git checkout signin`
3. Install dependencies: `npm install` or `yarn install`
5. Run the development server: `npm run dev` or `yarn dev`

## Next Steps

1. Complete the Steam authentication flow
2. Implement user session management
3. Create UI components for authentication
4. Add proper error handling and loading states
5. Implement user profile features

## Resources

- [Steam Web API Documentation](https://steamcommunity.com/dev/apikey)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js Documentation](https://nextjs.org/docs) 
