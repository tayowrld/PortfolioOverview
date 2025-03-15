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
  { symbol: 'AVAXUSDT', name: 'Avalanche' }
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