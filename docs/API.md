# FlashTrade Sim API Documentation

## Overview

FlashTrade Sim integrates with multiple external APIs to provide real-time market data, user authentication, and blockchain information. This document outlines all API integrations and their usage.

## API Services

### 1. Farcaster API (via Neynar)

**Purpose**: User authentication and profile data retrieval using Farcaster ID (FID).

**Base URL**: `https://api.neynar.com/v2`

**Authentication**: API Key required

**Environment Variables**:
```bash
REACT_APP_NEYNAR_API_KEY=your_neynar_api_key
```

#### Endpoints

##### Get User by FID
```javascript
GET /farcaster/user/bulk?fids={fid}
```

**Parameters**:
- `fid` (string): Farcaster user ID

**Response**:
```json
{
  "users": [{
    "fid": 12345,
    "username": "trader123",
    "display_name": "Crypto Trader",
    "pfp_url": "https://example.com/avatar.jpg",
    "follower_count": 150,
    "following_count": 75
  }]
}
```

**Usage Example**:
```javascript
import { farcasterAPI } from '../services/api';

const user = await farcasterAPI.getUserByFid('12345');
```

### 2. Base RPC API

**Purpose**: Fetching real-time market data and interacting with Base blockchain.

**Base URL**: `https://mainnet.base.org` (or custom RPC endpoint)

**Environment Variables**:
```bash
REACT_APP_BASE_RPC_URL=https://mainnet.base.org
```

#### Methods

##### Get Token Price
```javascript
async getTokenPrice(tokenAddress)
```

**Parameters**:
- `tokenAddress` (string): Contract address of the token

**Returns**: `number` - Current token price in USD

**Usage Example**:
```javascript
import { baseAPI } from '../services/api';

const ethPrice = await baseAPI.getTokenPrice('0x4200000000000000000000000000000000000006');
```

##### Get Historical Prices
```javascript
async getHistoricalPrices(tokenAddress, timeframe = '1d')
```

**Parameters**:
- `tokenAddress` (string): Contract address of the token
- `timeframe` (string): Time period ('1d', '7d', '30d')

**Returns**: `Array<Object>` - Historical price data points

**Response Format**:
```json
[
  {
    "timestamp": 1640995200000,
    "price": 2300.50,
    "volume": 1500000
  }
]
```

### 3. Airstack API

**Purpose**: Fetching indexed on-chain data for advanced analytics and token information.

**Base URL**: `https://api.airstack.xyz/gql`

**Authentication**: Bearer token required

**Environment Variables**:
```bash
REACT_APP_AIRSTACK_API_KEY=your_airstack_api_key
```

#### GraphQL Queries

##### Get Token Information
```graphql
query GetTokenInfo($address: Address!) {
  Token(input: {filter: {address: {_eq: $address}}, blockchain: base}) {
    name
    symbol
    decimals
    totalSupply
    contractAddress
  }
}
```

##### Get User Token Holdings
```graphql
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
```

**Usage Example**:
```javascript
import { airstackAPI } from '../services/api';

const tokenInfo = await airstackAPI.getTokenInfo('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913');
const userTokens = await airstackAPI.getUserTokens('0x1234...5678');
```

### 4. Market Data Service

**Purpose**: Aggregating market data from multiple sources for comprehensive trading information.

#### Methods

##### Get Market Data
```javascript
async getMarketData(symbols = ['ETH', 'BTC', 'USDC', 'LINK', 'UNI'])
```

**Parameters**:
- `symbols` (Array<string>): Array of token symbols

**Returns**: `Object` - Market data for all requested symbols

**Response Format**:
```json
{
  "ETH": {
    "symbol": "ETH",
    "name": "Ethereum",
    "price": 2300.50,
    "change": 2.5,
    "volume24h": 15000000,
    "marketCap": 276000000000,
    "lastUpdated": 1640995200000
  }
}
```

## Authentication Flow

### Farcaster Authentication

