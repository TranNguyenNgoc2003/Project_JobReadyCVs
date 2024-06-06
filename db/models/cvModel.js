const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    job_position: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    career_objective: {
        type: String,
        required: true
    },
    work_experience: {
        type: String,
        required: true
    },
    projects: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    awards: {
        type: String,
        required: true
    },
    certificates: {
        type: String,
        required: true
    },
    references: {
        type: String,
        required: true
    },
    activities: {
        type: String,
        required: true
    },
    hobbies: {
        type: String,
        required: true
    },
    additional_info: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('CV', cvSchema);