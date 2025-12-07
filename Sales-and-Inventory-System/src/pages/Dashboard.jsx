import { useApp } from '../context/AppContext';
import './Dashboard.css';

const Dashboard = () => {
  const { getStats } = useApp();
  const stats = getStats();

  const currencyFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  });

  const statCards = [
    {
      title: 'Menu Items',
      value: stats.totalProducts,
      icon: '☕',
      color: '#7a5230',
      bgColor: '#f5e2d5',
    },
    {
      title: 'Low Stock Ingredients',
      value: stats.lowStockProducts,
      icon: '⚠️',
      color: '#d97706',
      bgColor: '#fdeed3',
    },
    {
      title: 'Inventory Value',
      value: currencyFormatter.format(stats.totalValue),
      icon: '🫘',
      color: '#6b3f26',
      bgColor: '#f2d9c1',
    },
    {
      title: 'Orders Served',
      value: stats.totalSales,
      icon: '🥐',
      color: '#9d4b2b',
      bgColor: '#fde6d8',
    },
    {
      title: 'Total Revenue',
      value: currencyFormatter.format(stats.totalRevenue),
      icon: '💸',
      color: '#047857',
      bgColor: '#d7f0e5',
    },
    {
      title: 'Today\'s Orders',
      value: stats.todaySales,
      icon: '📊',
      color: '#8c4a32',
      bgColor: '#f6dfcf',
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back to the Tastea Bites Dashboard.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.bgColor, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-footer">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Dashboard;

