// Import necessary modules
const State = require('../model/States');

// Data object
const data = {
    states: require('../model/statesData.json'),
    setStates: function(data) { this.states = data }
};

// Get all states data
const getAllStates = async (req, res) => {
    try {
        // Retrieve all states from local JSON file
        const localStates = require('../model/statesData.json');

        // Retrieve all fun facts from MongoDB
        const funFacts = await State.find({}, { _id: 0, code: 1, funfacts: 1 });

        // Merge local states data with fun facts
        const mergedStates = localStates.map(localState => {
            const foundFact = funFacts.find(fact => fact.code === localState.code);
            if (foundFact) {
                localState.funfacts = foundFact.funfacts;
            } else {
                localState.funfacts = [];
            }
            return localState;
        });

        // Send the response with all states data
        res.status(200).json(mergedStates);
    } catch (error) {
        console.error('Error getting all states data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get random fun fact for a state
async function getStatesByContiguity(req, res) {
    // Implement function logic here
}


// Get state data by state code
const getStateByCode = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase(); // Ensure the state code is in uppercase

        // Retrieve state data from local JSON file
        const localState = require('../model/statesData.json').find(state => state.code === stateCode);

        if (!localState) {
            return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
        }

        // Retrieve fun facts for the state from MongoDB
        const foundFact = await State.findOne({ code: stateCode }, { _id: 0, funfacts: 1 });

        // Merge state data with fun facts
        if (foundFact && foundFact.funfacts.length > 0) {
            localState.funfacts = foundFact.funfacts;
        } else {
            delete localState.funfacts; // Remove the empty funfacts array
        }

        // Send the response with state data
        res.status(200).json(localState);
    } catch (error) {
        console.error('Error getting state data by code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// Get random fun fact for a state
async function getRandomFunFact(req, res) {
    // Implement function logic here
}

// Get state capital
const getStateCapital = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase(); // Ensure the state code is in uppercase

        // Retrieve state data from local JSON file
        const localState = require('../model/statesData.json').find(state => state.code === stateCode);

        if (!localState) {
            return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
        }

        // Send the response with state capital
        res.status(200).json({ state: localState.state, capital: localState.capital_city });
    } catch (error) {
        console.error('Error getting state capital:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get state nickname
const getStateNickname = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase(); // Ensure the state code is in uppercase

        // Retrieve state data from local JSON file
        const localState = require('../model/statesData.json').find(state => state.code === stateCode);

        if (!localState) {
            return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
        }

        // Send the response with state nickname
        res.status(200).json({ state: localState.state, nickname: localState.nickname });
    } catch (error) {
        console.error('Error getting state nickname:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get state population
const getStatePopulation = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase(); // Ensure the state code is in uppercase

        // Retrieve state data from local JSON file
        const localState = require('../model/statesData.json').find(state => state.code === stateCode);

        if (!localState) {
            return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
        }

        // Send the response with state population
        res.status(200).json({ state: localState.state, population: localState.population });
    } catch (error) {
        console.error('Error getting state population:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get state admission date
const getStateAdmissionDate = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase(); // Ensure the state code is in uppercase

        // Retrieve state data from local JSON file
        const localState = require('../model/statesData.json').find(state => state.code === stateCode);

        if (!localState) {
            return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
        }

        // Send the response with state admission date
        res.status(200).json({ state: localState.state, admission_date: localState.admission_date });
    } catch (error) {
        console.error('Error getting state admission date:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Add a fun fact
const addFunFact = async (req, res) => {
    try {
        const stateCode = req.params.state;
        const funfacts = req.body.funfacts;

        // Check if funfacts is provided
        if (!funfacts) {
            return res.status(400).json({ message: 'State fun facts value required' });
        }

        // Check if funfacts is an array
        if (!Array.isArray(funfacts)) {
            return res.status(400).json({ message: 'State fun facts value must be an array' });
        }

        // Check if funfacts array is empty
        if (funfacts.length === 0) {
            return res.status(400).json({ message: 'State fun facts value required' });
        }

        // Update the MongoDB collection
        const updatedState = await State.findOneAndUpdate(
            { code: stateCode },
            { $push: { funfacts: { $each: funfacts } } },
            { new: true, upsert: true }
        );

        // Check if the state has at least 4 properties
        if (!updatedState) {
            return res.status(404).json({ message: 'State not found.' });
        }

        // Send the response in the desired format
        const response = {
            "_id": updatedState._id,
            "stateCode": updatedState.code,
            "funfacts": updatedState.funfacts,
            "__v": updatedState.__v
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('Error adding fun facts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




// Update a fun fact
const updateFunFact = async (req, res) => {
    try {
        const stateCode = req.params.state;
        const index = req.body.index;
        const newFunFact = req.body.funfact;

        // Check if index and new fun fact are provided
        if (!index || !newFunFact) {
            return res.status(400).json({ message: 'Index and new fun fact must be provided.' });
        }

        // Adjust the index to be zero-based
        const adjustedIndex = index - 1;

        // Find the state by code
        const state = await State.findOne({ code: stateCode });

        // If state not found, return error message
        if (!state) {
            return res.status(404).json({ message: `No state found for ${stateCode}` });
        }

        // Check if the state has fun facts
        if (!state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
        }

        // Check if the provided index is valid
        if (adjustedIndex < 0 || adjustedIndex >= state.funfacts.length) {
            return res.status(400).json({ message: `No Fun Fact found at that index for ${state.state}` });
        }

        // Update the fun fact at the specified index
        state.funfacts[adjustedIndex] = newFunFact;
        await state.save();

        // Send the updated state with fun facts
        res.status(200).json(state);
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
