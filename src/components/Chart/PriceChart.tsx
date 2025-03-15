import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TooltipItem
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PriceChart: React.FC = () => {
  const { assets } = useAppSelector((state) => state.assets);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  
  // Generate some mock price history data for demonstration
  useEffect(() => {
    if (selectedAsset) {
      const asset = assets.find(a => a.id === selectedAsset);
      if (asset) {
        // Generate mock price history based on current price
        const basePrice = asset.currentPrice;
        const mockHistory = Array.from({ length: 30 }, (_, i) => {
          // Add some random variation to create a realistic looking chart
          const randomFactor = 0.05; // 5% max variation
          const dayFactor = (i / 30) * 0.2; // Trend factor
          const variation = (Math.random() * 2 - 1) * randomFactor;
          return basePrice * (1 + variation - dayFactor);
        }).reverse();
        
        setPriceHistory(mockHistory);
      }
    } else if (assets.length > 0) {
      // Auto-select the first asset
      setSelectedAsset(assets[0].id);
    } else {
      setPriceHistory([]);
    }
  }, [selectedAsset, assets]);
  
  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAsset(e.target.value);
  };
  
  // Prepare chart data
  const chartData = {
    labels: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Price',
        data: priceHistory,
        borderColor: '#5656ff',
        backgroundColor: 'rgba(86, 86, 255, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            const value = typeof context.raw === 'number' ? context.raw : 0;
            return `Price: $${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9e9e9e'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9e9e9e',
          callback: function(tickValue: string | number): string {
            return `$${Number(tickValue).toFixed(2)}`;
          }
        }
      }
    }
  };
  
  if (assets.length === 0) {
    return (
      <div className="chart__container">
        <div className="chart__header">
          <h2>Ценообразование</h2>
        </div>
        <div className="chart__empty">
          <p>Добавьте активы для просмотра их ценообразования</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="chart__container">
      <div className="chart__header">
        <h2>Ценообразование</h2>
        <select value={selectedAsset || ''} onChange={handleAssetChange}>
          {assets.map(asset => (
            <option key={asset.id} value={asset.id}>
              {asset.name} ({asset.symbol})
            </option>
          ))}
        </select>
      </div>
      
      <div className="chart__content">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PriceChart; 