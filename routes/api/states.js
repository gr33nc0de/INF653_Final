const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

// Define routes for state-specific endpoints
router.route('/:state')
    .get(statesController.getStateByCode)
    .post(statesController.addFunFact)
    .patch(statesController.updateFunFact)
    .delete(statesController.deleteFunFact);

router.route('/:state/funfact')
    .get(statesController.getRandomFunFact)
    .post(statesController.addFunFact)
    .patch(statesController.updateFunFact)
    .delete(statesController.deleteFunFact);

router.route('/:state/capital')
    .get(statesController.getStateCapital);

router.route('/:state/nickname')
    .get(statesController.getStateNickname);

router.route('/:state/population')
    .get(statesController.getStatePopulation);

router.route('/:state/admission')
    .get(statesController.getStateAdmissionDate);

router.route('/')
    .get(statesController.getAllStates);

module.exports = router;
