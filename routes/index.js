const router = require('express').Router();
const userController = require('../controllers/userController')

router.get('/', function (req, res) {
	res.send('Welcome StrayCare REST API');
});

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/users/:id', userController.findUser)


module.exports = router;