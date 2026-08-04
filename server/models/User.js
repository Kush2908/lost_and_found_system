const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true, default: '', trim: true },
    phone: { type: String, default: null, trim: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    legacyId: { type: Number, index: true, unique: true, sparse: true } // Preserved for data migration
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('User', userSchema);
