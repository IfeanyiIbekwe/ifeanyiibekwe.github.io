
/*
 * Create a list that holds all of your cards
 */


 const cardModel = {
//-- Array holding all cards--//
    cards : [
        {
            name: 'diamond',
            icon: 'fa fa-diamond',
            class: 'card'
        },
        {
            name: 'diamond',
            icon: 'fa fa-diamond',
            class: 'card'
        },
        {
            name: 'plane',
            icon: 'fa fa-paper-plane-o',
            class: 'card'
        },
        {
            name: 'plane',
            icon: 'fa fa-paper-plane-o',
            class: 'card'
        },
        {
            name: 'anchor',
            icon: 'fa fa-anchor',
            class: 'card'
        },
        {
            name: 'anchor',
            icon: 'fa fa-anchor',
            class: 'card'
        },
        {
            name: 'bolt',
            icon: 'fa fa-bolt',
            class: 'card'
        },
        {
            name: 'bolt',
            icon: 'fa fa-bolt',
            class: 'card'
        },
        {
            name: 'cube',
            class: 'card',
            icon: 'fa fa-cube'
        },
        {
            name: 'cube',
            class: 'card',
            icon: 'fa fa-cube'
        },
        {
            name: 'leaf',
            class: 'card',
            icon: 'fa fa-leaf'
        },
        {
            name: 'leaf',
            class: 'card',
            icon: 'fa fa-leaf'
        },
        {
            name: 'bicycle',
            class: 'card',
            icon: 'fa fa-bicycle'
        },
        {
            name: 'bicycle',
            class: 'card',
            icon: 'fa fa-bicycle'
        },
        {
            name: 'bomb',
            class: 'card',
            icon: 'fa fa-bomb'
        },
        {
            name: 'bomb',
            class: 'card',
            icon: 'fa fa-bomb'
        }
        
    ],
    //--Array to hold open cards--//
    openCards: [],
    //--Array to hold card states--//
    cardState: ['open' ,'match' ,'mismatch'],
    moves: 0,
    Stars: 3,
    clicks: 0,
    counter: 0

 }

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const initializeCards = {

    init(){
        cardView.init();

    },

//--gets all the cards in the card list--//
    getAllCards(){
return cardModel.cards;

    },

//--gets all open cards in the card list--//
    getOpenCards(){
return cardModel.openCards;

    },
//--Updates card state to open--//
    openCard(){
return cardModel.cardState[0];

    },
 //--Updates card state to matched--//
    matchedCard(){
return cardModel.cardState[1];

    },
//--Updates card state to mismatched--//
    mismatchedCard(){
        return cardModel.cardState[2];
        
    },

 //-- Shuffle function from http://stackoverflow.com/a/2450976--//
shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
},
showNumOfMoves(){

    let moves = cardModel.moves;
        moves % 2 === 0 ? moves /= 2 : null; // is moves/2 = 0? , if yes then (moves = moves/2) if no, set moves to null
        return moves;
},
incrementCount() {
    return cardModel.counter += 2;
},

clearList(arr) {
    arr.length = 0;
    return arr;
},

getStars() {
    return cardModel.stars;
},
incrementCount() {
    return cardModel.counter += 2;
},

incrementMoves() {
    return cardModel.moves += 1;
},

