// Import Model
const State = require('../model/States');

// Data object
const data = {
    states: require('../model/statesData.json'),
    setStates: function(data) { this.states = data }
};


// Get all states data
const getAllStates = async (req, res) => {
    try {
        // get all states from local JSON 
        const localStates = require('../model/statesData.json');

        // get all fun facts from MongoDB
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

        // Send response with all states data
        res.status(200).json(mergedStates);
    } catch (error) {
        console.error('Error getting all states data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getStatesByContiguity = async (req, res) => {
    try {
        const isContiguous = req.params.isContiguous; // Get isContiguous 

        // Get all states from local json
        const allStates = require('../model/statesData.json');

        if (isContiguous === 'true') {
            // Filter out AK and HI for contig
            const contiguousStates = allStates.filter(state => state.code !== 'AK' && state.code !== 'HI');
            return res.status(200).json(contiguousStates);
        } else if (isContiguous === 'false') {
            // Filter out all states except AK and HI for non-contig
            const nonContiguousStates = allStates.filter(state => state.code === 'AK' || state.code === 'HI');
            return res.status(200).json(nonContiguousStates);
        } else {
            return res.status(400).json({ message: 'Invalid isContiguous parameter value. Use true or false.' });
        }
    } catch (error) {
        console.error('Error getting states by contiguity:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Get state data by state code
const getStateByCode = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase(); 

        const localState = require('../model/statesData.json').find(state => state.code === stateCode);

        if (!localState) {
            return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
        }

        // get fun facts for state from MongoDB
        const foundFact = await State.findOne({ code: stateCode }, { _id: 0, funfacts: 1 });

        // Merge state data with fun facts
        if (foundFact && foundFact.funfacts.length > 0) {
            localState.funfacts = foundFact.funfacts;
        } else {
            delete localState.funfacts; // Remove empty funfacts array
        }

        // Send response with state data
        res.status(200).json(localState);
    } catch (error) {
        console.error('Error getting state data by code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Get random fun fact for a state
const getRandomFunFact = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase();

        const localState = data.states.find(state => state.code === stateCode);

        if (!localState) {
            return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
        }

        // get fun facts for state from MongoDB
        const stateData = await State.findOne({ code: stateCode });
        if (!stateData || !stateData.funfacts || stateData.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${localState.state}` });
        }

        // Get a random fun fact
        const randomIndex = Math.floor(Math.random() * stateData.funfacts.length);
        const randomFunFact = stateData.funfacts[randomIndex];

        // Send response with the random ff
        res.status(200).json({ funfact: randomFunFact });
    } catch (error) {
        console.error('Error getting random fun fact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Get state capital
const getStateCapital = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase();

        const localState = require('../model/statesData.json').find(state => state.code === stateCode);

        if (!localState) {
            return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
        }

        // Send response with state capital
        res.status(200).json({ state: localState.state, capital: localState.capital_city });
    } catch (error) {
        console.error('Error getting state capital:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Get state nickname
const getStateNickname = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase();

        const localState = require('../model/statesData.json').find(state => state.code === stateCode);

        if (!localState) {
            return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
        }

        // Send response with state nickname
        res.status(200).json({ state: localState.state, nickname: localState.nickname });
    } catch (error) {
        console.error('Error getting state nickname:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Get state population
const getStatePopulation = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase();

        // Get local state data from JSON
        const localState = require('../model/statesData.json').find(state => state.code === stateCode);

        if (!localState) {
            return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
        }

        // Format comma placement
        const formattedPopulation = localState.population.toLocaleString();

        // Send response with state population
        res.status(200).json({ state: localState.state, population: formattedPopulation });
    } catch (error) {
        console.error('Error getting state population:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Get state admission date
const getStateAdmissionDate = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase();

        const localState = require('../model/statesData.json').find(state => state.code === stateCode);

        if (!localState) {
            return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
        }

        // Send response with state admission date
        res.status(200).json({ state: localState.state, admitted: localState.admission_date });
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

        // Update states collection
        const updatedState = await State.findOneAndUpdate(
            { code: stateCode },
            { $push: { funfacts: { $each: funfacts } } },
            { new: true, upsert: true }
        );

        // Check if state has at least 4 properties
        if (!updatedState) {
            return res.status(404).json({ message: 'State not found.' });
        }

        // Send funfact response
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


const updateFunFact = async (req, res) => {
    try {
        const stateCode = req.params.state;
        const index = req.body.index;
        const newFunFact = req.body.funfact;

        // Check if index and new fun fact are provided
        if (!index) {
            return res.status(400).json({ message: 'State fun fact index value required' });
        }

        // Check if new fun fact is a non-empty string
        if (!newFunFact || typeof newFunFact !== 'string' || newFunFact.trim() === '') {
            return res.status(400).json({ message: 'State fun fact value required' });
        }

        // index is zero-based
        const adjustedIndex = index - 1;

        // Find state by code
        const state = await State.findOne({ code: stateCode });

        // If state not found, return error message
        if (!state) {
            // Get state name from local JSON
            const localState = require('../model/statesData.json').find(state => state.code === stateCode);
            const stateName = localState ? localState.state : stateCode;
            return res.status(404).json({ message: `No Fun Facts found for ${stateName}`});
        }

        // Check if state has fun facts
        if (!state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${state.state}`});
        }

        // Check index is valid
        if (adjustedIndex < 0 || adjustedIndex >= state.funfacts.length) {
            // Get state name from local JSON
            const localState = require('../model/statesData.json').find(state => state.code === stateCode);
            const stateName = localState ? localState.state : stateCode;
            return res.status(404).json({ message: `No Fun Fact found at that index for ${state.state}`});
        }

        // Update fun fact at index
        state.funfacts[adjustedIndex] = newFunFact;
        await state.save();

        // Send updated state with fun facts
        res.status(200).json(state);
    } catch (error) {
        console.error('Error updating fun fact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteFunFact = async (req, res) => {
    try {
        let index = req.body.index;

        if (!index) {
            return res.status(400).json({ message: 'State fun fact index value required' });
        }

        index--;

        const stateCode = req.params.state;

        let state = await State.findOne({ code: stateCode });

        // Check if state exists in MongoDB
        if (!state) {
            // get full state name from local statesData.json
            const stateData = data.states.find(state => state.code === stateCode);
            const stateName = stateData ? stateData.state : stateCode;
            return res.status(404).json({ message: `No Fun Facts found for ${stateName}` });
        }

        // Check if index is valid
        if (index < 0 || index >= state.funfacts.length) {
            // get full state name from local statesData.json
            const stateData = data.states.find(state => state.code === stateCode);
            const stateName = stateData ? stateData.state : stateCode;
            return res.status(404).json({ message: `No Fun Fact found at that index for ${stateName}` });
        }

        // Remove fun fact at index
        state.funfacts.splice(index, 1);

        // Save updated state
        state = await state.save();

        // Construct the response object
        const response = {
            _id: state._id,
            stateCode: state.code,
            funfacts: state.funfacts,
            __v: state.__v
        };

        // Success Response
        res.status(200).json(response);
    } catch (error) {
        console.error('Error deleting fun fact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


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