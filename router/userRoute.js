const express = require('express');
const bcryptjs = require('bcryptjs');
const router = new express.Router();
const jwt = require("jsonwebtoken");
const user = require("../models/userModel");
const mongoose = require("mongoose")

const auth = require("../auth/auth");
const upload = require("../uploads/file");
const booking = require('../models/bookingModel');
const table = require('../models/tableModel');
const categories = require('../models/categoryModel');

router.post("/user/register", function(req, res) {
    const username = req.body.username;

    user.findOne({username: username})
    .then(function(userData) {
        if (userData !== null) {
            res.status(400);
            res.json({message: "User already exists!"})
            return;
        }
        const password = req.body.password;
        bcryptjs.hash(password, 10, function(e, hashed_value) {
            const email = req.body.email;
            const user_type = req.body.user_type

            const data = new user({
                username: username,
                password: hashed_value,
                email: email,
                user_type: user_type
            })
            data.save()
            .then(function() {
                res.json({message: "User registered successfully!", success: true});
            })
            .catch(function(e) {
                res.status(400);
                res.json(e);
            })
        })
    })
})

router.post("/user/login", function(req, res) {
    const username = req.body.username;
    user.findOne({username: username})
    .then(function(userData) {
        if (userData === null) {
            res.status(400);
            return res.json({message: "Invalid login credentials!"})
        } else {
            const password = req.body.password;
            bcryptjs.compare(password, userData.password, function(e, result) {
                if (!result) {
                    res.status(400);
                    return res.json({message: "Invalid username or password!"});
                }
                const token = jwt.sign({userId: userData._id}, "restrobooking");
                const userDetails = {
                    userId: userData._id,
                    username: userData.username,
                    email: userData.email,
                    user_type: userData.user_type,
                    token: token,
                    user_image: userData.user_image
                }
                res.json({
                    token: token, 
                    message: "Logging you in!", 
                    success: true, 
                    userdetails: userDetails
                })
            })
        }
    })
})

router.put("/change-password", auth.verifyUser, function(req, res) {
    const username = req.userInfo.username;
    user.findOne({username: username})
    .then(function(userData) {
        const old_password = req.body.oldPassword;
        bcryptjs.compare(old_password, userData.password, function(e, result) {
            if (!result) {
                res.status(400);
                return res.json({message: "Old Password does not match!"});
            }
            const new_password = req.body.newPassword;
            bcryptjs.hash(new_password, 10, function(e, hashed_value) {
                user.updateOne({username: username}, {password: hashed_value})
                .then(function() {
                    res.status(200).json({message: "Password updated!", success: true});
                })
                .catch(function(e) {
                    res.status(400);
                    res.json(e);
                })
            })
        })
    })
})

router.put("/profile/update/:username", function(req, res) {
    let udata = req.body;
    // if (req.file !== undefined) {
    //     udata["user_image"] = req.file.filename;
    // }

    const primary_fields = ["_id", "username", "user_type"]
    primary_fields.forEach(function(value) {
        delete udata[value];
    })

    const username = req.params.username
    user.updateOne({username: username}, udata)
    .then(function() {
        res.json({message: "Profile Updated", success: true});
    }).catch(function() {
        res.status(400);
        res.json({message: "Error in updating profile"});
    })
})

router.put("/profile/change-pic/:username", upload.single("profile_pic"), function(req, res) {
    let data = {}
    if (req.file !== undefined) {
        data["user_image"] = req.file.filename;
    }

    const username = req.params.username
    user.updateOne({username: username}, data)
    .then(function() {
        res.json({message: "Picture Updated", success: true});
    }).catch(function() {
        res.status(400);
        res.json({message: "Error in updating profile"});
    })
})

router.get("/all-users", auth.verifyAdmin, function(req, res) {
    user.find({})
    .then(function(result) {
        res.json(result)
    }).catch(function() {
        res.status(400)
        res.json({message: "Something went wrong"})
    })
})

router.get("/dashboard-data", auth.verifyUser, function(req, res) {
    user.find({user_type: "Business"})
    .then(function(result) {
        var data = {}
        data["total_restaurants"] = result.length

        if (req.userInfo.user_type == 'Customer') {
            booking.find({user: req.userInfo._id})
            .then(function(userBooking) {
                data["total_booking"] = userBooking.length
                res.json(data)
            })
        } else if (req.userInfo.user_type == 'Business') {

            table.find({tableOf: req.userInfo._id})
            .then(function(tableData) {
                
                data["total_tables"] = tableData.length
                
                res.json(data)
            })
        } else {
            table.find({})
            .then(function(tbd) {
                data["total_tables"] = tbd.length
                res.json(data)
            })
        }
    }).catch(function(e) {
        res.status(400)
        res.json({message: "Something went wrong"})
    })
})

router.get("/all-business", auth.verifyUser, function(req, res) {

    user.aggregate([
        {
            $lookup: {
                from: "tables",
                localField: "_id",
                foreignField: "tableOf",
                as: "tables"
            }
        },
        {
            $lookup: {
                from: "items",
                localField: "_id",
                foreignField: "itemOf",
                as: "items"
            }
        },
        {
            $match: {user_type: "Business"}
            
        }
    ])
    .then(function(result) {
        categories.populate(result, {path: "items.categories"}, function(err, final_res) {
            res.json(final_res)
        })
    }).catch(function() {
        res.status(400)
        res.json({message: "Something went wrong"})
    })
})

router.get("/user-profile/:id", auth.verifyUser, function(req, res) {
    const user_id = req.params.id
    user.findOne({_id: user_id})
    .then(function(result) {
        res.json(result)
    }).catch(function() {
        res.status(400)
        res.json({message: "Something went wrong"})
    })
})

// search restaurant
router.get("/search-restaurant/:name",  function(req, res) {
    const name = req.params.name
    
    user.aggregate([
        {
            $lookup: {
                from: "tables",
                localField: "_id",
                foreignField: "tableOf",
                as: "tables"
            }
        },
        {
            $lookup: {
                from: "items",
                localField: "_id",
                foreignField: "itemOf",
                as: "items"
            }
        },
        {
            $match: {
                name: { "$regex": name, "$options": "i" }, 
                user_type: "Business"
            }
            
        }
    ])
    .then(function(result) {
        categories.populate(result, {path: "items.categories"}, function(err, final_res) {
            res.json(final_res)
        })
    })
    .catch(function() {
        res.status(400)
        res.json({message: "Something went wrong"})
    })
})

module.exports = router;
