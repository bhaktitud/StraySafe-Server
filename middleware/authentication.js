const { User } = require('../models');
const jwt = require('../helpers/jwt');
const CustomError = require('../helpers/customError');
const invalid = "invalid token!";

function authentication(req, res, next) {
  let token = req.headers.token;
  if (!token) {
    console.log("masuk");
    throw new CustomError(401, invalid);
  } else {
    try {
      let user = jwt.verify(token);
      User.findByPk(user.id)
        .then((result) => {
          if (result) {
            req.userId = user.id;
            next();
          } else {
            throw new CustomError(401, invalid);
          }
        })
        .catch((err) => {
          next(new CustomError(401, invalid));
        });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = authentication;
