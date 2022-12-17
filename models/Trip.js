const mongoose = require('mongoose');

const { Schema } = mongoose;
const TripSchema = new Schema({
    city: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});
module.exports = mongoose.model('trip', TripSchema); 