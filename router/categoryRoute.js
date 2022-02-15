const express = require('express');
const router = new express.Router();
const categories = require("../models/categoryModel");

const auth = require("../auth/auth");

router.post("/category/add", auth.verifyBusinessAdmin, function(req, res) {
    const data = new categories({
        name: req.body.name
    })
    data.save()
    .then(function(result) {
        res.json({message: "Category added successfully!", data: result, success: true});
    })
    .catch(function(e) {
        res.json(e);
    })
    
})

router.put("/category/update/:id", auth.verifyAdmin, function(req, res) {
    const category_id = req.params.id
    categories.updateOne({_id: category_id}, {name: req.body.name})
    .then(function() {
        res.json({message: "Category Updated", success: true});
    }).catch(function() {
        res.json({message: "Error in updating category"});
    })    
})

router.delete("/category/delete/:id", auth.verifyAdmin, function(req, res) {
    const category_id = req.params.id
    categories.deleteOne({_id: category_id})
    .then(function() {
        res.status(204)
        res.json({message: "Category Deleted", success: true});
    }).catch(function() {
        res.json({message: "Error in deleting category"});
    })
})

router.get("/all-categories/", function(req, res) { 
    categories.find()
    .then(function(result) {
        res.json(result)
    })
    .catch(function() {
        res.json({message: "something went wrong"})
    })
})

router.get("/category/:catid", function(req, res) { 
    const category_id = req.params.catid
    categories.findOne({_id: category_id})
    .then(function(result) {
        res.json(result)
    })
    .catch(function() {
        res.json({message: "something went wrong"})
    })
})

module.exports = router