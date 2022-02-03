const express = require('express');
const router = new express.Router();
const item = require("../models/itemModel");

const auth = require("../auth/auth");
const upload = require("../uploads/file");
const mongoose = require("mongoose");


router.post("/item/add", auth.verifyBusiness, upload.single('images'), function(req, res) {
    const categories = JSON.parse(req.body.categories)
    const data = new item({
        name: req.body.name,
        categories: categories,
        price: req.body.price,
        description: req.body.description,
        itemOf: req.body.itemOf,
        images: req.file.filename
    })
    data.save()
    .then(function(result) {
        res.json({message: "Item added successfully!", success: true});
    })
    .catch(function(e) {
        res.json(e);
    })
    
})

router.put("/item/update/:itemId", auth.verifyItem, function(req, res) {
    let idata = req.body
    const itemId = req.params.itemId;
    console.log(idata)

    const primary_fields = ["_id", "itemOf", "images"]
    primary_fields.forEach(function(value) {
        delete idata[value];
    })

    item.updateOne({_id: itemId}, idata)
    .then(function() {
        res.json({message: "Item Updated", success: true});
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

router.put("/item/:itemId/remove-image/", auth.verifyItem, function(req, res) {
    let idata = req.body
    const itemId = req.params.itemId;
    const image = idata["image"];

    item.updateOne({_id: itemId}, {images: ''})
    .then(function() {
        res.json({message: "Image Removed", success: true});
    }).catch(function() {
        res.json({message: "Error in removing image"});
    })
})

router.put("/item/:itemId/add-item-image/", auth.verifyItem, upload.single('image'), function(req, res) {

    const itemId = req.params.itemId;

    item.updateOne({_id: itemId}, {images: req.file.filename})
    .then(function() {
        res.json({message: "Image Replaced", success: true});
    }).catch(function() {
        res.json({message: "Error in adding image"});
    })
})

router.get("/my-items/", auth.verifyBusiness, function(req, res) {
    const userId = req.userInfo._id;
    item.aggregate([
        {
            $match: {itemOf: userId}
        },
        {
           $lookup:
            {
                from: "categories",
                localField: "categories",
                foreignField: "_id",
                as: "category_info"
            }
        }
    ])
    .then(function(result) {
        res.json(result)
    })
    .catch(function() {
        res.json({message: "something went wrong"})
    })
})

router.get("/all-items/", function(req, res) { 
    item.aggregate([
        {
           $lookup:
            {
                from: "categories",
                localField: "categories",
                foreignField: "_id",
                as: "category_info"
            }
        }
    ])
    .then(function(result) {
        res.json(result)
    })
    .catch(function() {
        res.json({message: "something went wrong"})
    })
})

router.get("/users-items/:userId", function(req, res) { 
    const userId = mongoose.Types.ObjectId(req.params.userId)
    item.aggregate([
        {
            $match: {itemOf: userId}
        },
        {
           $lookup:
            {
                from: "categories",
                localField: "categories",
                foreignField: "_id",
                as: "category_info"
            }
        }
    ])
    .then(function(result) {
        res.json(result)
    })
    .catch(function() {
        res.json({message: "something went wrong"})
    })
})

router.get("/items/:itemId", auth.verifyItem, function(req, res) { 
    const itemId = mongoose.Types.ObjectId(req.params.itemId)
    item.aggregate([
        {
            $match: {_id: itemId}
        },
        {
           $lookup:
            {
                from: "categories",
                localField: "categories",
                foreignField: "_id",
                as: "category_info"
            }
        }
    ])
    .then(function(result) {
        res.json(result[0])
    })
    .catch(function() {
        res.json({message: "something went wrong"})
    })
})

router.delete("/item/delete/:itemId", auth.verifyItem, function(req, res) {
    const itemId = req.params.itemId;

    item.deleteOne({_id: itemId})
    .then(function() {
        res.json({message: "Item Deleted", success: true});
    }).catch(function() {
        res.status(400);
        res.json({message: "Error in deleting table"});
    })
})

module.exports = router;

