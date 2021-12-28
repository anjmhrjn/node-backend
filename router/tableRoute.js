// const express = require('express');
// const router = new express.Router();
// const auth = require("../auth/auth");
// const table = require("../models/tableModel");

// router.post("/table/add", function(req, res) {
//     console.log(req.body)
//     res.json({})
// })

// module.exports = router;

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
        res.json({message: "Table added successfully!"});
    })
    .catch(function(e) {
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
        res.json({message: "Table Updated"});
    }).catch(function() {
        res.json({message: "Error in updating table"});
    })
})

router.delete("/table/delete/:tableId", auth.verifyTable, function(req, res) {
    const tableId = req.params.tableId;

    table.deleteOne({_id: tableId})
    .then(function() {
        res.json({message: "Table Deleted"});
    }).catch(function() {
        res.json({message: "Error in deleting table"});
    })
})


module.exports = router;

