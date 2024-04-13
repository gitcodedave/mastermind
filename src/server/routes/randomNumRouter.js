const express = require('express');
const randomNumController = require('../controllers/randomNumController.js')

const router = express.Router();

/* GET request will generate and return a random n digit number as a string */
router.get('/', randomNumController.generate, (req, res, next) => {
    return res.status(200).json(res.locals.randomNums);
})

module.exports = router;