const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

require("./database/database");

app.listen("80");
