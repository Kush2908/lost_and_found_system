const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const { requireLogin } = require('../middleware/auth');

router.post('/', requireLogin, claimController.submitClaim);
router.get('/item/:itemId', requireLogin, claimController.getClaimsByItem);

module.exports = router;
