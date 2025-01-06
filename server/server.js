const express = require('express');
const connectDB = require('./db/conn');
const recordRoutes = require('./routes/record');
const cors = require('cors'); // Import cors

const app = express();

app.use(cors()); // Use cors as middleware

app.use(express.json());
connectDB();
app.use(recordRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});