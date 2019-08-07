/*----------------- CONSTANTS -----------------*/
const validSquares = [
  1,3,5,7,
  8,10,12,14,
  17,19,21,23,
  24,26,28,30,
  33,35,37,39,
  40,42,44,46,
  49,51,53,55,
  56,58,60,62
];

const players = {
  1: 'white',
  '-1': 'black'
};

const kingable = {
  '-1': ['cell1','cell3','cell5','cell7'],
  1: ['cell56','cell58','cell60','cell62']
};

sounds = {
  'background': '../sounds/background.wav',
  'king': '../sounds/king.wav',
  'capture': '../sounds/capture.wav',
  'win': '../sounds/win.wav'
};

const audio = new Audio();

/*------------------ STATE VARIABLES -----------------*/
let board, winner, turn, cpu, cpuMove, peonSelected, validMoves, highlighted;

/*----------------- CACHED ELEMENT REFERENCES ---------------------*/
let turnEl = document.getElementById('turn');
let modalEl = document.getElementById('winModal');
let winEl = document.getElementById('winMsg');
let highlight = 'highlight';

/*-------------- EVENT LISTENERS ---------------*/
document.querySelector('.board').addEventListener('click', handleClick);
document.querySelector('button').addEventListener('click', reset);
document.querySelector('.closeModal').addEventListener('click', closeModal);

/*--------------- FUNCTIONS ---------------*/
init();

function init(){
  // Initialize the board with both players
  // board = [
  //   0,0,0,0,0,0,0,0,
  //   0,0,-2,0,1,0,0,0,
  //   0,0,0,2,0,0,0,0,
  //   0,0,0,0,0,0,0,0,
  //   0,0,0,0,0,0,0,0,
  //   0,0,0,0,0,0,0,0,
  //   0,0,0,0,0,1,0,0,
  //   0,0,0,0,0,0,0,0
  // ];
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
  cpu = -1;
  cpuMove = false;
  // Set winner to null (1, -1, 'T' and null)
  winner = null;
  // Set selected to false (no piece selected)
  peonSelected = false;
  // Play background music
  //document.getElementById('bg-player').play();
  // Call render() to refresh the state
  render();
}

function reset(){
  board.forEach(function(cell, idx){
    let id = `#cell${idx.toString()} div`;
    let div = document.querySelector(id);
    if(div){
      div.classList.remove('white', 'black', highlight, 'king');
    }
  });
  init();
  confetti.stop();
}

function render(){
  // Loop through board array and render each cell as empty or peon
  board.forEach(function(cell,idx){
    // If the board has a peon and that square is valid 
    // then we can grab the square and render
    if(validSquares.includes(idx)){
      let id = `#cell${idx.toString()} div`;
      let div = document.querySelector(id);
      if(board[idx] !== 0){
        // If a 1 -> white, if 2 -> white King, else if 2 -> black king, else, black
        if(board[idx] > 0){
          div = board[idx] === 1 ? div.classList.add('white') : div.classList.add('white', 'king');
        }else{
          div = board[idx] === -1 ? div.classList.add('black') : div.classList.add('black', 'king');
        }        
      }else{
        div.classList.remove('white', 'black', highlight, 'king');
      }
    }
  });

  // If it's the cpu's turn, run it
  if(turn === cpu){
    cpuMove = true;
    computer();
  }

  if(winner){
    modalEl.style.display = "block";
    winEl.textContent =`${players[winner][0].toUpperCase()}${players[winner].slice(1)} Wins!`;
    //Play a sound and shoot some confetti!
    playSound('win');
    confetti.start();
  }else{
    turnEl.textContent = `${players[turn][0].toUpperCase()}${players[turn].slice(1)}'s Turn`;
  }
}

function playSound(name){
  audio.src = sounds[name];
  audio.play();
}

////////////////////////////// CLICK HANDLING ////////////////////////////////

function handleClick(evt){
  if(winner) return;
  //Is click a piece?
  if(evt.target.classList.contains(players[turn]) || evt.target.classList.contains(players[-(turn)])){
    // Y -> Is selected piece our turn?
    if(evt.target.classList.contains(players[turn])){
      // Y -> Is piece already highlighted?
      if(highlighted){
        // Is there a highlighted piece, if so remove
        highlighted.classList.remove(highlight);
      }
      if(highlighted === evt.target){
        // Y -> unhighlight and unselect peon
        peonSelected = false;
        highlighted = null;
      }else{
        // N -> change current highlighted piece
        highlighted = evt.target;
        highlighted.classList.add(highlight);
        peonSelected = true;
      }
    } else {                      // N 
      return;
    }
  }else if(peonSelected){       // N -> Is peonSelected?
    // Y -> isValidMove? and is move kingable?
    let move = isValidMove(highlighted, evt.target);
    kingMe(move);
    // Y -> change turn and rerender
    if(move){
      turn *= -1;
      winner = getWinner();
      render();
    }
  }else{
    return;  // N -> not a valid click
  }
}

