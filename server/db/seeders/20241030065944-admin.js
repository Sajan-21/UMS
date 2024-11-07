const users = require('../models/users');

'use strict';

module.exports = {
  up: (models, mongoose) => {
      return models.users.insertMany([
        {
          "_id": "672af872ed6713c68f5345f4",
          "name": "john",
          "email": "john@gmail.com",
          "password": "$2a$10$tdxH/dQX.g0xa1EAkl6ltuvTl2WIGKrUtVn5wNKOWwi3LZIvMUkE2",
          "user_type": "672af4e6ed6713c68f5345f1",
          "image" : "uploads/users/17308900054030.jpeg",
          "reset_password_count": null,
          "login_count": null,
          "__v": 0
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
  },

  down: (models, mongoose) => {
      return models.users.deleteMany({
        _id : {
          $in : [
            "672af872ed6713c68f5345f4",
          ]
        }
      }).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
  }
};
