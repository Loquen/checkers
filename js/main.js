/*----- constants -----*/
const validSquares = [
  1,3,5,7,
  8,10,12,14,
  17,19,21,23,
  24,26,28,30,
  33,35,37,39,
  40,42,44,46,
  49,51,53,55,
  56,58,60,62
]

const players = {
  1: 'white',
  '-1': 'black'
}

/*----- app's state (variables) -----*/
let board, winner, turn, selected, validMoves;

/*----- cached element references -----*/


/*----- event listeners -----*/
document.querySelector('.board').addEventListener('click', handleClick);

/*----- functions -----*/
init();

function init(){
  // Initialize the board with both players
  board = [
    0,1,0,1,0,1,0,1,
    1,0,1,0,1,0,1,0,
    0,1,0,1,0,1,0,1,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    -1,0,-1,0,-1,0,-1,0,
    0,-1,0,-1,0,-1,0,-1,
    -1,0,-1,0,-1,0,-1,0
  ];
  // Set turn to Player 1
  turn = 1;
  // Set winner to null (1, -1, 'T' and null)
  winner = null;
  // Set selected to null (no piece selected)
  selected = null;
  // Call render() to refresh the state
  render();
}

function render(){
  // Loop through board array and render each cell as empty or peon
  board.forEach(function(cell,idx){
    // If the board has a peon and that square is valid 
    // then we can grab the square and render
    if(board[idx] !== 0 && validSquares.includes(idx)){
      let div = document.getElementById(idx.toString());
      div = board[idx] === 1 ? 
        div.classList.add('white') : div.classList.add('black');
    }
  });
}

function handleClick(evt){
  // If the user has clicked on their own peon and no other element has been selected
  if(evt.target.classList.contains(players[turn]) && !selected){
    
    selected = evt.target;
    selected.classList.add('highlight');

    validMoves = {
      'r': parseInt(selected.id) + 9,
      'l': parseInt(selected.id) + 7
    }

    let left = document.getElementById(validMoves.l);
    let right = document.getElementById(validMoves.r);
    left.classList.add('valid-move');
    right.classList.add('valid-move');
    console.log(validMoves);
  }

  // If there is already a selected 
  if(selected){

  }
}