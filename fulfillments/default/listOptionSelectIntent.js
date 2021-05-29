
const {Payload} =require("dialogflow-fulfillment");
module.exports = {

    fulfillment: function (agent) {



        let event=agent.contexts.find(x => x.name === "chooseoption1");
        let option = event.parameters.name;

        let context = agent.contexts.find(x => x.name === "global");
        let parameters=context.parameters;
        parameters.houseSelected=option;
        agent.context.set('global', 40, parameters); //storing house for ConfirmSubmit Intent

        agent.add(`The House selected is: ${option}`);
        agent.add(new Payload(agent.UNSPECIFIED, {
            "richContent": [
            [
                {
                    "type": "description",
                    "title": "Do you want to submit the task with this house or try again?",
                }

                ],
            [
                {
                    "type": "chips",
                    "options": [
                        {
                            "text": "Submit"
                        },
                        {
                            "text": "Try Again",
                        }
                    ]
                }
                ]
                ]
        }, {sendAsMessage: true, rawPayload: true}));


    }

};
