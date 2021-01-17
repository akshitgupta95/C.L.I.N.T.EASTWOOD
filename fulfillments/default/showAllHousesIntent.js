
const {Payload} =require("dialogflow-fulfillment");
var House = require("./models/house");
var Scenario = require("./models/scenarios");

module.exports = {

    fulfillment: function (agent) {
        let name=agent.parameters.givenName;

        return House.find().then(allhouses=>{
            agent.add(`These are all your options. You can choose any one of these by clicking on the text underneath each.`);
            let richContent={
                "richContent": [
                    []
                ]
            };
            for(let i=0;i<allhouses.length;i++){
                richContent.richContent[0].push({
                    "type": "divider"
                });
                richContent.richContent[0].push({
                    "type": "image",
                    "rawUrl": allhouses[i].url,
                    "accessibilityText": "Dialogflow across platforms"
                });
                richContent.richContent[0].push({
                    "type": "list",
                    "title": allhouses[i].name,
                    "subtitle": allhouses[i].summary.toString().replace(/\\n/g,'\n'),
                    "event": {
                        "name": "chooseOption1",
                        "languageCode": "",
                        "parameters":  {"name":allhouses[i].name}
                    }
                });

            }
            agent.add(new Payload(agent.UNSPECIFIED,richContent,{ sendAsMessage: true, rawPayload: true }));
        });

    }

};
