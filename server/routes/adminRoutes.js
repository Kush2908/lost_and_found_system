const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

router.use(requireAdmin);

router.get('/dashboard', adminController.getDashboardStats);
router.get('/items', adminController.getAllItems);
router.put('/items/:id/status', adminController.updateItemStatus);
router.delete('/items/:id', adminController.deleteItem);

router.get('/claims', adminController.getAllClaims);
router.put('/claims/:id/approve', adminController.approveClaim);
router.put('/claims/:id/reject', adminController.rejectClaim);
router.delete('/claims/:id', adminController.deleteClaim);

router.get('/users', adminController.getAllUsers);
router.put('/users/:id/toggle-role', adminController.toggleUserRole);
router.delete('/users/:id', adminController.deleteUser);

router.get('/categories', adminController.getAllCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);

router.get('/locations', adminController.getAllLocations);
router.post('/locations', adminController.createLocation);
router.put('/locations/:id', adminController.updateLocation);

module.exports = router;
