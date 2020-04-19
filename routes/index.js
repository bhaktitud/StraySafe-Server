const router = require('express').Router();
const userController = require('../controllers/userController')
const threadRouter = require('../routes/thread')

router.get('/', function (req, res) {
	res.send('Welcome StrayCare REST API');
});

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/users/:id', userController.findUser)

router.use('/threads', threadRouter)

module.exports = router;