const mongoose  = require('mongoose');

const Schema  = mongoose.Schema;

const LogSchema = new Schema({
    time: Date,
    info: String,
    event: String,
    wid: String,
    accuracy:String,
    sid: String

},{collection: 'CIlogs'});

module.exports = mongoose.model('logs', LogSchema);