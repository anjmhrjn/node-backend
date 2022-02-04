const mongoose = require("mongoose");

const booking = mongoose.model("Booking", {
    created_date: {
        type: Date
    },
    requested_for: {
        type: Date
    },
    start_time: {
        type: Date,
        get: v => [v.getHours(), v.getMinutes()]
    },
    end_time: {
        type: Date,
        get: v => [v.getHours(), v.getMinutes()]
    },
    total_seats: {
        type: Number
    },
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'table'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    booking_status: {
        type: String,
        default: 'Requested',
        enum: ['Requested', 'Approved', 'Cancelled', 'Disapproved', 'Completed']
    },
})

module.exports = booking;