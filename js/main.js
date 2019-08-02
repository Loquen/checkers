/*----- constants -----*/


/*----- app's state (variables) -----*/
let board, winner, turn;

/*----- cached element references -----*/


/*----- event listeners -----*/


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
  // Call render() to refresh the state
  render();
}

function render(){
  // Loop through board array and render each cell as empty or peon
  // Grab each element/div 
  // set style of inner div element to  

}

function handleClick(){

}