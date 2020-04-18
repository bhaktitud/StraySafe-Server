const router = require('express').Router();
const Controller = require('../controllers/petController');

router.get('/', Controller.get);
router.post('/', Controller.create);
router.put('/:id', Controller.update);
router.patch('/:id', Controller.updateRequest);
router.delete('/:id', Controller.delete);

module.exports = router;