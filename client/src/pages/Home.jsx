import React, { useState, useEffect } from 'react';
import { LayoutGrid } from 'lucide-react';
import api from '../api';

const Home = () => {
  const [activeTab, setActiveTab] = useState('Published');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const displayedProducts = products.filter(p => activeTab === 'Published' ? p.published : !p.published);

  return (
    <div className="page-content">
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'Published' ? 'active' : ''}`}
          onClick={() => setActiveTab('Published')}
        >
          Published
        </div>
        <div 
          className={`tab ${activeTab === 'Unpublished' ? 'active' : ''}`}
          onClick={() => setActiveTab('Unpublished')}
        >
          Unpublished
        </div>
      </div>

      {displayedProducts.length === 0 ? (
        <div className="empty-state">
          <LayoutGrid size={48} className="empty-icon" />
          <div className="empty-title">
            No {activeTab} Products
          </div>
          <div className="empty-subtitle">
            Your {activeTab} Products will appear here<br/>
            Create your first product to publish
          </div>
        </div>
      ) : (
        <div className="products-grid">
          {displayedProducts.map(product => (
            <div key={product._id} className="product-card">
              <img src={`http://localhost:5000${product.images[0] || ''}`} alt={product.productName} className="product-card-img" />
              <div className="product-card-title">{product.productName}</div>
              <div className="product-card-brand">{product.brandName}</div>
              <div className="product-card-details">
                <div>Type: <strong>{product.productType}</strong></div>
                <div>Stock: <strong>{product.quantityStock}</strong></div>
                <div>MRP: <strong>₹{product.mrp}</strong></div>
                <div>Price: <strong>₹{product.sellingPrice}</strong></div>
                <div>Images: <strong>{product.images.length}</strong></div>
                <div>Exchange: <strong>{product.exchangeEligibility}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
