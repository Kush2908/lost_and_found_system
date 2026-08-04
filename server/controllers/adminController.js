const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Item = require('../models/Item');
const Claim = require('../models/Claim');
const User = require('../models/User');
const Category = require('../models/Category');
const Location = require('../models/Location');

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      total_items, lost_items, found_items, pending_items, verified_items, resolved_items,
      total_claims, pending_claims,
      total_users, admin_users
    ] = await Promise.all([
      Item.countDocuments(),
      Item.countDocuments({ type: 'lost' }),
      Item.countDocuments({ type: 'found' }),
      Item.countDocuments({ status: 'reported' }),
      Item.countDocuments({ status: 'verified' }),
      Item.countDocuments({ status: 'resolved' }),
      Claim.countDocuments(),
      Claim.countDocuments({ status: 'pending' }),
      User.countDocuments(),
      User.countDocuments({ role: 'admin' })
    ]);

    const stats = {
      total_items, lost_items, found_items, pending_items, verified_items, resolved_items,
      total_claims, pending_claims, total_users, admin_users
    };

    const recentItemsData = await Item.find().populate('reporter_id', 'username').sort({ created_at: -1 }).limit(5).lean();
    const recentItems = recentItemsData.map(i => ({ ...i, username: i.reporter_id?.username }));

    const recentClaimsData = await Claim.find()
      .populate('claimant_id', 'full_name')
      .populate('item_id', 'title')
      .sort({ created_at: -1 })
      .limit(5)
      .lean();
      
    const recentClaims = recentClaimsData.map(c => ({
      ...c,
      full_name: c.claimant_id?.full_name,
      item_title: c.item_id?.title
    }));
    
    // Generate last 7 days chart data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split('T')[0]);
    }
    
    // Group items by date and type
    const itemsLast7Days = await Item.find({
      created_at: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
    }).lean();
    
    const chartData = last7Days.map(date => {
      const dayItems = itemsLast7Days.filter(i => new Date(i.created_at).toISOString().split('T')[0] === date);
      return {
        name: date.substring(5), // e.g. "08-04"
        lost: dayItems.filter(i => i.type === 'lost').length,
        found: dayItems.filter(i => i.type === 'found').length
      };
    });
    
    res.json({ stats, recentItems, recentClaims, chartData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const { status, type } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    
    const itemsData = await Item.find(filter)
      .populate('reporter_id', 'full_name')
      .sort({ created_at: -1 })
      .lean();
      
    const items = itemsData.map(i => ({ ...i, id: i._id, reporter_name: i.reporter_id?.full_name }));
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateItemStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['reported','verified','claimed','resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    await Item.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: 'Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item && item.image_path) {
      const p = path.join(__dirname, '..', item.image_path);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllClaims = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;
    
    const claimsData = await Claim.find(filter)
      .populate('item_id', 'title type')
      .populate('claimant_id', 'full_name username email')
      .sort({ created_at: -1 })
      .lean();
      
    const claims = claimsData.map(c => ({
      ...c,
      id: c._id,
      item_title: c.item_id?.title,
      item_type: c.item_id?.type,
      item_id: c.item_id?._id || c.item_id,
      full_name: c.claimant_id?.full_name,
      username: c.claimant_id?.username,
      email: c.claimant_id?.email
    }));
    
    res.json(claims);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.approveClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) throw new Error('Claim not found');
    const itemId = claim.item_id;
    
    await Claim.findByIdAndUpdate(req.params.id, { status: 'approved' });
    await Item.findByIdAndUpdate(itemId, { status: 'claimed' });
    await Claim.updateMany(
      { item_id: itemId, _id: { $ne: req.params.id }, status: 'pending' },
      { status: 'rejected' }
    );
    
    res.json({ message: 'Approved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.rejectClaim = async (req, res) => {
  try {
    await Claim.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    res.json({ message: 'Rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteClaim = async (req, res) => {
  try {
    await Claim.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'items',
          localField: '_id',
          foreignField: 'reporter_id',
          as: 'user_items'
        }
      },
      {
        $lookup: {
          from: 'claims',
          localField: '_id',
          foreignField: 'claimant_id',
          as: 'user_claims'
        }
      },
      {
        $addFields: {
          item_count: { $size: '$user_items' },
          claim_count: { $size: '$user_claims' },
          id: '$_id'
        }
      },
      {
        $project: {
          user_items: 0,
          user_claims: 0,
          password: 0
        }
      },
      {
        $sort: { created_at: -1 }
      }
    ]);
    
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.toggleUserRole = async (req, res) => {
  try {
    if (req.user.id === req.params.id) return res.status(400).json({ error: 'Cannot modify own account' });
    const user = await User.findById(req.params.id);
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await User.findByIdAndUpdate(req.params.id, { role: newRole });
    res.json({ message: 'Toggled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.id === req.params.id) return res.status(400).json({ error: 'Cannot delete own account' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, active } = req.body;
    const cat = await Category.create({ name, active: active !== undefined ? active : true });
    res.status(201).json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, active } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (active !== undefined) update.active = active;
    const cat = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ name: 1 });
    res.json(locations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createLocation = async (req, res) => {
  try {
    const { name, active } = req.body;
    const loc = await Location.create({ name, active: active !== undefined ? active : true });
    res.status(201).json(loc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { name, active } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (active !== undefined) update.active = active;
    const loc = await Location.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(loc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
