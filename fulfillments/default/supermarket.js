
const {Payload} =require("dialogflow-fulfillment");
module.exports = {

    fulfillment: function (agent) {
        // agent.user.storage.supermarket=``;
        let context = agent.contexts.find(x => x.name === "global");
        let parameters=context.parameters;
        parameters.supermarkets=true;
        agent.context.set('global', 20, parameters);
        agent.add(`Got you, near the supermarkets. What other preferences do you have?`);
        agent.add(new Payload(agent.UNSPECIFIED,{
            "richContent": [
                [
                    {
                        "type": "chips",
                        "options": [
                            {
                                "text": "Municipality Registration"
                            },
                            {
                                "text": "Travel Time",
                            },
                            {
                                "text": "Max Budget",
                            },
                            {
                                "text": "Rent Duration",
                            },
                            {
                                "text": "No other preference",
                            }
                        ]
                    }
                ]
            ]
        },{ sendAsMessage: true, rawPayload: true }));
    }

};
