const express = require("express");
const cors = require('cors');
const path = require("path");

/* Insert routers */
const randomNumRouter = require('./routes/randomNumRouter.js');
const guessNumRouter = require('./routes/guessNumRouter.js')

const PORT = 3000;
const app = express();
app.use(express.json())
app.use(cors());

/* Connect API routes */
app.use('/randomNum', randomNumRouter);
app.use('/guessNum', guessNumRouter);

app.use(express.static('dist'));
app.get('/', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '/public/index.html'));
  });


app.listen(PORT, () => console.log(`Backend server is listening on PORT ${PORT}`))