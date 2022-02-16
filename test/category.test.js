// use the path of your model
const category = require('../models/categoryModel');
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
describe('Category Schema test anything', () => {
// the code below is for insert testing
let id = '';
 it('Add category testing anything', () => {
 const cat_data = {
    'name': "test",
 };
 
 return category.create(cat_data)
 .then((cat_ret) => {
    id = cat_ret._id
    expect(cat_ret.name).toEqual('test');
 });
 });
it('to test the update', async () => {
 return category.findOneAndUpdate({_id :id}, 
{$set : {name:'updated'}}, {new:true})
 .then((uc)=>{
 expect(uc.name).toEqual('updated')
 })
 
 
});
// the code below is for delete testing
it('to test the delete category is working or not', async () => {
    const status = await category.deleteMany();
    expect(status.deletedCount).toBe(1);
});
 
})
