import { BinanceTickerResponse } from '../types';
import { store } from '../store';
import { updateAssetPrice } from '../store/slices/assetsSlice';

class BinanceService {
  private socket: WebSocket | null = null;
  private symbols: string[] = [];
  private connectionUrl = 'wss://stream.binance.com:9443/stream';

  // Connect to Binance WebSocket with the given symbols
  connect(symbols: string[]) {
    this.symbols = symbols;

    if (this.symbols.length === 0) {
      console.warn('Нет символов для подписки');
      return;
    }

    // Close existing connection if any
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    // Create streams string for each symbol
    const streams = this.symbols.map(symbol => `${symbol.toLowerCase()}@ticker`).join('/');
    const url = `${this.connectionUrl}?streams=${streams}`;

    try {
      // Create new WebSocket connection
      this.socket = new WebSocket(url);

      // Set up event handlers
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onerror = this.handleError.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
    } catch (error) {
      console.error('Ошибка подключения к Binance WebSocket:', error);
    }
  }

  // Disconnect from WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // Add a new symbol to the subscription
  addSymbol(symbol: string) {
    if (!this.symbols.includes(symbol)) {
      this.symbols.push(symbol);
      
      // Reconnect with updated symbols list
      this.connect(this.symbols);
    }
  }

  // Remove a symbol from the subscription
  removeSymbol(symbol: string) {
    this.symbols = this.symbols.filter(s => s !== symbol);
    
    // Reconnect with updated symbols list if there are any symbols left
    if (this.symbols.length > 0) {
      this.connect(this.symbols);
    } else {
      this.disconnect();
    }
  }

  // WebSocket event handlers
  private handleOpen() {
    console.log('Подключено к Binance WebSocket');
  }

  private handleMessage(event: MessageEvent) {
    try {
      const response: BinanceTickerResponse = JSON.parse(event.data);
      
      if (response && response.data) {
        const { s: symbol, c: lastPrice } = response.data;
        const price = parseFloat(lastPrice);
        
        // Dispatch price update to Redux store
        store.dispatch(updateAssetPrice({ symbol, price }));
      }
    } catch (error) {
      console.error('Ошибка обработки WebSocket сообщения:', error);
    }
  }

  private handleError(error: Event) {
    console.error('WebSocket отправляет ошибку:', error);
  }

  private handleClose(event: CloseEvent) {
    console.log('Отключено от Binance WebSocket:', event.code, event.reason);
    
    // Try to reconnect if not intentionally closed
    if (this.symbols.length > 0 && event.code !== 1000) {
      console.log('Попытка переподключения...');
      setTimeout(() => {
        this.connect(this.symbols);
      }, 5000); // Reconnect after 5 seconds
    }
  }
}

export default new BinanceService(); 