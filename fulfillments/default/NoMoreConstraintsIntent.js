const {Card} = require('dialogflow-fulfillment');
const {Payload} = require("dialogflow-fulfillment");
var House = require("./models/house");
var Scenario = require("./models/scenarios");
const logs = require('./models/logs');
const log = require('./helpers/utility');


module.exports = {

    fulfillment: function (agent) {
        let workerIdandSessionandAccuracy = JSON.parse(agent.originalRequest.payload.userId);
        let accuracy=workerIdandSessionandAccuracy.accuracy;
        return Scenario.findOne({id: workerIdandSessionandAccuracy.scenarioId}).populate('correctHouse')
            .then(data => {
                let response = "Okay, ";
                let context = agent.contexts.find(x => x.name === "global");
                let secondtry = false; //TODO: not needed in current implementation, unlimited tries allowed
                if (context == null) {
                    // secondtry = true;
                    context = agent.contexts.find(x => x.name === "global2");
                }

                let givenName = context.parameters.givenName;
                response = response + givenName + ", as per your submitted preferences,\n";
                agent.add(response);
                agent.add("I suggest the following option for you.");
                // let houseType = context.parameters.housetype;
                // response=response+"House Type: "+houseType;
                // if (context.parameters.travelTime != null) {
                //     var travelTime = context.parameters.travelTime.amount;
                //     response=response+"\n Commute Time: "+travelTime;
                //     let travelTimeunit = context.parameters.travelTime.unit;
                //     response=response+travelTimeunit;
                // }
                // if (context.parameters.duration != null) {
                //     var duration = context.parameters.duration.amount;
                //     response=response+"\n Stay period: "+duration;
                //     let durationunit = context.parameters.duration.unit;
                //     response=response+durationunit;
                // }
                // if (context.parameters.number != null) {
                //     var amount = context.parameters.number;
                //     response=response+"\n Rent: Euro"+ amount;
                // }
                // if(context.parameters.registration){
                //     response=response+"\n Municipality Registration: Required"
                // }
                // if(context.parameters.supermarkets){
                //     response=response+"\n Nearby Supermarkets: Required"
                // }
                //
                if (context.parameters.duration) {
                    if (context.parameters.duration.unit === "yr")
                        context.parameters.duration.amount = context.parameters.duration.amount * 12;//conversion to months
                }
                let inputConstraints = {
                    "nearSupermarkets": context.parameters.supermarkets,
                    "municipalityRegistration": context.parameters.registration,
                    "typeOfAccomodation": context.parameters.housetype,
                    "commuteTime": context.parameters.travelTime != null ? context.parameters.travelTime.amount : null,
                    "duration": {
                        "value": context.parameters.duration != null ? context.parameters.duration.amount : null,
                        "unit": context.parameters.duration != null ? context.parameters.duration.unit : null
                    },
                    "maxRent": context.parameters.number != null ? context.parameters.number : null
                };

                let foundAllConstraints = checkAllConstraints(data.constraints, inputConstraints, workerIdandSessionandAccuracy);
                console.log("wid: "+workerIdandSessionandAccuracy.workerId+" foundAllConstraints: "+ foundAllConstraints);
                log({
                    info: "foundAllConstraints: "+ foundAllConstraints,
                    wid: workerIdandSessionandAccuracy.workerId
                }, logs);
                let parameters=context.parameters;
                parameters.correctHouse=data.correctHouse.name;

                if (!secondtry) {
                    if (foundAllConstraints && accuracy.toString()=="1") {
                        //show correct house here and end
                        let houseToShow = data.correctHouse;
                        parameters.houseSelected=houseToShow.name;
                        agent.context.set('global', 40, parameters); //storing current shown house for ConfirmSubmit Intent
                        showHouseAndRetry(houseToShow, agent);

                    } else {
                        //show random incorrect house here and ask for try again
                        let correctHouse = data.correctHouse;
                        return House.find({_id: {$ne: correctHouse._id}})
                            .then(data => {
                                let incorrectHouse = data[Math.floor(Math.random() * data.length)];
                                parameters.houseSelected=incorrectHouse.name;
                                agent.context.set('global', 40, parameters); //storing current shown house for ConfirmSubmit Intent
                                showHouseAndRetry(incorrectHouse, agent)
                            });

                    }
                } else { //second and last try //TODO: will never be executed in current implementation with unlimited retries
                    if (foundAllConstraints) {
                        //show correct house here and end
                        let houseToShow = data.correctHouse;
                        showHouseAndEnd(houseToShow, agent);

                    } else {
                        //show random incorrect house here and end
                        let correctHouse = data.correctHouse;
                        return House.find({_id: {$ne: correctHouse._id}})
                            .then(data => {
                                let incorrectHouse = data[Math.floor(Math.random() * data.length)];
                                showHouseAndEnd(incorrectHouse, agent)
                            });
                    }

                }


                // if(houseType && houseType.toString().toUpperCase()==="studio".toUpperCase() && context.parameters.registration && context.parameters.supermarkets && duration.toString().toUpperCase()==="1".toUpperCase() && travelTime.toString().toUpperCase()==="10".toUpperCase()) {
                //     if (secondtry) {
                //
                //         agent.add(new Payload(agent.UNSPECIFIED, {
                //             "richContent": [
                //                 [
                //                     {
                //                         "type": "image",
                //                         "rawUrl": "https://www.xior.nl/cache/building/443/thumb/0_400_8-.jpg",
                //                         "accessibilityText": "Dialogflow across platforms"
                //                     },
                //                     {
                //                         "type": "info",
                //                         "title": "Xior Barbarasteeg",
                //                         "subtitle": "Studio with Rent: Euro 440 \n Location: Barbarasteeg 2, Delft \n Minimum Contract: 12 months with Municipality Registration \n Additonals: In front of Delft Station, 8 minutes to TU and near the city centre and the market",
                //                     }
                //                 ]
                //                 ]
                //
                //
                //         }, {sendAsMessage: true, rawPayload: true}));
                //         agent.end("This task is now complete. Click the continue button in left of your screen to proceed");
                //     }
                //
                //
                //      else {
                //         agent.add(new Payload(agent.UNSPECIFIED, {
                //             "richContent": [
                //                 [
                //                     {
                //                         "type": "image",
                //                         "rawUrl": "https://www.xior.nl/cache/building/443/thumb/0_400_8-.jpg",
                //                         "accessibilityText": "Dialogflow across platforms"
                //                     },
                //                     {
                //                         "type": "info",
                //                         "title": "Xior Barbarasteeg",
                //                         "subtitle": "Studio with Rent: Euro 440 \n Location: Barbarasteeg 2, Delft \n Minimum Contract: 12 months with Municipality Registration \n Additonals: In front of Delft Station, 8 minutes to TU and near the city centre and the market",
                //                     }
                //                 ],
                //                 [
                //                     {
                //                         "type": "description",
                //                         "title": "Do you want to submit this task or try again?",
                //                     }
                //
                //                 ],
                //                 [
                //                     {
                //                         "type": "chips",
                //                         "options": [
                //                             {
                //                                 "text": "Submit"
                //                             },
                //                             {
                //                                 "text": "Try Again",
                //                             }
                //                         ]
                //                     }
                //                 ]
                //             ]
                //         }, {sendAsMessage: true, rawPayload: true}));
                //     }
                // }
                // else {
                //     if(secondtry){
                //         agent.add(new Payload(agent.UNSPECIFIED, {
                //             "richContent": [
                //                 [
                //                     {
                //                         "type": "image",
                //                         "rawUrl": "https://www.duwo.nl/typo3temp/assets/_processed_/e/4/csm_image_242c92203779372268c56935ccaa57ab_005_roland_holstlaan_p1020792020_2364ec3ebe.jpg",
                //                         "accessibilityText": "Dialogflow across platforms"
                //                     },
                //                     {
                //                         "type": "info",
                //                         "title": "Roland Holstlaan",
                //                         "subtitle": "Studio with Rent: Euro 500 \n Location: Roland Holstlaan, Delft  \n Additonals: Near Delft South, 12 minutes to TU",
                //                     }
                //                 ]
                //             ]
                //
                //         }, {sendAsMessage: true, rawPayload: true}));
                //         agent.end("This task is now complete. Click the continue button in left of your screen to proceed");
                //
                //     }
                //     else {
                //         agent.add(new Payload(agent.UNSPECIFIED, {
                //             "richContent": [
                //                 [
                //                     {
                //                         "type": "image",
                //                         "rawUrl": "https://www.duwo.nl/typo3temp/assets/_processed_/e/4/csm_image_242c92203779372268c56935ccaa57ab_005_roland_holstlaan_p1020792020_2364ec3ebe.jpg",
                //                         "accessibilityText": "Dialogflow across platforms"
                //                     },
                //                     {
                //                         "type": "info",
                //                         "title": "Roland Holstlaan",
                //                         "subtitle": "Studio with Rent: Euro 500 \n Location: Roland Holstlaan, Delft  \n Additonals: Near Delft South, 12 minutes to TU",
                //                     }
                //                 ],
                //                 [
                //                     {
                //                         "type": "description",
                //                         "title": "Do you want to submit this task or try again?",
                //                     }
                //
                //                 ],
                //                 [
                //                     {
                //                         "type": "chips",
                //                         "options": [
                //                             {
                //                                 "text": "Submit"
                //                             },
                //                             {
                //                                 "text": "Try Again",
                //                             }
                //                         ]
                //                     }
                //                 ]
                //
                //             ],
                //
                //         }, {sendAsMessage: true, rawPayload: true}));
                //     }
                // }

            });
    }

};

