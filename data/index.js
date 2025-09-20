const mongoose = require('mongoose');
const listing = require('../models/listing.js');
let intialdata = require('./data.js');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Airbnb");
};

const sampledata = async () => {
    await listing.deleteMany({});
    intialdata = intialdata.map((obj) => ({...obj, owner: '66c0f48a2b9152b02e23323a'}))
    await listing.insertMany( intialdata );
    console.log("Data inserted");
}

sampledata();