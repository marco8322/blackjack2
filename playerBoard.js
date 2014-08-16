
/* Player board */

var makePlayerBoard = function (whichTable) {
    var playerBoardTable = document.getElementById(whichTable);
    var nbHands = 0;
    
    var createRowTable = function(i, table) {
        var row = document.createElement("tr");
            
        var handTD = document.createElement("td");
        handTD.appendChild(document.createTextNode("Hand " + i + "- "));
        
        var cardsTD = document.createElement("td");
        var cardsInfo = document.createTextNode("Cards: ");
        cardsTD.appendChild(cardsInfo);
        
        var totalTD = document.createElement("td");
        var totalInfo = document.createTextNode("Total: ");
        totalTD.appendChild(totalInfo);
        
        var betTD = document.createElement("td");
        var betInfo = document.createTextNode("Bet: ");
        betTD.appendChild(betInfo);
        
        row.appendChild(handTD);
        row.appendChild(cardsTD);
        row.appendChild(totalTD);
        row.appendChild(betTD);
        
        // NOTE: need to do insert!
        //
        table.appendChild(row);
        
        var rowObj = {
            printCards : function(cards) {
                var str = "";
                var i;
                
                for( i = 0; i < cards.length; ++i ) {
                    str += cards[i] + " ";
                }
                
                cardsInfo.nodeValue = "Cards: " + str;
            },
            
            printTotal : function(total) {
                totalInfo.nodeValue = "Total: " + total;
            },
            
            printBet : function(bet) {
                betInfo.nodeValue = "Bet: " + bet;
            }
        };
        
        return rowObj;
    };
    
    var playerBoard2 = {
        addHand : function () {
            nbHands = nbHands + 1;
            return createRowTable(nbHands, playerBoardTable);
        },
        
        clearTable : function() {
            var nbRows = playerBoardTable.rows.length - 1;
            while(nbRows >= 0) {
                playerBoardTable.deleteRow(0);
                nbRows = nbRows - 1;
            }
            
            nbHands = 0;
        }
    };
    
    return playerBoard2;
};


