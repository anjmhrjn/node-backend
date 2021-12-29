const express = require('express');
const router = new express.Router();
const item = require("../models/itemModel");

const auth = require("../auth/auth");
const upload = require("../uploads/file");


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

module.exports = router;

