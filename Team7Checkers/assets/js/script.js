window.onload = function() {

 
    // the vmin indices translate directly to the pieceObj and boxObj pos variable
    var posToCss = ["0vmin", "10vmin", "20vmin", "30vmin", "40vmin", "50vmin", "60vmin", "70vmin", "80vmin", "90vmin"]
    // right now, only this configuration is supported because visuals are hardcoded in html
    // if we want any other specified board config, we're gonna have to generate the html in the board.init method
    // but it's ok, because that's not in the scope of this project.

    // 0 represents empty square
    // -1 represents unreachable square
    // 1 is Player1
    // 2 is Player2
    var boardConfig =  [[-1, 1, -1, 1, -1, 1, -1, 1],
                    [1, -1, 1, -1, 1, -1, 1, -1],
                    [-1, 1, -1, 1, -1, 1, -1, 1],
                    [0, -1, 0, -1, 0, -1, 0, -1],
                    [-1, 0, -1, 0, -1, 0, -1, 0],
                    [2, -1, 2, -1, 2, -1, 2, -1],
                    [-1, 2, -1, 2, -1, 2, -1, 2],
                    [2, -1, 2, -1, 2, -1, 2, -1]];
    
    function Board(boardConfig)  {

        this.board = boardConfig
            
        this.boxes = [],
        this.pieces = [],
        this.player = (Math.random() <= 0.5) ? 1 : 2; //random player starts

        this.init = function() {
            let boxCount = 0;
            let pieceCount = 0;
            for (row in this.board) {
                for (column in this.board[row]) {
                    if (row % 2 == 1) { //odd row
                        if (column % 2 == 0) { //we're not saving the id as a string, we're saving as a jquery object
                            // even column
                            this.boxes[boxCount] = new Box("#box" + boxCount, [row, column]);
                            boxCount++;
                        }
                    } else { //even row
                        if (column % 2 == 1) { // odd column
                            this.boxes[boxCount] = new Box("#box" + boxCount, [row, column]);
                            boxCount++;
                        }   
                    }

                    if (this.board[row][column] == 1) { // now we assign pieces according to the startBoard setup, where player1 == 1 and player2 == 2
                        this.pieces[pieceCount] = new Piece("#p" + pieceCount, [row, column]);
                        pieceCount++;
                    } else if (this.board[row][column] == 2) {
                        this.pieces[pieceCount] = new Piece("#p" + pieceCount, [row, column]);
                        pieceCount++;
                    }
                }
            }
        },
        //check if the location has an object
        this.isEmptyBox = function (row, column) {
            if(this.board[row][column] == 0) {
                return true;
            } 
            else{
                return false;
            }
        },
        // i'm not sure if we even need this
        this.isUnreachableBox = function (row, column) { 
            if(this.board[row][column] == -1) {
                return true;
            } 
            else{
                return false;
            }
        },
        this.isP1 = function (row, column) {
            if(this.board[row][column] == 1) {
                return true;
            } 
            else{
                return false;
            }
          },

        this.isP2 =  function (row, column) {
            if(this.board[row][column] == 2) {
                return true;
            } 
            else{
                return false;
            }
        },
        this.updateBoard =  function(type, row, column){
            if(this.board[row][column] !== "undefined"){ // check if index exists
                this.board[row][column] = type 
            }
        },

        this.changePlayer = function(currentPlayer){
            if (currentPlayer == 1){
                this.player = 2
            }
            else if (currentPlayer == 2){
                this.player = 1
            }
            else{
                alert("this is not supposed to happen")
            }
        }

        this.printBoard = function(){
            console.table(this.board)
        }
        
    }

    function Box(id, pos) {
        this.id = id;
        this.pos = pos

    }

    function Piece(id, pos) {
        this.id = id;
        this.pos = pos

        this.movePiece = function(boxObj){
            newPos = boxObj.pos;
            // we don't care about restrictions now
            // if the box is empty, we just move it there

            if(Board.isEmptyBox(newPos[0],newPos[1])){
                Board.updateBoard(0, this.pos[0], this.pos[1]) 
                this.pos = newPos // this is extremely important. update the position only after marking the orig pos with 0
                Board.updateBoard(Board.player, newPos[0], newPos[1]);
                $(id).css('top', posToCss[newPos[0]]);
                $(id).css('left', posToCss[newPos[1]]);
                $(id).removeClass('highlight');
                Board.changePlayer(Board.player);
                Board.printBoard(); 
            }
            else{
                alert("you can't move there")
            }
            return true;  
        };
    }

    ///// I suppose this is the main() ///////
    //initialize the board;
    var Board = new Board(boardConfig);
    Board.init();
    
    $('.piece').on("click", function () {
        
        let isPlayerTurn = ($(this).parent().attr("class") == "player" + Board.player);

        if(isPlayerTurn == true){
            $(this).toggleClass('highlight');
            $(this).siblings().removeClass('highlight');
        }
        else{
            alert("it's not your turn!!!!!!!!!!!!!!!!!") // of course we don't just throw out alerts here and there. inform the player within that column on the left. that comes later
         
            
        }
      });

    $('.box').on("click", function () { 

        let pieceIDString = null;
        let boxIDString = null;
        let pieceObj = null;
        let boxObj = null;

        // box's visual aspect isn't really needed at this point, BUT
        // future TODO: reahcable box is highlighted after after piece is clicked
        $(this).toggleClass("highlight"); 
        $(this).siblings().removeClass('highlight');

        //only allow clicking on a box if a piece has been selected.
        pieceIDString = $( ".piece" ).filter( document.getElementsByClassName( "highlight" )).attr("id");
        if(typeof pieceIDString == "undefined"){
            console.log("you gotta click on a piece first to move it here");
        }else{
            boxIDString = $(this).attr('id');
            for (element in Board.boxes) {
                if(Board.boxes[element].id == '#' + boxIDString){
                    row = Board.boxes[element].pos[0];
                    column = Board.boxes[element].pos[1];
                    boxObj = Board.boxes[element];
                }
            }
            // now let's get the picece that's currently selected
            //below gets you the id of the selected piece when you click the box. format: "p16"
            for(element in Board.pieces){
                if(Board.pieces[element].id == "#" + pieceIDString){
                    pieceObj = Board.pieces[element];
                }
            }
            pieceObj.movePiece(boxObj);  
        }        
    });
}