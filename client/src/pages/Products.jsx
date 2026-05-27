import React, { useState, useEffect } from 'react';
import { LayoutGrid } from 'lucide-react';
import api from '../api';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProductData, setEditProductData] = useState(null);
  const [toast, setToast] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

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

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleProductAdded = () => {
    setShowAddModal(false);
    fetchProducts();
    showToast('Product added Successfully');
  };

  const handleProductEdited = () => {
    setShowEditModal(false);
    fetchProducts();
    showToast('Product updated Successfully');
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      await api.patch(`/products/${id}/publish`, { published: !currentStatus });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setShowDeleteConfirm(null);
      fetchProducts();
      showToast('Product Deleted Successfully');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {toast && <div className="toast">{toast}</div>}
      
      {products.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <button className="btn-primary-small" onClick={() => setShowAddModal(true)}>Add your Products</button>
        </div>
      )}

      {products.length === 0 ? (
        <div className="empty-state">
          <LayoutGrid size={48} className="empty-icon" />
          <div className="empty-title">
            Feels a little empty over here...
          </div>
          <div className="empty-subtitle">
            You can create products without connecting store<br/>
            you can add products to store anytime
          </div>
          <button className="btn-primary-small" style={{marginTop: '16px'}} onClick={() => setShowAddModal(true)}>
            Add your Products
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
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
              <div className="product-card-actions">
                <button 
                  className={`btn-action ${product.published ? 'unpublish' : 'publish'}`}
                  onClick={() => togglePublish(product._id, product.published)}
                >
                  {product.published ? 'Unpublish' : 'Publish'}
                </button>
                <button className="btn-action" onClick={() => { setEditProductData(product); setShowEditModal(true); }}>Edit</button>
                <button className="btn-action delete" onClick={() => setShowDeleteConfirm(product)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onProductAdded={handleProductAdded} />}
      {showEditModal && <EditProductModal product={editProductData} onClose={() => setShowEditModal(false)} onProductEdited={handleProductEdited} />}
      
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '400px', textAlign: 'center'}}>
            <div className="modal-title" style={{marginBottom: '16px'}}>Delete Product</div>
            <div style={{marginBottom: '24px'}}>
              Are you sure you really want to delete this Product<br/>
              <strong>{showDeleteConfirm.productName}</strong> ?
            </div>
            <div style={{display: 'flex', gap: '16px', justifyContent: 'center'}}>
              <button className="btn-action" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
              <button className="btn-action delete" style={{backgroundColor: '#EF4444', color: '#fff'}} onClick={() => deleteProduct(showDeleteConfirm._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
