const mongoose  = require('mongoose');

const Schema  = mongoose.Schema;

const LogSchema = new Schema({
    time: Date,
    info: String,
    wid: String,

},{collection: 'CIlogs'});

module.exports = mongoose.model('logs', LogSchema);