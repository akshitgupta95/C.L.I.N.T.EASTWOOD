/**
 * Intent: Default Welcome Intent
 * Fulfillment: default
 */


const logs = require('./models/logs');
const log = require('./helpers/utility');

module.exports = {

  fulfillment: function (agent) {
    let workerIdandSessionandAccuracy = JSON.parse(agent.originalRequest.payload.userId);
    log({
      info: "Start Time CI Interaction",
      wid: workerIdandSessionandAccuracy.workerId
    }, logs);
    agent.add('Hi! This is a conversational interface to suggest housing options in Delft. My name is Clint. What\'s the name assigned to you?')

  }

};
