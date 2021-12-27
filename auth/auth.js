const jwt = require('jsonwebtoken');
const user = require('../models/userModel');

module.exports.verifyUser = function(req, res, next) {
    try {
        const authorization_val = req.headers.authorization
        if (authorization_val !== undefined) {
            const token = authorization_val.split(" ")[1];
            const udata = jwt.verify(token, "restrobooking");
            user.findOne({_id: udata.userId}).then(function(userData) {
                req.userInfo = userData;
                next();
            })
            .catch(function(e) {
                res.json({error: e})
            })
        } else {
            res.json({error: "Authentication details not provided"})
        }
        
    }
    catch(e) {
        res.json({error: e})
    }
}

module.exports.verifyBusiness = function(req, res, next) {
    try {
        const authorization_val = req.headers.authorization
        if (authorization_val !== undefined) {
            const token = authorization_val.split(" ")[1];
            const udata = jwt.verify(token, "restrobooking");
            user.findOne({_id: udata.userId}).then(function(userData) {
                if (userData.user_type === 'Business') {
                    req.userInfo = userData;
                    next();
                } else {
                    res.json({error: "Method not allowed"})
                }
            })
            .catch(function(e) {
                res.json({error: e})
            })
        } else {
            res.json({error: "Authentication details not provided"})
        }
        
    }
    catch(e) {
        console.log(e)
        res.json({error: e})
    }
}

module.exports.verifyAdmin = function(req, res, next) {
    try {
        const authorization_val = req.headers.authorization
        if (authorization_val !== undefined) {
            const token = req.headers.authorization.split(" ")[1];
            const udata = jwt.verify(token, "restrobooking");
            user.findOne({_id: udata.userId}).then(function(userData) {
                // if (userData.isSuperUser) {
                if (userData.user_type === 'Admin') {
                    req.userInfo = userData;
                    next();
                } else {
                    res.json({message: "Method not allowed"})
                }
            })
            .catch(function(e) {
                res.json({error: e})
            })
        } else {
            res.json({error: "Authentication details not provided"})
        }
    }
    catch(e) {
        res.json({error: e})
    }
}
