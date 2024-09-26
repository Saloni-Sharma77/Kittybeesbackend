const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const socketHandler = require('./src/socket/socket');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // Swagger configuration
const bodyParser = require('body-parser');

const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

// Database connection
require('./src/config/db');

// Routes
const routes = require('./src/routes/routes');
app.use('/', routes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'It is working!😁' });
});

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Socket handler
socketHandler(io);

// Start the server
server.listen(port, () => {
  console.log(`Your server is running on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
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



