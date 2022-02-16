// use the path of your model
const table = require('../models/tableModel');
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
describe('Table Schema test anything', () => {
// the code below is for insert testing
    let id = '';
    it('Add table testing anything', () => {
        const table_data = {
            'min_capacity': 3,
            "table_number": 2,
        };
        
        return table.create(table_data)
        .then((table_ret) => {
            id = table_ret._id
            expect(table_ret.min_capacity).toEqual(3);
        });
    });
    it('to test the update', async () => {
        return table.findOneAndUpdate({_id :id}, 
        {$set : {min_capacity:2}}, {new:true})
        .then((ut)=>{
            expect(ut.min_capacity).toEqual(2)
        })
    });
    // the code below is for delete testing
    it('to test the delete table is working or not', async () => {
        const status = await table.deleteMany();
        expect(status.deletedCount).toBe(1);
    });
 
})
