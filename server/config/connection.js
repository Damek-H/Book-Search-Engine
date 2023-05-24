const myMongoose = require('mongoose');

myMongoose.connect(
  process.env.MY_MONGODB_URI || 'mongodb://127.0.0.1:27017/mygooglebooks',
);

module.exports = myMongoose.connection;
