import React, { useState, useEffect } from 'react';
import { LayoutGrid, X } from 'lucide-react';
import api from '../api';

const AddProductModal = ({ onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    productName: '',
    productType: 'Foods',
    quantityStock: '',
    mrp: '',
    sellingPrice: '',
    brandName: '',
    exchangeEligibility: 'Yes'
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    if (!formData.productName) {
      setError('Please enter product name');
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    images.forEach(img => {
      data.append('images', img);
    });

    try {
      await api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onProductAdded();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">Add Product</div>
          <X className="modal-close" onClick={onClose} />
        </div>
        
        <div className="form-row">
          <label className="form-label">Product Name</label>
          <input 
            type="text" 
            name="productName"
            className={`form-input ${error ? 'error' : ''}`}
            placeholder="CakeZone Walnut Brownie"
            value={formData.productName}
            onChange={handleChange}
            style={error ? {borderColor: '#EF4444'} : {}}
          />
          {error && <div style={{color: '#EF4444', fontSize: '12px', marginTop: '4px'}}>{error}</div>}
        </div>

        <div className="form-row">
          <label className="form-label">Product Type</label>
          <select name="productType" className="form-input" value={formData.productType} onChange={handleChange}>
            <option>Foods</option>
            <option>Electronics</option>
            <option>Clothes</option>
            <option>Beauty Products</option>
            <option>Others</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Quantity Stock</label>
          <input type="number" name="quantityStock" className="form-input" placeholder="Total numbers of Stock available" value={formData.quantityStock} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label className="form-label">MRP</label>
          <input type="number" name="mrp" className="form-input" placeholder="Total numbers of Stock available" value={formData.mrp} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label className="form-label">Selling Price</label>
          <input type="number" name="sellingPrice" className="form-input" placeholder="Total numbers of Stock available" value={formData.sellingPrice} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label className="form-label">Brand Name</label>
          <input type="text" name="brandName" className="form-input" placeholder="Total numbers of Stock available" value={formData.brandName} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label className="form-label">Upload Product Images</label>
          <label className="upload-box">
            <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{display: 'none'}} />
            <div className="upload-text">Enter Description</div>
            <div className="upload-browse">Browse</div>
            {images.length > 0 && <div style={{marginTop: '8px', fontSize: '12px'}}>{images.length} files selected</div>}
          </label>
        </div>

        <div className="form-row">
          <label className="form-label">Exchange or return eligibility</label>
          <select name="exchangeEligibility" className="form-input" value={formData.exchangeEligibility} onChange={handleChange}>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        <div className="modal-footer">
          <button className="btn-submit" onClick={handleSubmit}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
