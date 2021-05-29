
const {Payload} =require("dialogflow-fulfillment");
module.exports = {

    fulfillment: function (agent) {

        let context = agent.contexts.find(x => x.name === "global");
        let parameters=context.parameters;
        parameters.registration=true;
        agent.context.set('global', 40, parameters);
        agent.add(`Got it, you need municipality registration. Any other preferences you would like me to know about?`);
        agent.add(new Payload(agent.UNSPECIFIED,{
            "richContent": [
                [
                    {
                        "type": "chips",
                        "options": [
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
                                "text": "Near supermarkets",
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
