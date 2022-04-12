function catchAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(e => {
            console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
            console.log(`mongoDB error name: ${e.name}`); // error name provided by mongoDB
            console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
            next(e);
        });
    }
}

module.exports = catchAsync;