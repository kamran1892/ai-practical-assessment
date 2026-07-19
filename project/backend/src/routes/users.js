const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', userController.listUsers);

module.exports = router;
