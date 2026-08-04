const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { requireLogin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'item_' + Date.now() + '_' + Math.round(Math.random()*1e9) + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
  }
});

const claimController = require('../controllers/claimController');

router.get('/', itemController.getItems);
router.get('/stats', itemController.getStats);
router.get('/:id', itemController.getItemById);
router.get('/:id/claims', requireLogin, (req, res) => {
  req.params.itemId = req.params.id;
  claimController.getClaimsByItem(req, res);
});
router.post('/', requireLogin, upload.single('image'), itemController.createItem);
router.delete('/:id', requireLogin, itemController.deleteItem);

module.exports = router;
