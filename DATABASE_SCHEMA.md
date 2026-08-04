# Database Schema

The Online Lost and Found System uses MongoDB with Mongoose ODM. Below is the detailed schema documentation.

## User Model
Stores user credentials, profile information, and role.

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  contactNumber: { type: String },
  profilePictureUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

## Item Model
Represents items that have been reported lost or found.

```javascript
const itemSchema = new mongoose.Schema({
  type: { type: String, enum: ['lost', 'found'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  dateLostOrFound: { type: Date, required: true },
  images: [{ type: String }],
  status: { type: String, enum: ['open', 'resolved', 'closed'], default: 'open' },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

## Claim Model
Handles requests by users to claim a 'found' item or match a 'lost' item.

```javascript
const claimSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  claimerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proofDescription: { type: String, required: true },
  proofImages: [{ type: String }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

## Category Model
Standardized categories for items (e.g., Electronics, Keys, Wallets).

```javascript
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String },
  isActive: { type: Boolean, default: true }
});
```

## Location Model
Standardized locations (e.g., Library, Cafeteria, Building A).

```javascript
const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  building: { type: String },
  description: { type: String },
  isActive: { type: Boolean, default: true }
});
```
