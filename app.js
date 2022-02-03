const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname+'/images'))

require("./database/database");

const userRoute = require("./router/userRoute");
app.use(userRoute);

const tableRoute = require("./router/tableRoute");
app.use(tableRoute);

const categoryRoute = require("./router/categoryRoute");
app.use(categoryRoute);

const itemRoute = require("./router/itemRoute");
app.use(itemRoute);

app.listen("80");
