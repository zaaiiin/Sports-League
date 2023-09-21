const express = require("express");
const cors = require("cors");
const server = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON request bodies
server.use(express.json());

server.use(cors());

// Serve your db.json file
server.get("/api/data", (req, res) => {
  const data = require("./db.json"); // Assuming db.json is in the same directory
  res.json(data);
});

// Start the Express server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = server;
