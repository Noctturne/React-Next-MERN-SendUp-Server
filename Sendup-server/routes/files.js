const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const auth = require('../middlewares/auth');


router.post('/', auth, fileController.newFile);
router.get('/:file', fileController.download, fileController.deleteFile);

module.exports = router;