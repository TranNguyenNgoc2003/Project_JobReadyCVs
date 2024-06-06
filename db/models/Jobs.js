const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    title: {
        type: String,
        default: 'No Title'
    },
    company: {
        type: String,
        default: 'No Company'
    },
    companyLogo: {
        type: String,
        default: 'No Logo'
    },
    startDate: Date,
    endDate: Date,
    description: {
        type: String,
        default: 'No Description'
    },
    responsibilities: [{
        type: String,
        default: 'No Responsibility'
    }],
    requirements: [{
        type: String,
        default: 'No Requirement'
    }]
});

module.exports = mongoose.model('Jobs', jobSchema, 'Jobs');