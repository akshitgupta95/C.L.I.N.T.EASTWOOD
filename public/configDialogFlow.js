
let workerID = params.get("wid");
let accuracy= params.get("acc");
const dfMessenger = document.querySelector('df-messenger');
if(workerID!=null && scenario!=null && accuracy!=null) {
    let serialised={"workerId":workerID.toString(),"scenarioId":scenario.toString(),"accuracy":accuracy.toString()};
    dfMessenger.setAttribute("user-id", JSON.stringify(serialised));
}

