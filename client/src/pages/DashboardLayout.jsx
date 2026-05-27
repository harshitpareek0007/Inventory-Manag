import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, ShoppingBag } from 'lucide-react';

const DashboardLayout = () => {
  const location = useLocation();

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          Productr <span>∞</span>
        </div>
        <div className="sidebar-search">
          <input type="text" className="sidebar-search-input" placeholder="Search" />
        </div>
        <div className="sidebar-menu">
          <Link 
            to="/dashboard" 
            className={`sidebar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            <HomeIcon size={18} /> Home
          </Link>
          <Link 
            to="/dashboard/products" 
            className={`sidebar-item ${location.pathname === '/dashboard/products' ? 'active' : ''}`}
          >
            <ShoppingBag size={18} /> Products
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-title">
              {location.pathname === '/dashboard/products' ? 'Products' : ''}
            </div>
            {location.pathname === '/dashboard' && (
              <input type="text" className="topbar-search" placeholder="Search Services, Products" />
            )}
          </div>
          <div className="topbar-right">
            <div className="avatar">
              <img src="/athlete.png" alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          </div>
        </div>
        
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
