
module.exports = {

    fulfillment: function (agent) {

        let workerIdandSessionandAccuracy = JSON.parse(agent.originalRequest.payload.userId);
        let context = agent.contexts.find(x => x.name === "global");
        let houseSubmitted= context.parameters.houseSelected;
        let correctHouse=context.parameters.correctHouse;
        console.log("wid: "+ workerIdandSessionandAccuracy.workerId+ " sid: "+workerIdandSessionandAccuracy.scenarioId+ " house Submitted: "+ houseSubmitted);
        console.log("wid: "+ workerIdandSessionandAccuracy.workerId+  " Correct House Submitted: "+ correctHouse===houseSubmitted?"true": "false");
        agent.add("Hope you like the house. Have a nice Day!");
        agent.end("This task is now complete. Click the continue button in left of your screen to proceed");

    }

};
