// Let's start by grabbing a reference to the <span> below.
var userStats = {
  numWins: 0,
  totalPlays: 0,
  incrementNumWins: function(){
    this.numWins++;
  },
  incrementTotalPlays: function(){
    this.totalPlays++;
  }        
};

var guessObj = {
  guessesRemain: 9,
  randomWord: "",
  wordUnderline: "",
  arWords: [],
  arCorrectGuess: [],
  arWrongGuess: [],
  historicalSelections: {
    //difficult could be selected from a drop down... 3,2,1 is easy 2,2,2 is med, 1,2,3 hard and could be number of lives
    difficulty: {easy: [3, 2, 1], medium: [2, 2, 2], hard: [1, 2, 3]}, 
    battles: {
      0: ["SARATOGA", "FORT SUMPTER", "BUNKER HILL", "GETTYSBURG", "YORKTOWN", "BULL RUN", "LEXINGTON AND CONCORD", "ANTIETAM", "TRENTON"],
      1: ["HASTINGS", "STALINGRAD", "VIENNA", "WATERLOO", "STALINGRAD", "TRAFALGAR", "AGINCOURT", "VERDUN", "MARNE"],
      2: ["TEUTOBURG FOREST", "MANZIKERT", "SALAMIS", "MARATHON", "THERMOPYLAE", "CANNAE", "ADRIANOPLE", "HERACLEA", "MEGIDDO"]
    },
    leaders: {
      0: ["GEORGE WASHINGTON", "GEORGE W BUSH", "BARAK OBAMA"],
      1: ["CHARLEMAGNE", "NAPOLEON BONAPARTE", "MAO ZEDONG"],
      2: ["CONSTANTINE THE GREAT", "CONSTANTINE X PALAIOLOGOS", "SALADIN IBN AYYUB"]
    }
  },
  removeStrFromArWords: function(str){
    var idx = this.arWords.indexOf(str);
    this.arWords.splice(idx, 1)
  },
  randomizeArWords: function(){
    var selectionObj = JSON.parse(JSON.stringify(this.historicalSelections["battles"]));
    var arDif = this.historicalSelections.difficulty["easy"];
    for(var i = 0; i<3; i++){
      var dif = arDif[i];
      var arSel = selectionObj[i];
      for(var j = 0; j<dif; j++){
        var randIdx = Math.floor(Math.random()*arSel.length);
        var removed = arSel.splice(randIdx, 1)[0]; 
        this.arWords.push(removed);
      }
    }
  },
  setRandomWord: function(){
    this.randomWord = this.arWords[Math.floor(Math.random()*this.arWords.length)];
  },
  getRandomWord: function(){
    return this.randomWord;
  },
  buildSpacesString: function(str){
    var spaces = "";
    for(var i = 0; i<str.length; i++){
      spaces += "_";
    }
    return spaces;
  },
  setWordUnderline: function(str){
    this.wordUnderline = this.buildSpacesString(str);
    var arTemp = this.wordUnderline.split("");
    var i = 0;
    while(i !== -1){
      i = str.indexOf(" ", i);
      if(i !== -1){
        arTemp[i] = " ";
        i++;
      }
    }
    this.wordUnderline = arTemp.join("");
  },
  replaceSpaceWithCorrectGuess: function(char){
    for (var i = 0; i<this.randomWord.length; i++){
      if(this.randomWord.charAt(i) === char){
        //this.wordUnderline = char;  TODO function to splice in char for cur letter
        if(!this.arCorrectGuess.includes(char)){
          this.arCorrectGuess.push(char);
        }
        this.wordUnderline = this.wordUnderline.substr(0, i)+ char +this.wordUnderline.substr(i + char.length);
      }
    }
    return this.wordUnderline;
  }, 
  collectWrongGuess: function(char){
    if(this.randomWord !== "undefined" && !this.randomWord.includes(char)){
      this.arWrongGuess.push(char)
    }
  },
  resetGame: function(){ //true to setupMatch with new random words
    this.randomWord = "";
    this.wordUnderline = "";
    this.arCorrectGuess = [];
    this.arWords = [];
    this.arWrongGuess = [];
    this.resetHangManObj();
    this.randomizeArWords(); 
    this.setRandomWord();
    var randomWord = this.getRandomWord();
    this.setWordUnderline(this.randomWord);
    var underline = this.buildSpacesString(randomWord)
    return underline;
  },
  setupMatch: function(){ //true to setupMatch with new random words
    this.randomWord = "";
    this.wordUnderline = "";
    this.arCorrectGuess = [];
    this.arWrongGuess = [];

    this.setRandomWord();
    var randomWord = this.getRandomWord();
    if(randomWord){
      this.setWordUnderline(this.randomWord);
    }else{
      
    }
    var underline = this.buildSpacesString(randomWord)
    return underline;
  },
  decrementGuessesRemain: function(){
    this.guessesRemain--;
  }
}


