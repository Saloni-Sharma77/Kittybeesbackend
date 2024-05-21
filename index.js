const express = require('express');
const cors = require('cors');
// const path = require('path');
const port = process.env.PORT || 3000;

const app = express();
const server = app.listen(port, () => {
  console.log(`Your server is running on port ${port}`);
});



require('./src/config/db');
const routes = require('./src/routes/routes');

app.use(express.json());
app.use(cors());
app.use('/', routes);







