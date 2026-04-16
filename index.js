const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const cors = require("cors");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const userRoutes = require('./routes/userRoutes');
const orderRoutes = require("./routes/orderRoutes");
const chatRoutes = require("./routes/chatRoutes");
const teamRoutes = require("./routes/teamRoutes");
const cartRoutes = require("./routes/cartRoutes");
const Product = require("./models/product");

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://harshithacart.onrender.com',
  'https://harshithacart-frontend.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api", teamRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/cart", cartRoutes);

// Razorpay Payment Route
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Seed initial products
const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const initialProducts = [
        {
          name: 'Wireless Bluetooth Headphones',
          brand: 'Sony',
          description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality',
          price: 2999,
          discount: 15,
          profit: 20,
          gst: 18,
          finalPrice: 3022.32,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
        },
        {
          name: 'Smart Fitness Watch',
          brand: 'Apple',
          description: 'Advanced fitness tracker with heart rate monitor, GPS, sleep tracking, and water resistance',
          price: 4999,
          discount: 10,
          profit: 25,
          gst: 18,
          finalPrice: 5398.92,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
        },
        {
          name: 'Ergonomic Laptop Stand',
          brand: 'Logitech',
          description: 'Aluminum laptop stand with adjustable height, improves posture and reduces neck strain',
          price: 1499,
          discount: 5,
          profit: 30,
          gst: 18,
          finalPrice: 1798.31,
          image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop'
        },
        {
          name: 'USB-C Multiport Hub',
          brand: 'Anker',
          description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and 100W PD charging',
          price: 2499,
          discount: 20,
          profit: 25,
          gst: 18,
          finalPrice: 2724.70,
          image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400&h=400&fit=crop'
        },
        {
          name: 'Mechanical Gaming Keyboard',
          brand: 'Corsair',
          description: 'RGB mechanical keyboard with Cherry MX switches, programmable macros, and aircraft-grade aluminum frame',
          price: 3999,
          discount: 12,
          profit: 22,
          gst: 18,
          finalPrice: 4544.88,
          image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=400&fit=crop'
        },
        {
          name: 'Wireless Gaming Mouse',
          brand: 'Razer',
          description: 'High-precision wireless gaming mouse with 20,000 DPI sensor, 70-hour battery, and RGB lighting',
          price: 2999,
          discount: 18,
          profit: 25,
          gst: 18,
          finalPrice: 3157.75,
          image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop'
        },
        {
          name: 'Portable Bluetooth Speaker',
          brand: 'JBL',
          description: 'Waterproof portable speaker with powerful bass, 12-hour battery life, and PartyBoost feature',
          price: 1999,
          discount: 10,
          profit: 28,
          gst: 18,
          finalPrice: 2497.58,
          image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop'
        },
        {
          name: '4K Webcam with Microphone',
          brand: 'Logitech',
          description: 'Ultra HD 4K webcam with auto-focus, built-in noise-canceling microphone, and privacy shutter',
          price: 5999,
          discount: 15,
          profit: 20,
          gst: 18,
          finalPrice: 6022.32,
          image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=400&fit=crop'
        },
        {
          name: 'Wireless Charging Pad',
          brand: 'Samsung',
          description: 'Fast wireless charging pad compatible with all Qi-enabled devices, LED indicator',
          price: 999,
          discount: 20,
          profit: 35,
          gst: 18,
          finalPrice: 1306.69,
          image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=400&h=400&fit=crop'
        },
        {
          name: 'Noise Cancelling Earbuds',
          brand: 'Samsung',
          description: 'True wireless earbuds with active noise cancellation, premium sound, and 8-hour battery',
          price: 3999,
          discount: 12,
          profit: 22,
          gst: 18,
          finalPrice: 4544.88,
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop'
        },
        {
          name: 'External SSD 1TB',
          brand: 'Western Digital',
          description: 'Portable SSD with 1TB storage, read speeds up to 1050MB/s, compact and durable design',
          price: 7999,
          discount: 10,
          profit: 18,
          gst: 18,
          finalPrice: 8557.16,
          image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop'
        },
        {
          name: 'USB Microphone for Streaming',
          brand: 'Blue Yeti',
          description: 'Professional USB microphone with four pickup patterns, ideal for streaming and podcasting',
          price: 4999,
          discount: 8,
          profit: 25,
          gst: 18,
          finalPrice: 6217.85,
          image: 'https://images.unsplash.com/photo-1590602847861-e7f0738e1b7c?w=400&h=400&fit=crop'
        },
        {
          name: 'Smart Speaker with Alexa',
          brand: 'Amazon',
          description: 'Voice-controlled smart speaker with premium sound and Alexa integration',
          price: 4499,
          discount: 20,
          profit: 15,
          gst: 18,
          finalPrice: 4414.12,
          image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66eb?w=400&h=400&fit=crop'
        },
        {
          name: 'Gaming Monitor 27 inch',
          brand: 'ASUS',
          description: '27-inch 4K gaming monitor with 144Hz refresh rate and HDR support',
          price: 15999,
          discount: 15,
          profit: 18,
          gst: 18,
          finalPrice: 16227.96,
          image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop'
        },
        {
          name: 'Wireless Keyboard and Mouse Combo',
          brand: 'Logitech',
          description: 'Wireless keyboard and mouse combo with ergonomic design and long battery life',
          price: 1999,
          discount: 10,
          profit: 25,
          gst: 18,
          finalPrice: 2296.85,
          image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop'
        },
        {
          name: 'Power Bank 20000mAh',
          brand: 'Xiaomi',
          description: '20000mAh power bank with fast charging and dual USB output',
          price: 1499,
          discount: 15,
          profit: 20,
          gst: 18,
          finalPrice: 1534.18,
          image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop'
        },
        {
          name: 'Smart TV Stick 4K',
          brand: 'Amazon',
          description: 'Streaming device with 4K Ultra HD support and voice remote',
          price: 3499,
          discount: 12,
          profit: 18,
          gst: 18,
          finalPrice: 3797.14,
          image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop'
        },
        {
          name: 'Fitness Band with Heart Rate',
          brand: 'Xiaomi',
          description: 'Fitness band with heart rate monitor, sleep tracking, and 14-day battery',
          price: 1999,
          discount: 18,
          profit: 22,
          gst: 18,
          finalPrice: 2263.40,
          image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop'
        },
        {
          name: 'Tablet 10 inch',
          brand: 'Samsung',
          description: '10.1-inch tablet with HD display, 32GB storage, and long battery life',
          price: 12999,
          discount: 10,
          profit: 15,
          gst: 18,
          finalPrice: 13849.35,
          image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop'
        },
        {
          name: 'Wireless Earbuds Pro',
          brand: 'OnePlus',
          description: 'True wireless earbuds with active noise cancellation and premium sound',
          price: 2999,
          discount: 15,
          profit: 20,
          gst: 18,
          finalPrice: 3022.32,
          image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop'
        },
        {
          name: 'Smart Home Hub',
          brand: 'Google',
          description: 'Smart home hub with voice assistant and compatibility with 5000+ devices',
          price: 7999,
          discount: 12,
          profit: 18,
          gst: 18,
          finalPrice: 8679.14,
          image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400&h=400&fit=crop'
        },
        {
          name: 'Portable Projector',
          brand: 'Epson',
          description: 'Mini portable projector with 1080p support and built-in speakers',
          price: 9999,
          discount: 15,
          profit: 20,
          gst: 18,
          finalPrice: 10074.10,
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop'
        },
        {
          name: 'VR Headset',
          brand: 'Meta',
          description: 'Virtual reality headset with immersive experience and hand tracking',
          price: 24999,
          discount: 8,
          profit: 15,
          gst: 18,
          finalPrice: 26748.93,
          image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=400&fit=crop'
        },
        {
          name: 'Smart Door Lock',
          brand: 'Samsung',
          description: 'Fingerprint smart door lock with app control and emergency key backup',
          price: 8999,
          discount: 12,
          profit: 18,
          gst: 18,
          finalPrice: 9759.14,
          image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=400&fit=crop'
        },
        {
          name: 'Air Purifier HEPA',
          brand: 'Xiaomi',
          description: 'Smart air purifier with HEPA filter, real-time air quality monitoring',
          price: 5999,
          discount: 18,
          profit: 20,
          gst: 18,
          finalPrice: 6778.87,
          image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop'
        },
        {
          name: 'Electric Kettle 1.8L',
          brand: 'Prestige',
          description: 'Stainless steel electric kettle with auto shut-off and boil-dry protection',
          price: 1299,
          discount: 15,
          profit: 25,
          gst: 18,
          finalPrice: 1467.62,
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
        },
        {
          name: 'Instant Camera',
          brand: 'Fujifilm',
          description: 'Instant camera with auto exposure and built-in selfie mirror',
          price: 6999,
          discount: 10,
          profit: 18,
          gst: 18,
          finalPrice: 7598.85,
          image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop'
        },
        {
          name: 'Desk Fan with Remote',
          brand: 'Bajaj',
          description: 'High-speed desk fan with remote control and 3-speed settings',
          price: 2499,
          discount: 20,
          profit: 22,
          gst: 18,
          finalPrice: 2821.87,
          image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop'
        },
        {
          name: 'Robot Vacuum Cleaner',
          brand: 'iRobot',
          description: 'Smart robot vacuum with mapping technology and app control',
          price: 19999,
          discount: 12,
          profit: 15,
          gst: 18,
          finalPrice: 21298.93,
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
        }
      ];
      
      await Product.insertMany(initialProducts);
      console.log('✅ Initial products seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    seedProducts();
  })
  .catch((err) => console.log(err));

// Test Route
app.get("/", (req, res) => {
  res.send("Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);














