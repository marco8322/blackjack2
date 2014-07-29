
/* This is the main entry for the function */

var nonShuffledCards = [ 
    'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
    'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
    'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
    'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'
];

var shuffledCards;
var indexShuffledCards = 0;

var dealerCards;
var playerCards;

function play() {
    
    // Shuffle the cards
    //
    console.log("Shuffling cards");
    shuffleCards();
    document.getElementById("message").innerHTML = "";
    
    // Get the cards for the dealer and player
    //
    console.log("Create player and dealer");
    playerCards = createPlayerHand(
        createBoard(
            document.getElementById("cards_1"),
            document.getElementById("total_1"),
            document.getElementById("bet_1")
            ),
        playerInfo
        );
        
    dealerCards = createDealerHand(
        createBoard(
            document.getElementById("dealer_cards"),
            document.getElementById("dealer_total")
            )
        );
    
    playerCards.initialBet(10);
    
    console.log("Add cards");
    addCard(playerCards); 
    addCard(dealerCards); 
    addCard(playerCards); 
    addCard(dealerCards);
    
    playerCards.showCards();
    dealerCards.showCards();
    
    // Ask player what to do
    //
    initialMove();
}

function resetButtons() {
    document.getElementById("play").hidden = "";
    document.getElementById("hit").hidden = "hidden";
    document.getElementById("stay").hidden = "hidden";
    document.getElementById("double").hidden = "hidden";
}

function disableAllButtons() {
    document.getElementById("play").hidden = "hidden";
    document.getElementById("hit").hidden = "hidden";
    document.getElementById("stay").hidden = "hidden";
    document.getElementById("double").hidden = "hidden";
    document.getElementById("insurance_yes").hidden = "hidden";   
    document.getElementById("insurance_no").hidden = "hidden";
}

function enableInsuranceButtons() {
    document.getElementById("play").hidden = "hidden";
    document.getElementById("insurance_yes").hidden = "";   
    document.getElementById("insurance_no").hidden = "";
}

function disableInsuranceButtons() {
    document.getElementById("insurance_yes").hidden = "hidden";   
    document.getElementById("insurance_no").hidden = "hidden";
}


/* initial move... ask for insurance if required */
function initialMove() {
    if( dealerCards.cards[0] == 'A' )
    {
        enableInsuranceButtons();
        return;
    }
    
    askNextMove();
}

/* This will enable the hit/stay buttons and disable the let's play button */
function askNextMove() {
    // If 21, game over...
    //
    if( dealerCards.total == 21 || playerCards.total == 21) {
        showHiddenCard();
        gameOver();
        return;
    }
    
    document.getElementById("play").hidden = "hidden";
    document.getElementById("hit").hidden = "";
    document.getElementById("stay").hidden = "";
    
    // Enable double
    //
    if(playerCards.cards.length == 2) {
        document.getElementById("double").hidden = "";
    }
}

function insuranceTaken() {
    disableInsuranceButtons();
    if(dealerCards.total == 21) {
        showHiddenCard();
        playerCards.payInsurance();
        document.getElementById("message").innerHTML = "Insurance won";
        resetButtons();
        return;
    }
    
    document.getElementById("message").innerHTML = "Insurance lost";
    playerCards.loseInsurnce();
    askNextMove();
}

function insuranceNotTaken() {
    disableInsuranceButtons();
    askNextMove();
}

/* show the hidden card */
function showHiddenCard() {
    dealerCards.showHiddenCard = true;
    dealerCards.showCards();
}

/* What happen when hit */
function playerHit() {
    addCard(playerCards);
    playerCards.showCards();
    
    if( playerCards.total > 21 ) {
        gameOver();
        return;
    }
    
    if( playerCards.total == 21 ) {
        dealerPlay();
    }
}

/* What happen when player double */
function playerDouble() {
    console.log("playerDouble");
    addCard(playerCards);
    playerCards.showCards();
    playerCards.increaseBet(playerCards.bet);
    
    if( playerCards.total > 21) {
        console.log("Over 21");
        gameOver();
        return;
    }
    
    console.log("Go to dealer");
    dealerPlay();
}

/* What happen when stay */
function dealerPlay() {
    document.getElementById("hit").hidden = "hidden";
    document.getElementById("stay").hidden = "hidden";
    document.getElementById("double").hidden = "hidden";
    
    showHiddenCard();
    
    while(dealerCards.total < 17) {
        addCard(dealerCards);
        dealerCards.showCards();
    }
    
    gameOver();
}

/* End of game */
function gameOver() {
    var msg = "";
    var playerWins = false;
    var isPush = false;
    var playerHasBlackjack = false;
    
    showHiddenCard();
    
    if( dealerCards.total == 21 && dealerCards.cards.length == 2 ) {
        msg += "Dealer has blackjack, ";
    }
    
    if( playerCards.total == 21 && playerCards.cards.length == 2) {
        msg += "Player has blackjack, ";
        playerHasBlackjack = true;
    }
    
    if( dealerCards.total > 21 ) {
        msg += "Dealer has busted, player wins";
        playerWins = true;
    }
    else if (playerCards.total > 21 ) {
        msg += "Player has busted, player lose";
    }
    else if(playerCards.total > dealerCards.total) {
        msg += "Player wins";
        playerWins = true;
    }
    else if(playerCards.total < dealerCards.total) {
        msg += "Players lose";
    }
    else {
        msg += "Push";
        isPush = true;
    }
    
    document.getElementById("message").innerHTML = msg;
    
    if( playerWins ) {
        if( playerHasBlackjack ) {
            playerCards.winBet(2.5);
        }
        else {
            playerCards.winBet(2);
        }
    }
    else if( isPush )
    {
        playerCards.winBet(1);
    }
    
    resetButtons();
}

