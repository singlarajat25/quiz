const express = require('express');
const router = express.Router();

/* GET home page. */
const question = require('./question');


router.use('/question', question);
module.exports = router;
