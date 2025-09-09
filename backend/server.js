require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { MONGO_URI } = process.env;
const app = express();

app.use(cors());
app.use(express.json()); // body parser first

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use("/api/dashboard", require("./routes/dashboard"));

mongoose.connect(process.env.MONGO_URI, {}).then(()=>console.log('MongoDB Connected'));

app.listen(5000, ()=>console.log('Server running on port 5000'));





// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const { MONGO_URI } = require("./config");



// const app = express();

// //Middleware
// app.use(cors());
// app.use(bodyParser.json());


// // Routes
// const jobRoutes = require("./routes/jobs");
// const authRoutes = require("./routes/auth");
// const resumeRoutes = require("./routes/resume");
// app.use("/api/resume", resumeRoutes);
// app.use("/api/jobs", jobRoutes);
// app.use("/api/auth", authRoutes);




// // DB Connect
// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));


// // Server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
