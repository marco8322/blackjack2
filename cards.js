
/* Functions and object for cards */

// note 'numberOfDecks' is currently not used
//
function createShuffleCards(numberOfDecks) {
    var nonShuffledCards = [ 
        'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
        'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
        'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
        'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'
    ];

    var shuffledCards = nonShuffledCards;
    var indexShuffledCards =  0;
    
    var cardsObj = {
        getNextCard : function() {
            var nextCard = shuffledCards[indexShuffledCards];
            ++indexShuffledCards;
            return nextCard;
        },
        
        addCard : function(p) {
            p.addCard(this.getNextCard())
        }
    };
    
    /* This shuffle the cards */
    for( var i = 0; i < 52; ++i) {
        var newIdx = Math.floor(Math.random() * 52);
        var tmp = shuffledCards[i];
        shuffledCards[i] = shuffledCards[newIdx];
        shuffledCards[newIdx] = tmp;
    }

    return cardsObj;
}
