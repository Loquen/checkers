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
let board, winner, turn, peonSelected, validMoves, highlighted;

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
  // Set selected to false (no piece selected)
  peonSelected = false;
  // Call render() to refresh the state
  render();
}

function render(){
  // Loop through board array and render each cell as empty or peon
  board.forEach(function(cell,idx){
    // If the board has a peon and that square is valid 
    // then we can grab the square and render
    if(board[idx] !== 0 && validSquares.includes(idx)){
      let id = `#cell${idx.toString()} div`;
      let div = document.querySelector(id);
      div = board[idx] === 1 ? 
        div.classList.add('white') : div.classList.add('black');
    }
  });
}

function handleClick(evt){
  // If the user has clicked on their own peon and no other element has been selected
  if(evt.target.classList.contains(players[turn])){
    if(!peonSelected){
      // No peon selected, add the highlight class and update our highlighted var
      evt.target.classList.add('highlight');
      highlighted = evt.target;
      peonSelected = true;
    } else if(peonSelected && evt.target === highlighted){
      // We've clicked on the already highlighted peon, remove and stop tracking highlighted
      highlighted.classList.remove('highlight');
      highlighted = null;
      peonSelected = false;
    } else if(peonSelected){
      // We've clicked on a new peon, remove old highlight, 
      //swap out highlight for new peon and highlight that one
      highlighted.classList.remove('highlight');
      highlighted = evt.target;
      highlighted.classList.add('highlight');
      peonSelected = true;
    }
  } else if(peonSelected){
    // We need to check if the move is valid
    if(isValidMove(highlighted, evt.target)){
      render();
    }
    
  }
}
//     selected = evt.target;
//     selected.classList.add('highlight');
//     let cell = parseInt(selected.parentNode.id.replace('cell', ''));
    

    
//     //console.log(validMoves);
//   }
// //debugger;
//   // If there is already a selected 
//   if(selected.parentElement === evt.target.parentElement){
//     // We've already selected this piece
//     selected.classList.remove('highlight');
//     selected = null;
//     return;
//   } else {
//     selected.classList.remove('highlight');
//     selected = evt.target;
//     selected.classList.add('highlight'); 
//   }


function isValidMove(peon, targetMove){
  let cell = parseInt(peon.parentNode.id.replace('cell', ''));
  let move = parseInt(targetMove.id.replace('cell', ''));
  let cellLeft = cell + (7 * turn);
  let cellRight = cell + (9 * turn);
  //debugger;
  // If these cells are not occupied
  // TODO: Eventually it will need to check for jumps, backwards 
  validMoves = {
    'r': `cell${cellRight.toString()}`,
    'l': `cell${cellLeft.toString()}`
  }
  // If the cell we've clicked on is one of either validMoves.l or validMoves.r
  // Also need to check that there is no piece in cell
  if((targetMove.id === validMoves.l || targetMove.id === validMoves.r) && (!board[cellLeft] || !board[cellRight])){
    board[cell] = 0;
    board[move] = turn;
    return true;
  }

  return false;
}