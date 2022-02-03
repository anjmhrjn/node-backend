const mongoose = require("mongoose");
const user = require("./userModel");
const categories = require("../models/categoryModel");

const item = mongoose.model("Item", {
    name: {
        type: String
    },
    categories: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'categories'
    },
    price: {
        type: Number
    },
    images: {
        type: String
    },
    description: {
        type: String 
    },
    itemOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

module.exports = item;