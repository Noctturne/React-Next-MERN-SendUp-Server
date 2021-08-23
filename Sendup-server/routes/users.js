const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {check} = require('express-validator');

//Crear usuarios
router.post('/', 
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Use a valid email').isEmail(),
        check('password', 'Your password must be at least 6 characters long').isLength({min: 6}),
    ], 
    userController.newUser);

module.exports = router;