incrementClicks() {
    return cardModel.clicks += 1;
},
reloadGame() {
    location.reload();
}

}

 const cardView = {

    init(){
        //DOM Pointers
        this.deck = document.getElementsByClassName('deck')[0];
        this.overlay = document.getElementById('bodyOverlay');
        this.movesCounter = document.getElementsByClassName('moves')[0];
        const restartButton = document.getElementsByClassName('restart')[0];
        

        //stars
        this.star1 = document.getElementById('star1');
        this.star2 = document.getElementById('star2');
        this.star3 = document.getElementById('star3');

//Event listener on the restart button
        restartButton.addEventListener('click', () => initializeCards.reloadGame());

        this.render();
    },
    

    render(){
        
   // match playing cards

        this.matchPlayingCards();
    },
    matchPlayingCards(){
        const cards = initializeCards.getAllCards();
   const openCards = initializeCards.getOpenCards();

   initializeCards.shuffle(cards);
   //-- Card States -- //
   const open = initializeCards.openCard();
   const match = initializeCards.matchedCard();
   const mismatch = initializeCards.mismatchedCard();

   //--loop through the shuffled cards within the render scope --//


        for (let card of cards) {
            // Dynamically create li and i elements
                     let liElem = document.createElement('li');
                     let iElem = document.createElement('i');
         // Assigns different values (classes, names...)
                     liElem.classList.add(card.class, card.name);
                     iElem.className = card.icon;
         
                     // Append elements
                     liElem.appendChild(iElem);
                     this.deck.appendChild(liElem);
         
                     // Sets up the event listener for a card
                     liElem.addEventListener('click', function() {

                          // Get a number of stars
                
                          let stars = initializeCards.getStars();

                
                          // Get a number of moves
       
                          let numOfMoves = initializeCards.showNumOfMoves();

         
                          // Increment clicks
        
                          let numOfClicks = initializeCards.incrementClicks();

                       
         
                         // Prevents multiple pushes of the same card
                         if (liElem.classList.contains(open)) {
                             return false;
         
                         } else {

                            initializeCards.incrementMoves(); //increase moves
                            if (numOfClicks === 1) {
                                // Start timer
                                Timer.starttimeFunction();
                            }


                            // Removes stars depending on the number of moves
                    if (numOfMoves > 12 && numOfMoves < 24) {
                        cardView.star3.style.color = 'rgba(255, 255, 255, 0.24)';
                        stars = 2;
                        cardModel.Stars = 2;
                        

                    } else if (numOfMoves > 24) {
                        cardView.star2.style.color = 'rgba(255, 255, 255, 0.24)';
                        stars = 1;
                        cardModel.Stars = 1;

                    }

                             liElem.classList.add(open);
         
                             // Adds the card to a *list* of "open" cards
                             openCards.push(liElem);
         
                             // If the list already has another card, check to see if the two cards match
                             if (openCards.length === 2) {
         
                                 let card1 = openCards[0];
                                 let card2 = openCards[1];
                               
                                 
         
                                 if (card1.classList.contains(card.name) && card2.classList.contains(card.name)) {
                                     
                                    initializeCards.incrementCount();
                                     card1.classList.add(match);
                                     card2.classList.add(match);
                                    initializeCards.clearList(openCards);
                                    cardView.movesCounter.textContent = initializeCards.showNumOfMoves(); //pass the context of shownumofmoves into cardview.movesCounter

         
                                 
         
                                 } else {
                                    cardView.overlay.classList.add('overlay');
                                     card1.classList.add(mismatch);
                                     card2.classList.add(mismatch);
                                     cardView.movesCounter.textContent = initializeCards.showNumOfMoves(); //pass the context of shownumofmoves into cardview.movesCounter

         
                                     // setTimeout allows the user to see the 2nd card before flipping
                                     setTimeout(function() {
                                         card1.classList.remove(open, mismatch);
                                         card2.classList.remove(open, mismatch);
                                         initializeCards.clearList(openCards);
                                         cardView.overlay.classList.remove('overlay');
                                     }, 900);

                                         
                                 };
                                     // Game ends
                    if (cardModel.counter === 16) {
                        // End timer
                       Timer.stoptimeFunction();

                        
                        setTimeout(function() {
                            
                           EndGame.displayModal();
                            
                        }, 600);
                    }
                                   
         
         
             }
         }
         });
         }
         
    },
};
 const Timer={

    seconds : 0,
    minutes :0, 
    hours : 0,
    t:0,
    

    timeFunction() {
        Timer.seconds++;
        if (Timer.seconds >= 60) {
            Timer.seconds = 0;
            Timer.minutes++;
            if (Timer.minutes >= 60) {
                Timer.minutes = 0;
                Timer.hours++;
            }
        }
        
        document.getElementById("timerClass").innerHTML= (Timer.hours ? (Timer.hours > 9 ? Timer.hours : "0" + Timer.hours) : "00") + ":" + (Timer.minutes ? (Timer.minutes > 9 ? Timer.minutes : "0" + Timer.minutes) : "00") + ":" + (Timer.seconds > 9 ? Timer.seconds : "0" + Timer.seconds);

    
        Timer.starttimeFunction();
    },
    starttimeFunction() {
        Timer.t = setTimeout(Timer.timeFunction, 1000);
    },
    stoptimeFunction(){

        clearTimeout(Timer.t);
        document.getElementById("timerClass").innerHTML= "00:00:00";
      Timer.seconds = 0; Timer.minutes = 0; Timer.hours = 0;
    }

    };
    const EndGame ={

        displayModal(){
            this.congratulationsPopup = document.getElementById('congratulationsPopupModal');
            EndGame.congratulationsPopup.style.display = 'block';
            this.restartButton2 = document.getElementById('restart');
            document.getElementById("movesModal").innerHTML= "Moves: " + " "+ initializeCards.showNumOfMoves()+ "";
            document.getElementById("starsModal").innerHTML= "Stars: " + " "+  cardModel.Stars;

            //Event listener on the restart button
           
            EndGame.restartButton2.onclick = function() {

                initializeCards.reloadGame();
            }

        }
    };


//---------- INVOKATIONS ----------//
initializeCards.init();

