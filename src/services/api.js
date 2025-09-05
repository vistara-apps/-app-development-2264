import axios from 'axios';

// API Configuration
const API_CONFIG = {
  NEYNAR_API_KEY: process.env.REACT_APP_NEYNAR_API_KEY || 'demo-key',
  BASE_RPC_URL: process.env.REACT_APP_BASE_RPC_URL || 'https://mainnet.base.org',
  AIRSTACK_API_KEY: process.env.REACT_APP_AIRSTACK_API_KEY || 'demo-key',
};

// Axios instances for different APIs
const neynarAPI = axios.create({
  baseURL: 'https://api.neynar.com/v2',
  headers: {
    'api_key': API_CONFIG.NEYNAR_API_KEY,
    'Content-Type': 'application/json',
  },
});

const baseRPC = axios.create({
  baseURL: API_CONFIG.BASE_RPC_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const airstackAPI = axios.create({
  baseURL: 'https://api.airstack.xyz/gql',
  headers: {
    'Authorization': `Bearer ${API_CONFIG.AIRSTACK_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Farcaster API functions
export const farcasterAPI = {
  // Get user by FID
  async getUserByFid(fid) {
    try {
      const response = await neynarAPI.get(`/farcaster/user/bulk?fids=${fid}`);
      return response.data.users[0];
    } catch (error) {
      console.error('Error fetching Farcaster user:', error);
      // Return mock data for demo
      return {
        fid: fid,
        username: `user${fid}`,
        display_name: `Demo User ${fid}`,
        pfp_url: 'https://via.placeholder.com/150',
        follower_count: 100,
        following_count: 50,
      };
    }
  },

  // Verify user authentication
  async verifyUser(fid, signature) {
    try {
      // In a real implementation, verify the signature
      // For demo purposes, return success
      return { verified: true, fid };
    } catch (error) {
      console.error('Error verifying user:', error);
      return { verified: false };
    }
  },
};

// Base RPC API functions
export const baseAPI = {
  // Get token price from Base
  async getTokenPrice(tokenAddress) {
    try {
      // This would typically call a DEX aggregator or price oracle
      // For demo, return mock data
      const mockPrices = {
        '0x4200000000000000000000000000000000000006': 2300, // ETH
        '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913': 1.00, // USDC
      };
      return mockPrices[tokenAddress] || Math.random() * 1000;
    } catch (error) {
      console.error('Error fetching token price:', error);
      return 0;
    }
  },

  // Get historical price data
  async getHistoricalPrices(tokenAddress, timeframe = '1d') {
    try {
      // Generate mock historical data
      const now = Date.now();
      const points = 24; // 24 hours of data
      const basePrice = await this.getTokenPrice(tokenAddress);
      
      return Array.from({ length: points }, (_, i) => ({
        timestamp: now - (points - i) * 3600000, // 1 hour intervals
        price: basePrice * (0.95 + Math.random() * 0.1), // ±5% variation
        volume: Math.random() * 1000000,
      }));
    } catch (error) {
      console.error('Error fetching historical prices:', error);
      return [];
    }
  },
};

// Airstack API functions
export const airstackAPI_service = {
  // Get token information
  async getTokenInfo(tokenAddress) {
    try {
      const query = `
        query GetTokenInfo($address: Address!) {
          Token(input: {filter: {address: {_eq: $address}}, blockchain: base}) {
            name
            symbol
            decimals
            totalSupply
            contractAddress
          }
        }
      `;
      
      const response = await airstackAPI.post('', {
        query,
        variables: { address: tokenAddress },
      });
      
      return response.data.data.Token;
    } catch (error) {
      console.error('Error fetching token info:', error);
      // Return mock data
      return {
        name: 'Demo Token',
        symbol: 'DEMO',
        decimals: 18,
        totalSupply: '1000000000000000000000000',
        contractAddress: tokenAddress,
      };
    }
  },

  // Get user's token holdings
  async getUserTokens(userAddress) {
    try {
      const query = `
        query GetUserTokens($owner: Identity!) {
          TokenBalances(
            input: {filter: {owner: {_eq: $owner}}, blockchain: base, limit: 50}
          ) {
            TokenBalance {
              amount
              formattedAmount
              token {
                name
                symbol
                address
              }
            }
          }
        }
      `;
      
      const response = await airstackAPI.post('', {
        query,
        variables: { owner: userAddress },
      });
      
      return response.data.data.TokenBalances;
    } catch (error) {
      console.error('Error fetching user tokens:', error);
      return [];
    }
  },
};

// Market data aggregation service
export const marketDataService = {
  // Get real-time market data for multiple assets
  async getMarketData(symbols = ['ETH', 'BTC', 'USDC', 'LINK', 'UNI']) {
    try {
      // In production, this would aggregate data from multiple sources
      const marketData = {};
      
      for (const symbol of symbols) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        marketData[symbol] = {
          symbol,
          name: this.getAssetName(symbol),
          price: this.generatePrice(symbol),
          change: (Math.random() - 0.5) * 10, // ±5% change
          volume24h: Math.random() * 10000000,
          marketCap: Math.random() * 100000000000,
          lastUpdated: Date.now(),
        };
      }
      
      return marketData;
    } catch (error) {
      console.error('Error fetching market data:', error);
      return {};
    }
  },

  getAssetName(symbol) {
    const names = {
      ETH: 'Ethereum',
      BTC: 'Bitcoin',
      USDC: 'USD Coin',
      LINK: 'Chainlink',
      UNI: 'Uniswap',
    };
    return names[symbol] || symbol;
  },

  generatePrice(symbol) {
    const basePrices = {
      ETH: 2300,
      BTC: 45000,
      USDC: 1.00,
      LINK: 15.50,
      UNI: 8.75,
    };
    const basePrice = basePrices[symbol] || 100;
    return basePrice * (0.95 + Math.random() * 0.1); // ±5% variation
  },
};

// Error handling utility
export const handleAPIError = (error, context = 'API call') => {
  console.error(`${context} failed:`, error);
  
  if (error.response) {
    // Server responded with error status
    return {
      success: false,
      error: error.response.data?.message || 'Server error',
      status: error.response.status,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      success: false,
      error: 'Network error - please check your connection',
      status: 0,
    };
  } else {
    // Something else happened
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      status: -1,
    };
  }
};

export default {
  farcasterAPI,
  baseAPI,
  airstackAPI: airstackAPI_service,
  marketDataService,
  handleAPIError,
};
