const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {check} = require('express-validator');
const auth = require('../middlewares/auth');

// Crear usuario autenticado
router.post('/', 
    [
        check('email', 'You have to use an email').not().isEmpty(),
        check('password', 'Password is empty').not().isEmpty()
   ],
      authController.authenticateUser);

// Obtener usuario autenticado
router.get('/', 
    auth,
    authController.authenticatedUser);

module.exports = router;