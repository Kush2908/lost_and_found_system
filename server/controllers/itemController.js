const Item = require('../models/Item');
const User = require('../models/User');

exports.getItems = async (req, res) => {
  try {
    const { search, category, type, location, date, page = 1 } = req.query;
    const limit = 9;
    const skip = (page - 1) * limit;

    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (location) filter.location = location;
    if (date) {
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);
      filter.date_lost_found = { $gte: startDate, $lte: endDate };
    }

    const total = await Item.countDocuments(filter);
    
    // Using lean() and map to add reporter_name to match SQL output shape
    const itemsData = await Item.find(filter)
      .populate('reporter_id', 'username')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const items = itemsData.map(item => ({
      ...item,
      id: item._id,
      reporter_name: item.reporter_id?.username || 'Unknown'
    }));

    res.json({
      items,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await Item.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          lost_count: [
            { $match: { type: 'lost' } },
            { $count: "count" }
          ],
          found_count: [
            { $match: { type: 'found' } },
            { $count: "count" }
          ],
          resolved_count: [
            { $match: { status: 'resolved' } },
            { $count: "count" }
          ]
        }
      }
    ]);

    const result = {
      total: stats[0].total[0]?.count || 0,
      lost_count: stats[0].lost_count[0]?.count || 0,
      found_count: stats[0].found_count[0]?.count || 0,
      resolved_count: stats[0].resolved_count[0]?.count || 0
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('reporter_id', 'username full_name email phone')
      .lean();
      
    if (!item) return res.status(404).json({ error: 'Item not found' });
    
    // Flatten reporter_id fields to match old SQL join output
    const formattedItem = {
      ...item,
      id: item._id,
      username: item.reporter_id?.username,
      full_name: item.reporter_id?.full_name,
      email: item.reporter_id?.email,
      phone: item.reporter_id?.phone
    };
    
    // Fetch claims for this item
    const Claim = require('../models/Claim');
    const claims = await Claim.find({ item_id: req.params.id })
      .populate('claimant_id', 'username full_name')
      .lean();
      
    const formattedClaims = claims.map(c => ({
      ...c,
      id: c._id,
      claimant_name: c.claimant_id?.username || 'Unknown',
      claimant_full_name: c.claimant_id?.full_name || 'Unknown'
    }));
    
    res.json({ item: formattedItem, claims: formattedClaims });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { title, description, category, type, location, date_lost_found } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required.' });
    if (title.length > 150) return res.status(400).json({ error: 'Title cannot exceed 150 characters.' });
    if (!description) return res.status(400).json({ error: 'Description is required.' });
    if (!category) return res.status(400).json({ error: 'Category is required.' });
    if (!['lost', 'found'].includes(type)) return res.status(400).json({ error: 'Please select Lost or Found.' });
    if (!location) return res.status(400).json({ error: 'Location is required.' });
    if (!date_lost_found) return res.status(400).json({ error: 'Date is required.' });
    
    let imagePath = null;
    if (req.file) {
      imagePath = 'uploads/' + req.file.filename;
    }
    
    const newItem = await Item.create({
      title, description, category, type, location, date_lost_found, image_path: imagePath, reporter_id: req.user.id
    });
    
    res.json({ message: 'Item created', id: newItem._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const result = await Item.findOneAndDelete({ _id: req.params.id, reporter_id: req.user.id });
    if (!result) return res.status(403).json({ error: 'Forbidden' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
