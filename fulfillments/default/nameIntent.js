
const {Payload} =require("dialogflow-fulfillment");
var Scenario = require("./models/scenarios");

module.exports = {

    fulfillment: function (agent) {
        let workerIdandSessionandAccuracy = JSON.parse(agent.originalRequest.payload.userId);
        let name=agent.contexts.find(x => x.name === "global").parameters.givenName;
        return Scenario.findOne({id: workerIdandSessionandAccuracy.scenarioId}).then(data => {
            if (name.length > 0 && data.scenarioName.toString().toLowerCase()==name.toString().toLowerCase()) {
                agent.context.set({'name': 'allowsubmit', 'lifespan': 5});
                agent.add(`Hi ${name}, Nice to meet you. So, Tell me, what type of house are you looking for ?`);
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

            } else {
                agent.add('Sorry, I couldn\'t get that. What\'s name that is assigned to you in the scenario?')
            }
        });

    }

};
