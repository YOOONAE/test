const mongoose = require('mongoose');

const campGroundSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String
})

const CampGround = mongoose.model('Yelpcamp', campGroundSchema);

// const sandiaMountain = new CampGround({
//     title: 'Highest Mountain in ABQ', 
//     price: 1000000, 
//     location: 'albuquerque'}
// )

// sandiaMountain.save().then((d)=> {
//     console.log(d);
//     console.log('data saved!');
// })

module.exports = CampGround;


