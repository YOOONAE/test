const { random } = require('colors');
const mongoose = require('mongoose');
const CampGround = require('../models/main')
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

const db = mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
db.then(() => {
    console.log('DB Connected from seed index.js');
})

//to get a randome value from array. 
//function() >>> () => , called arrow function, () => value to be return >> ok
//but ()=> { line change } >> keyword of 'return' must be needed.
const arrRand = array => {
    return array[Math.floor(Math.random() * array.length)];
}

//default db first, and save data into db. 
//new ModelName({~~~~})
//mongoDB and js are asynchronized operation(?). so don't forget to use async, await when communicating with DB server
const seedDB = async () => {
    await CampGround.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const newData = new CampGround({
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${arrRand(descriptors)} ${arrRand(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate quae commodi culpa optio, odio eos fuga est exercitationem saepe. Minima, fugiat reprehenderit? Inventore, ab sequi magnam tempore ipsa ipsum quam.',
            image: 'https://images.unsplash.com/photo-1478562853135-c3c9e3ef7905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY0MzgxNjUyOQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
            price: Math.floor(Math.random() * 100)/10
        })
        await newData.save();
    }
}


//call function and then close mongoose connection to disconnect DB server
seedDB().then(() => {
    mongoose.connection.close();
})
console.log(`DB has been reset. New DB creation done.`);

