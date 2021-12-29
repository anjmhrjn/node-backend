const mongoose = require("mongoose");

const categories = mongoose.model("Categories", {
    name: {
        type: String
    }
})

module.exports = categories;
