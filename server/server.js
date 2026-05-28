require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const User = require('./models/User');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('./public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/productr_db')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes

// Auth
app.post('/auth/login', async (req, res) => {
 
    const { phoneOrEmail } = req.body;
    if (!phoneOrEmail) return res.status(400).json({ message: 'Phone or email is required' });

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated OTP for ${phoneOrEmail}: ${otp}`);

    let user = await User.findOne({ phoneOrEmail });
    if (!user) {
      user = new User({ phoneOrEmail, otp });
    } else {
      user.otp = otp;
    }
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: phoneOrEmail,
      subject: 'Your OTP Code',
      text: `OTP Verification\nYour OTP is: ${otp}`
    };
     

    
      
      await transporter.sendMail(mailOptions);
   
    
      
    

    res.json({ message: 'OTP sent successfully', phoneOrEmail, otp });
  
  
  
  });

app.post('/auth/verify-otp', async (req, res) => {
  try {
    const { phoneOrEmail, otp } = req.body;
    if (!phoneOrEmail || !otp) return res.status(400).json({ message: 'Phone/email and OTP are required' });

    const user = await User.findOne({ phoneOrEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.otp = null; // clear OTP
    await user.save();

    res.json({ message: 'Login successful', token: 'mock-jwt-token' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Products
app.post('/products', upload.array('images', 5), async (req, res) => {
  try {
    const {
      productName,
      productType,
      quantityStock,
      mrp,
      sellingPrice,
      brandName,
      exchangeEligibility
    } = req.body;

    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const product = new Product({
      productName,
      productType,
      quantityStock,
      mrp,
      sellingPrice,
      brandName,
      exchangeEligibility,
      images: imagePaths,
      published: false
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/products/:id', upload.array('images', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/products/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;
    const { published } = req.body;
    
    const product = await Product.findByIdAndUpdate(id, { published }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: `Product ${published ? 'published' : 'unpublished'} successfully`, product });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
