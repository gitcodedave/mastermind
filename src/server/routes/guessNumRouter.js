const express = require('express');
const guessNumController = require('../controllers/guessNumController');

const router = express.Router();

/* GET request is sent with a parameter labeled guess which contains the client's n digit guess */
router.get('/:guess', guessNumController.guess, (req, res, next) => {
   return res.status(200).send(res.locals.data);
})


module.exports = router;