/* This shuffle the cards */
function shuffleCards() {
    shuffledCards = nonShuffledCards;
    indexShuffledCards = 0;
    
    for( var i = 0; i < 52; ++i) {
        var newIdx = Math.floor(Math.random() * 52);
        var tmp = shuffledCards[i];
        shuffledCards[i] = shuffledCards[newIdx];
        shuffledCards[newIdx] = tmp;
    }
}

/* Get the value of a card */
function getCardValue(c) {
    switch(c) {
        case 'A': return 11;
        case '10': case 'J': case 'Q': case 'K': return 10;
        case '9': return 9;
        case '8': return 8;
        case '7': return 7;
        case '6': return 6;
        case '5': return 5;
        case '4': return 4;
        case '3': return 3;
        case '2': return 2;
    }
    
    return 0;
}


/* Create the board for the dealer */
function createBoard(cardsBoard, totalBoard, betBoard) {
    return {
        printCards : function(cards) {
            var str = "";
            for( var i = 0; i < cards.length; ++i )
            {
                str += cards[i] + " ";
            }
            cardsBoard.innerHTML = str; 
        },
        
        printTotal : function(total, soft) {
            var str = "Total: ";
            if( soft ) 
            {
                str += "Soft ";
            }
            
            str += total;
            totalBoard.innerHTML = str;
        },
        
        printBet : function(bet) {
            var str = "Bet: ";
            str += bet;
            betBoard.innerHTML = str;
        }
    };
}

function createAHand() {
    return {
        total : 0,
        cards : [],
        soft : false,
        addCard : function(c) {
            this.cards.push(c);
            var v = getCardValue(c);
            
            if( v == 11 ) {
                if( this.total >= 11 ) {
                    v = 1;
                }
                else {
                    this.soft = true;
                }
            }
            
            this.total += v;
            
            if( this.total > 21 && this.soft ) {
                this.soft = false;
                this.total -= 10;
            }
        }
    };
}

/* Create a hand */
function createPlayerHand(handBoard, player) {
    var obj = createAHand(handBoard);
    obj.bet = 0;
    obj.initialBet = function(b) {
        this.bet = b;
        player.removeBet(b);
        handBoard.printBet(this.bet);
    };
    obj.increaseBet = function(b) {
        this.bet += b;
        player.removeBet(b);
        handBoard.printBet(this.bet);
    };
    obj.winBet = function(factor) {
        player.addMoney(factor * this.bet);
    };
    obj.payInsurance = function() {
        player.addMoney(2 * this.bet);
    };
    obj.loseInsurnce = function() {
        player.removeBet(this.bet / 2);
    };
    obj.showCards = function() {
        // Show the cards
        //
        var cardsToShow = [];
        for( var i = 0; i < this.cards.length; ++i) {
            cardsToShow.push(this.cards[i]);        
        }
    
        handBoard.printCards(cardsToShow);
        handBoard.printTotal(this.total, this.soft && this.total < 21);
    };
    
    return obj;
}


/* create a dealer hand */
function createDealerHand(handBoard) {
    var obj = createAHand();
    obj.showHiddenCard = false;
    
    obj.showCards = function() {
        // Show the cards
        //
        var cardsToShow = [];
        for( var i = 0; i < this.cards.length; ++i) {
            if(!this.showHiddenCard && i === 1)
            {
                cardsToShow.push('X');
            }
            else
            {
                cardsToShow.push(this.cards[i]);        
            }
        }
    
        handBoard.printCards(cardsToShow);
        
        // Show the total
        //
        if(!this.showHiddenCard && this.cards.length == 2)
        {
            handBoard.printTotal(getCardValue(this.cards[0]), false /* soft */);
        }
        else
        {
            handBoard.printTotal(this.total, false);
        }
    };
   
   return obj;
}

/* Create a money board */
function createMoneyBoard(moneyBoard) {
    return {
        showMoney : function(money) {
            var str = "Pot: " + money;
            moneyBoard.innerHTML = str;
        }
    };
}

/* Create a player */
function createAPlayer(initialAmount, moneyBoard) {
    var obj = {
        money : initialAmount,
        addMoney : function(wins) {
            this.money += wins;
            moneyBoard.showMoney(this.money);
        },
        removeBet : function(bet) {
            this.money -= bet;
            moneyBoard.showMoney(this.money);
        }
    };
    
    moneyBoard.showMoney(initialAmount);
    return obj;
}

/* Add a card to a player */
function addCard(p) {
    p.addCard(shuffledCards[indexShuffledCards]);
    ++indexShuffledCards;
}

var playerInfo = createAPlayer(
    100, 
    createMoneyBoard(
        document.getElementById("money")
        )
    );
