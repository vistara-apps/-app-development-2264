import React, { useState } from 'react';
import { User, LogIn, Loader2, ExternalLink } from 'lucide-react';

function AuthModal({ isOpen, onClose, onAuthenticate }) {
  const [authMethod, setAuthMethod] = useState('demo'); // 'demo' or 'farcaster'
  const [fid, setFid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDemoAuth = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await onAuthenticate('demo');
      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFarcasterAuth = async () => {
    if (!fid.trim()) {
      setError('Please enter your Farcaster ID');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await onAuthenticate('farcaster', fid.trim());
      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthAuth = () => {
    // In a real implementation, this would redirect to Farcaster OAuth
    const authUrl = `https://warpcast.com/~/oauth/authorize?client_id=flashtrade-sim&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=code&scope=read`;
    window.location.href = authUrl;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-effect rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to FlashTrade Sim</h2>
          <p className="text-white text-opacity-70">
            Connect your account to start trading simulation
          </p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg p-3 mb-4">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Demo Authentication */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="demo"
                name="authMethod"
                value="demo"
                checked={authMethod === 'demo'}
                onChange={(e) => setAuthMethod(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="demo" className="text-white font-medium">
                Demo Mode
              </label>
            </div>
            <p className="text-white text-opacity-60 text-sm ml-7">
              Try the app with a demo account (no registration required)
            </p>
          </div>

          {/* Farcaster Authentication */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="farcaster"
                name="authMethod"
                value="farcaster"
                checked={authMethod === 'farcaster'}
                onChange={(e) => setAuthMethod(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="farcaster" className="text-white font-medium">
                Farcaster Account
              </label>
            </div>
            <p className="text-white text-opacity-60 text-sm ml-7">
              Connect with your Farcaster ID for personalized experience
            </p>
            
            {authMethod === 'farcaster' && (
              <div className="ml-7 space-y-3">
                <input
                  type="text"
                  placeholder="Enter your Farcaster ID (FID)"
                  value={fid}
                  onChange={(e) => setFid(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white bg-opacity-10 text-white border border-white border-opacity-20 placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleOAuthAuth}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Or authenticate via Warpcast
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-lg bg-white bg-opacity-10 text-white hover:bg-opacity-20 transition-all font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={authMethod === 'demo' ? handleDemoAuth : handleFarcasterAuth}
            disabled={loading || (authMethod === 'farcaster' && !fid.trim())}
            className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                {authMethod === 'demo' ? 'Start Demo' : 'Connect Farcaster'}
              </>
            )}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-white border-opacity-10">
          <p className="text-white text-opacity-50 text-xs text-center">
            FlashTrade Sim is a trading simulator for educational purposes only.
            No real money is involved in this simulation.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
