const express = require('express');

const path = require('path');
const { WebhookClient } = require('dialogflow-fulfillment');

const bodyParser = require('body-parser');
const app = express();
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

var mongoose=require('mongoose');
var House = require("./fulfillments/default/models/house");
var Scenario = require("./fulfillments/default/models/scenarios");
var Worker = require("./fulfillments/default/models/worker");

// Database Connectivity
var mongoDB = 'mongodb+srv://akshitgupta:akshitgupta@cluster0.jvxlv.mongodb.net/clinteastwood?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// var house = new House({ name:"Ruivenstraat, Delft",
//   description:"Furnished Room in Shared house",
//   summary:"Rent:EUR 375 Registration Possible 6 minutes commute to TU Delft Min contract: 1 year Private Room",
//   url:"https://resources.kamernet.nl/webp/43545674-bae0-403d-8c1f-b95e17e0d28b/resize/680-452" });

// House.create(house, function (err, awesome_instance) {
//   if (err) return handleError(err);
//   // saved!
//   var scene = new Scenario({
//     id:3,
//     description:"Aman is looking for a shared apartment with a private room in Delft. He is an international student and has moved to study at the TU for his Bachelor’s degree. He wants a place close to the university with less than 8 minutes commute time and requires registration at the municipality. His main requirement is that the rent of the place should be less than 400 euros along with a long term contract of at least an year.",
//     constraints:{
//       nearSupermarkets:false,
//       municipalityRegistration:true,
//       typeOfAccomodation:"Private Room",
//       commuteTime:8,
//       duration:{
//         value:12,
//         unit:"mo"},
//       maxRent:400,
//       } ,
//     correctHouse:house._id// assign the _id from the our author Bob. This ID is created by default!
//   });
//
//   scene.save(function (err) {
//     if (err) return handleError(err);
//
//   });
// });


/**
 * Require all intent fulfillment modules
 */
const f_welcome = require('./fulfillments/default/welcome');
const f_fallback = require('./fulfillments/default/fallback');
const f_name = require('./fulfillments/default/nameIntent');
const f_houseType = require('./fulfillments/default/TypeOfHouse');
const f_houseTypeNo = require('./fulfillments/default/TypeOfHouseNo');
const f_houseTypeYes = require('./fulfillments/default/TypeOfHouseYes');
const f_Budget = require('./fulfillments/default/budgetIntent');
const f_duration = require('./fulfillments/default/durationIntent');
const f_travel = require('./fulfillments/default/travelIntent');
const f_superMarket = require('./fulfillments/default/supermarket');
const f_municipality = require('./fulfillments/default/municipalityIntent');
const f_final = require('./fulfillments/default/NoMoreConstraintsIntent');
const f_submit = require('./fulfillments/default/ConfirmSubmission');
const f_tryagain = require('./fulfillments/default/tryagain');
const f_allhouses = require('./fulfillments/default/showAllHousesIntent');
const f_listOption = require('./fulfillments/default/listOptionSelectIntent');



app.get('/error', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/pages/error.html'));
});

app.get('/ati', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/forms/ati-ci.html'));
    //__dirname : It will resolve to your project folder.
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/exit', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/forms/resque.html'));
});