function checkAllConstraints(scenarioConstraints, inputConstraints, workerIdandSessionandAccuracy) {
    let unmetConstraints = [];
    if (scenarioConstraints.nearSupermarkets) {
        if (!inputConstraints.nearSupermarkets)
            unmetConstraints.push("nearSupermarkets");
    }
    if (scenarioConstraints.municipalityRegistration) {
        if (!inputConstraints.municipalityRegistration)
            unmetConstraints.push("municipalityRegistration");
    }
    if (scenarioConstraints.typeOfAccomodation.toString().toUpperCase() !== inputConstraints.typeOfAccomodation.toString().toUpperCase())
        unmetConstraints.push("typeOfAccomodation");
    if (scenarioConstraints.commuteTime != -1) {//there is a commute time constraint
        if (!inputConstraints.commuteTime)//no commute time given by user
            unmetConstraints.push("commuteTime");
        else {
            if (scenarioConstraints.commuteTime.toString() !== inputConstraints.commuteTime.toString())
                unmetConstraints.push("commuteTime");
        }
    }
    if (scenarioConstraints.maxRent != -1) {
        if (!inputConstraints.maxRent)//no max rent given by user
            unmetConstraints.push("maxRent");
        else {
            if (scenarioConstraints.maxRent.toString() !== inputConstraints.maxRent.toString())
                unmetConstraints.push("maxRent");
        }
    }
    if (scenarioConstraints.duration.value != -1) {//there is a duration constraint // in db always store months
        if (!inputConstraints.duration.value)//no duration given by user
            unmetConstraints.push("duration");
        else {
            if (scenarioConstraints.duration.value.toString() !== inputConstraints.duration.value.toString())
                unmetConstraints.push("duration");
        }
    }
    if (!Array.isArray(unmetConstraints) || !unmetConstraints.length)
        return true;
    else {

        console.log("wid: "+workerIdandSessionandAccuracy.workerId+ " unmetConstraints: "+unmetConstraints.toString());
        log({
            info: " unmetConstraints: "+unmetConstraints.toString(),
            wid: workerIdandSessionandAccuracy.workerId
        }, logs);
        return false;
    }

}

