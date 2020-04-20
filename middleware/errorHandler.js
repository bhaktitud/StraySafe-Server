"use strict"

module.exports = function (err, req, res, next) {
    console.log("masuk error");
    console.log(err);
    if (err.name) {
        switch (err.name) {
            case "SequelizeConnectionError":
                res.status(500).json({
                    msg: err.message
                })
                break
            case "SequelizeValidationError":
                res.status(400).json({
                    msg: err.errors[0].message
                })
                break
            case "SequelizeDatabaseError":
                res.status(400).json({
                    msg: err.message
                })
                break
            default:
                res.status(500).json({
                    msg: err.message
                })
                break
        }
    }
    if (err.statusCode) {
        res.status(err.statusCode).json({
            msg: err.msg
        })
    }
}