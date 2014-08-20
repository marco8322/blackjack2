
/* File for handling of buttons */

function createButtons() {
    var newHandButton = document.getElementById("newHand");
    var betButton = document.getElementById("bet");
    var dealButton = document.getElementById("deal");
    var hitButton = document.getElementById("hit");
    var stayButton = document.getElementById("stay");
    var doubleButton = document.getElementById("double");
    var insuranceYesButton = document.getElementById("insurance_yes");   
    var insuranceNoButton = document.getElementById("insurance_no");
    
    var enableButton = function(b) { b.hidden = ""; };
    var disableButton = function(b) { b.hidden = "hidden"; };
    
    return {
        disableAll : function() {
            disableButton(newHandButton);
            disableButton(betButton);
            disableButton(dealButton);
            disableButton(hitButton);
            disableButton(stayButton);
            disableButton(doubleButton);
            disableButton(insuranceYesButton);
            disableButton(insuranceNoButton);
        },
        
        enableNewHand : function() {
            this.disableAll();
            enableButton(newHandButton);
        },
        
        enableBet : function () {
            this.disableAll();
            enableButton(betButton);
        },
        
        enableDeal : function() {
            //this.disableAll();
            enableButton(dealButton);
        },
        
        enableHitStay : function() {
            this.disableAll();
            enableButton(hitButton);
            enableButton(stayButton);
        },
        
        enableDouble : function() {
            enableButton(doubleButton);
        },
        
        enableInsurance : function() {
            this.disableAll();
            enableButton(insuranceYesButton);
            enableButton(insuranceNoButton);
        },
        
        setCallbackNewHand : function(cb) { newHandButton.onclick = cb; },
        setCallbackBet : function(cb) { betButton.onclick = cb; },
        setCallbackDeal : function(cb) { dealButton.onclick = cb; },
        setCallbackHit : function(cb) { hitButton .onclick= cb; },
        setCallbackStay : function(cb) { stayButton.onclick = cb; },
        setCallbackDouble : function(cb) { doubleButton.onclick = cb; },
        setCallbackInsuranceYes : function(cb) { insuranceYesButton.onclick = cb; },
        setCallbackInsuranceNo : function(cb) { insuranceNoButton.onclick = cb; }
    };
}