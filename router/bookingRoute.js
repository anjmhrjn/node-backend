const express = require('express');
const router = new express.Router();
const categories = require("../models/categoryModel");
const mongoose = require('mongoose');

const auth = require("../auth/auth");
const booking = require('../models/bookingModel');

function checkTime(start_time, end_time, time_to_check) {

    var hours = time_to_check.getHours();
    var mins = time_to_check.getMinutes();

    var st_hours = start_time[0]
    var et_hours = end_time[0]
    var et_mins = end_time[1]

    return hours >= st_hours 
        && (hours < et_hours || hours === et_hours && mins <= et_mins);
}

router.post("/book/table", auth.verifyCustomer, function(req, res) {
    const requested_start_time = new Date(req.body.start_time)
    const requested_end_time = new Date(req.body.end_time)
    booking.find({"user": req.body.user, "requested_for": req.body.requested_for})
    .then(function(result) {
        let has_booking = false
        result.map(user_booking => {
            const start_time = user_booking.start_time
            const end_time = user_booking.end_time
            if (checkTime(start_time, end_time, requested_start_time)) {
                has_booking = true
            }
            if (checkTime(start_time, end_time, requested_end_time)) {
                has_booking = true
            }
        })
        if (has_booking) {
            res.json({message: "You already have a booking at that time.", success: false})
        } else {
            booking.find({"table": req.body.table, "requested_for": req.body.requested_for})
            .then(function(result) {
                result.map(table_booking => {
                    const start_time = table_booking.start_time
                    const end_time = table_booking.end_time
                    if (checkTime(start_time, end_time, requested_start_time)) {
                        has_booking = true
                    }
                    if (checkTime(start_time, end_time, requested_end_time)) {
                        has_booking = true
                    }
                })
                if (has_booking) {
                    res.json({message: "The table is already booked for that time.", success: false})
                } else {
                    const data = new booking(req.body)
                    data.save()
                    .then(function(result) {
                        res.json({message: "Booking added successfully!", data: result, success: true});
                    })
                    .catch(function(e) {
                        res.json(e);
                    })
                }
            })
            .catch(function(e) {
                console.log(e)
            })
        }
    })
    .catch(function(e) {
        console.log(e)
    })
})

router.put("/update/booking/:bid", auth.verifyBooking, function(req, res) {
    const bookingId = req.params.bid
    const requested_start_time = new Date(req.body.start_time)
    const requested_end_time = new Date(req.body.end_time)
    booking.find({"user": req.body.user, "requested_for": req.body.requested_for})
    .then(function(result) {
        let has_booking = false
        result.map(user_booking => {
            const start_time = user_booking.start_time
            const end_time = user_booking.end_time
            if (user_booking._id.toString() !== bookingId) {
                if (checkTime(start_time, end_time, requested_start_time)) {
                    has_booking = true
                }
                if (checkTime(start_time, end_time, requested_end_time)) {
                    has_booking = true
                }
            }
        })
        if (has_booking) {
            res.json({message: "You already have a booking at that time.", success: false})
        } else {
            booking.find({"table": req.body.table, "requested_for": req.body.requested_for})
            .then(function(result) {
                result.map(table_booking => {
                    const start_time = table_booking.start_time
                    const end_time = table_booking.end_time
                    if (table_booking._id.toString() !== bookingId) {
                        if (checkTime(start_time, end_time, requested_start_time)) {
                            has_booking = true
                        }
                        if (checkTime(start_time, end_time, requested_end_time)) {
                            has_booking = true
                        }
                    }
                })
                if (has_booking) {
                    res.json({message: "The table is already booked for that time.", success: false})
                } else {
                    booking.updateOne({_id: bookingId}, req.body)
                    .then(function() {
                        res.json({message: "Booking Updated", success: true});
                    }).catch(function() {
                        res.json({message: "Error in updating booking", success: false});
                    })
                }
            })
            .catch(function(e) {
                console.log(e)
            })
        }
    })
    .catch(function(e) {
        console.log(e)
    })
})

router.delete("/booking/delete/:bid", auth.verifyBooking, function(req, res) {
    const bookingId = req.params.bid;

    booking.deleteOne({_id: bookingId})
    .then(function() {
        res.json({message: "Booking Deleted", success: true});
    }).catch(function() {
        res.status(400);
        res.json({message: "Error in deleting table"});
    })
})

