const express = require('express');
const router = express.Router();
const userController = require('../controls/user_controller');
const { access_controller } = require('../utils/access_controller');

function setAccessController(access_type) {
    return (req, res, next) => {
        access_controller(access_type, req, res, next);
    }
}

router.post('/user',setAccessController("1"),userController.createUser);
router.get('/users',setAccessController("1"),userController.getUsers);
router.get('/user/:id',setAccessController("*"),userController.getUser);
router.put('/user/:id',setAccessController("1,2"),userController.updateUser);
router.put('/resetpassword/:id',setAccessController("*"),userController.resetPassword);
router.delete('/user/:id',setAccessController("1"),userController.deleteUser);

module.exports = router;