app.post('/', express.json(), (req, res) => {

    const agent = new WebhookClient({ request: req, response: res });
    let intentMap = new Map();

    intentMap.set('Default Welcome Intent', f_welcome.fulfillment);
    intentMap.set('Default Fallback Intent', f_fallback.fulfillment);
    intentMap.set('NameIntent', f_name.fulfillment);
    intentMap.set('TypeOfHouse', f_houseType.fulfillment);
    intentMap.set('TypeOfHouse - no', f_houseTypeNo.fulfillment);
    intentMap.set('TypeOfHouse - yes', f_houseTypeYes.fulfillment);
    intentMap.set('budgetIntent', f_Budget.fulfillment);
    intentMap.set('DurationIntent', f_duration.fulfillment);
    intentMap.set('TravelTimeIntent', f_travel.fulfillment);
    intentMap.set('SupermarketIntent', f_superMarket.fulfillment);
    intentMap.set('municipalityIntent', f_municipality.fulfillment);
    intentMap.set('NoMoreConstraintsIntent', f_final.fulfillment);
    intentMap.set('ConfirmSubmission', f_submit.fulfillment);
    intentMap.set('tryagain', f_tryagain.fulfillment);
    intentMap.set('showAllHousesIntent', f_allhouses.fulfillment);
    intentMap.set('listOptionSelectIntent', f_listOption.fulfillment);



    // Todo: connect each custom intent with custom fulfillment modules
    // Hint: create a intent in Dialogflow first

    // Connect the agent to the intent map
    agent.handleRequest(intentMap);

});


// Startup server on port 8080
console.log(`app listening on port 8080)`);
app.listen(process.env.PORT || 8080);
// Navigate to localhost:8080 in the browser to use dialogflow locally

app.use('/', express.static(path.join(__dirname, 'public')));

console.log(`navigate to: http://localhost:8080/`);


app.route('/getScenario').get(async (req, res) => {
  let scenarioId = 1;
  if(req.query.sid!=="null")
    scenarioId = req.query.sid;
  const scenario = await Scenario.findOne( {id : scenarioId});
  res.send(scenario);
});

app.route('/Scenarios/count').get(async (req, res) => {
    const scenarios = await Scenario.estimatedDocumentCount();
    res.send({ "count": scenarios });
});

app.route('/getAllHouses').get(async (req, res) => {
  const houses = await House.find();
  res.send(houses);
});

app.route('/getIncorrectHouses').get(async (req, res) => {
  let correctHouseId = 1;
  if(req.query.hid!=="null")
    correctHouseId = req.query.hid;
  const houses = await House.find({ _id: {$ne: correctHouseId}});
  res.send(houses);
});

app.route('/getScenarioAndHouse').get(async (req, res) => {
  let scenarioId = 1;
  if(req.query.sid!=="null")
    scenarioId = req.query.sid;
  const scenario = await Scenario.findOne( {id : scenarioId}).populate('correctHouse');
  res.send(scenario);
});

app.route('/checkConstraints').post(async (req, res) => {
  let scenarioId = 1;
  if(req.body.sid!=="null")
    scenarioId = req.body.sid;
  const scenario = await Scenario.findOne( {id : scenarioId});
  let response=checkAllConstraints(scenario.constraints, req.body.inputConstraints);
  res.send(response);
});

app.route('/log-form-responses').post(async (req, res) => {

    let entryLog = {
        workerId: req.body.workerId,
        formType: req.body.formType,
        interface: req.body.interface,
        timestamp: req.body.timestamp,
        questionId: req.body.questionId,
        response: req.body.response,
        duration: req.body.duration
    };
    db.collection("formLogs").insertOne(entryLog, function (err, res) {
        if (err) throw err;
        console.log("1 record inserted");
    });
    res.send(true)
})

app.route('/log-ati').post(async (req, res) => {

    let response = {
        workerId: req.body.workerId,
        startTime: req.body.startTime,
        stopTime: req.body.stopTime,
        interface: "ci",
        condition: req.body.condition,
        stage: req.body.stage,
        accuracy: req.body.accuracy,
        q1: req.body.q1,
        q2: req.body.q2,
        q3: req.body.q3,
        q4: req.body.q4,
        q5: req.body.q5,
        q6: req.body.q6,
        q7: req.body.q7,
        q8: req.body.q8,
        q9: req.body.q9
    };

    db.collection("atiFormResponses").insertOne(response, function (err, res) {
        if (err) throw err;
        console.log("1 ati response inserted");
    });
    res.send(true)
})

