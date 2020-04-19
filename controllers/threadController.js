const { Thread, Comment, User } = require('../models')

class Controller {
    static createThread(req, res, next){
        const data = {
            title: req.body.title,
            description: req.body.description,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            UserId: req.decoded.id,
            status: 1
        }

        Thread.create(data)
        .then(_ => {
            res.status(201).json({ msg: 'Thread succesfully created' })
        })
        .catch(next)
    }

    static fetchAllThread(req, res, next){
        Thread.findAll({
            include: [{
                model: Comment
            }, {
                model: User
            }],
            order: ['id']
        })
        .then(result => {
            res.status(200).json({
                data: result
            })
        })
        .catch(next)
    }

    static fetchThreadById(req, res, next){
        Thread.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: Comment
            }, {
                model: User
            }]
        })
        .then(result => {
            res.status(200).json({
                data: result
            })
        })
        .catch(next)
    }

    static editThread(req, res, next){
        const data = {
            title: req.body.title,
            description: req.body.description,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            UserId: req.decoded.id,
            status: 1
        }

        Thread.update(data,{
            where: {
                id: req.params.id
            }
        })
        .then(result => {
            res.status(200).json({ msg: 'Thread succesfully edited' })
        })
        .catch(next)
    }

    static deleteThread(req, res ,ext){
        Thread.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(result => {
            res.status(200).json({ msg: 'Thread succesfully deleted' })
        })
        .catch(next)
    }

    static createComment(req, res ,ext){
        const data = {
            message: req.body.message,
            ThreadId: req.params.id,
            UserId: req.decoded.id
        }

        Comment.create(data)
        .then(_ => {
            res.status(201).json({ msg: 'Comment succesfully created' })
        })
    }

}

module.exports = Controller