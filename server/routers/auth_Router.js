const express = require('express');
const router = express.Router();
const authController = require('../controls/auth_controller')

router.post('/login',authController.login);
router.post('/forgotPassword',authController.forgetPassword);
router.patch('/resetForgotPassword',authController.passwordResetController);

module.exports = router;