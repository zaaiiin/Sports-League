const express = require("express");
const app = express();
const port = process.env.PORT || 3001; // Use the provided PORT or a default one

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve your db.json file
app.get("/api/data", (req, res) => {
  const data = require("./db.json"); // Assuming db.json is in the same directory
  res.json(data);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
