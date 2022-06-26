// Mongoose connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');
const db = mongoose.connection;

// Check for DB connection
db.once('open', function(){
    console.log("Connected to MongoDB successfully!");
});
db.on('error', function(){
    console.log(err);
});
const insertItem = (item) => {
    const collection = db.collection('Cache_Data')
    return collection.insertOne(item)
  }
module.exports = insertItem ;
