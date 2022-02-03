const express = require('express');
const router = new express.Router();
const table = require("../models/tableModel");

const auth = require("../auth/auth");

router.post("/table/add", auth.verifyBusiness, function(req, res) {
    const data = new table({
        min_capacity: req.body.min_capacity,
        max_capacity: req.body.max_capacity,
        table_number: req.body.table_number,
        tableOf: req.body.tableOf
    })
    data.save()
    .then(function() {
        res.json({message: "Table added successfully!", success: true});
    })
    .catch(function(e) {
        res.status(400);
        res.json(e);
    })
    
})

router.put("/table/update/:tableId", auth.verifyTable, function(req, res) {
    let tdata = req.body
    const tableId = req.params.tableId;

    const primary_fields = ["_id", "tableOf"]
    primary_fields.forEach(function(value) {
        delete tdata[value];
    })

    table.updateOne({_id: tableId}, tdata)
    .then(function() {
        res.json({message: "Table Updated", success: true});
    }).catch(function() {
        res.status(400);
        res.json({error: "Error in updating table"});
    })
})

router.delete("/table/delete/:tableId", auth.verifyTable, function(req, res) {
    const tableId = req.params.tableId;

    table.deleteOne({_id: tableId})
    .then(function() {
        res.json({message: "Table Deleted", success: true});
    }).catch(function() {
        res.status(400);
        res.json({message: "Error in deleting table"});
    })
})

router.get("/table/user/:id", auth.verifyBusiness, function(req, res) {
    const tableOf = req.params.id;
    table.find({tableOf: tableOf})
    .then(function(result) {
        res.json(result)
    })
    .catch(function() {
        res.status(400)
        res.json({message: "something went wrong"})
    })
})

router.get("/table/:id", auth.verifyBusiness, function(req, res) {
    const table_id = req.params.id;
    table.findOne({_id: table_id})
    .then(function(result) {
        res.json(result)
    })
    .catch(function() {
        res.status(400)
        res.json({message: "something went wrong"})
    })
})


module.exports = router;

