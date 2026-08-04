const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    type: { type: String, enum: ['lost', 'found'], required: true, index: true },
    location: { type: String, required: true, trim: true },
    date_lost_found: { type: Date, required: true },
    image_path: { type: String, default: null },
    status: { type: String, enum: ['reported', 'verified', 'claimed', 'resolved'], default: 'reported', index: true },
    reporter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    legacyId: { type: Number, index: true, unique: true, sparse: true } // Preserved for data migration
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Item', itemSchema);
