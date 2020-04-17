const router = require('express').Router();

router.get('/', function (req, res) {
	res.send('Welcome StrayCare REST API');
});


module.exports = router;