// Close modal on click of X
function closeModal(evt){
  winModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(evt){
  if(evt.target == winModal){
    winModal.style.display = "none";
  }
}

///////////////////////// HELPER FUNCTIONS //////////////////////////////
function getWinner(){
  let points = {
    1: 0,
    '-1': 0
  }

  // Loop through board and add up all scores
  board.forEach(function(el, idx){
    if(board[idx]){ // value is not 0
      // Element is negative, add to the black side
      // Element is positive, add to the white side
      board[idx] > 0 ? points[1]++ : points['-1']++;

      // TODO: If there are no moves left, otherside wins
      // Check each piece's valid moves
      // Loop over valid moves, if move is valid, break
    } 
  });

  if(points[turn] === 0){
    return -(turn);
  }else if(points[-(turn)] === 0){
    return turn;
  }
}

function kingMe(move){
  let cell = `cell${move}`;
  if(kingable[turn].includes(cell)){
    board[move] = turn * 2;
    playSound('king');
  }
}

function isValidMove(peon, targetMove){
  let cell = parseInt(peon.parentNode.id.replace('cell', ''));
  let move = parseInt(targetMove.id.replace('cell', ''));
  
  calculatePossibleMoves(cell);

  // Forward Movement
  debugger;
  if(((move > cell && turn === 1) || (move < cell && turn === -1)) && !board[move]){   
    // If the cell we've clicked on is forward right or left
    // and check that cell is empty
    if((targetMove.id === validMoves.l || targetMove.id === validMoves.r)){
      completeJump(cell, move);
    } else if(targetMove.id === validMoves.jumpL || targetMove.id === validMoves.jumpR){
      // Otherwise we are checking the jump squares, and if valid we update board
      if((board[validMoves.id.cellLeft] === -(turn) || board[validMoves.id.cellLeft] === -(turn * 2)) && targetMove.id === validMoves.jumpL){ 
        completeJump(cell, move, validMoves.id.cellLeft);
      }
      if((board[validMoves.id.cellRight] === -(turn) || board[validMoves.id.cellRight] === -(turn * 2)) && targetMove.id === validMoves.jumpR){
        completeJump(cell, move, validMoves.id.cellRight);
      }
    }
    // Check validity of calculated move
    if(Object.values(validMoves).includes(targetMove.id)){
      return move;
    }
  }else if((board[cell] === turn * 2) && !board[move]){ // If king, check for backwards movement and check that cell is empty
    // If the cell we've clicked on is back left or back right
    if((targetMove.id === validMoves.backLeft || targetMove.id === validMoves.backRight)){
      completeJump(cell, move);
    }else if(targetMove.id === validMoves.jumpBackLeft || targetMove.id === validMoves.jumpBackRight){
      // Otherwise we are checking the jump squares, and if valid we update board
      if((board[validMoves.id.cellBackLeft] === -(turn) || board[validMoves.id.cellBackLeft] === -(turn * 2))  && targetMove.id === validMoves.jumpBackLeft){ // also check if targetMove === validMoves.jumpL... or jumpR
        completeJump(cell, move, validMoves.id.cellBackLeft);
      }
      if((board[validMoves.id.cellBackRight] === -(turn) || board[validMoves.id.cellBackRight] === -(turn * 2)) && targetMove.id === validMoves.jumpBackRight){ // May need to change this to deal with more kings
        completeJump(cell, move, validMoves.id.cellBackRight);
      }
    }
    // Check validity of calculated move
    if(Object.values(validMoves).includes(targetMove.id)){ 
      return move;
    }
  }
  return false;
}

function completeJump(cell, move, ...jumps){
  board[move] = board[cell];
  board[cell] = 0;
  
  if(jumps.length > 0){
    board[jumps[0]] = 0;
    playSound('capture');
  }
}

function calculatePossibleMoves(cell){
  let cellLeft = cell + (7 * turn);
  let jumpLeft = cell + (14 * turn);
  let cellRight = cell + (9 * turn);
  let jumpRight = cell + (18 * turn);
  let cellBackLeft = cell - (7 * turn);
  let cellBackRight = cell - (9 * turn);
  let cellJumpBackLeft = cell - (14 * turn);
  let cellJumpBackRight = cell - (18 * turn);

  validMoves = {
    'r': `cell${cellRight.toString()}`,
    'l': `cell${cellLeft.toString()}`,
    'jumpL': `cell${jumpLeft.toString()}`,
    'jumpR': `cell${jumpRight.toString()}`,
    'backRight': `cell${cellBackRight.toString()}`,
    'backLeft': `cell${cellBackLeft.toString()}`,
    'jumpBackLeft': `cell${cellJumpBackLeft.toString()}`,
    'jumpBackRight': `cell${cellJumpBackRight.toString()}`,
    'id' :{
      'cellRight': cellRight,
      'cellLeft': cellLeft,
      'jumpLeft': jumpLeft,
      'jumpRight': jumpRight,
      'cellBackRight': cellBackRight,
      'cellBackLeft': cellBackLeft,
      'cellJumpBackLeft': cellJumpBackLeft,
      'cellJumpBackRight': cellJumpBackRight
    }
  };
}

function computer(){
  debugger;
  // Loop over board array
  board.forEach(function(cell, idx){
    // The piece is computer's
    if((cpu === board[idx] || cpu * 2 === board[idx]) && cpuMove){
      // Calculate possible moves
      // Grab the actual peon element with the idx
      let piece = document.getElementById(`cell${idx}`).firstChild;
      calculatePossibleMoves(idx); // calculate valid moves for the current element
      // Loop through those valid moves
      for(target in validMoves.id){
        let targetMove = document.getElementById(`cell${validMoves.id[target]}`);
        if(targetMove){ // If the move is negative targetMove will be null
          let move = isValidMove(piece, targetMove);
          kingMe(move);
          if(move){
            turn *= -1;
            winner = getWinner();
            cpuMove = false;
            render();
            return;
          }
        }  
      }
      winner = -(cpu);  // If no valid moves, then player wins
    }
  });
}
