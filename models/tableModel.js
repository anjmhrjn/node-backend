const mongoose = require("mongoose");
const user = require("../models/userModel");

const table = mongoose.model("Table", {
    min_capacity: {
        type: Number,
        min: 1,
        default: 1
    },
    max_capacity: {
        type: Number
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    table_number: {
        type: Number,
        required: true
    },
    tableOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
})

module.exports = table;