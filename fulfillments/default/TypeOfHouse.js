
const {Payload} =require("dialogflow-fulfillment");
module.exports = {

    fulfillment: function (agent) {
        let houseType = agent.parameters.housetype;
        if (houseType.length > 0) {
            agent.add(`Okay! ${houseType}. Do you have any more preferences?`);
            agent.add(new Payload(agent.UNSPECIFIED, {
                "richContent": [
                    [
                        {
                            "type": "chips",
                            "options": [
                                {
                                    "text": "Yes"
                                },
                                {
                                    "text": "No",
                                }
                            ]
                        }
                    ]
                ]
            }, {sendAsMessage: true, rawPayload: true}));

        } else {

            agent.add(`Let's start again. So, Tell me, what type of house are you looking for ?`);
            agent.add(new Payload(agent.UNSPECIFIED, {
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
            }, {sendAsMessage: true, rawPayload: true}));

        }
    }

};
