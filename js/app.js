/*
 * Create a list that holds all of your cards
 */
let cards = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb",
            "diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"];

//Create variable for timer, preventing bugs and stoping timing events.
let openedCards = [];
let matchedCount = 0;
let moves = 0;
let stars = 3;
let setIntervalID = null;
let setTimeoutID = null;
let pro = 1;     //debug variable 
let con = 1;     //debug variable 
let totalSeconds = 0;
let shownCard = 0;

//Set up event listener when open the page, press reastart button and cards
document.addEventListener('DOMContentLoaded', function(){
    restart();
    setUps();
});
document.getElementById('again').addEventListener('click', function(){
    if (pro===con){
        restart();
        setTimeout(setUps, 350);
    }
    else{
        clearTimeout(setTimeoutID);
        restart();
        setTimeout(setUps, 350);
        con++;
    }
});
document.getElementById('table').addEventListener('click', function(e){
    if (shownCard===0){
        setIntervalID = setInterval(setTime, 1000);
        openCard(e);
    }
    else{
        openCard(e);
    }
});

//function to restar the game and reset all variables
function restart(){
    let pro = 1;
    let con = 1;
    openedCards = [];
    matchedCount = 0;
    moves = 0;
    stars = 3;
    shownCard = 0;
    setUp();
    document.querySelector('.moves').innerHTML = moves;
    document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
    document.getElementById("seconds").innerHTML = '00';
    document.getElementById("minutes").innerHTML = '00';
    totalSeconds = 0;
    clearInterval(setIntervalID);
}

// function that reset cards' class 
function setUp() {
    const deck = document.querySelectorAll('.deck');
    let counter = 0;
    for (let i = 1; i < 32; i+=2) {
        deck[0].childNodes[i].classList.remove('open','show','match');
        counter++;
    }
}

//function that reassgin cards' icon to each card
function setUps() {
    const deck = document.querySelectorAll('.deck');
    let counter = 0;
    shuffle(cards);
    for (let i = 1; i < 32; i+=2) {
        deck[0].childNodes[i].childNodes[1].className = 'fa '+'fa-'+cards[counter];
        counter++;
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

//function to setup timer 
function setTime() {
  ++totalSeconds;
  document.getElementById("seconds").innerHTML = pad(totalSeconds % 60);
  document.getElementById("minutes").innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}


//function to open a card
function openCard(e){
    if((e.target.classList.contains('card'))&&(pro===con)&&(e.target.classList.contains('match')===false)){
        e.target.classList.add('open','show');
        shownCard++;
        if (e.target!==openedCards[0]){
            openedCards.push(e.target);
            if (openedCards.length === 2){
                pro++
                checkMatch();
            }
        }
    }
}

//function to check if two cards were matched 
function checkMatch(){
    if (openedCards[0].childNodes[1].className===openedCards[1].childNodes[1].className){
        matched();
    }
    else {
        setTimeoutID = setTimeout(notMached, 350);
    }
}

//function to add match condition
function matched(){
    openedCards[0].classList.remove('open','show');
    openedCards[1].classList.remove('open','show');
    openedCards[0].classList.add('match');
    openedCards[1].classList.add('match');
    openedCards = [];
    matchedCount++;
    movesCount();
    setTimeout(win, 200);
    con++;
}

//function to flip the card back when not match
function notMached(){
    openedCards[0].classList.remove('open','show');
    openedCards[1].classList.remove('open','show');
    openedCards = [];
    con++;
    movesCount();
}

//function to determine game score base on moves
function movesCount(){
    moves++;
    document.querySelector('.moves').innerHTML = moves;
    if (moves > 25){
        document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li>';
        stars=1;
    } else if (moves > 18) {
        document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
        stars=2;
    }
}

//function to determine if the player won the game
function win(){
    if (matchedCount===8){
        clearInterval(setIntervalID);
        swal({
            title: "Congrat!",
            text: " You won the game in " + totalSeconds.toFixed(0) + " seconds with " + stars + " star(s)!",
            icon: "success",
            buttons: {
                cancel: true,
                again: {
                    text: 'Play Again',
                    value: 'again',
                },
            }
        }).then((value)=> {
//asking player if they want to play again
            if(value==='again'){
                restart();
                setTimeout(setUps, 350);
            }
        })
    }
}