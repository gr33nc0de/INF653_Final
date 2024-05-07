const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

// Get states data based on contiguity
router.get('/contig=:isContiguous', statesController.getStatesByContiguity);

// Get all states data
router.route('/')
    .get(statesController.getAllStates);

// Get state data by state code
router.route('/:state')
    .get(statesController.getStateByCode);

// Get random fun fact for a state
router.route('/:state/funfact')
    .get(statesController.getRandomFunFact);

// Get state capital
router.route('/:state/capital')
    .get(statesController.getStateCapital);

// Get state nickname
router.route('/:state/nickname')
    .get(statesController.getStateNickname);

// Get state population
router.route('/:state/population')
    .get(statesController.getStatePopulation);

// Get state admission date
router.route('/:state/admission')
    .get(statesController.getStateAdmissionDate);

// Adding, updating, or deleting fun fact for a state
router.route('/:state/funfact')
    .post(statesController.addFunFact)
    .patch(statesController.updateFunFact)
    .delete(statesController.deleteFunFact);

module.exports = router;
