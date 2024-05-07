const verifyStates = (req, res, next) => {
    const allowedStates = statesData.map(state => state.code.toUpperCase()); // Step 1 and 2
    const stateCode = req.params.state.toUpperCase(); 

    const foundState = allowedStates.find(state => state === stateCode);

    if (!foundState) { 
        return res.sendStatus(400).json({ error: 'Invalid state abbreviation' }); 
    }

    req.stateCode = foundState;
    next();
};

module.exports = verifyStates;
