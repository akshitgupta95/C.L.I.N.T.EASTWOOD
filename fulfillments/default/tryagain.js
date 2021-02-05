
module.exports = {

    fulfillment: function (agent) {

        let name=agent.context.get("global").parameters.givenName;
        agent.context.set({'name': 'global', 'lifespan': -1, 'parameters': {'givenName': name}});
        agent.context.set({'name': 'global2', 'lifespan': 40, 'parameters': {'givenName': name}});
        agent.setFollowupEvent("RESTART");
        agent.add("restarting journey!");

    }

};
