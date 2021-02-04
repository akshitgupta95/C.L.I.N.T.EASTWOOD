/**
 * Intent: Default Fallback Intent
 * Fulfillment: default
 */
const {Payload} =require("dialogflow-fulfillment");
module.exports = {

    fulfillment: function (agent) {

        let context = agent.contexts.find(x => x.name === "global");
        let secondtry = false;
        if (context == null) {
            // secondtry = true;
            context = agent.contexts.find(x => x.name === "global2");
        }

        if (context.parameters) {

                agent.add(
                    `I did not get that.`
                );
                agent.add(`What are the other housing preferences do you have?`);
                agent.add(new Payload(agent.UNSPECIFIED, {
                    "richContent": [
                        [
                            {
                                "type": "chips",
                                "options": [
                                    {
                                        "text": "Municipality Registration"
                                    },
                                    {
                                        "text": "House Type"
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
                                        "text": "Near supermarkets",
                                    },
                                    {
                                        "text": "No other preference",
                                    }
                                ]
                            }
                        ]
                    ]
                }, {sendAsMessage: true, rawPayload: true}));


        }
        else{
            agent.add('Hi! It seems I couldn\'t get your name yet. Could you tell me what\'s your name?')
        }



        }


};
