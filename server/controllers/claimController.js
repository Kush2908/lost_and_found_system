const Claim = require('../models/Claim');
const Item = require('../models/Item');

exports.submitClaim = async (req, res) => {
  try {
    const { item_id, proof } = req.body;
    if (!proof || proof.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide proof of ownership.' });
    }
    if (proof.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide more detail (at least 20 characters).' });
    }
    
    // Check duplicate
    const existing = await Claim.findOne({ item_id, claimant_id: req.user.id });
    if (existing) return res.status(400).json({ error: 'You have already submitted a claim for this item.' });

    // Insert
    const newClaim = await Claim.create({
      item_id,
      claimant_id: req.user.id,
      proof
    });
    
    res.json({ message: 'Claim submitted', id: newClaim._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getClaimsByItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId).select('reporter_id');
    if (!item) return res.status(404).json({ error: 'Item not found' });
    
    // Authorization check
    if (req.user.role !== 'admin' && item.reporter_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const claimsData = await Claim.find({ item_id: itemId })
      .populate('claimant_id', 'full_name email phone username')
      .sort({ created_at: -1 })
      .lean();
      
    const claims = claimsData.map(c => ({
      ...c,
      claimant_name: c.claimant_id?.full_name,
      email: c.claimant_id?.email,
      phone: c.claimant_id?.phone,
      username: c.claimant_id?.username
    }));

    res.json(claims);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
