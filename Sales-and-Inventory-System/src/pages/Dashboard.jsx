import { useApp } from '../context/AppContext';
import './Dashboard.css';

const Dashboard = () => {
  const { getStats } = useApp();
  const stats = getStats();

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockProducts,
      icon: '⚠️',
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      title: 'Inventory Value',
      value: `₱${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: '💵',
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      title: 'Total Sales',
      value: stats.totalSales,
      icon: '💰',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: '📈',
      color: '#ec4899',
      bgColor: '#fce7f3',
    },
    {
      title: 'Today\'s Sales',
      value: stats.todaySales,
      icon: '📊',
      color: '#06b6d4',
      bgColor: '#cffafe',
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your Sales & Inventory Management System</p>
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

