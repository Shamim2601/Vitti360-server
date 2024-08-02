const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Import and use the routes from main-routes.js
const mainRoutes = require('./main-routes');
app.use('/', mainRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
