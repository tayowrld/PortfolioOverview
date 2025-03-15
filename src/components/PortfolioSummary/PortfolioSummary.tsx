import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { formatPrice, formatPercentage, getChangeColorClass } from '../../utils/formatters';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PortfolioSummary: React.FC = () => {
  const { assets, totalPortfolioValue } = useAppSelector((state) => state.assets);
  
  // Calculate total 24h change
  const calculateTotalChange = () => {
    if (assets.length === 0) return 0;
    
    const totalChange = assets.reduce((sum, asset) => {
      return sum + (asset.change24h * asset.portfolioShare / 100);
    }, 0);
    
    return totalChange;
  };
  
  const totalChange = calculateTotalChange();
  
  // Prepare data for the doughnut chart
  const chartData = {
    labels: assets.map(asset => asset.name),
    datasets: [
      {
        data: assets.map(asset => asset.portfolioShare),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#8AC249',
          '#EA5545',
          '#F46A9B',
          '#EF9B20'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#fff'
        }
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const label = context.label || '';
            const value = typeof context.raw === 'number' ? context.raw : 0;
            return `${label}: ${value.toFixed(2)}%`;
          }
        }
      }
    }
  };
  
  if (assets.length === 0) {
    return (
      <div className="portfolio-summary">
        <div className="portfolio-summary__header">
          <h2>Сводка портфеля</h2>
        </div>
        <div className="portfolio-summary__empty">
          <p>Добавьте активы в портфель, для анализа сводки</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="portfolio-summary">
      <div className="portfolio-summary__header">
        <h2>Сводка портфеля</h2>
      </div>
      
      <div className="portfolio-summary__total">
        {formatPrice(totalPortfolioValue)}
      </div>
      
      <div className="portfolio-summary__stat-grid">
        <div className="portfolio-summary__stat">
          <h4>Суточные изменения</h4>
          <p className={getChangeColorClass(totalChange)}>
            {formatPercentage(totalChange)}
          </p>
        </div>
        
        <div className="portfolio-summary__stat">
          <h4>Активы</h4>
          <p>{assets.length}</p>
        </div>
      </div>
      
      <div className="portfolio-summary__distribution">
        <h3>Распределение активов</h3>
        <div className="portfolio-summary__chart-container">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;