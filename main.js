
// main code
//

var theGame = createBlackjackGame(
    createShuffleCards, 
    createButtons(), 
    makePlayerBoard("playerBoard"),
    {
        setMessage: function(msg) {
            document.getElementById("message").innerHTML = msg;
        }
    }
    );