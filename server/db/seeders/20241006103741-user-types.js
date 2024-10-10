const user_types = require('../models/user_types');

'use strict';

module.exports = {
  up: (models, mongoose) => {
    
      return models.user_types.insertMany([
        {
          _id : "6702692d2e1d8c4abc729a18",
          user_type : "Admin"
        },
        {
          _id : "670269452e1d8c4abc729a19",
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
            "6702692d2e1d8c4abc729a18",
            "670269452e1d8c4abc729a19"
          ]
        }
      }).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
    
  }
};
