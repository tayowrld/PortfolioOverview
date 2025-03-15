import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addAsset } from '../../store/slices/assetsSlice';
import priceService from '../../services/priceService';
import binanceService from '../../services/binanceService';

const AddAssetForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { availableAssets } = useAppSelector((state) => state.assets);
  
  const [selectedAsset, setSelectedAsset] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
    setQuantity('');
    setError(null);
  };
  
  return (
    <div className="add-asset-form">
      <div className="add-asset-form__header">
        <h2>Добавление актива</h2>
      </div>
      
      <form className="add-asset-form__form" onSubmit={handleSubmit}>
        <div className="add-asset-form__group">
          <label htmlFor="asset">Актив:</label>
          <select
            id="asset"
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            disabled={loading}
          >
            <option value="">Выберите актив</option>
            {availableAssets.map((asset) => (
              <option key={asset.symbol} value={asset.symbol}>
                {asset.name} ({asset.symbol})
              </option>
            ))}
          </select>
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