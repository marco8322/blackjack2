
/* This is the main entry for the function */


function createBlackjackGame(
    cardsCreater, 
    buttons, 
    playerBoard,
    messageBoard
    ) 
{
    
    /* Cards */
    var shuffledCards;
    
    /* Dealer cards */
    var dealerCards;
    
    /* Player cards */
    var playerCards;
    
    /* Initial bet */
    var initialBet = 0;

    var blackjackObj = {
        
        newHand : function() {
            initialBet = 0;
            messageBoard.setMessage("");
            
            // Enable bet button
            //
            buttons.enableBet();
            
            // Create new hand
            //
            this.initializeHands();
        },
        
        initializeHands : function () {
            playerBoard.clearTable();    
            console.log("Create player and dealer");
            var handBoard = playerBoard.addHand();
            console.log("Merde");

            playerCards = createPlayerHand(
                handBoard,
                playerInfo
            );

            dealerCards = createDealerHand(
                createBoard(
                    document.getElementById("dealer_cards"),
                    document.getElementById("dealer_total")
                )
            );
        },
        
        addBet : function(amount) {
            initialBet += amount;
            playerCards.increaseBet(amount);
            
            buttons.enableDeal();
        },
        
        deal : function () {
            // Shuffle the cards
            //
            console.log("Shuffling cards");
            shuffledCards = cardsCreater(1);
            document.getElementById("message").innerHTML = "";
    
            console.log("Add cards");
            shuffledCards.addCard(playerCards); 
            shuffledCards.addCard(dealerCards); 
            shuffledCards.addCard(playerCards); 
            shuffledCards.addCard(dealerCards);
            
            console.log("Go to play");
            this.play();
        },
        
        play : function () {
            console.log("In play");
            playerCards.showCards();
            dealerCards.showCards();
    
            // Ask player what to do
            //
            this.initialMove();
        },
        
        /* initial move... ask for insurance if required */
        initialMove : function () {
            console.log("initialMove");
 
            // Mark if players have blackjack
            //
            if( playerCards.total == 21 )
            {
                playerCards.setHasBlackjack();    
            }
            
            // Mark if dealer has blackjack
            //
            if( dealerCards.total == 21 )
            {
                dealerCards.setHasBlackjack();
            }
            
            // Play for insurance...
            //
            if( dealerCards.cards[0] == 'A' )
            {
                buttons.enableInsurance();
                return;
            }
    
    
            // If dealer has blackjack, game is over
            //
            if( dealerCards.hasBlackjack() ) {
                this.showHiddenCard();
                this.gameOver();
                return;
            }
            
            this.askNextMove();
        },
        
        /* This will enable the hit/stay buttons and disable the let's play button */
        askNextMove : function () {

            if( playerCards.total == 21 ) 
            {
                this.gotoNextPlayer();
                return;
            }
    
            buttons.enableHitStay();
    
            // Enable double
            //
            if(playerCards.cards.length == 2) {
                buttons.enableDouble();
            }
        },
        
        gotoNextPlayer : function() {
            this.dealerPlay();    
        },
        
        /* If insurance is taken */
        insuranceTaken : function () {
            buttons.disableAll();
            
            if(dealerCards.hasBlackjack()) {
                this.showHiddenCard();
                playerCards.payInsurance();
                
                messageBoard.setMessage("Insurance won");
                buttons.enableDeal();
                return;
            }
    
            //document.getElementById("message").innerHTML = "Insurance lost";
            messageBoard.setMessage("Insurance lost");
            playerCards.loseInsurnce();
            this.askNextMove();
        },
        
        insuranceNotTaken : function () {
            buttons.disableAll();
            this.askNextMove();
        },
        
        /* show the hidden card */
        showHiddenCard : function () {
            dealerCards.showHiddenCard = true;
            dealerCards.showCards();
        },
        
        /* What happen when hit */
        playerHit : function () {
            shuffledCards.addCard(playerCards);
            playerCards.showCards();
    
            if( playerCards.total > 21 ) {
                this.gameOver();
                return;
            }
    
            if( playerCards.total == 21 ) {
                this.dealerPlay();
            }
            
            this.askNextMove();
        },
        
        
        /* What happen when player double */
        playerDouble : function () {
            console.log("playerDouble");
            shuffledCards.addCard(playerCards);
            playerCards.showCards();
            playerCards.increaseBet(playerCards.bet);
    
            if( playerCards.total > 21) {
                console.log("Over 21");
                this.gameOver();
                return;
            }
    
            console.log("Go to dealer");
            this.dealerPlay();
        },
      
        /* What happen when stay */
        dealerPlay : function () {
            buttons.disableAll();
    
            this.showHiddenCard();
    
            while(dealerCards.total < 17) {
                shuffledCards.addCard(dealerCards);
                dealerCards.showCards();
            }
    
            this.gameOver();
        },
        
        
        /* End of game */
        gameOver : function () {
            var msg = "";
            var playerWins = false;
            var isPush = false;
            var playerHasBlackjack = false;
    
            this.showHiddenCard();
    
            if( dealerCards.hasBlackjack() ) {
                msg += "Dealer has blackjack, ";
            }
    
            if( playerCards.hasBlackjack() ) {
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
    
            messageBoard.setMessage(msg);
            //document.getElementById("message").innerHTML = msg;       
    
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
    
            buttons.enableNewHand();
        },
    };
    
    /* Set up the callbacks for the buttons */
    buttons.setCallbackNewHand(function () { blackjackObj.newHand(); });
    buttons.setCallbackBet(function () { blackjackObj.addBet(10); });
    buttons.setCallbackDeal(function () { blackjackObj.deal(); });
    buttons.setCallbackHit(function () { blackjackObj.playerHit(); });
    buttons.setCallbackStay(function() { blackjackObj.dealerPlay(); });
    buttons.setCallbackDouble(function () { blackjackObj.playerDouble(); });
    buttons.setCallbackInsuranceYes(function () { blackjackObj.insuranceTaken(); });
    buttons.setCallbackInsuranceNo(function () { blackjackObj.insuranceNotTaken(); });
    
    buttons.enableNewHand();
    
    return blackjackObj;
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
    var isBlackjack = false;
    
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
        },
        
        setHasBlackjack : function () { isBlackjack = true; },
        hasBlackjack : function () { return isBlackjack; }
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


var playerInfo = createAPlayer(
    100, 
    createMoneyBoard(
        document.getElementById("money")
        )
    );


