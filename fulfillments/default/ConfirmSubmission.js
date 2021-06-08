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
            info:  houseSubmitted,
            event: "NAME_HOUSE_SUBMIT",
            wid: workerIdandSessionandAccuracy.workerId,
            accuracy: workerIdandSessionandAccuracy.accuracy,
            sid: workerIdandSessionandAccuracy.scenarioId
        }, logs);

        if(correctHouse.toString().toLowerCase()===houseSubmitted.toString().toLowerCase()) {
            console.log("wid: " + workerIdandSessionandAccuracy.workerId + " Correct House Submitted: True");
            log({
                info: "True",
                event: "CORRECT_HOUSE_SUBMIT",
                wid: workerIdandSessionandAccuracy.workerId,
                accuracy: workerIdandSessionandAccuracy.accuracy,
                sid: workerIdandSessionandAccuracy.scenarioId
            }, logs);
        }
       else{
            console.log("wid: "+ workerIdandSessionandAccuracy.workerId+  " Correct House Submitted: False");
            log({
                info: "False",
                event: "CORRECT_HOUSE_SUBMIT",
                wid: workerIdandSessionandAccuracy.workerId,
                accuracy: workerIdandSessionandAccuracy.accuracy,
                sid: workerIdandSessionandAccuracy.scenarioId
            }, logs);
        }

        agent.add("Hope you like the house. Have a nice Day!");
        log({
            info: new Date().toString(),
            event: "END",
            wid: workerIdandSessionandAccuracy.workerId,
            accuracy: workerIdandSessionandAccuracy.accuracy,
            sid: workerIdandSessionandAccuracy.scenarioId
        }, logs);
        agent.end("This task is now complete. Click the continue button in left of your screen to proceed");

    }

};
