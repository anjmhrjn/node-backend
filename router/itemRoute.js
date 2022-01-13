const express = require('express');
const router = new express.Router();
const item = require("../models/itemModel");

const auth = require("../auth/auth");
const upload = require("../uploads/file");
const mongoose = require("mongoose");


router.post("/item/add", auth.verifyBusiness, upload.array('images'), function(req, res) {
    let images = [];
    req.files.forEach(function(value) {
        images.push(value.filename);
    })
    const data = new item({
        name: req.body.name,
        categories: req.body.categories,
        price: req.body.price,
        description: req.body.description,
        itemOf: req.body.itemOf,
        images: images
    })
    data.save()
    .then(function() {
        res.json({message: "Item added successfully!"});
    })
    .catch(function(e) {
        res.json(e);
    })
    
})

router.put("/item/update/:itemId", auth.verifyItem, function(req, res) {
    let idata = req.body
    const itemId = req.params.itemId;

    const primary_fields = ["_id", "itemOf", "categories", "images"]
    primary_fields.forEach(function(value) {
        delete idata[value];
    })

    item.updateOne({_id: itemId}, idata)
    .then(function() {
        res.json({message: "Item Updated"});
    }).catch(function() {
        res.json({message: "Error in updating item"});
    })
})

router.put("/item/:itemId/remove-category/", auth.verifyItem, function(req, res) {
    let idata = req.body
    const itemId = req.params.itemId;
    const category = mongoose.Types.ObjectId(idata["category"]);

    item.updateOne({_id: itemId}, {$pull : {categories: category}})
    .then(function() {
        res.json({message: "Category Updated"});
    }).catch(function() {
        res.json({message: "Error in removing category"});
    })
})

router.put("/item/:itemId/add-item-category/", auth.verifyItem, function(req, res) {
    let idata = req.body
    const itemId = req.params.itemId;
    const category = idata["category"];

    item.updateOne({_id: itemId}, {$push : {categories: category}})
    .then(function() {
        res.json({message: "Category Added"});
    }).catch(function() {
        res.json({message: "Error in adding category"});
    })
})

module.exports = router;

