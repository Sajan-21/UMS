const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkLogin = require('../utils/checkLogin').checkLogin;
const accessControl = require('../utils/access-control').accessControl;

function setAccessControl(access_type) {
    return (req, res, next) => {
        accessControl(access_type, req, res, next);
    }
}

router.post('/user', setAccessControl('1'),userController.createUser);
router.get('/users', setAccessControl('1'),userController.getAllUsers);
router.get('/user/:id', setAccessControl('*'),userController.getUser);


module.exports = router;