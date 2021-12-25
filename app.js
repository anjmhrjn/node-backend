const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

require("./database/database");

const userRoute = require("./router/userRoute");
app.use(userRoute);

app.listen("80");
