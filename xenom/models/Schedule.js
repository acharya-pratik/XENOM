const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    name: String,
    contact: String,
    time: String,
    location: String,
    wasteType: String,
    collectorType: String,  // Local or Business
    weather: String,  // Weather condition
    weight: Number,  // Approximate weight in kg
    notes: String  // Additional information
});

module.exports = mongoose.model('Schedule', scheduleSchema);
