import React, { useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import AssetListItem from './AssetListItem';
import { deleteAsset } from '../../store/slices/assetsSlice';
import binanceService from '../../services/binanceService';

const AssetList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { assets } = useAppSelector((state) => state.assets);
  
  // Set up WebSocket connection to Binance for real-time price updates
  useEffect(() => {
    if (assets.length > 0) {
      const symbols = assets.map(asset => asset.symbol);
      binanceService.connect(symbols);
    }
    
    return () => {
      binanceService.disconnect();
    };
  }, [assets]);
  
  const handleDeleteAsset = (id: string) => {
    const asset = assets.find(a => a.id === id);
    if (asset) {
      dispatch(deleteAsset({ id }));
      
      // Check if we still have assets with this symbol
      const remainingAssetsWithSymbol = assets.filter(a => a.symbol === asset.symbol && a.id !== id);
      if (remainingAssetsWithSymbol.length === 0) {
        binanceService.removeSymbol(asset.symbol);
      }
    }
  };
  
  if (assets.length === 0) {
    return (
      <div className="asset-list">
        <div className="asset-list__header">
          <h2>Ваши активы</h2>
        </div>
        <div className="asset-list__empty">
          <p>В вашем портфеле еще нет активов.</p>
          <p>Добавьте ваш первый актив через форму справа.</p>
        </div>
      </div>
    );
  }
  
  // Column headers for the asset list
  const renderHeader = () => (
    <div className="asset-list__header-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '0 1rem 1rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div>Актив</div>
      <div>Кол-во</div>
      <div>Цена</div>
      <div>Стоимость</div>
      <div>24ч</div>
      <div>Доля</div>
    </div>
  );
  
  // Row renderer for react-window
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const asset = assets[index];
    return (
      <div style={style}>
        <AssetListItem asset={asset} onDelete={handleDeleteAsset} />
      </div>
    );
  };
  
  return (
    <div className="asset-list">
      <div className="asset-list__header">
        <h2>Ваши активы</h2>
        <p>Нажатие на актив приведет к удалению его из портфеля</p>
      </div>
      
      {renderHeader()}
      
      <div className="asset-list__virtualized">
        <List
          height={400}
          itemCount={assets.length}
          itemSize={70}
          width="100%"
        >
          {Row}
        </List>
      </div>
    </div>
  );
};

export default AssetList; 