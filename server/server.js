require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const claimRoutes = require('./routes/claimRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const { requireLogin } = require('./middleware/auth');
const connectDB = require('./config/mongoDb');
const Item = require('./models/Item');
const Claim = require('./models/Claim');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Ensure DB connection before handling any requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/admin', adminRoutes);

// User dashboard
app.get('/api/user/dashboard', requireLogin, async (req, res) => {
  try {
    const userId = req.user.id;
    const itemsData = await Item.find({ reporter_id: userId }).sort({ created_at: -1 }).lean();
    
    const claimsData = await Claim.find({ claimant_id: userId })
      .populate('item_id', 'title type')
      .sort({ created_at: -1 })
      .lean();
      
    const claims = claimsData.map(c => ({
      ...c,
      item_title: c.item_id?.title,
      item_type: c.item_id?.type
    }));
    
    let active_items = 0, items_resolved = 0;
    itemsData.forEach(i => { 
      if (i.status === 'resolved') items_resolved++; 
      else active_items++; 
    });
    
    const userStats = {
      total_reported: itemsData.length,
      active_items,
      items_resolved,
      total_claims: claims.length
    };
    
    const activities = [
      ...itemsData.map(i => ({ ...i, id: i._id, action_type: 'reported_item', item_title: i.title, item_id: i._id })),
      ...claims.map(c => ({ ...c, id: c._id, action_type: 'claim', item_id: c.item_id?._id || c.item_id }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).reverse().slice(0, 10);
    
    res.json({
      stats: userStats,
      items: itemsData.map(i => ({ ...i, id: i._id })),
      claims: claims.map(c => ({ ...c, id: c._id })),
      activities,
      user: req.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
