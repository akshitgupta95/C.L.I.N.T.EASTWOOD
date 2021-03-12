var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scenarioSchema = new Schema({
    id: Number, //alice
    description: String,
    scenarioName: String,
    constraints: {
        nearSupermarkets: Boolean,
        municipalityRegistration: Boolean,
        typeOfAccomodation: String,
        commuteTime: Number,
        duration: {
            value: Number,
            unit: String
        },
        maxRent: Number
    },
    correctHouse : { type: Schema.Types.ObjectId, ref: 'House' },


});



module.exports = mongoose.model('Scenario', scenarioSchema );
