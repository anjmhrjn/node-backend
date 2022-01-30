const express = require('express');
const bcryptjs = require('bcryptjs');
const router = new express.Router();
const jwt = require("jsonwebtoken");
const user = require("../models/userModel");

const auth = require("../auth/auth");
const upload = require("../uploads/file");

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
                    token: token
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

router.put("/profile/update/:username", auth.verifyProfile, upload.single('user_image'), function(req, res) {
    let udata = req.body;
    if (req.file !== undefined) {
        udata["user_image"] = req.file.filename;
    }

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

module.exports = router;
