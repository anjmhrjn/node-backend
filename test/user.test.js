// use the path of your model
const user = require('../models/userModel');
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
describe('User Schema test anything', () => {
// the code below is for insert testing
    let id = '';
    it('Add user testing anything', () => {
        const user_data = {
            'username': "testuser",
            'password': 'testuser',
            'email': 'testuser@email.com',
            'user_type': 'Customer',
        };
        
        return user.create(user_data)
        .then((user_ret) => {
            id = user_ret._id
            expect(user_ret.username).toEqual('testuser');
        });
    });
    it('to test the update', async () => {
        return user.findOneAndUpdate({_id :id}, 
        {$set : {username:'updated'}}, {new:true})
        .then((uu)=>{
            expect(uu.username).toEqual('updated')
        })
    });
    // the code below is for delete testing
    it('to test the delete user is working or not', async () => {
        const status = await user.deleteMany();
        expect(status.deletedCount).toBe(1);
    });
 
})
