const User = require('../models/User');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

exports.newUser = async (req, res) => {

    // Error, express-validator
    const errs = validationResult(req);
    if(!errs.isEmpty()){
        return res.status(400).json({errs: errs.array()});
    }

    // Verificación y validación
    const {email, password} = req.body;
    let user = await User.findOne({email});

    if(user){
        return res.status(400).json({msg: 'User already exists'});
    }

    user = new User(req.body);
    // Hash
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    try {
        await user.save();
        res.json({msg: "User created! "});
    } catch (e) {
        console.log(e);
    }
}