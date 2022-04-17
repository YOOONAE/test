const CampGround = require('../models/campground');
const AppError = require('../AppError');

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

    // console.log(foundData);

    //catch mongoDB aync data load error. ex;nonexisting object ID
    if (!foundData) {
        throw new AppError('ID not found', 400); //throw here, catch(e) will catch, and error middleware will catch it
    }

    res.render('campground/showbyid', { foundData });
}

module.exports.deleteId = async (req, res) => {
    await CampGround.findByIdAndDelete(req.params.id, { useFindAndModify: false });
    console.log('here you go');
    res.redirect('/main');
}

module.exports.editId = async (req, res) => {
    const foundData = await CampGround.findById(req.params.id);
    await CampGround.findByIdAndUpdate(req.params.id, { ...req.body.campground }, { new: true, useFindAndModify: false, runValidators: true });
    res.redirect(`/main/${req.params.id}`);
}

module.exports.createId = async (req, res, next) => {
    console.log('New -> save() function opened');
    //it could take some time to save data into DB, so you better use await keyword
    //so that it waits until it saves data completely and redirect page.
    const newData = new CampGround(req.body.campground);
    newData.author = req.user._id; //req.user from Passport after isLoggedin function run

    newData.images = req.files.map(f => {
       ( {url: f.path, filename: f.filename}, i )
    });
    
    
    // newData.images = req.files.map(f => ({url: f.path, filename: f.filename}) );
    console.log(`newdata::::: ${newData}`);

    await newData.save();
    res.redirect('/main');
}

module.exports.showEdit = async (req, res) => {
    const { id } = req.params;
    const foundData = await CampGround.findById(id);
    // console.log(`wow: ${foundData}`);
    res.render('campground/edit', { foundData });
}

module.exports.showNew = (req, res) => {
    res.render('campground/new');
}

module.exports.showIndex = async (req, res) => {
    console.log("Basic route opened!!");
    const allData = await CampGround.find({});
    delete req.session.returnTo;
    res.render('campground/main', {allData});
}