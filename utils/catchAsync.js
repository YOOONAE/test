//To catch MongoDB error
module.exports = function catchAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(e => {
            console.log(`[MongoDB error name: ${e.name}]`); // error name provided by mongoDB
            next(e);
            // return res.send('stop here')
        });
    }
}

// module.exports = catchAsync;