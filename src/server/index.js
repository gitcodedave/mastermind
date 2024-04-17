const express = require("express");
const cors = require('cors');
const path = require('path');

/* Insert routers */
const gameRouter = require('./routes/gameRouter.js');

const PORT = 3000;
const app = express();
app.use(express.json())
app.use(cors());

/* Connect API routes */
app.use('/game', gameRouter);

app.use(express.static('dist'));
app.get('/', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '/public/index.html'));
  });


app.listen(PORT, () => console.log(`Backend server is listening on PORT ${PORT}`))