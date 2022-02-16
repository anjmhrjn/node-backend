// use the path of your model
const item = require('../models/itemModel');
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
describe('Item Schema test anything', () => {
// the code below is for insert testing
    let id = '';
    it('Add item testing anything', () => {
        const item_data = {
            'name': "test",
        };
        
        return item.create(item_data)
        .then((item_ret) => {
            id = item_ret._id
            expect(item_ret.name).toEqual('test');
        });
    });
    it('to test the update', async () => {
        return item.findOneAndUpdate({_id :id}, 
        {$set : {name:'updated'}}, {new:true})
        .then((ui)=>{
            expect(ui.name).toEqual('updated')
        })
    });
    // the code below is for delete testing
    it('to test the delete item is working or not', async () => {
        const status = await item.deleteMany();
        expect(status.deletedCount).toBe(1);
    });
 
})
