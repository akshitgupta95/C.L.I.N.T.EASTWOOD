
let workerID = params.get("wid");
let accuracy= params.get("acc");
const dfMessenger = document.querySelector('df-messenger');

//trying to change df-messenger height
// $r1=document.querySelector('df-messenger');
// $r2 = $r1.shadowRoot.querySelector("df-messenger-chat");
// var sheet = new CSSStyleSheet;
// sheet.replaceSync( `div.chat-wrapper[opened="true"] { height: 100px }`);
// $r2.shadowRoot.adoptedStyleSheets = [ sheet ];

if(workerID!=null && scenario!=null && accuracy!=null) {
    let serialised={"workerId":workerID.toString(),"scenarioId":scenario.toString(),"accuracy":accuracy.toString()};
    dfMessenger.setAttribute("user-id", JSON.stringify(serialised));
}

