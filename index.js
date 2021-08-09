require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const domainRoutes = require("./routes/domain");

const app = express();

app.use(express.json());
app.use(cors());

app.use(domainRoutes);

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => app.listen(process.env.PORT || 3000, () => console.log("Server is running!")))
    .catch(err => console.log(err));