const logs = require('./models/logs');
const log = require('./helpers/utility');

module.exports = {

    fulfillment: function (agent) {

        let workerIdandSessionandAccuracy = JSON.parse(agent.originalRequest.payload.userId);
        let context = agent.contexts.find(x => x.name === "global");
        let houseSubmitted= context.parameters.houseSelected;
        let correctHouse=context.parameters.correctHouse;
        console.log("wid: "+ workerIdandSessionandAccuracy.workerId+ " sid: "+workerIdandSessionandAccuracy.scenarioId+ " house Submitted: "+ houseSubmitted);
        log({
            info: "sid: "+workerIdandSessionandAccuracy.scenarioId+ " house Submitted: "+ houseSubmitted,
            wid: workerIdandSessionandAccuracy.workerId
        }, logs);

        if(correctHouse.toString().toLowerCase()===houseSubmitted.toString().toLowerCase()) {
            console.log("wid: " + workerIdandSessionandAccuracy.workerId + " Correct House Submitted: True");
            log({
                info: " Correct House Submitted: True",
                wid: workerIdandSessionandAccuracy.workerId
            }, logs);
        }
       else{
            console.log("wid: "+ workerIdandSessionandAccuracy.workerId+  " Correct House Submitted: False");
            log({
                info: " Correct House Submitted: False",
                wid: workerIdandSessionandAccuracy.workerId
            }, logs);
        }

        agent.add("Hope you like the house. Have a nice Day!");
        agent.end("This task is now complete. Click the continue button in left of your screen to proceed");

    }

};
