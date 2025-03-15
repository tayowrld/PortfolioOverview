import axios from 'axios';

// Binance API base URL for price data
const API_BASE_URL = 'https://api.binance.com/api/v3';

// Service for getting cryptocurrency price data
class PriceService {
  // Get the current price of a single symbol
  async getPrice(symbol: string): Promise<number> {
    try {
      const response = await axios.get(`${API_BASE_URL}/ticker/price`, {
        params: { symbol }
      });
      
      if (response.data && response.data.price) {
        return parseFloat(response.data.price);
      }
      
      throw new Error('Цена не доступна');
    } catch (error) {
      console.error(`Ошибка при получении цены для ${symbol}:`, error);
      throw error;
    }
  }
  
  // Get prices for multiple symbols at once
  async getPrices(symbols: string[]): Promise<Record<string, number>> {
    try {
      // Get all ticker prices
      const response = await axios.get(`${API_BASE_URL}/ticker/price`);
      
      if (response.data && Array.isArray(response.data)) {
        // Filter and map the results
        const priceMap: Record<string, number> = {};
        
        response.data.forEach((item: { symbol: string; price: string }) => {
          if (symbols.includes(item.symbol)) {
            priceMap[item.symbol] = parseFloat(item.price);
          }
        });
        
        return priceMap;
      }
      
      throw new Error('Информация о ценах не доступна');
    } catch (error) {
      console.error('Ошибка при получении цен:', error);
      throw error;
    }
  }
  
  // Get 24hr price change data for a symbol
  async get24hChange(symbol: string): Promise<{ priceChange: number; priceChangePercent: number }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/ticker/24hr`, {
        params: { symbol }
      });
      
      if (response.data) {
        return {
          priceChange: parseFloat(response.data.priceChange),
          priceChangePercent: parseFloat(response.data.priceChangePercent)
        };
      }
      
      throw new Error('Данные о цене не доступны');
    } catch (error) {
      console.error(`Ошибка при получении 24ч изменения для ${symbol}:`, error);
      throw error;
    }
  }
}

export default new PriceService(); 