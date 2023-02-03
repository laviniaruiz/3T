// add eventListerner on the window object to listen for the dom content loaded event.
// THIS IS NEEDED bc JS file included in the head of HTML document & bc of that position this script will be processed
// before any HTML on the page. By listening to this event we will make sure that the HTML is processed by the browser and can work with it //
window.addEventListener('DOMContentLoaded', () => {
    // for the tiles wrapped with the array.from bc the querySelectorAll function returns a node list which is an array-like object by converting it to a proper array
      const tiles = Array.from(document.querySelectorAll('.tile'));
      const playerDisplay = document.querySelector('.display-player');
      const resetButton = document.querySelector('#reset');
      const announcer = document.querySelector('.announcer');
  
    // variables that needed to control the game by create an array 
    // with nine empty strings & this will act for the board.
    // Store the current player which can be x/ o and will have an end game result or the game is still active.
      let board = ['', '', '', '', '', '', '', '', ''];
      let currentPlayer = 'X';
      let isGameActive = true;
    // The isGameActive variable will be true until someone wins or the game ends in a tie. In these cases
    // will set it to false so the remaining tiles will be inactive until a reset & will have three constants which represent end game states.
      const PLAYERX_WON = 'PLAYERX_WON';
      const PLAYERO_WON = 'PLAYERO_WON';
      const TIE = 'TIE';
    
    // three constant string values & each of them represents an endgame state & use this to announce the endgame state //
  /*
     Indexes within the board
     [0] [1] [2]
     [3] [4] [5]
     [6] [7] [8]
  */
  
    // collect & store all the winning condition states in the winning conditions constant.
    // This is an array of arrays & store different indexes in it. The first winning condition 0,1,2 will be the first horizontal line
      const winningConditions = [
       [0, 1, 2],
       [3, 4, 5],
       [6, 7, 8],
       [0, 3, 6],
       [1, 4, 7],
       [2, 5, 8],
       [0, 4, 8],
       [2, 4, 6]
    ];
  
    // implement the hundred  result validation function, check if there's a winner or not by looping through
    // the win conditions array and for every sub which all contains three numbers & check if the array has the
    // same characters for these indexes. If any of the three elements is an empty tile we will skip the iteration
    // using the continue keyword if they are equal then set the round one  variable to true & exit for loop using the break keyword.
    // If there's a winner then use the announce function and call it with player x1 or player 01 based on the current player's value and set the is game active to force.
    // If there's no winner and the board doesnt have any empty strings left then wont have any winenrs. So we unknowns a tie
      function handleResultValidation() {
            let roundWon = false;
            for (let i = 0; i <= 7; i++) {
                const winCondition = winningConditions[i];
                const a = board[winCondition[0]];
                const b = board[winCondition[1]];
                const c = board[winCondition[2]];
                if (a === '' || b === '' || c === '') {
                    continue;
                }
                if (a === b && b === c) {
                    roundWon = true;
                    break;
                }
            }
  
        if (roundWon) {
              announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
              isGameActive = false;
              return;
          }
  
      if (!board.includes(''))
          announce(TIE);
      }
      
    // implement a helper function called announce which will help to announce the winner/
    // end game state to the users it receives an endgame state string called type & based on that
    // will modify the announcers in the HTML . Lastly will remove the hide class to the enchancer to the user 
      const announce = (type) => {
          switch(type){
              case PLAYERO_WON:
                  announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                  break;
              case PLAYERX_WON:
                  announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                  break;
              case TIE:
                  announcer.innerText = 'Tie';
          }
          announcer.classList.remove('hide');
      };
  
  
    // isValidAction function. Basically checks whether the tile has a value already & if it has it returns false otherwise it returns true.
    // Using this function to make sure that players only play empty  tiles in their turns. 
      const isValidAction = (tile) => {
            if (tile.innerText === 'X' || tile.innerText === 'O'){
                return false;
            }
    
            return true;
        };
  
    // updateBoard function it sets the value  of the element in the board array at the given position to be equal  to the value of the current player  variable
       const updateBoard =  (index) => {
          board[index] = currentPlayer;
      }
  
    // first remove the class list of the current player then change the player to be x if it was o or either way. 
    const changePlayer = () => {
          playerDisplay.classList.remove(`player${currentPlayer}`);
          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
          playerDisplay.innerText = currentPlayer;
          playerDisplay.classList.add(`player${currentPlayer}`);
      }
  
    // implement the user action function it will represent a turn in the game this function will be called when the user clicks on the tile.
    // first! check if the step is a valid action  by passing the tile to the isValidAction function & implement this later & check wheter is the game is active or  not.
    // Basically whether it has an endgame state or a winner or a tie basically or not. If both conditions are  true so we have a valid action and the game
    // is active then will set the inner attacks  to the current player  which will be x/ o and assign the player x/ o class  based on the current player. 
    // ** not using the conditional instead using the template string literals so the current player inside the {} will be x/ o depending on the current player's  value.
       const userAction = (tile, index) => {
          if(isValidAction(tile) && isGameActive) {
              tile.innerText = currentPlayer;
              tile.classList.add(`player${currentPlayer}`);
              updateBoard(index);
              handleResultValidation();
              changePlayer();
          }
      }
  
    // implement thr reset board function which reset the game state and the board. First set the board to contain 9 empty strings then set the ease game active variable to true
    // and hide the announcer  by adding the height class. By definition player X starts the game every time. So, if the current player is O then we call the change player function 
    const resetBoard = () => {
          board = ['', '', '', '', '', '', '', '', ''];
          isGameActive = true;
          announcer.classList.add('hide');
  
          if (currentPlayer === 'O') {
              changePlayer();
          }
  // update the ui and for every tile will set the the inner text to be an empty string & remove any player related classes 
      tiles.forEach(tile => {
              tile.innerText = '';
              tile.classList.remove('playerX');
              tile.classList.remove('playerO');
          });
      }
  
    // tiles array & attach an event listener to every single tile in it. So when tile is clicked a user action function will be called
    // with the reference to that spesific  tile & the index of it. The tile reference to modify the ui and will  use the index to update in-memory saved board array
     tiles.forEach( (tile, index) => {
          tile.addEventListener('click', () => userAction(tile, index));
      });
  
  
    resetButton.addEventListener('click', resetBoard);
  });