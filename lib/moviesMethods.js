var Movie = require("../models/Movie.js");


//// return all records
//Movies.find({}, (err, items) => {
//  if (err) return next(err);
//  console.log(items.length);
//  // other code here
//});

// return all records
exports.getAll = () => {
  return Movie.find({}, (err, result) => {
    if (err) {
      return err;
    }
    console.log(result.length);
    return result;
  });
};


