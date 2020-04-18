const router = require('express').Router();
const petRouter = require('./pet');

router.get('/', function (req, res) {
	res.send('Welcome StrayCare REST API');
});
router.use('/pet', petRouter);


module.exports = router;