const Link = require('../models/Link');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

exports.newLink = async(req, res, next) => {

    // Error, express-validator
    const errs = validationResult(req);
    if(!errs.isEmpty()){
        return res.status(400).json({errs: errs.array()});
    }

    const { sourceName, name } = req.body;

    // Crear enlace
    const link = new Link();
        link.url = shortid.generate();
        link.name = name;
        link.sourceName = sourceName;

    if(req.user)   {
        const {password, downloads} = req.body;
        if(downloads){
            link.downloads = downloads;
        }
        if(password){
            const salt = await bcrypt.genSalt(10);
            link.password = await bcrypt.hash(password, salt);
        }
        // Asignar autor
        link.author = req.user.id;
    }

    // Guardar en BD
    try {
        await link.save();
        return res.json({ msg : `${link.url}` });
        next();
        
    } catch (e) {
        console.log(e);
    }
}


// Lista de enlaces
exports.getAll = async (req, res) => {
    try {
        const links = await Link.find({}).select('url -_id');
        res.json({links});
    } catch (e) {
        console.log(e);
    }
 }


exports.havePass = async (req, res, next) => {
    const {url} = req.params;
    const link = await Link.findOne({url});

    if(!link){
        res.status(404).json({msg: 'Not found'});
        return next();
    }
    if(link.password){
        return res.json({file: link.name, password: true, link: link.url});
    }

    next();
}


exports.verifyPass = async (req, res, next) => {
    const {url} = req.params;
    const {password} = req.body;

    const link = await Link.findOne({url});
    if(bcrypt.compareSync(password, link.password)){
        next();
    }else{
        res.status(401).json({msg: 'Invalid password'});
    }

}


exports.getLink = async(req, res, next) => {
    const {url} = req.params;
    const link = await Link.findOne({url});

    if(!link){
        res.status(404).json({msg: 'Not found'});
        return next();
    }
    res.json({file: link.name, password: false});

    next(); 

}

