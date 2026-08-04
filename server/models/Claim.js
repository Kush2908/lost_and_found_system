const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true, index: true },
    claimant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    proof: { type: String, required: true, trim: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    admin_notes: { type: String, default: null, trim: true },
    legacyId: { type: Number, index: true, unique: true, sparse: true } // Preserved for data migration
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Claim', claimSchema);