var randEl = document.getElementById("rnd-word");
var wrongText = document.getElementById("wrong-txt");
var wrongEl = document.getElementById("wrong-letter");     
var stats = document.getElementById("player-stats");
var guess = document.getElementById("guess-remain");     

var resetMatch = function(message){
  var status = document.getElementById("status");
  status.childNodes[0].textContent = message;
  randEl.textContent = guessObj.randomWord;
  document.onkeyup =  null;
  setTimeout(function () {
    guessObj.guessesRemain = 9;
    guess.textContent = "Guesses: 9";
    userStats.incrementTotalPlays();
    stats.textContent = "Correct: "+userStats.numWins+" / "+userStats.totalPlays;
    document.onkeyup = onKeyUpListener;
    var underlines = guessObj.setupMatch();
    status.childNodes[0].textContent = "Guess A Letter ";
    randEl.textContent = underlines;
    wrongText.childNodes[0].textContent = "Wrong Guess ";
    wrongEl.textContent = "";
  }, 5000);
} 

document.body.onload = function(){
  //setup of the initial word guess game
  guessObj.randomizeArWords();
  var randomWord = guessObj.setupMatch(true);
  //set up the random word element to contain only _ characters for each letter of word
  randEl.textContent = guessObj.buildSpacesString(randomWord);
};

var onKeyUpListener = function(event) {
  //get the key pressed from the event
  var char = event.key;
  //while character entered isn't A-Z (no numerics or symbols)
  while(!char.match(/[A-Za-z]/gi)){
    char = prompt("You must enter a letter"); //prompt until character is A-Z
  }
  //We will only use uppercase, so make sure char is uppercase
  char = char.charAt(0).toUpperCase(); 
  //replace space with the correctly guessed letter for respective location
  randEl.textContent = guessObj.replaceSpaceWithCorrectGuess(char);
  //if there are no more underlines in the string
  if(!guessObj.wordUnderline.includes("_")){
    //this is a win
    //remove correct word from array
    guessObj.removeStrFromArWords(guessObj.randomWord)
    //reset the game with a "Correct" message
    userStats.incrementNumWins();
    resetMatch("Correct: ")
  }
  //if the guess is already a wrong or correct guess then return to skip remaining logic
  if(guessObj.arWrongGuess.includes(char) || guessObj.arCorrectGuess.includes(char)){
    return;
  }
  guessObj.decrementGuessesRemain();
  if(guessObj.guessesRemain >= 0){
    guess.textContent = "Guesses: "+guessObj.guessesRemain;
  }
  //incorrect guess goes into array
  guessObj.collectWrongGuess(char);
  //fill out the list of incorrect guesses
  wrongEl.textContent = guessObj.arWrongGuess.toString();
  //number of guesses to get the word right
  if(guessObj.arWrongGuess.length > 8){
    //loss
    guessObj.removeStrFromArWords(guessObj.randomWord);
    //reset game with the word was message
    resetMatch("The word was: ");
  }else{
    //still have more guesses left so add wrong guess to list
    wrongEl.textContent = guessObj.arWrongGuess.toString();
  }
};

document.onkeyup = onKeyUpListener;
