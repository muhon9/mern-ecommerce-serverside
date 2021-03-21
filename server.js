const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const fs = require("fs");

const app = express();

//connecting DB
mongoose.connect(process.env.DATABASE,
    {useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false})
    .then(()=> console.log("DB Connected"))
    .catch((err)=> console.log("Connectin error", err));
mongoose.Promise = global.Promise;


//using middleware
app.use(morgan("dev"));
app.use(bodyParser.json({limit:"2mb"}));
app.use(cors());



//setting up the routes middleware


fs.readdirSync('./routes').map((r)=> app.use('/api',require("./routes/"+r)));


//setting the port
const port = process.env.PORT || 8000;
app.listen(port,()=>{
  console.log("Server Connected at port",port,"Browse localhost:8000");
})