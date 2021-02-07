
const {Payload} =require("dialogflow-fulfillment");
module.exports = {

    fulfillment: function (agent) {
        let name=agent.contexts.find(x => x.name === "global").parameters.givenName;
        if(name.length>0) {
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

        }
        else{
            agent.add('Sorry, I couldn\'t get that. What\'s name that is assigned to you in the scenario?')
        }

    }

};
