# FlashTrade Sim 📈

> **Learn, Practice, and Master Trading Without Risk**

A comprehensive Base MiniApp for aspiring traders to practice trading strategies in a simulated environment and analyze their performance.

![FlashTrade Sim Dashboard](https://via.placeholder.com/800x400/667eea/ffffff?text=FlashTrade+Sim+Dashboard)

## 🚀 Features

### 🎯 Core Trading Features
- **Interactive Simulated Trading Environment** - Execute buy/sell orders with real-time market data using virtual currency
- **Real-time Price Charts** - Advanced charting with multiple timeframes (1d, 7d, 30d)
- **Multiple Asset Support** - Trade ETH, BTC, USDC, LINK, UNI and more
- **Order Types** - Market orders and limit orders
- **Portfolio Management** - Track virtual balance and positions

### 📊 Performance Analytics
- **Trade Performance Tracking** - Automatic P&L calculation and win rate analysis
- **Advanced Analytics Dashboard** - Comprehensive performance metrics
- **Trade History** - Detailed logs of all simulated trades
- **Performance Insights** - Identify profitable patterns and strategies

### 🎓 Educational Content
- **Learning Paths** - Curated educational content on trading strategies
- **Interactive Tutorials** - Technical analysis, risk management, market psychology
- **Progress Tracking** - Monitor learning module completion

### 🔐 Authentication & Social
- **Farcaster Integration** - Authenticate with Farcaster ID for personalized experience
- **Demo Mode** - Try the app without registration
- **Social Features** - Connect with the Base ecosystem community

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Charts**: Recharts for advanced data visualization
- **APIs**: Farcaster (Neynar), Base RPC, Airstack
- **State Management**: React Context + useReducer
- **Styling**: Custom design system with glass morphism effects
- **Deployment**: Docker-ready with production optimizations

## 🏗 Architecture

```
src/
├── components/          # React components
│   ├── Analytics.jsx    # Performance analytics
│   ├── AuthModal.jsx    # Authentication modal
│   ├── Dashboard.jsx    # Main dashboard
│   ├── PriceChart.jsx   # Advanced price charts
│   └── ...
├── context/            # React context providers
│   └── TradingContext.jsx
├── services/           # API integrations
│   ├── api.js         # External API services
│   └── auth.js        # Authentication service
└── docs/              # Documentation
    └── API.md         # API documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/-app-development-2264.git
   cd -app-development-2264
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
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

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   Navigate to `http://localhost:5173`

### Docker Deployment

```bash
# Build the Docker image
docker build -t flashtrade-sim .

# Run the container
docker run -p 3000:3000 flashtrade-sim
```

## 📱 Usage

### Getting Started

1. **Authentication**
   - Choose Demo Mode for immediate access
   - Or connect with your Farcaster ID for personalized experience

2. **Start Trading**
   - Select an asset from the sidebar
   - View real-time price charts
   - Place buy/sell orders with virtual currency

3. **Analyze Performance**
   - Navigate to Analytics tab
   - Review P&L, win rate, and trade history
   - Identify successful strategies

4. **Learn & Improve**
   - Access Learning Modules
   - Complete interactive tutorials
   - Apply new strategies in simulation

### Key Components

#### Trading Interface
- **Asset Selection**: Choose from multiple cryptocurrencies
- **Price Charts**: Interactive charts with multiple timeframes
- **Order Placement**: Market and limit order support
- **Position Tracking**: Monitor open positions and P&L

#### Analytics Dashboard
- **Performance Metrics**: Total P&L, win rate, trade count
- **Trade History**: Detailed transaction logs
- **Strategy Analysis**: Performance by strategy type
- **Time-based Insights**: Performance over different periods

#### Learning Center
- **Technical Analysis**: Chart patterns, indicators, trend analysis
- **Risk Management**: Position sizing, stop losses, portfolio management
- **Market Psychology**: Emotional trading, discipline, mindset

## 🔧 Configuration

### API Keys Setup

1. **Neynar API** (Farcaster)
   - Sign up at [Neynar](https://neynar.com)
   - Get your API key from the dashboard
   - Add to `.env` as `REACT_APP_NEYNAR_API_KEY`

2. **Base RPC**
   - Use public endpoint: `https://mainnet.base.org`
   - Or get dedicated RPC from [Alchemy](https://alchemy.com) or [QuickNode](https://quicknode.com)

3. **Airstack API**
   - Sign up at [Airstack](https://airstack.xyz)
   - Get your API key
   - Add to `.env` as `REACT_APP_AIRSTACK_API_KEY`

### Customization

#### Design System
The app uses a custom design system defined in `tailwind.config.js`:

```javascript
colors: {
  bg: 'hsl(210 36% 98%)',
  accent: 'hsl(171 74% 45%)',
  primary: 'hsl(204 94% 51%)',
  surface: 'hsl(210 36% 96%)',
}
```

#### Trading Assets
Add new trading assets in `src/context/TradingContext.jsx`:

```javascript
const MOCK_ASSETS = {
  'NEW_TOKEN': { 
    symbol: 'NEW', 
    name: 'New Token', 
    price: 100, 
    change: 0 
  },
  // ... existing assets
};
```

## 📊 Data Model

### User Entity
```javascript
{
  userId: string,           // Farcaster FID or demo ID
  username: string,         // Display username
  virtualBalance: number,   // Virtual trading balance
  totalPnL: number,        // Total profit/loss
  winRate: number,         // Win percentage
  totalTrades: number      // Total number of trades
}
```

### Trade Entity
```javascript
{
  tradeId: string,         // Unique trade identifier
  userId: string,          // User who made the trade
  symbol: string,          // Asset symbol (ETH, BTC, etc.)
  type: 'buy' | 'sell',   // Trade direction
  quantity: number,        // Amount traded
  entryPrice: number,      // Entry price
  exitPrice: number,       // Exit price (null for open positions)
  timestamp: string,       // ISO timestamp
  pnl: number,            // Profit/loss amount
  strategyUsed: string    // Strategy identifier
}
```

### Learning Module Entity
```javascript
{
  moduleId: number,        // Unique module ID
  title: string,          // Module title
  content: string,        // Module content/description
  type: 'video' | 'text' | 'quiz', // Content type
  completed: boolean      // Completion status
}
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### API Testing
Test API integrations:

```javascript
// Test Farcaster authentication
import { farcasterAPI } from './src/services/api';
const user = await farcasterAPI.getUserByFid('12345');

// Test market data
import { marketDataService } from './src/services/api';
const data = await marketDataService.getMarketData(['ETH', 'BTC']);
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```bash
REACT_APP_NEYNAR_API_KEY=prod_neynar_key
REACT_APP_BASE_RPC_URL=https://mainnet.base.org
REACT_APP_AIRSTACK_API_KEY=prod_airstack_key
REACT_APP_FARCASTER_CLIENT_ID=flashtrade-sim
```

### Docker Production
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style
- Use ESLint and Prettier for code formatting
- Follow React best practices
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/API.md)
- [User Guide](docs/USER_GUIDE.md)
- [Developer Guide](docs/DEVELOPER_GUIDE.md)

### Community
- [Discord](https://discord.gg/base) - Join the Base community
- [Twitter](https://twitter.com/base) - Follow Base updates
- [GitHub Issues](https://github.com/vistara-apps/-app-development-2264/issues) - Report bugs or request features

### Resources
- [Base Documentation](https://docs.base.org/)
- [Farcaster Documentation](https://docs.farcaster.xyz/)
- [React Documentation](https://react.dev/)

## 🙏 Acknowledgments

- **Base Team** - For the amazing L2 infrastructure
- **Farcaster Community** - For the decentralized social protocol
- **Open Source Contributors** - For the tools and libraries that make this possible

---

**⚠️ Disclaimer**: FlashTrade Sim is a trading simulator for educational purposes only. No real money is involved in this simulation. Past performance does not guarantee future results. Always do your own research before making real trading decisions.

**Built with ❤️ for the Base ecosystem**
