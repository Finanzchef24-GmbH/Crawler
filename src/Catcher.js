module.exports = function (error) {
    console.error(error.stack);
    process.exitCode = 1;
};
