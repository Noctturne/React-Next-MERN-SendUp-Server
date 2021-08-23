const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');
const {check} = require('express-validator');
const auth = require('../middlewares/auth');

router.post('/', 
[
    check('name', 'You have to upload a file').not().isEmpty(),
    check('sourceName', 'You have to upload a file').not().isEmpty()
],
auth, linkController.newLink);

router.get('/', linkController.getAll);
router.get('/:url', linkController.havePass, linkController.getLink);
router.post('/:url', linkController.verifyPass, linkController.getLink);

module.exports = router;