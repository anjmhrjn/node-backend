const express = require('express');
const router = new express.Router();
const table = require("../models/tableModel");
const user = require("../models/userModel");
const mongoose = require('mongoose');

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

router.post("/table/bulk/add", auth.verifyBusiness, function(req, res) {
    const table_number = req.body.table_number
    const table_list = table_number.split(",")
    table_list.forEach((num, index) => {
        let data = new table({
            min_capacity: req.body.min_capacity,
            max_capacity: req.body.max_capacity,
            table_number: num,
            tableOf: req.body.tableOf
        })
        data.save()
        .then(function() {
            if (index == table_list.length - 1) {
                res.json({message: "Tables added successfully!", success: true});
            }
        })
        .catch(function(e) {
            res.status(400);
            res.json(e);
        }) 
        
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

// get tables of a user
router.get("/table/user/:id", auth.verifyBusiness, function(req, res) {
    const tableOf = mongoose.Types.ObjectId(req.params.id);
    table.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "tableOf",
                foreignField: "_id",
                as: "user_detail"
            }
        },
        {
            $unwind: "$user_detail"
        },
        {
            $match: {
                tableOf: tableOf
            }
            
        }
    ])
    .then(function(result) {
        res.json(result)
    })
    .catch(function() {
        res.status(400)
        res.json({message: "something went wrong"})
    })
})

// get single table
router.get("/table/:id", auth.verifyUser, function(req, res) {
    const table_id = mongoose.Types.ObjectId(req.params.id);
    table.aggregate([
        {
            $match: {_id: table_id}
        },
        {
           $lookup:
            {
                from: "users",
                localField: "tableOf",
                foreignField: "_id",
                as: "user_detail"
            }
        },
        {
            $unwind: "$user_detail"
        }
    ])
    .then(function(result) {
        res.json(result[0])
    })
    .catch(function() {
        res.status(400)
        res.json({message: "something went wrong"})
    })
})

// get available tables
router.get("/available/tables", function(req, res){
    table.aggregate([
        {
            $match: {isAvailable: true}
        },
        {
           $lookup:
            {
                from: "users",
                localField: "tableOf",
                foreignField: "_id",
                as: "user_detail"
            }
        },
        {
            $unwind: "$user_detail"
        }
    ])
    .then(function(result) {
        res.json(result)
    })
    .catch(function() {
        res.status(400)
        res.json({message: "something went wrong"})
    })
})

// get users available tables
router.get("/user/:id/available/tables", function(req, res){
    const tableOf = mongoose.Types.ObjectId(req.params.id);
    user.findOne({_id: tableOf})
    .then(function(result) {
        let data = {}
        table.find({tableOf:tableOf, isAvailable:true})
        .then(function(tables) {
            data.tables = tables
            data.user = result
            res.json(data)
        })
        .catch(function() {
            res.status(400)
            res.json({message: "something went wrong"})
        })
        
    })
    .catch(function() {
        res.status(400)
        res.json({message: "something went wrong"})
    })
})


module.exports = router;

