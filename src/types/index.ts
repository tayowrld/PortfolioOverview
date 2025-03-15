// Asset Types
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  currentPrice: number;
  previousPrice?: number;
  totalValue: number;
  change24h: number;
  portfolioShare: number;
}

// Binance WebSocket Types
export interface BinanceTickerResponse {
  stream: string;
  data: {
    e: string; // Event type
    E: number; // Event time
    s: string; // Symbol
    p: string; // Price change
    P: string; // Price change percent
    w: string; // Weighted average price
    c: string; // Last price
    Q: string; // Last quantity
    o: string; // Open price
    h: string; // High price
    l: string; // Low price
    v: string; // Total traded base asset volume
    q: string; // Total traded quote asset volume
    O: number; // Statistics open time
    C: number; // Statistics close time
    F: number; // First trade ID
    L: number; // Last trade ID
    n: number; // Total number of trades
  };
}

// Redux Store Types
export interface AssetState {
  assets: Asset[];
  availableAssets: {
    symbol: string;
    name: string;
  }[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  totalPortfolioValue: number;
}

// Action Types
export type AddAssetPayload = {
  symbol: string;
  name: string;
  quantity: number;
  currentPrice: number;
};

export type UpdateAssetPricePayload = {
  symbol: string;
  price: number;
};

export type DeleteAssetPayload = {
  id: string;
};