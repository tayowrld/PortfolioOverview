import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { 
  AssetState, 
  Asset, 
  AddAssetPayload, 
  UpdateAssetPricePayload,
  DeleteAssetPayload 
} from '../../types';

// Popular cryptocurrencies as available assets
const availableCryptos = [
  { symbol: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', name: 'Ethereum' },
  { symbol: 'BNBUSDT', name: 'Binance Coin' },
  { symbol: 'ADAUSDT', name: 'Cardano' },
  { symbol: 'SOLUSDT', name: 'Solana' },
  { symbol: 'XRPUSDT', name: 'Ripple' },
  { symbol: 'DOTUSDT', name: 'Polkadot' },
  { symbol: 'DOGEUSDT', name: 'Dogecoin' },
  { symbol: 'LUNAUSDT', name: 'Luna' },
  { symbol: 'AVAXUSDT', name: 'Avalanche' },
  // Добавляем еще 90+ криптовалют
  { symbol: 'MATICUSDT', name: 'Polygon' },
  { symbol: 'LINKUSDT', name: 'Chainlink' },
  { symbol: 'UNIUSDT', name: 'Uniswap' },
  { symbol: 'SHIBUSDT', name: 'Shiba Inu' },
  { symbol: 'LTCUSDT', name: 'Litecoin' },
  { symbol: 'ALGOUSDT', name: 'Algorand' },
  { symbol: 'ATOMUSDT', name: 'Cosmos' },
  { symbol: 'TRXUSDT', name: 'TRON' },
  { symbol: 'ETCUSDT', name: 'Ethereum Classic' },
  { symbol: 'XLMUSDT', name: 'Stellar' },
  { symbol: 'VETUSDT', name: 'VeChain' },
  { symbol: 'FILUSDT', name: 'Filecoin' },
  { symbol: 'THETAUSDT', name: 'Theta Network' },
  { symbol: 'AXSUSDT', name: 'Axie Infinity' },
  { symbol: 'HBARUSDT', name: 'Hedera' },
  { symbol: 'XMRUSDT', name: 'Monero' },
  { symbol: 'FTMUSDT', name: 'Fantom' },
  { symbol: 'EGLDUSDT', name: 'Elrond' },
  { symbol: 'SANDUSDT', name: 'The Sandbox' },
  { symbol: 'MANAUSDT', name: 'Decentraland' },
  { symbol: 'CAKEUSDT', name: 'PancakeSwap' },
  { symbol: 'AAVEUSDT', name: 'Aave' },
  { symbol: 'KLAYUSDT', name: 'Klaytn' },
  { symbol: 'BITUSDT', name: 'BitDAO' },
  { symbol: 'IOTAUSDT', name: 'IOTA' },
  { symbol: 'BTTUSDT', name: 'BitTorrent' },
  { symbol: 'EOSUSDT', name: 'EOS' },
  { symbol: 'GRTUSDT', name: 'The Graph' },
  { symbol: 'NEARUSDT', name: 'NEAR Protocol' },
  { symbol: 'MKRUSDT', name: 'Maker' },
  { symbol: 'BCHUSDT', name: 'Bitcoin Cash' },
  { symbol: 'STXUSDT', name: 'Stacks' },
  { symbol: 'NEOUSDT', name: 'NEO' },
  { symbol: 'QNTUSDT', name: 'Quant' },
  { symbol: 'FLOWUSDT', name: 'Flow' },
  { symbol: 'XTZUSDT', name: 'Tezos' },
  { symbol: 'KAVAUSDT', name: 'Kava' },
  { symbol: 'CHZUSDT', name: 'Chiliz' },
  { symbol: 'ZENUSDT', name: 'Horizen' },
  { symbol: 'ENJUSDT', name: 'Enjin Coin' },
  { symbol: 'WAVESUSDT', name: 'Waves' },
  { symbol: 'COMPUSDT', name: 'Compound' },
  { symbol: 'TUSDT', name: 'Threshold' },
  { symbol: 'HOTUSDT', name: 'Holo' },
  { symbol: 'ZECUSDT', name: 'Zcash' },
  { symbol: 'BATUSDT', name: 'Basic Attention Token' },
  { symbol: 'DASHUSDT', name: 'Dash' },
  { symbol: 'ICPUSDT', name: 'Internet Computer' },
  { symbol: 'CELOUSDT', name: 'Celo' },
  { symbol: 'KSMUSDT', name: 'Kusama' },
  { symbol: 'YFIUSDT', name: 'yearn.finance' },
  { symbol: 'RUNEUSDT', name: 'THORChain' },
  { symbol: 'SRMUSDT', name: 'Serum' },
  { symbol: 'OMGUSDT', name: 'OMG Network' },
  { symbol: 'ZILUSDT', name: 'Zilliqa' },
  { symbol: 'LRCUSDT', name: 'Loopring' },
  { symbol: 'ONTUSDT', name: 'Ontology' },
  { symbol: 'SNXUSDT', name: 'Synthetix' },
  { symbol: '1INCHUSDT', name: '1inch' },
  { symbol: 'SUSHIUSDT', name: 'SushiSwap' },
  { symbol: 'CRVUSDT', name: 'Curve DAO Token' },
  { symbol: 'STORJUSDT', name: 'Storj' },
  { symbol: 'RENUSDT', name: 'Ren' },
  { symbol: 'SCUSDT', name: 'Siacoin' },
  { symbol: 'ANKRUSDT', name: 'Ankr' },
  { symbol: 'BLZUSDT', name: 'Bluzelle' },
  { symbol: 'BANDUSDT', name: 'Band Protocol' },
  { symbol: 'BALLUSDT', name: 'Balancer' },
  { symbol: 'RSRUSDT', name: 'Reserve Rights' },
  { symbol: 'SKLUSDT', name: 'SKALE Network' },
  { symbol: 'REEFUSDT', name: 'Reef' },
  { symbol: 'CTSIUSDT', name: 'Cartesi' },
  { symbol: 'AUDIOUSDT', name: 'Audius' },
  { symbol: 'OGUSDT', name: 'OG Fan Token' },
  { symbol: 'UMAUSDT', name: 'UMA' },
  { symbol: 'ALPHAUSDT', name: 'Alpha Finance Lab' },
  { symbol: 'GTCUSDT', name: 'Gitcoin' },
  { symbol: 'TFUELUSDT', name: 'Theta Fuel' },
  { symbol: 'CELRUSDT', name: 'Celer Network' },
  { symbol: 'LINAUSDT', name: 'Linear' },
  { symbol: 'ICXUSDT', name: 'ICON' },
  { symbol: 'OCEANUSDT', name: 'Ocean Protocol' },
  { symbol: 'ARPAUSDT', name: 'ARPA Chain' },
  { symbol: 'KNCUSDT', name: 'Kyber Network Crystal' },
  { symbol: 'BZRXUSDT', name: 'bZx Protocol' },
  { symbol: 'IOTXUSDT', name: 'IoTeX' },
  { symbol: 'BAKEUSDT', name: 'BakeryToken' },
  { symbol: 'SUNUSDT', name: 'SUN' },
  { symbol: 'ALPHAUSDT', name: 'Alpha Finance Lab' },
  { symbol: 'XVSUSDT', name: 'Venus' },
  { symbol: 'TORNUSDT', name: 'Tornado Cash' },
  { symbol: 'LITUSDT', name: 'Litentry' },
  { symbol: 'UNFIUSDT', name: 'Unifi Protocol DAO' },
  { symbol: 'DYDXUSDT', name: 'dYdX' },
  { symbol: 'GMTUSDT', name: 'STEPN' },
  { symbol: 'APTUSDT', name: 'Aptos' },
  { symbol: 'ARBUSDT', name: 'Arbitrum' }
];

// Load assets from localStorage if available
const loadAssetsFromStorage = (): Asset[] => {
  const savedAssets = localStorage.getItem('portfolio-assets');
  return savedAssets ? JSON.parse(savedAssets) : [];
};

// Initial state
const initialState: AssetState = {
  assets: loadAssetsFromStorage(),
  availableAssets: availableCryptos,
  status: 'idle',
  error: null,
  totalPortfolioValue: 0
};

// Calculate total portfolio value and update portfolio shares
const recalculatePortfolio = (assets: Asset[]): Asset[] => {
  const totalValue = assets.reduce((sum, asset) => sum + asset.totalValue, 0);
  
  return assets.map(asset => ({
    ...asset,
    portfolioShare: totalValue > 0 ? (asset.totalValue / totalValue) * 100 : 0
  }));
};

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    // Add a new asset to the portfolio
    addAsset: (state, action: PayloadAction<AddAssetPayload>) => {
      const { symbol, name, quantity, currentPrice } = action.payload;
      
      // Check if the asset already exists
      const existingAssetIndex = state.assets.findIndex(asset => asset.symbol === symbol);
      
      if (existingAssetIndex >= 0) {
        // Update existing asset quantity
        state.assets[existingAssetIndex].quantity += quantity;
        state.assets[existingAssetIndex].totalValue = 
          state.assets[existingAssetIndex].quantity * state.assets[existingAssetIndex].currentPrice;
      } else {
        // Add new asset
        const totalValue = quantity * currentPrice;
        const newAsset: Asset = {
          id: uuidv4(),
          name,
          symbol,
          quantity,
          currentPrice,
          previousPrice: currentPrice,
          totalValue,
          change24h: 0,
          portfolioShare: 0 // Will be calculated in recalculatePortfolio
        };
        
        state.assets.push(newAsset);
      }
      
      // Recalculate portfolio shares
      state.assets = recalculatePortfolio(state.assets);
      state.totalPortfolioValue = state.assets.reduce((sum, asset) => sum + asset.totalValue, 0);
      
      // Save to localStorage
      localStorage.setItem('portfolio-assets', JSON.stringify(state.assets));
    },
    
    // Update the price of an asset based on WebSocket data
    updateAssetPrice: (state, action: PayloadAction<UpdateAssetPricePayload>) => {
      const { symbol, price } = action.payload;
      
      // Find the asset to update
      const assetIndex = state.assets.findIndex(asset => asset.symbol === symbol);
      
      if (assetIndex >= 0) {
        const asset = state.assets[assetIndex];
        
        // Store previous price for change calculation
        const previousPrice = asset.currentPrice;
        
        // Update the asset
        state.assets[assetIndex] = {
          ...asset,
          previousPrice: previousPrice,
          currentPrice: price,
          totalValue: asset.quantity * price,
          change24h: previousPrice > 0 ? ((price - previousPrice) / previousPrice) * 100 : 0
        };
        
        // Recalculate portfolio
        state.assets = recalculatePortfolio(state.assets);
        state.totalPortfolioValue = state.assets.reduce((sum, asset) => sum + asset.totalValue, 0);
        
        // Save to localStorage
        localStorage.setItem('portfolio-assets', JSON.stringify(state.assets));
      }
    },
    
    // Delete an asset from the portfolio
    deleteAsset: (state, action: PayloadAction<DeleteAssetPayload>) => {
      const { id } = action.payload;
      
      // Filter out the asset to delete
      state.assets = state.assets.filter(asset => asset.id !== id);
      
      // Recalculate portfolio
      state.assets = recalculatePortfolio(state.assets);
      state.totalPortfolioValue = state.assets.reduce((sum, asset) => sum + asset.totalValue, 0);
      
      // Save to localStorage
      localStorage.setItem('portfolio-assets', JSON.stringify(state.assets));
    }
  }
});

export const { addAsset, updateAssetPrice, deleteAsset } = assetsSlice.actions;
export default assetsSlice.reducer; 