app.route('/log-exit').post(async (req, res) => {

    let response = {
        workerId: req.body.workerId,
        startTime: req.body.startTime,
        stopTime: req.body.stopTime,
        interface: "ci",
        condition: req.body.condition,
        stage: req.body.stage,
        accuracy: req.body.accuracy,
        scenarioId: req.body.sid,
        quality_q1: req.body.quality_q1,
        quality_q2: req.body.quality_q2,
        quality_q3: req.body.quality_q3,
        interaction_q1: req.body.interaction_q1,
        interaction_q2: req.body.interaction_q2,
        interface_q1: req.body.interface_q1,
        interface_q2: req.body.interface_q2,
        interface_q3: req.body.interface_q3,
        easeOfUse_q1: req.body.easeOfUse_q1,
        easeOfUse_q2: req.body.easeOfUse_q2,
        easeOfUse_q3: req.body.easeOfUse_q3,
        usefulness_q1: req.body.usefulness_q1,
        usefulness_q2: req.body.usefulness_q2,
        control_q1: req.body.control_q1,
        control_q2: req.body.control_q2,
        attitudes_q1: req.body.attitudes_q1,
        attitudes_q2: req.body.attitudes_q2,
        attitudes_q3: req.body.attitudes_q3,
        attitudes_q4: req.body.attitudes_q4,
        attitudes_q5: req.body.attitudes_q5,
        intentions_q1: req.body.intentions_q1,
        intentions_q2: req.body.intentions_q2,
        intentions_q3: req.body.intentions_q3,
        intentions_q4: req.body.intentions_q4,
        intentions_q5: req.body.intentions_q5,
        intentions_q6: req.body.intentions_q6
    };

    db.collection("exitFormResponses").insertOne(response, function (err, res) {
        if (err) throw err;
        if (err) alert(err);
        console.log("1 exit form response inserted");
    });
    res.send(true)
})

app.route('/getWorkerScenario').get(async (req, res) => {
    let workerId = 1;
    if(req.query.wid!=="null")
        workerId = req.query.wid;

    const worker = await Worker.findOne( {id : workerId});
    if(worker==null) {
        let complexScenario = getRandomInt(3);
        let complexScenarioCompleted = [];
        for (let i = 0; i < 3; i++) {
            if (complexScenario-1 != i)
                complexScenarioCompleted[i] = false;
            else
                complexScenarioCompleted[i] = true;
        }

        let easyScenario = 3+getRandomInt(3);
        let easyScenarioCompleted = [];
        for (let i = 0; i < 3; i++) {
            if (easyScenario-4 != i)
                easyScenarioCompleted[i] = false;
            else
                easyScenarioCompleted[i] = true;
        }

        let _worker = new Worker({
            id: workerId,
            completedComplexScenario: complexScenarioCompleted,
            completedEasyScenario: easyScenarioCompleted

        });
        await _worker.save();
        let response={
            complexScenario:complexScenario,
            easyScenario:easyScenario

        };

        res.json(response);
    }
    else {
        let complexScenarioCompleted=worker.completedComplexScenario;
        let complexScenario = 1+complexScenarioCompleted.indexOf(false);
        for (let i = 0; i < 3; i++) {
            if (complexScenario-1 == i)
                complexScenarioCompleted[i] = true;
        }

        let easyScenarioCompleted=worker.completedEasyScenario;
        let easyScenario = 4+easyScenarioCompleted.indexOf(false);
        for (let i = 0; i < 3; i++) {
            if (easyScenario-4 == i)
                easyScenarioCompleted[i] = true;
        }


        await worker.update({completedComplexScenario:complexScenarioCompleted,completedEasyScenario: easyScenarioCompleted});
        if(complexScenario!=0) {
            let response = {
                complexScenario: complexScenario,
                easyScenario: easyScenario

            };
            res.json(response);
        }
        else{
            res.status(400);
            res.send("You have already completed 3 sessions")
        }
    }


});

function getRandomInt(max) {
    return 1+Math.floor(Math.random() * Math.floor(max));
}

function checkAllConstraints(scenarioConstraints, inputConstraints) {
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
  else
    return false;

}