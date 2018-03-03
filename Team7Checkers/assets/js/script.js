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

    // below: the thing you send to the server
    // not finalized
    var gameStateObj = {
        board: null,
        playerOneTurn: null,
        playerOneName: null,
        playerTwoName: null,

            // i would call this initialize, but we're updatinig this object all the time, so it's set
            set: function (board, turn, p1, p2) {
                this.board = board;
                this.playerOneTurn = turn;
                this.playerOneName  = p1;
                this.playerTwoName = p2;
            }
        }
    
    function Board(boardConfig)  {

        this.board = boardConfig
            
        this.boxes = [],
        this.pieces = [],
        this.playerTurn = (Math.random() <= 0.5) ? 1 : 2; //random player starts

        this.init = function() {
            let boxCount = 0;
            let pieceCount = 0;
            for (row in this.board) {
                for (column in this.board[row]) {
                    if (row % 2 == 1) { //odd row
                        if (column % 2 == 0) { //we're not saving the id as a string, we're saving as a jquery object
                            // even column
                            this.boxes[boxCount] = new Box("#box" + boxCount, [parseInt(row), parseInt(column)]);
                            boxCount++;
                        }
                    } else { //even row
                        if (column % 2 == 1) { // odd column
                            this.boxes[boxCount] = new Box("#box" + boxCount, [parseInt(row), parseInt(column)]);
                            boxCount++;
                        }   
                    }
                    if (this.board[row][column] == 1) { // now we assign pieces according to the startBoard setup, where player1 == 1 and player2 == 2
                        this.pieces[pieceCount] = new Piece("#p" + pieceCount, [parseInt(row), parseInt(column)], 1);
                        pieceCount++;
                    } else if (this.board[row][column] == 2) {
                        this.pieces[pieceCount] = new Piece("#p" + pieceCount, [parseInt(row), parseInt(column)], 2);
                        pieceCount++;
                    }
                }
            }
        },
        this.getBoxByPosition = function(row, column){
            for(i = 0; i < this.boxes.length; i++){
                if(this.boxes[i].pos[0] == row && this.boxes[i].pos[1] == column){
                    console.log("found the box: " + this.boxes[i].id + " at " + this.boxes[i].pos)
                    return this.boxes[i]
                }
            }
        },
        this.getBoxByIDString = function(IDString){ // get it from calling the dom $(this).attr("id")
            for (element in this.boxes) {
                if(this.boxes[element].id == '#' + IDString){
                    row = this.boxes[element].pos[0];
                    column = this.boxes[element].pos[1];
                    return this.boxes[element];
                }
            }
        },
        this.getPieceByPosition = function(row, column){
            for(i = 0; i < this.pieces.length; i++){
                if(this.pieces[i].pos[0] == row && this.pieces[i].pos[1] == column){
                    console.log("found the piece: " + this.pieces[i].id + " at " + this.pieces[i].pos)
                    return this.pieces[i]
                }
            }
        },
        this.getSqareType = function (row, column){

            if(row in this.board && column in this.board){ 
                let type = this.board[row][column]
                switch (type) {
                    case 0:
                        return 0
                        break;
                    case -1:
                        return -1
                        break;
                    case 1:
                        return 1 
                        break;
                    case 2:
                        return 2
                        break;
                    default:
                        return null 
                }
            }
            return null 
        },
        //check if the location has an object
        this.isEmptyBox = function (row, column) {
            if(row in this.board && column in this.board){ // check if index exists
                if(this.board[row][column] == 0) {
                    return true;
                } 
                else{
                    return false;
                }
            }
        },
        this.updateBoard =  function(type, row, column){
            if(row in this.board && column in this.board){
                this.board[row][column] = type 
            }
        },
        this.changePlayer = function(currentPlayer){
            if (currentPlayer == 1){
                this.playerTurn = 2
            }
            else if (currentPlayer == 2){
                this.playerTurn = 1
            }
            else{
                alert("this is not supposed to happen")
            }
        },
        this.printBoard = function(){
            console.table(this.board)
        },
        this.resetBoard = function(){
            // coming soon!
        },
        this.isGameOver = function(){
            let over = false;
            let p1Count = 0; // we might make player count a board attribute in the future
            let p2Count = 0;

            for(var i=0;i < this.board.length;i++){
                for(var j=0;j<this.board[i].length;j++){
                  if(this.board[i][j] == 1){ p1Count++}
                  if(this.board[i][j] == 2){ p2Count++}
                }
              }

              return p1Count == 0 || p2Count == 0 ? true : false
        }
    }

    function Box(id, pos) { // i suppose this is more of a struct since it likely won't have any methods
        this.id = id;
        this.pos = pos
    } 

    function Piece(id, pos, piecePlayer) {
        this.id = id;
        this.pos = pos
        this.piecePlayer = piecePlayer
        this.isKing = false;

        this.validateMoveOneRowCol = function(boxObj){
            let newPos = boxObj.pos;
            let moveOneRow = Math.abs(parseInt(this.pos[0]) - parseInt(newPos[0]))
            let moveOneColumn = Math.abs(parseInt(this.pos[1]) - parseInt(newPos[1]))

            if(moveOneRow == 1 && moveOneColumn == 1){
                console.log("this one row col") // good
                return true
            }
            else{
                console.log("that was not one row col")
                return false
            }
        },

        this.validateMoveByPlayer = function(boxObj){
            // p1 can only move down
            // p2 can only move up
            let newPos = boxObj.pos;
            let moveOneRow = Math.abs(parseInt(this.pos[0]) - parseInt(newPos[0]))
            let moveOneColumn = Math.abs(parseInt(this.pos[1]) - parseInt(newPos[1]))
           
            if(this.isKing){
                return true;
            }// don't bother with the below stuff
            if (this.piecePlayer == 1){
                if(this.pos[0] < newPos[0]){ // smaller means higher
                    console.log("this is a valid move for p1") // good
                    return true
                }
                else if (this.pos[0] > newPos[0]){
                    console.log("this is an invalid move for p1") // bad
                    return false
                }
            }
            else if (this.piecePlayer == 2){
                if(this.pos[0] < newPos[0]){ // smaller means higher
                    console.log("this is an invalid move for p2") // bad
                    return false
                }
                else if (this.pos[0] > newPos[0]){
                    console.log("this is a valid move for p2") // good
                    return true
                }
            }
        },
        this.isBlocked = function(){
            //coming soon!
        }
        this.emptyBoxInRange = function(row, column, direction){
            //we'll make these enums later
            //remember we have to repeat this and piece search until we are out of bounds
            // and additional step in the enemy direction

            let rowUp = row - parseInt(1);
            let rowDown = row + parseInt(1);
            let columnLeft = column - parseInt(1);
            let columnRight = column + parseInt(1);
            let targetBox = [] //it's not like  the enemies array, because you only have one target per enemuy
            // meaing we don't push, we only have one positio value [row, col]

            switch (direction) {
                case "topR":
                    console.log("r: " + rowUp + "c: " + columnRight)
                    if(Board.isEmptyBox(rowUp, columnRight)){
                        console.log("empty beyond the enemy topR")
                        return targetBox = [rowUp, columnRight];
                    }
                    break;
                case "botR":
                    console.log("r: " + rowDown + "c: " + columnRight)
                    if(Board.isEmptyBox(rowDown, columnRight)){
                        console.log("empty beyond the enemy botR")
                        return targetBox = [rowDown, columnRight];
                    }
                    break;
                case "botL":
                    console.log("r: " + rowDown + "c: " + columnLeft)
                    if(Board.isEmptyBox(rowDown, columnLeft)){
                        console.log("empty beyond the enemy botL")
                        return targetBox = [rowDown, columnLeft];
                    }
                    break;
                case "topL":
                    console.log("r: " + rowUp + "c: " + columnLeft)
                    if(Board.isEmptyBox(rowUp, columnLeft)){
                        console.log("empty beyond the enemy topL")
                        return targetBox = [rowUp, columnLeft];
                    }
                default:
                    return targetBox // empty targets a.k.a false alarm. no eatable enemies
            }
        },

        this.enemiesDirtyWork = function(rowLookup, columnLookup, dir, enemyPlayer){
            
            let enemy = []
            
            if(Board.getSqareType(rowLookup, columnLookup) == enemyPlayer){
                targetBoxCoords = this.emptyBoxInRange(rowLookup, columnLookup, dir)
                if(!(typeof targetBoxCoords == "undefined" || targetBoxCoords == null )){ //here, box = [row, col]
                    enemy = [Board.getPieceByPosition(rowLookup, columnLookup), 
                                Board.getBoxByPosition(targetBoxCoords[0], targetBoxCoords[1])] // format: ememies = [pieceObj, boxObj]
                }
            }
            return enemy
        },

        this.enemiesInRange = function(row, column){
  
            // stil needs the force jump loop

            // top-right (p2) -1, +1
            // top-left (p2) -1, -1
            // bottom-right (p1) +1, +1
            // bottom-left (p1) +1, -1

            let enemies = [] // we will always have either 0, 1 or 2 enemies in range.

            let thisRow = parseInt(this.pos[0])
            let thisColumn = parseInt(this.pos[1]);

            let thisRowUp = thisRow - parseInt(1);
            let thisRowDown = thisRow + parseInt(1);
            let thisColumnLeft = thisColumn - parseInt(1);
            let thisColumnRight = thisColumn + parseInt(1);

            let targetBoxCoords = []

            // below are 2 ifs each for 2  players, meaning you will only ever be able to have 2 eat choices
            // unless you are king. modification: include || this.isKing at each player check. then king will have 4
            if(this.piecePlayer == 1){
                enemies.push(this.enemiesDirtyWork(thisRowDown, thisColumnRight, "botR", 2))
                enemies.push(this.enemiesDirtyWork(thisRowDown, thisColumnLeft, "botL", 2))
                if (this.isKing == true){
                    enemies.push(this.enemiesDirtyWork(thisRowUp, thisColumnRight, "topR", 2))
                    enemies.push(this.enemiesDirtyWork(thisRowUp, thisColumnLeft, "topL", 2))
                }
                
            }
            if(this.piecePlayer == 2){
                if(this.isKing == true){
                    enemies.push(this.enemiesDirtyWork(thisRowDown, thisColumnRight, "botR", 1))
                    enemies.push(this.enemiesDirtyWork(thisRowDown, thisColumnLeft, "botL", 1))
                }
                enemies.push(this.enemiesDirtyWork(thisRowUp, thisColumnRight, "topR", 1))
                enemies.push(this.enemiesDirtyWork(thisRowUp, thisColumnLeft, "topL", 1))
            }
            return enemies
        },
        this.movePiece = function(boxObj){
            newPos = boxObj.pos;
        
            if(Board.isEmptyBox(newPos[0],newPos[1])){
                Board.updateBoard(0, this.pos[0], this.pos[1]) 
                this.pos = newPos // this is extremely important. update the position only after marking the orig pos with 0
                Board.updateBoard(Board.playerTurn, newPos[0], newPos[1]);
                $(id).css('top', posToCss[newPos[0]]);
                $(id).css('left', posToCss[newPos[1]]);
                $(id).removeClass('highlight');

                if(this.isKing == false){
                    if(this.pos[0] == 0 || this.pos[0] == 7){
                        this.kingSelf();
                    }
                }
                Board.changePlayer(Board.playerTurn);
                Board.printBoard(); 
            }
            else{
                alert("you can't move there")
                return false;
            }
            return true;  
        },
        this.kingSelf = function(){
            this.isKing = true;
            $(id).css("border-style","solid")
        },

        this.removeSelf = function(){
            $(id).css("display", "none");
            Board.updateBoard(0, this.pos[0], this.pos[1]);
            this.pos = [];
        };
    }

    ///// I suppose this is the main() ///////
    //initialize the board;
    var Board = new Board(boardConfig);
    Board.init();
    // var myJSON = JSON.stringify(Board);
    // console.log(myJSON);
    
    $('.piece').on("click", function () {
        console.log("GAME OVER: " + Board.isGameOver())

        let pieceIDString = null;
        let pieceObj = null;
        let enemiesAround = [];
        let isPlayerTurn = ($(this).parent().attr("class") == "player" + Board.playerTurn);

        if(isPlayerTurn == true){
            $(this).toggleClass('highlight');
            $(this).siblings().removeClass('highlight');

            //below is a repeat from box onclick func. see if you can make a function for it
            // we may need this in the future to force a jump
            // other than that it merely outputs to console
            pieceIDString = $( ".piece" ).filter( document.getElementsByClassName( "highlight" )).attr("id");
            for(element in Board.pieces){
                if(Board.pieces[element].id == "#" + pieceIDString){
                    pieceObj = Board.pieces[element];
                }
            }
            if(!!pieceObj){ // if not null
                enemiesAround = pieceObj.enemiesInRange().slice();
                if(!(enemiesAround == undefined || enemiesAround.length == 0)){
                console.log("YOU CAN KILL HIM HERE")
                // at this point, the piece does not obey the row1 col1 rule. now it obeys the row2 col2 rule
                // but the piece MUST land at the returned empty box
                }
            }
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
        let enemiesAround = [];
        let boxesAround = [];

        // box's visual aspect isn't really needed at this point, BUT
        // future TODO: reahcable box is highlighted after after piece is clicked. priority 3 feature
        $(this).toggleClass("highlight"); 
        $(this).siblings().removeClass('highlight');

        //only allow clicking on a box if a piece has been selected.
        pieceIDString = $( ".piece" ).filter( document.getElementsByClassName( "highlight" )).attr("id");
        if(typeof pieceIDString == "undefined"){
            console.log("you gotta click on a piece first to move it here");
        }else{
            boxIDString = $(this).attr('id');
            boxObj = Board.getBoxByIDString(boxIDString);

            for(element in Board.pieces){
                if(Board.pieces[element].id == "#" + pieceIDString){
                    pieceObj = Board.pieces[element];
                }
            }
            if(!!pieceObj){ // if not null
                enemiesAround = pieceObj.enemiesInRange().slice();
                if(!(enemiesAround == undefined || enemiesAround.length == 0)){
                    console.log("YOU COULD HAVE KILLED HIM THERE") // future TODO we want to restrict any other move if you can kill em
                    // this is not the place to do it. you gotta scan the the entire board to see if any jumps are possible from the current player

                    //enemiesAround format: [[pieceObj, boxObj], [pieceObj, boxObj]]
                    for(i = 0; i < enemiesAround.length; i++){
                        if(!(enemiesAround[i][1] == undefined) && "#" + boxIDString == enemiesAround[i][1].id){
                            pieceObj.movePiece(enemiesAround[i][1])
                            enemiesAround[i][0].removeSelf();
                        }                 
                    }
                }
            }
            if (pieceObj.validateMoveByPlayer(boxObj) && pieceObj.validateMoveOneRowCol(boxObj)){
                pieceObj.movePiece(boxObj);  
                
            }
            else{
                Board.printBoard();
                console.log("that's a no-no move, bud! OR YOU JUST ATE A MAN")
                if(Board.isGameOver()){ // TODO : delay this so that piece eating occurs before the alert
                    alert("GAME OVER!") // we'll let you if p1 or p2 wins in future iters
                }
                //we don't actually alert the player in the main app
            }
        }        
    });
}