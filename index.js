
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const socketHandler = require('./src/socket/socket');
const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(cors());

require('./src/config/db'); 
const routes = require('./src/routes/routes');
app.use('/', routes);
app.get('/', (req, res) => {
  res.json({ message: 'It is working!😁' });
});

socketHandler(io);

app.listen(port, () => {
  console.log(`Your server is running on port ${port}`);
});








