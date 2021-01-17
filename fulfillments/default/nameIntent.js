
const {Payload} =require("dialogflow-fulfillment");
module.exports = {

    fulfillment: function (agent) {
        let name=agent.parameters.givenName;
        agent.add(`Hi ${name}, Nice to meet you. So, Tell me, what type of house are you looking for ?`);
        agent.add(new Payload(agent.UNSPECIFIED,{
            "richContent": [
                [
                    {
                        "type": "chips",
                        "options": [
                            {
                                "text": "Studio"
                            },
                            {
                                "text": "Private Room",
                            },
                            {
                                "text": "Shared Room",
                            }
                        ]
                    }
                ]
            ]
        },{ sendAsMessage: true, rawPayload: true }));

    }

};
