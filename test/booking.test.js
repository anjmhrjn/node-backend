// use the path of your model
const booking = require('../models/bookingModel');
const mongoose = require('mongoose');
// use the new name of the database
const url = 'mongodb://localhost:27017/restrobooking-testing';
beforeAll(async () => {
    await mongoose.connect(url, {
        useNewUrlParser: true,
    });
});
afterAll(async () => {
    await mongoose.connection.close();
});
describe('Booking Schema test anything', () => {
    // the code below is for insert testing
    let id = '';
    it('Add booking testing anything', () => {
        const booking_data = {
            'total_seats': 1,
        };
        
        return booking.create(booking_data)
        .then((bkn_ret) => {
            id = bkn_ret._id
            expect(bkn_ret.total_seats).toEqual(1);
        });
    });
    it('to test the update', async () => {
        return booking.findOneAndUpdate({_id :id}, 
        {$set : {total_seats:3}}, {new:true})
        .then((uu)=>{
            expect(uu.total_seats).toEqual(3)
        })
    });
    // the code below is for delete testing
    it('to test the delete booking is working or not', async () => {
        const status = await booking.deleteMany();
        expect(status.deletedCount).toBe(1);
    });
 
})
