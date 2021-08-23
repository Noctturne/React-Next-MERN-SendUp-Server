const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Link = require('../models/Link');

/* Permitir solo algunos tipos de archivos
    fileFilter: (req, file, cb) => {
        if(file.mimetype === 'application/pdf'){
            return cb(null, true);
        }
    }
*/

exports.newFile = async (req, res, next) => {
    // Subir archivos
    const configMulter = {
        limits: { fileSize: req.user ? 1024 * 1024 * 10 :1024 * 1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads');
            },
            filename: (req, file, cb) => {
                const ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${ext}`);
            }
        })
    }

    const upload = multer(configMulter).single('file');

    upload(req, res, async (err) => {
        if(!err){
            res.json({file: req.file.filename});
        }else{
            console.log(err);
            return next();
        }
    });
}

exports.download = async (req,res, next ) => {
    const {file} = req.params;
    const link = await Link.findOne({name: file});

    const fileDownload = __dirname + '/../uploads/' + file;
    res.download(fileDownload);

    // Eliminarlo +1
    const {downloads, name} = link;
    if(downloads === 1){
        // Eliminar archivo 
        req.file = name;
        // Eliminarlo de la BD
        await Link.findOneAndRemove(link.id);
        next();
    }else{
        link.downloads--;
        await link.save();
    }
}

exports.deleteFile = async(req, res) => {
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.file}`);
    } catch (e) {
        console.log(e);
    }
}

