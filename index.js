require('dotenv').config();
const express = require('express');

const cors = require('cors');
const port = process.env.PORT || 4000;
const app = express();
app.listen(port, () => {
  console.log(`Your server is running on port ${port}`);
});

require('./src/config/db');
const routes = require('./src/routes/routes');

app.use(express.json());
app.use(cors());
app.use('/', routes);







