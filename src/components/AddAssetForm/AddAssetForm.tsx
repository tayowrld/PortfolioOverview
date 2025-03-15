import React, { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addAsset } from '../../store/slices/assetsSlice';
import priceService from '../../services/priceService';
import binanceService from '../../services/binanceService';

const AddAssetForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { availableAssets } = useAppSelector((state) => state.assets);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Фильтр активов на основе поискового запроса и приоритизация результатов
  const filteredAssets = availableAssets
    .filter(asset => 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Приоритизация по началу имени
      const aNameStartsWith = a.name.toLowerCase().startsWith(searchQuery.toLowerCase());
      const bNameStartsWith = b.name.toLowerCase().startsWith(searchQuery.toLowerCase());
      
      if (aNameStartsWith && !bNameStartsWith) return -1;
      if (!aNameStartsWith && bNameStartsWith) return 1;
      
      // Затем приоритизация по началу символа
      const aSymbolStartsWith = a.symbol.toLowerCase().startsWith(searchQuery.toLowerCase());
      const bSymbolStartsWith = b.symbol.toLowerCase().startsWith(searchQuery.toLowerCase());
      
      if (aSymbolStartsWith && !bSymbolStartsWith) return -1;
      if (!aSymbolStartsWith && bSymbolStartsWith) return 1;
      
      // Если оба начинаются или оба не начинаются, сортировка по алфавиту
      return a.name.localeCompare(b.name);
    });
  
  // Обработчик выбора актива из выпадающего списка
  const handleAssetSelect = (symbol: string) => {
    setSelectedAsset(symbol);
    
    // Найти выбранный актив, чтобы отобразить его имя в поле ввода
    const asset = availableAssets.find(a => a.symbol === symbol);
    if (asset) {
      setSearchQuery(asset.name);
    }
    
    setShowDropdown(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAsset || !quantity) {
      setError('Пожалуйста, выберите актив и его количество!');
      return;
    }
    
    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError('Количество должно быть числом больше 0 и не пустым');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Get the selected asset details
      const asset = availableAssets.find(a => a.symbol === selectedAsset);
      if (!asset) {
        throw new Error('Выбранный актив не найден, перезагрузите страницу и выберите актив снова');
      }
      
      // Get the current price from Binance API
      const price = await priceService.getPrice(selectedAsset);
      
      // Dispatch action to add the asset
      dispatch(addAsset({
        symbol: selectedAsset,
        name: asset.name,
        quantity: quantityNum,
        currentPrice: price
      }));
      
      // Add the symbol to WebSocket subscription if not already subscribed
      binanceService.addSymbol(selectedAsset);
      
      // Reset form
      setSelectedAsset('');
      setSearchQuery('');
      setQuantity('');
    } catch (err) {
      setError('При добавлении актива произошла ошибка. Пожалуйста, попробуйте снова через некоторое время.');
      console.error('Ошибка при добавлении актива:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setSelectedAsset('');
    setSearchQuery('');
    setQuantity('');
    setError(null);
  };
  
  // Закрываем выпадающий список при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="add-asset-form">
      <div className="add-asset-form__header">
        <h2>Добавление актива</h2>
      </div>
      
      <form className="add-asset-form__form" onSubmit={handleSubmit}>
        <div className="add-asset-form__group">
          <label htmlFor="asset-search">Актив:</label>
          <div 
            className="add-asset-form__search-container"
            ref={searchContainerRef}
          >
            <input
              id="asset-search"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
                if (e.target.value === '') {
                  setSelectedAsset('');
                }
              }}
              onClick={() => setShowDropdown(true)}
              placeholder="Поиск актива..."
              disabled={loading}
              className="add-asset-form__search-input"
            />
            
            {showDropdown && (
              <div className="add-asset-form__dropdown">
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <div
                      key={asset.symbol}
                      className={`add-asset-form__dropdown-item ${selectedAsset === asset.symbol ? 'active' : ''}`}
                      onClick={() => handleAssetSelect(asset.symbol)}
                    >
                      <span className="add-asset-form__dropdown-name">{asset.name}</span>
                      <span className="add-asset-form__dropdown-symbol">{asset.symbol}</span>
                    </div>
                  ))
                ) : (
                  <div className="add-asset-form__dropdown-empty">Активы не найдены</div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="add-asset-form__group">
          <label htmlFor="quantity">Количество:</label>
          <input
            id="quantity"
            type="number"
            step="any"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Введите количество"
            disabled={loading}
          />
        </div>
        
        {error && <div className="add-asset-form__error">{error}</div>}
        
        <div className="add-asset-form__actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Добавление...' : 'Добавить актив'}
          </button>
          
          <button
            type="button"
            className="btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Сброс
          </button>
        </div>
      </form>
      
      {loading && <div className="spinner"></div>}
    </div>
  );
};

export default AddAssetForm; 