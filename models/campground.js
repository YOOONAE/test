const mongoose = require('mongoose');
const Review = require('./review');
const { Schema } = mongoose;

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('sizedUrl').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,h_130,w_200');
});

// To properly send Json data via Mongoose, you need this along with ",opts" in schema like below)
const opts = { toJSON: { virtuals: true } }; 

const campGroundSchema = new Schema({
    title: {
        type: String,
        required: [true, 'you must input title man ~']
    },
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
    },
    images: [imageSchema],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts) //********* 

campGroundSchema.virtual('properties.popUpText').get(function() {
    return this.location;
})




campGroundSchema.post('findOneAndDelete', async function (data) {
    console.log(`[[ Mongoose MiddleWare ]]`);
    const { reviews, title, id } = data;
    // const {reviews, title, _id:id} = data;

    //when deleting a campground post, if it contains reviews, this code will delete reviews pertaining to the compground as well.
    if (reviews.length) {
        await Review.deleteMany({ _id: { $in: [...reviews] } });
        console.log(`${title}(${id}) has been deleted along with ${reviews.length} reviews`);
    } else {
        console.log(`no sub-reviews existing to be deleted`)
    }
});

const CampGround = mongoose.model('Yelpcamp', campGroundSchema);


module.exports = CampGround;


