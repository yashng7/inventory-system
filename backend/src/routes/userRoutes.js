const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createStaffUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getUserStats);
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', createStaffUser);
router.put('/:id', updateUser);
router.patch('/:id/toggle-status', toggleUserStatus);
router.delete('/:id', deleteUser);

module.exports = router;