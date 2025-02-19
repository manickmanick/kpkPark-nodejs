require('dotenv').config()
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const router = require("./router/routes");

app.use(express.json());

app.use(router);



app.listen(PORT,()=>{
    console.log(`app listening on port ${PORT}`);
});