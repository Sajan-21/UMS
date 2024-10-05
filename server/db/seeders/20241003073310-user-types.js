const user_types = require('../models/user_types');

'use strict';

module.exports = {
  up: (models, mongoose) => {
      return models.user_types.insertMany([
        {
          _id : "66fe499daef5f0d2948d13c5",
          user_type : "Admin"
        },
        {
          _id : "66fe49f8aef5f0d2948d13c6",
          user_type : "Employee"
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
  },

  down: (models, mongoose) => {
      return models.user_types.deleteMany({
        _id : {
          $in : [
            "66fe499daef5f0d2948d13c5",
            "66fe49f8aef5f0d2948d13c6"
          ]
        }
      }).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
  }
};
