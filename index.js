const express = require('express');
const connectDB = require('./db');
const cors = require('cors');

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Import and use the routes from main-routes.js
const mainRoutes = require('./main-routes');
app.use('/', mainRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
