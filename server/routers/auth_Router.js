const express = require('express');
const router = express.Router();
const authController = require('../controls/auth_controller')

router.post('/login',authController.login);

module.exports = router;