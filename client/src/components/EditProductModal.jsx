import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../api';

const EditProductModal = ({ product, onClose, onProductEdited }) => {
  const [formData, setFormData] = useState({
    productName: product.productName,
    productType: product.productType,
    quantityStock: product.quantityStock,
    mrp: product.mrp,
    sellingPrice: product.sellingPrice,
    brandName: product.brandName,
    exchangeEligibility: product.exchangeEligibility
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    images.forEach(img => {
      data.append('images', img);
    });

    try {
      await api.put(`/products/${product._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onProductEdited();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">Edit Product</div>
          <X className="modal-close" onClick={onClose} />
        </div>
        
        <div className="form-row">
          <label className="form-label">Product Name</label>
          <input 
            type="text" 
            name="productName"
            className="form-input"
            value={formData.productName}
            onChange={handleChange}
          />
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
          <input type="number" name="quantityStock" className="form-input" value={formData.quantityStock} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label className="form-label">MRP</label>
          <input type="number" name="mrp" className="form-input" value={formData.mrp} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label className="form-label">Selling Price</label>
          <input type="number" name="sellingPrice" className="form-input" value={formData.sellingPrice} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label className="form-label">Brand Name</label>
          <input type="text" name="brandName" className="form-input" value={formData.brandName} onChange={handleChange} />
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
          <button className="btn-submit" onClick={handleSubmit}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
