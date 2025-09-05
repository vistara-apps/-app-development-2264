import React, { useState, useEffect } from 'react';
import { TradingProvider } from './context/TradingContext';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import authService from './services/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const authenticated = authService.isUserAuthenticated();
      setIsAuthenticated(authenticated);
      setShowAuthModal(!authenticated);
      setLoading(false);
    };

    // Listen for auth state changes
    const handleAuthChange = ({ isAuthenticated: newAuthState }) => {
      setIsAuthenticated(newAuthState);
      setShowAuthModal(!newAuthState);
    };

    authService.addListener(handleAuthChange);
    checkAuth();

    return () => {
      authService.removeListener(handleAuthChange);
    };
  }, []);

  const handleAuthenticate = async (method, data) => {
    try {
      let result;
      if (method === 'demo') {
        result = await authService.authenticateDemo();
      } else if (method === 'farcaster') {
        result = await authService.authenticateWithFarcaster(data);
      }
      
      return result;
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error: error.message };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading FlashTrade Sim...</p>
        </div>
      </div>
    );
  }

  return (
    <TradingProvider>
      <div className="min-h-screen gradient-bg">
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">FlashTrade Sim</h1>
              <p className="text-white text-opacity-80 mb-8">
                Learn, Practice, and Master Trading Without Risk
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthenticate={handleAuthenticate}
        />
      </div>
    </TradingProvider>
  );
}

export default App;
