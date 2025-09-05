import React from 'react';
import { farcasterAPI } from './api';

// Authentication state management
class AuthService {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
    this.listeners = [];
    
    // Try to restore session on initialization
    this.restoreSession();
  }

  // Add listener for auth state changes
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remove listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners of auth state change
  notifyListeners() {
    this.listeners.forEach(callback => callback({
      user: this.user,
      isAuthenticated: this.isAuthenticated,
    }));
  }

  // Authenticate user with Farcaster FID
  async authenticateWithFarcaster(fid, signature = null) {
    try {
      // Verify the user exists and signature is valid
      const verificationResult = await farcasterAPI.verifyUser(fid, signature);
      
      if (!verificationResult.verified) {
        throw new Error('Invalid signature or FID');
      }

      // Get user profile data
      const userData = await farcasterAPI.getUserByFid(fid);
      
      if (!userData) {
        throw new Error('User not found');
      }

      // Create user session
      this.user = {
        fid: userData.fid,
        username: userData.username,
        displayName: userData.display_name,
        pfpUrl: userData.pfp_url,
        followerCount: userData.follower_count,
        followingCount: userData.following_count,
        authenticatedAt: new Date().toISOString(),
        // Initialize trading data
        virtualBalance: 10000,
        totalPnL: 0,
        winRate: 0,
        totalTrades: 0,
      };

      this.isAuthenticated = true;
      
      // Persist session
      this.saveSession();
      
      // Notify listeners
      this.notifyListeners();
      
      return {
        success: true,
        user: this.user,
      };
    } catch (error) {
      console.error('Authentication failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Demo authentication for testing
  async authenticateDemo(demoUserId = 'demo-user') {
    try {
      this.user = {
        fid: demoUserId,
        username: 'demo_trader',
        displayName: 'Demo Trader',
        pfpUrl: 'https://via.placeholder.com/150/667eea/ffffff?text=DT',
        followerCount: 150,
        followingCount: 75,
        authenticatedAt: new Date().toISOString(),
        virtualBalance: 10000,
        totalPnL: 0,
        winRate: 0,
        totalTrades: 0,
      };

      this.isAuthenticated = true;
      this.saveSession();
      this.notifyListeners();

      return {
        success: true,
        user: this.user,
      };
    } catch (error) {
      console.error('Demo authentication failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Update user trading stats
  updateUserStats(stats) {
    if (!this.isAuthenticated || !this.user) {
      return false;
    }

    this.user = {
      ...this.user,
      ...stats,
      lastUpdated: new Date().toISOString(),
    };

    this.saveSession();
    this.notifyListeners();
    return true;
  }

  // Logout user
  logout() {
    this.user = null;
    this.isAuthenticated = false;
    
    // Clear persisted session
    localStorage.removeItem('flashtrade-auth');
    localStorage.removeItem('flashtrade-user');
    
    this.notifyListeners();
  }

  // Save session to localStorage
  saveSession() {
    try {
      localStorage.setItem('flashtrade-auth', JSON.stringify({
        isAuthenticated: this.isAuthenticated,
        timestamp: Date.now(),
      }));
      
      if (this.user) {
        localStorage.setItem('flashtrade-user', JSON.stringify(this.user));
      }
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  // Restore session from localStorage
  restoreSession() {
    try {
      const authData = localStorage.getItem('flashtrade-auth');
      const userData = localStorage.getItem('flashtrade-user');
      
      if (authData && userData) {
        const auth = JSON.parse(authData);
        const user = JSON.parse(userData);
        
        // Check if session is still valid (24 hours)
        const sessionAge = Date.now() - auth.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (sessionAge < maxAge) {
          this.user = user;
          this.isAuthenticated = auth.isAuthenticated;
          this.notifyListeners();
        } else {
          // Session expired, clear it
          this.logout();
        }
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      this.logout();
    }
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Check if user is authenticated
  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  // Generate authentication URL for Farcaster
  generateAuthUrl(redirectUrl = window.location.origin) {
    const params = new URLSearchParams({
      client_id: process.env.REACT_APP_FARCASTER_CLIENT_ID || 'flashtrade-sim',
      redirect_uri: redirectUrl,
      response_type: 'code',
      scope: 'read',
    });
    
    return `https://warpcast.com/~/oauth/authorize?${params.toString()}`;
  }

  // Handle OAuth callback
  async handleOAuthCallback(code, state) {
    try {
      // In a real implementation, exchange code for access token
      // and then get user data
      
      // For demo, simulate successful OAuth
      const mockFid = Math.floor(Math.random() * 100000);
      return await this.authenticateWithFarcaster(mockFid);
    } catch (error) {
      console.error('OAuth callback failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Create singleton instance
const authService = new AuthService();

// React hook for using auth service
export const useAuth = () => {
  const [authState, setAuthState] = React.useState({
    user: authService.getCurrentUser(),
    isAuthenticated: authService.isUserAuthenticated(),
    loading: false,
  });

  React.useEffect(() => {
    const handleAuthChange = (newState) => {
      setAuthState(prev => ({
        ...prev,
        ...newState,
        loading: false,
      }));
    };

    authService.addListener(handleAuthChange);
    
    return () => {
      authService.removeListener(handleAuthChange);
    };
  }, []);

  const login = async (fid, signature) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    return await authService.authenticateWithFarcaster(fid, signature);
  };

  const loginDemo = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    return await authService.authenticateDemo();
  };

  const logout = () => {
    authService.logout();
  };

  const updateStats = (stats) => {
    return authService.updateUserStats(stats);
  };

  return {
    ...authState,
    login,
    loginDemo,
    logout,
    updateStats,
    generateAuthUrl: authService.generateAuthUrl.bind(authService),
    handleOAuthCallback: authService.handleOAuthCallback.bind(authService),
  };
};

export default authService;
