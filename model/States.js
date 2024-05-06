const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new Schema({
    state: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true // Ensures uniqueness of state code
    },
    nickname: String,
    website: String,
    admission_date: Date,
    admission_number: Number,
    capital_city: String,
    capital_url: String,
    population: Number,
    population_rank: Number,
    constitution_url: String,
    state_flag_url: String,
    state_seal_url: String,
    map_image_url: String,
    landscape_background_url: String,
    skyline_background_url: String,
    twitter_url: String,
    facebook_url: String,
    funfacts: {
        type: [String], // Array of strings for fun facts
        default: [] // Default value as an empty array
    }
});

module.exports = mongoose.model('State', stateSchema);
