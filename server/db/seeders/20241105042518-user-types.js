const user_types = require('../models/user-types');

'use strict';

module.exports = {
  up: (models, mongoose) => {
    
      return models.user_types.insertMany([
        {
          _id : "672af4e6ed6713c68f5345f1",
          user_type : "Admin"
        },
        {
          _id : "67299ed07772713c843ee8c8",
          user_type : "Employee"
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
  },

  down: (models, mongoose) => {
    
    return models.user_types.deleteMany({
      _id: { $in: [
                  "672af4e6ed6713c68f5345f1",
                  "67299ed07772713c843ee8c8"
                  ]
           }
    }).then(res => {
      // Prints the number of deleted documents
      console.log(res.deletedCount);
    });
    
}
};
