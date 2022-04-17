const mongoose = require('mongoose');
const Review = require('./review');
const {Schema} = mongoose;

const campGroundSchema = new Schema({
    title: {
        type: String,
        required: [true, 'you must input title man ~']
    },
    price: Number,
    description: String,
    location: String,
    images: [{
        url: String,
        filename: String
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

campGroundSchema.post('findOneAndDelete', async function(data) {
    console.log(`[[ Mongoose MiddleWare ]]`);
    const {reviews, title, id} = data;
    // const {reviews, title, _id:id} = data;
    
    //when deleting a campground post, if it contains reviews, this code will delete reviews pertaining to the compground as well.
    if(reviews.length) {
        await Review.deleteMany({_id: {$in: [...reviews]}});
        console.log(`${title}(${id}) has been deleted along with ${reviews.length} reviews`);
    } else {
        console.log(`no sub-reviews existing to be deleted`)
    }
});

const CampGround = mongoose.model('Yelpcamp', campGroundSchema);


module.exports = CampGround;


