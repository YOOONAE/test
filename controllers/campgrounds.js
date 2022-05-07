const CampGround = require('../models/campground');
const AppError = require('../AppError');
const { cloudinary } = require('../cloudinary/cloudinary')
// const bsCustomFileInput = require('bs-custom-file-input');

//mapbox default setting
const mbxStyles = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoding = mbxStyles({ accessToken: process.env.MAPBOX_TOKEN });


module.exports.showId = async (req, res, next) => {
    // router.get('/invalid_img_src_address', (req, res) => {
    //     console.log('catch invalid img src address here as a route address.');
    // })

    // console.log('id page works')
    const { id } = req.params;
    //If img src has invalid address, it will send you to /main/invalid_address, 
    //meaning it will comes back to here and will show you Cast to ObjectId failed error 
    //because invalid_address will not be a type of id for mongoDB. **********
    //then, the render(showbyid) will be eventually run after running error rendering page.

    // const foundData = await CampGround.findById(id).populate('reviews').populate('author');
    const foundData = await CampGround.findById(id)
        .populate('author')
        .populate({ path: 'reviews', populate: { path: 'author' } });

    // console.log('foundData here! : ')
    // console.log(foundData);

    //catch mongoDB aync data load error. ex;nonexisting object ID
    if (!foundData) {
        throw new AppError('ID not found', 400); //throw here, catch(e) will catch, and error middleware will catch it
    }

    res.render('campground/showbyid', { foundData });
}



module.exports.deleteId = async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    console.log(campground);

    if (campground.images) {
        for (let img of campground.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
    }

    await CampGround.findByIdAndDelete(req.params.id, { useFindAndModify: false });

    console.log('here you go');
    res.redirect('/main');
}




module.exports.showEdit = async (req, res) => {
    const { id } = req.params;
    const foundData = await CampGround.findById(id);
    res.render('campground/edit', { foundData });
}

module.exports.editId = async (req, res) => {
    const campground = await CampGround.findById(req.params.id);

    console.log('========== Things to be checked!! ============')
    console.log(req.body.campground);
    console.log('==============================================')

    await CampGround.findByIdAndUpdate(req.params.id, { ...req.body.campground }, { new: true, useFindAndModify: false, runValidators: true });

    //when there is(are) image file(s) check-marked by a user to be deleted, this functions will work
    if (req.body.deletedImages) {
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deletedImages } } } })

        for (let filename of req.body.deletedImages) {
            await cloudinary.uploader.destroy(filename);
            console.log(`${filename} is deleted.`);
        }
    }

    //when there is(are) added image file(s) to be uploaded by a user, this function will work
    //if req.files exist, then it map it to create "imgs" array to be pushed into "campground" and to be saved.
    if (req.files && req.files.length > 0) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        campground.images.push(...imgs);
        console.log('req.files exist, img(s) mapped and saved in campground data');
        await campground.save();
    }

    // console.log('================== ******** ==================')
    // const campgroundUpdated = await CampGround.findById(req.params.id);
    // console.log(campgroundUpdated);
    // console.log('==============================================')

    const geoData = await geoCoding.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();

    campground.geometry = geoData.body.features[0].geometry;
    campground.location = geoData.body.features[0].place_name;

    await campground.save();

    res.redirect(`/main/${req.params.id}`);
}

module.exports.createId = async (req, res, next) => {
    console.log('New -> save() function opened');

    //don't forget to await here first until you get geoCodes(data).
    const geoData = await geoCoding.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();

    // console.log('======= geoData =======')
    // console.log(geoData.body);
    // console.log(geoData.body.features[0].geometry);
    // console.log('======= geoData =======')


    //it could take some time to save data into DB, so you better use await keyword
    //so that it waits until it saves data completely and redirect page.
    // ====================================================
    const campground = new CampGround(req.body.campground);
    campground.author = req.user._id; //req.user from Passport after isLoggedin function run

    const uploadedImages = req.files.map(f => ({ url: f.path, filename: f.filename }));

    console.log('*********************')
    console.log(uploadedImages);

    if (uploadedImages && uploadedImages.length !== 0) {
        campground.images = uploadedImages;
    } else {
        campground.images = [{
            url: "https://media.istockphoto.com/vectors/default-image-icon-vector-missing-picture-page-for-website-design-or-vector-id1357365823?b=1&k=20&m=1357365823&s=170667a&w=0&h=y6ufWZhEt3vYWetga7F33Unbfta2oQXCZLUsEa67ydM=",
            filename: "no-image"
        }];

        console.log('no img else condition worked');
    }


    campground.geometry = geoData.body.features[0].geometry;
    campground.location = geoData.body.features[0].place_name;
    // console.log(`campground::::: ${campground}`);


    await campground.save();
    res.redirect('/main');
}

module.exports.showNew = (req, res) => {
    res.render('campground/new');
}

module.exports.showIndex = async (req, res) => {
    console.log("Basic route opened!!");
    const foundData = await CampGround.find({});
    delete req.session.returnTo;
    // console.log(foundData);
    res.render('campground/main', { foundData });
}