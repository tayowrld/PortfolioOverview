import React from 'react';
import { Asset } from '../../types';
import { 
  formatPrice, 
  formatCryptoAmount, 
  formatPercentage, 
  getChangeColorClass 
} from '../../utils/formatters';

interface AssetListItemProps {
  asset: Asset;
  onDelete: (id: string) => void;
}

const AssetListItem: React.FC<AssetListItemProps> = ({ asset, onDelete }) => {
  const handleClick = () => {
    if (window.confirm(`Уверены, что вы хотите удалить актив ${asset.name} из портфеля?`)) {
      onDelete(asset.id);
    }
  };
  
  return (
    <div className="asset-list__item" style={{height: "60px", position: "relative"}} onClick={handleClick}>
      <div>
        <span className="asset-list__name">{asset.name}</span>
        <span className="asset-list__symbol">{asset.symbol}</span>
      </div>
      
      <div className="asset-list__quantity">
        {formatCryptoAmount(asset.quantity)}
      </div>
      
      <div className="asset-list__price">
        {formatPrice(asset.currentPrice)}
      </div>
      
      <div className="asset-list__total">
        {formatPrice(asset.totalValue)}
      </div>
      
      <div className={`asset-list__change ${getChangeColorClass(asset.change24h)}`}>
        {formatPercentage(asset.change24h)}
      </div>
      
      <div className="asset-list__share">
        {asset.portfolioShare.toFixed(2)}%
      </div>
    </div>
  );
};

export default AssetListItem; 