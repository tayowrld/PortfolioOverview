import AssetList from '../components/AssetList/AssetList';
import AddAssetForm from '../components/AddAssetForm/AddAssetForm';
import PortfolioSummary from '../components/PortfolioSummary/PortfolioSummary';
import PriceChart from '../components/Chart/PriceChart';

export default function Portfolio() {
    return (
        <div className="container">
            <h1>Обзор портфеля</h1>
            
            <div className="content">
                <div className="left-panel">
                    <AssetList />
                    <PriceChart />
                </div>
                
                <div className="right-panel">
                    <PortfolioSummary />
                    <AddAssetForm />
                </div>
            </div>
        </div>
    );
}