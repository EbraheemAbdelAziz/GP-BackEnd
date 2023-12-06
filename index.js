// ================= INITIALIZE EXEPRESS APP =================
const express = require("express");
const app = express();

// ================= GLOBAL MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('upload'));
const cors = require("cors");
app.use(cors());
const port = 4000 

// ================= REQUIRED MODULE =================
const auth = require('./routes/Auth');
const skins = require("./routes/Skins");

// ================= RUN THE APP =================
app.listen(port ,"localhost" , () => console.log("SERVER IS RUNING "));

// ================= API ROUTES  =================
app.use("/auth", auth);
app.use("/skins", skins);