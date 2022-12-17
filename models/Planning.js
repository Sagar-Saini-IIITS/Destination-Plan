const mongoose = require('mongoose');

const { Schema } = mongoose;
const PlanningSchema = new Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'  
    },
    shared: {
        type: Boolean,
        required:true,
        default:"false"
    },
    title: {
        type: String,
        required: true
    },
    city: {
        type: String
    },
    place: {
        type: String
    },
    startdate: {
        type: String
    },
    returndate: {
        type: String
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
});
module.exports = mongoose.model('planning', PlanningSchema); 