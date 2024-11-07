const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const { access_controller } = require('../utils/access-controller');

function setAccessController(access_type) {
    return (req, res, next) => {
        access_controller(access_type, req, res, next);
    }
}

router.post('/user',userController.createUser);
router.patch('/user/:id',userController.resetPassword);
router.get('/users',userController.getUsers);
router.get('/user/:id',userController.getUser);
router.put('/user/:id',userController.updateUser);
router.patch('/forgotPassword/:id',userController.forgotPassword);
router.delete('/user/:id',userController.deleteUser);

module.exports = router;