function showHouseAndEnd(house, agent) {
    let summary=house.summary.toString();
    var formattedSummary = summary.replace(/\\n/g,'\n');
    agent.add(new Payload(agent.UNSPECIFIED, {
        "richContent": [
            [
                {
                    "type": "image",
                    "rawUrl": house.url,
                    "accessibilityText": "the shown house"
                },
                {
                    "type": "info",
                    "title": house.name,
                    "subtitle": formattedSummary
                }
            ]
        ]


    }, {sendAsMessage: true, rawPayload: true}));
    agent.end("This task is now complete. Click the continue button in left of your screen to proceed");
}

function showHouseAndRetry(house, agent) {

    let summary=house.summary.toString();
    var formattedSummary = summary.replace(/\\n/g,'\n');
    agent.add(new Payload(agent.UNSPECIFIED, {
        "richContent": [
            [
                {
                    "type": "image",
                    "rawUrl": house.url,
                    "accessibilityText": "the shown house"
                },
                {
                    "type": "info",
                    "title": house.name,
                    "subtitle": formattedSummary
                }
            ],
            [
                {
                    "type": "description",
                    "title": "Do you want to submit this task or try again?",
                }

            ],
            [
                {
                    "type": "chips",
                    "options": [
                        {
                            "text": "Submit House"
                        },
                        {
                            "text": "Try Again",
                        },
                        {
                            "text": "Show All houses"
                        },
                    ]
                }
            ]
        ]
    }, {sendAsMessage: true, rawPayload: true}));
}
