export default (req, res, next) => {
    console.log('');
    console.log('==================');
    console.time('Request');

    console.log(`Method: ${req.method} | URL: ${req.url}`);

    next();

    console.timeEnd('Request');
    console.log('==================');
    console.log('');
};