router.get("/booking/:bid", auth.verifyBooking, function(req, res) { 
    const bookingId = mongoose.Types.ObjectId(req.params.bid)
    booking.aggregate([
        {
            $match: {_id: bookingId}
        },
        {
           $lookup:
            {
                from: "tables",
                localField: "table",
                foreignField: "_id",
                as: "table_detail"
            }
        },
        {
            $unwind: "$table_detail"
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user_detail"
            }
        },
        {
            $unwind: "$user_detail"
        },
    ])
    .then(function(result) {
        res.json(result[0])
    })
    .catch(function() {
        res.json({message: "something went wrong"})
    })
})

router.get("/my-bookings", auth.verifyCustomer, function(req, res) { 
    const user = mongoose.Types.ObjectId(req.userInfo._id)
    booking.aggregate([
        {
            $match: {user: user}
        },
        {
           $lookup:
            {
                from: "tables",
                localField: "table",
                foreignField: "_id",
                as: "table_detail"
            }
        },
        {
            $unwind: "$table_detail"
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user_detail"
            }
        },
        {
            $unwind: "$user_detail"
        },
    ])
    .then(function(result) {
        res.json(result)
    })
    .catch(function() {
        res.json({message: "something went wrong"})
    })
})

router.get("/filter-booking/:status", auth.verifyCustomer, function(req, res) { 
    const user = mongoose.Types.ObjectId(req.userInfo._id)
    const status = req.params.status
    booking.aggregate([
        {
            $match: {user: user, booking_status: status}
        },
        {
           $lookup:
            {
                from: "tables",
                localField: "table",
                foreignField: "_id",
                as: "table_detail"
            }
        },
        {
            $unwind: "$table_detail"
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user_detail"
            }
        },
        {
            $unwind: "$user_detail"
        },
        
    ])
    .then(function(result) {
        res.json(result)
    })
    .catch(function() {
        res.json({message: "something went wrong"})
    })
})

router.get("/business/my-booking", auth.verifyBusiness, function(req, res) { 
    const businessId = mongoose.Types.ObjectId(req.userInfo._id)
    booking.aggregate([
        {
            $lookup: {
                from: "tables",
                localField: "table",
                foreignField: "_id",
                as: "table_detail"
            }
        },
        {
            $unwind: "$table_detail"
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user_detail"
            }
        },
        {
            $unwind: "$user_detail"
        },
        {
            $match: {"table_detail.tableOf": businessId}
            
        }
    ])
    .then(function(result) {
        res.json(result)
    })
    .catch(function() {
        res.json({message: "something went wrong"})
    })
})

router.post("/booking/filter", auth.verifyUser, function(req, res) { 
    const user_type = req.userInfo.user_type
    if (user_type === 'Business') {
        const businessId = mongoose.Types.ObjectId(req.userInfo._id)
        const status_types = req.body.status_types
        const date = new Date(req.body.date)
        booking.aggregate([
            {
                $lookup: {
                    from: "tables",
                    localField: "table",
                    foreignField: "_id",
                    as: "table_detail"
                }
            },
            {
                $unwind: "$table_detail"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user_detail"
                }
            },
            {
                $unwind: "$user_detail"
            },
            {
                $match: {
                    $and: [
                        {"table_detail.tableOf": businessId},
                        { $or: [ {booking_status: {$in: status_types}}, {requested_for: date}] },
                    ]
                }
                
            }
        ])
        .then(function(result) {
            res.json(result)
        })
        .catch(function() {
            res.json({message: "something went wrong"})
        })
    } else if (user_type === 'Customer') {
        const userId = mongoose.Types.ObjectId(req.userInfo._id)
        const status_types = req.body.status_types
        const date = req.body.date
        booking.aggregate([
            {
                $lookup: {
                    from: "tables",
                    localField: "table",
                    foreignField: "_id",
                    as: "table_detail"
                }
            },
            {
                $unwind: "$table_detail"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user_detail"
                }
            },
            {
                $unwind: "$user_detail"
            },
            {
                $match: {
                    $and: [
                        {user: userId},
                        { $or: [ {booking_status: {$in: status_types}}, {requested_for: date}] },
                    ]
                }
                
            }
        ])
        .then(function(result) {
            res.json(result)
        })
        .catch(function() {
            res.json({message: "something went wrong"})
        })
    } else {
        res.json()
    }
    
})

router.put("/booking/update-status/:bid", auth.verifyBusinessBooking, function(req, res) {
    const bookingId = req.params.bid
    booking.updateOne({_id: bookingId}, {booking_status: req.body.booking_status})
    .then(function(result) {
        res.json({message: "Status Updated", success: true, data:result});
    }).catch(function() {
        res.json({message: "Error in updating category", success: false});
    })    
})

module.exports = router
