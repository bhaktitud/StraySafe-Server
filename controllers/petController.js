const { Pet } = require('../models');
const CustomError = require('../helpers/customError');
const notFound = "Pet Not Found!";

class Controller {
  static get(req, res, next) {
    let UserId = req.userId;
    Pet.findAll({
      where: {
        UserId
      },
      include: [
        {
          model: User
        }
      ]
    })
      .then((result) => {
        res.status(200).json({ data: result })
      }).catch((err) => {
        console.log(err);
        next(err);
      });
  }

  static getById(req, res, next) {
    Pet.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: User
        }
      ]
    })
      .then((result) => {
        res.status(200).json({ data: result })
      }).catch((err) => {
        console.log(err);
        next(err);
      });
  }

  static create(req, res, next) {
    let createObj = {
      UserId: req.userId,
      name: req.body.name,
      species: req.body.species,
      birth_date: req.body.birth_date,
      description: req.body.description,
      status: req.body.status,
      request_user_id: req.body.request_user_id,
    }
    Pet.create(createObj)
      .then((result) => {
        res.status(status).json({ data: result })
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }

  static update(req, res, next) {
    let qty = req.body.qty
    let isPaid = req.body.isPaid
    let data = {
      qty,
      isPaid
    }
    if (Number(req.params.id)) {
      Pet.update(data, {
        where: {
          id: req.params.id
        },
        returning: true,
      })
        .then((result) => {
          res.status(200).json({ data: result[1][0] })
        }).catch((err) => {
          console.log(err);
          next(err);
        });
    } else {
      let err = new CustomError(400, "Bad Request")
      next(err)
    }
  }

  static updateRequest(req, res, next) {
    let request_user_id = req.body.request_user_id
    let data = {
      request_user_id
    }
    if (Number(req.params.id)) {
      Pet.update(data, {
        where: {
          id: req.params.id
        },
        returning: true,
      })
        .then((result) => {
          res.status(200).json({ data: result[1][0] })
        }).catch((err) => {
          console.log(err);
          next(err);
        });
    } else {
      let err = new CustomError(400, "Bad Request")
      next(err)
    }
  }

  static delete(req, res, next) {
    let deletedData;
    if (Number(req.params.id)) {
      Pet.findOne({
        where: {
          id: req.params.id
        }
      })
        .then((result) => {
          deletedData = result;
          if(result) {
            return Pet.destroy({
              where: {
                id: result.id
              }
            })
          } else {
            throw new CustomError(404, notFound)
          }
        })
        .then((result) => {
          res.status(200).json({ data: deletedData })
        }).catch((err) => {
          console.log(err);
          next(err);
        });
    } else {
      next(new CustomError(400, "Bad Request"))
    }
  }
}

module.exports = Controller;
