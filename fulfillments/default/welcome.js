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
      info: new Date().toDateString(),
      event: "START",
      wid: workerIdandSessionandAccuracy.workerId,
      accuracy: workerIdandSessionandAccuracy.accuracy,
      sid: workerIdandSessionandAccuracy.scenarioId
    }, logs);
    agent.add('Hi! This is a conversational interface to suggest housing options in Delft. My name is Clint. What\'s the name assigned to you?')

  }

};
