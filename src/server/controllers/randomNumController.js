const randomNumController = {};
const db = require('../models/database.js')

randomNumController.generate = async(req, res, next) => {
    /* API is called and returns a JSON object, converted to plain text */
    const randomNums = await fetch('https://www.random.org/integers/?num=4&min=0&max=7&col=4&base=10&format=plain&rnd=new')
        .then((data) => data.text());

    /* The API response data is normalized and then passed as an argument into the db.newGame method */
    db.newGame(randomNums.replace(/\s/g, ''));
    res.locals.randomNums = randomNums.replace(/\s/g, '');
    next();
}

module.exports = randomNumController;