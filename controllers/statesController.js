// Import necessary modules
const State = require('../model/States');

// Data object
const data = {
    states: require('../model/statesData.json'),
    setStates: function(data) { this.states = data }
};

// Get all States
const getAllStates = async (req, res) => {
    try {
        // Fetch states data
        const states = data.states;
        
        // Fetch all fun facts from MongoDB
        const funFacts = await State.find({}, 'state funfacts');
        console.log('Fun Facts:', funFacts); // Log fun facts for debugging

        // Map fun facts to states
        const combinedData = states.map(state => {
            const stateCode = state.code;
            const stateFunFacts = funFacts
                .filter(fact => fact.state.toLowerCase() === state.name.toLowerCase())
                .flatMap(fact => fact.funfacts);
            return { ...state, funfacts: stateFunFacts };
        });

        // Send response
        res.json(combinedData);
    } catch (err) {
        console.error('Error fetching all states:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get states data based on contiguity
async function getStatesByContiguity(req, res) {
    const { contig } = req.query;
    let statesData = [];

    if (contig === 'true') {
        // Get contiguous states data
        statesData = data.states.filter(state => !['AK', 'HI'].includes(state.stateCode));
    } else if (contig === 'false') {
        // Get non-contiguous states data
        statesData = data.states.filter(state => ['AK', 'HI'].includes(state.stateCode));
    } else {
        // Invalid query parameter
        return res.status(400).json({ error: 'Invalid query parameter value. Use "true" or "false".' });
    }

    // Send response
    res.json(statesData);
}

// Get state data by state code
async function getStateByCode(req, res) {
    // Implement function logic here
}

// Get random fun fact for a state
async function getRandomFunFact(req, res) {
    // Implement function logic here
}

// Get state capital
async function getStateCapital(req, res) {
    // Implement function logic here
}

// Get state nickname
async function getStateNickname(req, res) {
    // Implement function logic here
}

// Get state population
async function getStatePopulation(req, res) {
    // Implement function logic here
}

// Get state admission date
async function getStateAdmissionDate(req, res) {
    // Implement function logic here
}

// Add funFact
const addFunFact = async (req, res) => {
    try {
        const stateCode = req.params.state;
        console.log("Found stateCode: " + stateCode);
        const funfacts = req.body.funfacts;
        console.log("Found funfacts: " + funfacts);

        // Check if funfacts is provided and is an array
        if (!Array.isArray(funfacts) || funfacts.length === 0) {
            return res.status(400).json({ message: 'Fun facts must be provided as a non-empty array.' });
        }

        // Update the MongoDB collection
        const updatedState = await State.findOneAndUpdate(
            { code: stateCode },
            { $push: { funfacts: { $each: funfacts } } },
            { new: true, upsert: true }
        );

        // Send a success response
        res.status(201).json({ message: 'Fun facts added successfully.', state: updatedState });
    } catch (error) {
        console.error('Error adding fun facts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Update a fun fact
const updateFunFact = async (req, res) => {
    try {
        const stateCode = req.params.state;
        let index = req.body.index;
        const newFunFact = req.body.funfact;

        // Check if index and new fun fact are provided
        if (!index || !newFunFact) {
            return res.status(400).json({ message: 'Index and new fun fact must be provided.' });
        }

        // Adjust the index to make it zero-based
        index--;

        // Update the MongoDB collection
        const updatedState = await State.findOneAndUpdate(
            { code: stateCode },
            { $set: { [`funfacts.${index}`]: newFunFact } },
            { new: true }
        );

        // Send a success response
        res.status(200).json({ message: 'Fun fact updated successfully.', state: updatedState });
    } catch (error) {
        console.error('Error updating fun fact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a funfact
const deleteFunFact = async (req, res) => {
    try {
        const stateCode = req.params.state;
        let index = req.body.index;

        // Check if index is provided
        if (!index) {
            return res.status(400).json({ message: 'Index must be provided.' });
        }

        // Adjust the index to be zero-based
        index--;

        // Update the MongoDB collection
        const updatedState = await State.findOneAndUpdate(
            { code: stateCode },
            { $unset: { [`funfacts.${index}`]: 1 } },
            { new: true }
        );

        // Remove any potential null values from the funfacts array
        await State.updateOne(
            { code: stateCode },
            { $pull: { funfacts: null } }
        );

        // Send a success response
        res.status(200).json({ message: 'Fun fact deleted successfully.', state: updatedState });
    } catch (error) {
        console.error('Error deleting fun fact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};






// Export only the functions
module.exports = {
    getAllStates,
    getStatesByContiguity,
    getStateByCode,
    getRandomFunFact,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmissionDate,
    addFunFact,
    updateFunFact,
    deleteFunFact
};
