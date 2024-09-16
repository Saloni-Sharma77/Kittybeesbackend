
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





// const dotenv = require('dotenv');
// dotenv.config(); // Load environment variables

// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const socketIo = require('socket.io');
// const socketHandler = require('./src/socket/socket'); // Ensure the path is correct
// const port = process.env.PORT || 4000;

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server); // Initialize Socket.IO with the HTTP server

// app.use(express.json()); // Middleware to parse JSON bodies
// app.use(cors()); // Middleware to enable CORS

// // Ensure you have a correct path to your routes
// const routes = require('./src/routes/routes');
// app.use('/', routes);

// // Health check route
// app.get('/', (req, res) => {
//     res.json({ message: 'It is working!😁' });
// });

// // Initialize Socket.IO event handlers
// socketHandler(io);

// // Start server
// server.listen(port, () => {
//     console.log(`Your server is running on port ${port}`);
// });



