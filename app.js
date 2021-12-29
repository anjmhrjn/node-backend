const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

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
