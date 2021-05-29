
module.exports = {

    fulfillment: function (agent) {
        let workerIdandSessionandAccuracy = JSON.parse(agent.originalRequest.payload.userId);
        let name=agent.context.get("global").parameters.givenName;
        agent.context.set({'name': 'global', 'lifespan': 40, 'parameters': {'givenName': name}});
        console.log("wid: "+ workerIdandSessionandAccuracy+" RESTART EVENT");
        // agent.context.set({'name': 'global2', 'lifespan': 40, 'parameters': {'givenName': name}});
        agent.setFollowupEvent("RESTART");
        agent.add("restarting journey!");

    }

};
