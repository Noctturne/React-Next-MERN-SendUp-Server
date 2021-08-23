const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'vars.env'});

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(authHeader){
        // Obtener el token
        const token = authHeader.split(' ')[1];
        
        try {
            const user = jwt.verify(token, process.env.JWT_WORD);
            req.user = user;
        } catch (e) {
            console.log(e);
        }

    }
    // Va al siguiente middleware
    return next();
}