const jwt = require('jsonwebtoken');
const item = require('../models/itemModel');
const table = require('../models/tableModel');
const user = require('../models/userModel');
const booking = require('../models/bookingModel');

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

module.exports.verifyCustomer = function(req, res, next) {
    try {
        const authorization_val = req.headers.authorization
        if (authorization_val !== undefined) {
            const token = req.headers.authorization.split(" ")[1];
            const udata = jwt.verify(token, "restrobooking");
            user.findOne({_id: udata.userId}).then(function(userData) {
                if (userData.user_type === 'Customer') {
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
                if (userData.isSuperUser) {
                // if (userData.user_type === 'Admin') {
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

module.exports.verifyBusinessAdmin = function(req, res, next) {
    try {
        const authorization_val = req.headers.authorization
        if (authorization_val !== undefined) {
            const token = req.headers.authorization.split(" ")[1];
            const udata = jwt.verify(token, "restrobooking");
            user.findOne({_id: udata.userId}).then(function(userData) {
                if (userData.isSuperUser) {
                // if (userData.user_type === 'Admin') {
                    req.userInfo = userData;
                    next();
                } else if (userData.user_type === 'Business') {
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


module.exports.verifyProfile = function(req, res, next) {
    try {
        const authorization_val = req.headers.authorization
        if (authorization_val !== undefined) {
            const token = req.headers.authorization.split(" ")[1];
            const udata = jwt.verify(token, "restrobooking");
            user.findOne({_id: udata.userId}).then(function(userData) {
                if (userData.username === req.params.username) {
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

module.exports.verifyTable = function(req, res, next) {
    try {
        const authorization_val = req.headers.authorization
        if (authorization_val !== undefined) {
            const token = req.headers.authorization.split(" ")[1];
            const udata = jwt.verify(token, "restrobooking");
            table.findOne({_id: req.params.tableId}).then(function(tableData) {
                if (tableData.tableOf.toString() === udata.userId) {
                    req.tableInfo = tableData;
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

module.exports.verifyItem = function(req, res, next) {
    try {
        const authorization_val = req.headers.authorization
        if (authorization_val !== undefined) {
            const token = req.headers.authorization.split(" ")[1];
            const udata = jwt.verify(token, "restrobooking");
            item.findOne({_id: req.params.itemId}).then(function(itemData) {
                if (itemData.itemOf.toString() === udata.userId) {
                    req.itemInfo = itemData;
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

module.exports.verifyBooking = function(req, res, next) {
    try {
        const authorization_val = req.headers.authorization
        if (authorization_val !== undefined) {
            const token = req.headers.authorization.split(" ")[1];
            const udata = jwt.verify(token, "restrobooking");
            booking.findOne({_id: req.params.bid}).then(function(bookingData) {
                if (bookingData.user.toString() === udata.userId) {
                    req.bookingInfo = bookingData;
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
