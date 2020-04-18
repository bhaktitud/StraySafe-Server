'use strict';
module.exports = (sequelize, DataTypes) => {
  class Pet extends sequelize.Sequelize.Model {}

  Pet.init({
    name: DataTypes.STRING,
    species: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    birth_date: DataTypes.DATE,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    request_user_id: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate(pet, options) {
        if (!pet.status) {
          pet.status = "available"
        }
        if (!pet.name) {
          pet.name = "no name"
        }
      }
    },
    sequelize
  })
  Pet.associate = function(models) {
    // associations can be defined here
  };
  return Pet;
};