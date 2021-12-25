const mongoose = require("mongoose");

const user = mongoose.model("User", {
    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    bio: {
        type: String 
    },
    user_image: {
        type: String
    }, 
    address: {
        type: String
    }, 
    phone: {
        type: Number 
    },
    isSuperUser: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    firstLogin: {
        type: Boolean,
        default: true
    },
    age: {
        type: Number
    }, 
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    }, 
    user_type: {
        type: String,
        enum: ['Customer', 'Business', 'Admin']
    }
})

module.exports = user;