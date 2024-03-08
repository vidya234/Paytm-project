//Backend main index.js file

const express = require('express');
const cors = require('cors');
const rootRoute = require('./routes/index');
const app = express();

//using cors middleware
app.use(cors());

//using express.json middleware
app.use(express.json());

//using the root route
app.use("/api/v1", rootRoute);

//listen to the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});