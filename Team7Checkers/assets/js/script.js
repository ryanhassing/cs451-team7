window.onload = function() {    

  
    var startBoard = [ 
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0]
        ];
    // 0 represents empty square
    // 1 is P1
    // 2 is P2

    var boxes = [];
    /////////////////////////////

    var Box = {
        // we'll store the position in here later
    }

    var Piece = {

    }

    var Board = {
        board: startBoard,

        init: function () {
            //we want to automatically generate the boxes
            //give each box a html id and class
        }
    }
    //initialize the board
    Board.init();


    console.log("hello from script.js");
}