1. **User Initiation**: User chooses to authenticate with Farcaster
2. **FID Input**: User provides their Farcaster ID (FID)
3. **Verification**: System verifies FID exists and is valid
4. **Profile Fetch**: Retrieve user profile data from Neynar API
5. **Session Creation**: Create authenticated session with user data

```javascript
// Authentication flow example
import authService from '../services/auth';

const authenticateUser = async (fid) => {
  try {
    const result = await authService.authenticateWithFarcaster(fid);
    if (result.success) {
      console.log('User authenticated:', result.user);
      // Redirect to dashboard
    } else {
      console.error('Authentication failed:', result.error);
    }
  } catch (error) {
    console.error('Authentication error:', error);
  }
};
```

### OAuth Flow (Alternative)

1. **Redirect to Warpcast**: User clicks OAuth login
2. **Authorization**: User authorizes app on Warpcast
3. **Callback**: Warpcast redirects back with authorization code
4. **Token Exchange**: Exchange code for access token
5. **Profile Fetch**: Use access token to get user profile

```javascript
// OAuth URL generation
const generateAuthUrl = (redirectUrl) => {
  const params = new URLSearchParams({
    client_id: 'flashtrade-sim',
    redirect_uri: redirectUrl,
    response_type: 'code',
    scope: 'read',
  });
  
  return `https://warpcast.com/~/oauth/authorize?${params.toString()}`;
};
```

## Error Handling

All API calls include comprehensive error handling:

```javascript
import { handleAPIError } from '../services/api';

try {
  const data = await someAPICall();
  return { success: true, data };
} catch (error) {
  const errorInfo = handleAPIError(error, 'API call context');
  return { success: false, ...errorInfo };
}
```

**Error Response Format**:
```json
{
  "success": false,
  "error": "Error message",
  "status": 404
}
```

## Rate Limits and Best Practices

### Neynar API
- **Rate Limit**: 100 requests per minute
- **Best Practice**: Cache user data locally to minimize API calls

### Base RPC
- **Rate Limit**: Varies by provider (typically 100-300 requests per minute)
- **Best Practice**: Batch requests when possible, implement request queuing

### Airstack API
- **Rate Limit**: 1000 requests per hour
- **Best Practice**: Use GraphQL efficiently, request only needed fields

## Environment Configuration

Create a `.env` file in your project root:

```bash
# Farcaster/Neynar API
REACT_APP_NEYNAR_API_KEY=your_neynar_api_key

# Base RPC
REACT_APP_BASE_RPC_URL=https://mainnet.base.org

# Airstack API
REACT_APP_AIRSTACK_API_KEY=your_airstack_api_key

# Farcaster OAuth (optional)
REACT_APP_FARCASTER_CLIENT_ID=flashtrade-sim
```

## Testing

### Mock Data

For development and testing, the API service provides mock data when real APIs are unavailable:

```javascript
// Mock market data is automatically used when API calls fail
const marketData = await marketDataService.getMarketData();
// Returns mock data if API is unavailable
```

### API Testing

Test API integrations using the provided test utilities:

```javascript
// Test Farcaster authentication
const testAuth = async () => {
  const result = await farcasterAPI.getUserByFid('test-fid');
  console.log('Auth test result:', result);
};

// Test market data
const testMarketData = async () => {
  const data = await marketDataService.getMarketData(['ETH', 'BTC']);
  console.log('Market data test:', data);
};
```

## Security Considerations

1. **API Keys**: Never expose API keys in client-side code
2. **Rate Limiting**: Implement client-side rate limiting to prevent API abuse
3. **Data Validation**: Always validate API responses before using data
4. **Error Handling**: Don't expose sensitive error information to users
5. **HTTPS**: Always use HTTPS for API communications

## Support and Resources

- **Neynar Documentation**: https://docs.neynar.com/
- **Base Documentation**: https://docs.base.org/
- **Airstack Documentation**: https://docs.airstack.xyz/
- **Farcaster Protocol**: https://docs.farcaster.xyz/

For additional support or questions about API integrations, please refer to the respective documentation or contact the development team.
