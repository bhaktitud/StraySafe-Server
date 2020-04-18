'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      
    },
    password: {
      type: DataTypes.STRING,
      
    },
    first_name: {
      type: DataTypes.STRING,
      
    },
    last_name: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    bio: DataTypes.STRING,
    city: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};