const verifyStates = (req, res, next) => {
    const allowedStates = statesData.map(state => state.code.toUpperCase()); // Step 1 and 2
    const stateCode = req.params.state.toUpperCase(); // Step 5

    const foundState = allowedStates.find(state => state === stateCode); // Step 3

    if (!foundState) { // Step 4
        return res.sendStatus(400).json({ error: 'Invalid state abbreviation' }); // Respond with appropriate error
    }

    req.stateCode = foundState; // Step 5
    next();
};

module.exports = verifyStates;
