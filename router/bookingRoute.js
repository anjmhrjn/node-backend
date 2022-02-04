const express = require('express');
const router = new express.Router();
const categories = require("../models/categoryModel");

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

module.exports = router
