const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
require('dotenv').config({path: 'vars.env'});

exports.authenticateUser = async (req, res, next) => {
    // Error, express-validator
    const errs = validationResult(req);
    if(!errs.isEmpty()){
        return res.status(400).json({errs: errs.array()});
    }

    // Buscar usuario para ver si está registrado
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        res.status(401).json({msg: 'User not exists'});
        return next();
    }

    // Verificar contraseña
    if(bcrypt.compareSync(password, user.password)){
        // JWT
        const token = jwt.sign({
            id: user._id,
            name: user.name
        }, process.env.JWT_WORD, {expiresIn: '24h'});

        res.json({token});
    }else{
        res.status(401).json({msg: 'Wrong password'});
    }
}

exports.authenticatedUser = async (req, res, next) => {
    res.json({user: req.user});
}