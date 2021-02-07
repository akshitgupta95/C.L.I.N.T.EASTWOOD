let continueButton = document.getElementById('continue');
continueButton.disabled = true;


window.addEventListener('df-response-received', function (event) {
    // Handle event
    try{
    if( event.detail.response.queryResult.intent.displayName.toUpperCase()==="ConfirmSubmission".toUpperCase())
        continueButton.disabled=false;
    else
        continueButton.disabled=true;
    }
    catch (e) {
        console.log(e)
    }

});