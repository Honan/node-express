const express = require('express');
const router = express.Router();
const controller = require('../controllers');

router.get('/', controller.indexGet);
router.post('/', controller.indexPost);

router.get('/login', controller.loginGet);
router.post('/login', controller.loginPost);

router.get('/admin', controller.adminGet);
router.post('/admin/skills', controller.skillsPost);
router.post('/admin/upload', controller.uploadPost);

module.exports = router;
