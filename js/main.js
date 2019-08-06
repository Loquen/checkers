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

const kingable = {
  '-1': [1,3,5,7],
  1: [56,58,60,62]
}
/*----- app's state (variables) -----*/
let board, winner, turn, peonSelected, validMoves, highlighted;

/*----- cached element references -----*/
let msgEl = document.getElementById('msg');
let highlight = 'highlight';
// let 

/*----- event listeners -----*/
document.querySelector('.board').addEventListener('click', handleClick);
document.querySelector('button').addEventListener('click', reset);

/*----- functions -----*/
init();

function init(){
  // Initialize the board with both players
  board = [
    0,0,0,0,0,0,0,0,
    0,0,0,0,-1,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,2,0,0,0,0,0,
    0,0,0,-2,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,1,0,0,0,0,
    0,0,0,0,0,0,0,0
  ];
  // board = [
  //   0,1,0,1,0,1,0,1,
  //   1,0,1,0,1,0,1,0,
  //   0,1,0,1,0,1,0,1,
  //   0,0,0,0,0,0,0,0,
  //   0,0,0,0,0,0,0,0,
  //   -1,0,-1,0,-1,0,-1,0,
  //   0,-1,0,-1,0,-1,0,-1,
  //   -1,0,-1,0,-1,0,-1,0
  // ];
  // Set turn to Player 1
  turn = 1;
  // Set winner to null (1, -1, 'T' and null)
  winner = null;
  // Set selected to false (no piece selected)
  peonSelected = false;
  // Call render() to refresh the state
  render();
}

function reset(){
  board.forEach(function(cell, idx){
    let id = `#cell${idx.toString()} div`;
    let div = document.querySelector(id);
    if(div){
      div.classList.remove('white', 'black', highlight);
    }
  });
  init();
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
        div = board[idx] === 1 || board[idx] === 2 ? 
          div.classList.add('white') : div.classList.add('black'); // TODO: add logic to render kings
      }else {
        div.classList.remove('white', 'black', highlight);
      }
    }
  });

  if(winner){
    // Winning!
    msgEl.textContent =`${players[winner][0].toUpperCase()}${players[winner].slice(1)} Wins!`
  } else {
    msgEl.textContent = `${players[turn][0].toUpperCase()}${players[turn].slice(1)}'s Turn`
  }
}

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
      } else {
        // N -> change current highlighted piece
        highlighted = evt.target;
        highlighted.classList.add(highlight);
        peonSelected = true;
      }
      console.log(evt.target, 'piece');
    } else {                      // N -> return
      return;
    }
  } else if (peonSelected){       // N -> Is peonSelected?
    // Y -> isValidMove?
    let move = isValidMove(highlighted, evt.target);
    kingMe(move);
    console.log(board[move]);
    // Y -> change turn and rerender
    if(move){
      turn *= -1;
      winner = getWinner();
      render();
    }
  } else {
    return;  // N -> not a valid click, return
  }
}

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
    } 
  });

  if(points[turn] === 0){
    return -(turn);
  } else if (points[-(turn)] === 0){
    return turn;
  }
}

function kingMe(move){
  if(kingable[turn].includes(move)) board[move] = turn * 2;
}

function isValidMove(peon, targetMove){
  let cell = parseInt(peon.parentNode.id.replace('cell', ''));
  let move = parseInt(targetMove.id.replace('cell', ''));
  let cellLeft = cell + (7 * turn);
  let jumpLeft = cell + (14 * turn);
  let cellRight = cell + (9 * turn);
  let jumpRight = cell + (18 * turn);
  let cellBackLeft = cell - (7 * turn);
  let cellBackRight = cell - (9 * turn);
  let cellJumpBackLeft = cell - (14 * turn);
  let cellJumpBackRight = cell - (18 * turn);
  // If these cells are not occupied
  // TODO: Eventually it will need to check for double jumps, backwards/king movement
  validMoves = {
    'r': `cell${cellRight.toString()}`,
    'l': `cell${cellLeft.toString()}`,
    'jumpL': `cell${jumpLeft.toString()}`,
    'jumpR': `cell${jumpRight.toString()}`,
    'backRight': `cell${cellBackRight.toString()}`,
    'backLeft': `cell${cellBackLeft.toString()}`,
    'jumpBackLeft': `cell${cellJumpBackLeft.toString()}`,
    'jumpBackRight': `cell${cellJumpBackRight.toString()}`,
  }
  
  // If the cell we've clicked on is one of either validMoves.l or validMoves.r
  // Also need to check that there is no piece in cell
  if((move > cell && turn === 1) || (move < cell && turn === -1)){   // forward movement
    if((targetMove.id === validMoves.l || targetMove.id === validMoves.r) && (!board[cellLeft] || !board[cellRight])){
      board[move] = board[cell];
      board[cell] = 0;
    } else if(targetMove.id === validMoves.jumpL || targetMove.id === validMoves.jumpR){
      // Otherwise we are checking the jump squares, and if valid we update board
      if((board[cellLeft] === -(turn) || board[cellLeft] === -(turn * 2)) && targetMove.id === validMoves.jumpL){ // need to check if the value is 1, 2, or -1, -2 not just 1, -1
        board[move] = board[cell];
        board[cell] = 0;
        board[cellLeft] = 0;
      }
      if(board[cellRight] === -(turn) || board[cellRight] === -(turn * 2)){
        board[move] = board[cell];
        board[cell] = 0;
        board[cellRight] = 0;
      }
    }
    return move;
  } else if(board[cell] === turn * 2){ // King, check for backwards moves
    if((targetMove.id === validMoves.backLeft || targetMove.id === validMoves.backRight) && (!board[cellBackLeft] || !board[cellBackRight])){
      board[move] = board[cell];
      board[cell] = 0;
    } else if(targetMove.id === validMoves.jumpBackLeft || targetMove.id === validMoves.jumpBackRight){
      // Otherwise we are checking the jump squares, and if valid we update board
      if((board[cellBackLeft] === -(turn) || board[cellBackLeft] === -(turn * 2))  && targetMove.id === validMoves.jumpBackLeft){ // also check if targetMove === validMoves.jumpL... or jumpR
        board[move] = board[cell];
        board[cell] = 0;
        board[cellBackLeft] = 0;
      }
      if(board[cellBackRight] === -(turn) || board[cellBackRight] === -(turn * 2)){ // May need to change this to deal with more kings
        board[move] = board[cell];
        board[cell] = 0;
        board[cellBackRight] = 0;
      }
    }
    return move;
  }
  return false;
}
