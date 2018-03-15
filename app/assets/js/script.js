const { app, ipcRenderer, remote, BrowserWindow } = require('electron')
$(document).ready(function () {
  var WebSocket = require('ws')
  var connection
  var moveJson
  var playerYou = 0
  var url = 'ws://cs451team7server.herokuapp.com/checkers'
  var userCount = 0
  var singlePlayer = false;

  /// ///////////////////////MENU FUNCTIONS///////////////////////////////

  $(document).on('click', '#single-player', function () {
    $('#modal-screen-wait').css('display', 'none')
    singlePlayer = true;
    $("#p1-box > span").css("display", "none")
    $("#p2-box > span").css("display", "none")
    if (connection.readyState === WebSocket.OPEN) {
      connection.close();
      console.log("Connection closed.")
   }

  })

  $(document).on('click', '#exit', function () {
    remote.getCurrentWindow().close()
  })
  $(document).on('click', '#forfeit', function () {
    let winner = playerYou == 1 ? 2 : 1;
    $("#f-winner").text("Forfeit! Player " + winner + " wins!");
    $('#modal-screen').css('display', 'flex')
    sendGameOverJSON(winner, true)
  })
  $(document).on('click', '.leave', function () {
    Board.resetBoard(boardConfig)
    
    $('#modal-screen').css('display', 'none')

    playerLeave = JSON.stringify({'playerLeave': playerYou})
    connection.send(playerLeave)

    $('#maingamescreen').hide();
    $("#mainmenuscreen").show();
    $("#p1-box > span").text("")
    $("#p2-box > span").text("")

    if (connection.readyState === WebSocket.OPEN) {
      connection.close();
      console.log("Connection closed.")
   }
   userCount = 0


  })
  $(document).on('click', '#restart-game', function () {
    if($("#rematch-message").text() == "You both have to hit restart for a rematch."){
      sendRestartJSON(true); // the initiator
      $('#rematch-message').text('Waiting for other player to confirm rematch.')
    }
    else{
      sendRestartJSON(false) // not the initiator
    }
    
    
    //Board.resetBoard(boardConfig)
  })

  $(document).on('click', "#join", function(){
    connection = new WebSocket(url)
      // connection opened
    connection.addEventListener('open', function (event) {
      // connection.send('{"msg" : "connected"}');
      console.log('Connected to server')

      $("#modal-screen-wait").css("display", "flex")
    })

    // log message
    connection.addEventListener('message', function (event) {
      // jsonToMove(event.data);

      let json = event.data
      json = JSON.parse(json)
      console.log('This is json')
      console.log(json)
      if(typeof json.user != 'undefined'){
        userCount++;
        console.log("this is user: ")
        let userStr = json.user;
        let userInt = parseInt(userStr.substring(4));
        console.log(userStr);
        console.log(parseInt(userStr.substring(4)))
        setPlayers(userInt)
      }

      if (typeof json.move != 'undefined') {
        console.log('this is json move: ')
        console.log(json.move)
        if(typeof json.move.me != 'undefined'){
          console.log("this is json me")
          console.log(json.move.me)
          if(json.move.me == "true"){
            $("#modal-screen-wait").css("display", "none")
          }
        }
        else if (typeof json.move.id != 'undefined') {
          if (typeof json.move.id != 'undefined') {
            console.log('this is json id: ')
            console.log(json.move.id)
          }
          if (typeof json.move.box != 'undefined') {
            console.log('this is json box: ')
            console.log(json.move.box)
          }
          if (typeof json.move.player != 'undefined') {
            console.log('this is json player: ')
            console.log(json.move.player)
          }
          if (typeof json.move.position != 'undefined') {
            console.log('this is json position: ')
            console.log(json.move.position)
          }
          if (typeof json.move.zeat != 'undefined') {
            console.log('this is json eat: ')
            console.log(json.move.zeat)
          }
          console.log("id no hash: ")
          let otherPieceObj = Board.getPieceByIDString(json.move.id.substring(1));
          let eatPieceObj = json.move.zeat === null ? null : Board.getPieceByIDString(json.move.zeat.substring(1))
          let otherBoxPos = json.move.box
          console.log("target pos:" + otherBoxPos[0] +  otherBoxPos[1])
          otherPieceObj.movePiece(otherBoxPos, eatPieceObj)
        }
        else if (typeof json.move.gameOver != 'undefined') {
          let fText = ""
          if(typeof json.move.forfeit != 'undefined'){
            console.log("this is f: ")
            console.log(json.move.forfeit)
            fText = "Forfeit! "
          }
          if (typeof json.move.winner != 'undefined') {
            console.log('this is winner: ')
            console.log(json.move.winner)

            if (playerYou == json.move.winner) {
              $('#f-winner').text(fText + 'Player ' + json.move.winner + ' wins!')
              $('#modal-screen').css('display', 'flex')
            }
          }
        }
        else if (typeof json.move.playerLeave != 'undefined') {
          console.log('player ' + json.move.playerLeave + ' has left')
          // redirect to main menu
          if(playerYou != json.move.playerLeave){
            $("#modal-screen-leave").css("display", "flex");
            $("#modal-screen").css("display", "none");
            setTimeout(function(){ $(".leave").trigger("click"); $("#modal-screen-leave").css("display", "none") }, 2000);
          }
        }
        else if(typeof json.move.restartRequest != "undefined"){
          console.log('restart request received')
          if(playerYou != json.move.restarter){
            $("#rematch-message").text("The other player wants to rematch!")
          }
          if(json.move.restartRequest == false){
            Board.resetBoard(boardConfig);
             let pName = "#p" + playerYou + "-box > span";
            $(pName).text(" (You!)")
          }
        }
      }
    })
  })




  function setPlayers(int){
    let pName = ""
    console.log("usercount: " + userCount)
    console.log("user number: " + int);
    if(userCount == 1){
      if(int % 2 == 0){
        playerYou = 2
        console.log("you are p2")
      }
      else{
        playerYou = 1
        console.log("you are p1")
      }
      pName = "#p" + playerYou + "-box > span";
      $(pName).text(" (You!)")
    }
    if(userCount == 2){
      console.log("anotehr player joined!")
      $("#modal-screen-wait").css("display", "none");
      $(".p-name").css("display", "initial");
      singlePlayer = false;

      playerJoin = JSON.stringify({'me': "true"})
      if (connection.readyState == 1) {
        connection.send(playerJoin)
        console.log(playerJoin)
      }


    }
  }

  function sendGameOverJSON(player, isForfeit) {
    //moveJSON = JSON.stringify({'player': this.piecePlayer, 'id': this.id, 'position': originalPos, 'box': boxObjpos, 'zeat': eatPieceID })
    gameOverJSON = JSON.stringify({'winner': player, 'gameOver': 'gameOver', 'forfeit': isForfeit})
    if (connection.readyState == 1) {
      connection.send(gameOverJSON)
      console.log(gameOverJSON)
    }
  }

  function sendRestartJSON(isRequest) {
    //moveJSON = JSON.stringify({'player': this.piecePlayer, 'id': this.id, 'position': originalPos, 'box': boxObjpos, 'zeat': eatPieceID })
    restartJSON = JSON.stringify({'restarter': playerYou, 'restartRequest': isRequest})
    if (connection.readyState == 1) {
      connection.send(restartJSON)
      console.log(restartJSON)
    }
  }


  /// ////////////////////////////////////////////////////

  // the vmin indices translate directly to the pieceObj and boxObj pos variable
  var posToCss = ['0vmin', '10vmin', '20vmin', '30vmin', '40vmin', '50vmin', '60vmin', '70vmin', '80vmin', '90vmin']
  // right now, only this configuration is supported because visuals are hardcoded in html
  // if we want any other specified board config, we're gonna have to generate the html in the board.init method
  // but it's ok, because that's not in the scope of this project.

  // 0 represents empty square
  // -1 represents unreachable square
  // 1 is Player1
  // 2 is Player2
  var boardConfig = [[-1, 1, -1, 1, -1, 1, -1, 1],
    [1, -1, 1, -1, 1, -1, 1, -1],
    [-1, 1, -1, 1, -1, 1, -1, 1],
    [0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0],
    [2, -1, 2, -1, 2, -1, 2, -1],
    [-1, 2, -1, 2, -1, 2, -1, 2],
    [2, -1, 2, -1, 2, -1, 2, -1]]
  // int. if yoy create the game, youre 1. if you join, youre 2. Depending on who you are, you cannot touch another anotehr person's move till you receive the moveJSON from the server.



  function Board (boardConfig) {
    this.board = boardConfig
    this.p1Score = 0
    this.p2Score = 0
    this.boxes = [],
    this.pieces = [],
    this.playerTurn = 1 // player one, the creator of the game room
    // we need a game id here

    this.init = function () {
      let boxCount = 0
      let pieceCount = 0
      for (row in this.board) {
        for (column in this.board[row]) {
          if (row % 2 == 1) { // odd row
            if (column % 2 == 0) { // we're not saving the id as a string, we're saving as a jquery object
              // even column
              this.boxes[boxCount] = new Box('#box' + boxCount, [parseInt(row), parseInt(column)])
              boxCount++
            }
          } else { // even row
            if (column % 2 == 1) { // odd column
              this.boxes[boxCount] = new Box('#box' + boxCount, [parseInt(row), parseInt(column)])
              boxCount++
            }
          }
          if (this.board[row][column] == 1) { // now we assign pieces according to the startBoard setup, where player1 == 1 and player2 == 2
            this.pieces[pieceCount] = new Piece('#p' + pieceCount, [parseInt(row), parseInt(column)], 1)
            pieceCount++
          } else if (this.board[row][column] == 2) {
            this.pieces[pieceCount] = new Piece('#p' + pieceCount, [parseInt(row), parseInt(column)], 2)
            pieceCount++
          }
        }
      }
    },
    // todo: a rest method
    this.updateScore = function () {
      if (this.playerTurn == 1) {
        this.p1Score++
      } else if (this.playerTurn == 2) {
        this.p2Score++
      }
    }
    this.getBoxByPosition = function (row, column) {
      for (i = 0; i < this.boxes.length; i++) {
        if (this.boxes[i].pos[0] == row && this.boxes[i].pos[1] == column) {
          console.log('found the box: ' + this.boxes[i].id + ' at ' + this.boxes[i].pos)
          return this.boxes[i]
        }
      }
    },
    this.getBoxByIDString = function (IDString) { // get it from calling the dom $(this).attr("id")
      for (element in this.boxes) {
        if (this.boxes[element].id == '#' + IDString) {
          row = this.boxes[element].pos[0]
          column = this.boxes[element].pos[1]
          return this.boxes[element]
        }
      }
    },
    this.getPieceByPosition = function (row, column) {
      for (i = 0; i < this.pieces.length; i++) {
        if (this.pieces[i].pos[0] == row && this.pieces[i].pos[1] == column) {
          console.log('found the piece: ' + this.pieces[i].id + ' at ' + this.pieces[i].pos)
          return this.pieces[i]
        }
      }
    },
    this.getPieceByIDString = function (IDString) { // get it from calling the dom $(this).attr("id")
      for (element in this.pieces) {
        if (this.pieces[element].id == '#' + IDString) {
          row = this.pieces[element].pos[0]
          column = this.pieces[element].pos[1]
          return this.pieces[element]
        }
      }
    },
    this.getSqareType = function (row, column) {
      if (row in this.board && column in this.board) {
        let type = this.board[row][column]
        switch (type) {
          case 0:
            return 0
            break
          case -1:
            return -1
            break
          case 1:
            return 1
            break
          case 2:
            return 2
            break
          default:
            return null
        }
      }
      return null
    },
    // check if the location has an object
    this.isEmptyBox = function (row, column) {
      if (row in this.board && column in this.board) { // check if index exists
        if (this.board[row][column] == 0) {
          return true
        } else {
          return false
        }
      }
    },
    this.updateBoard = function (type, row, column) {
      if (row in this.board && column in this.board) {
        this.board[row][column] = type
      }
    },
    this.changePlayer = function (currentPlayer) {
      if (currentPlayer == 1) {
        this.playerTurn = 2
      } else if (currentPlayer == 2) {
        this.playerTurn = 1
      } else {
        alert('this is not supposed to happen')
      }
    },
    this.changeYou = function (you) {
      if (you == 1) {
        playerYou = 2
      } else if (you == 2) {
        playerYou = 1
      } else {
        alert('this is not supposed to happen')
      }
    },
    this.printBoard = function () {
      console.table(this.board)
    },
    this.resetBoard = function (boardConfig) {
      this.board = [[-1, 1, -1, 1, -1, 1, -1, 1],
        [1, -1, 1, -1, 1, -1, 1, -1],
        [-1, 1, -1, 1, -1, 1, -1, 1],
        [0, -1, 0, -1, 0, -1, 0, -1],
        [-1, 0, -1, 0, -1, 0, -1, 0],
        [2, -1, 2, -1, 2, -1, 2, -1],
        [-1, 2, -1, 2, -1, 2, -1, 2],
        [2, -1, 2, -1, 2, -1, 2, -1]] // something wrong with reading boardConfig param
      this.p1Score = 0
      this.p2Score = 0
      this.boxes = [],
      this.pieces = [],
      this.playerTurn = 1;
      this.init()
      $('#maingamescreen').html($('#maingamescreen').data('old-state'))
      setPlayers(playerYou) // still gives playerYou back
      // pName = "#p" + playerYou + "-box > span";
      // $(pName).text(" (You!)")
      // setPlayers()
      console.log('resetBoard')
      this.printBoard()
    },
    this.isGameOver = function () {
      if (this.p1Score == 12 || this.p2Score == 12) {
        // send json

        return true
      }
      return false
    }
  }

  function Box (id, pos) { // i suppose this is more of a struct since it likely won't have any methods
    this.id = id
    this.pos = pos
  }

  function Piece (id, pos, piecePlayer) {
    this.id = id
    this.pos = pos
    this.piecePlayer = piecePlayer
    this.isKing = false

    this.validateMoveOneRowCol = function (boxObj) {
      let newPos = boxObj.pos
      let moveOneRow = Math.abs(parseInt(this.pos[0]) - parseInt(newPos[0]))
      let moveOneColumn = Math.abs(parseInt(this.pos[1]) - parseInt(newPos[1]))

      if (moveOneRow == 1 && moveOneColumn == 1) {
        console.log('this one row col') // good
        return true
      } else {
        console.log('that was not one row col')
        return false
      }
    },

    this.validateMoveByPlayer = function (boxObj) {
      // p1 can only move down
      // p2 can only move up
      let newPos = boxObj.pos
      let moveOneRow = Math.abs(parseInt(this.pos[0]) - parseInt(newPos[0]))
      let moveOneColumn = Math.abs(parseInt(this.pos[1]) - parseInt(newPos[1]))

      if (this.isKing) {
        return true
      }// don't bother with the below stuff
      if (this.piecePlayer == 1) {
        if (this.pos[0] < newPos[0]) { // smaller means higher
          console.log('this is a valid move for p1') // good

          return true
        } else if (this.pos[0] > newPos[0]) {
          console.log('this is an invalid move for p1') // bad

          return false
        }
      } else if (this.piecePlayer == 2) {
        if (this.pos[0] < newPos[0]) { // smaller means higher
          console.log('this is an invalid move for p2') // bad

          return false
        } else if (this.pos[0] > newPos[0]) {
          console.log('this is a valid move for p2') // good

          return true
        }
      }
    },
    this.isBlocked = function () {
      // coming soon!
    }
    this.emptyBoxInRange = function (row, column, direction) {
      // we'll make these enums later
      // remember we have to repeat this and piece search until we are out of bounds
      // and additional step in the enemy direction

      let rowUp = row - parseInt(1)
      let rowDown = row + parseInt(1)
      let columnLeft = column - parseInt(1)
      let columnRight = column + parseInt(1)
      let targetBox = [] // it's not like  the enemies array, because you only have one target per enemuy
      // meaing we don't push, we only have one positio value [row, col]

      switch (direction) {
        case 'topR':
          console.log('r: ' + rowUp + 'c: ' + columnRight)
          if (Board.isEmptyBox(rowUp, columnRight)) {
            console.log('empty beyond the enemy topR')
            return targetBox = [rowUp, columnRight]
          }
          break
        case 'botR':
          console.log('r: ' + rowDown + 'c: ' + columnRight)
          if (Board.isEmptyBox(rowDown, columnRight)) {
            console.log('empty beyond the enemy botR')
            return targetBox = [rowDown, columnRight]
          }
          break
        case 'botL':
          console.log('r: ' + rowDown + 'c: ' + columnLeft)
          if (Board.isEmptyBox(rowDown, columnLeft)) {
            console.log('empty beyond the enemy botL')
            return targetBox = [rowDown, columnLeft]
          }
          break
        case 'topL':
          console.log('r: ' + rowUp + 'c: ' + columnLeft)
          if (Board.isEmptyBox(rowUp, columnLeft)) {
            console.log('empty beyond the enemy topL')
            return targetBox = [rowUp, columnLeft]
          }
        default:
          return targetBox // empty targets a.k.a false alarm. no eatable enemies
      }
    },

    this.enemiesDirtyWork = function (rowLookup, columnLookup, dir, enemyPlayer) {
      let enemy = []

      if (Board.getSqareType(rowLookup, columnLookup) == enemyPlayer) {
        targetBoxCoords = this.emptyBoxInRange(rowLookup, columnLookup, dir)
        if (!(typeof targetBoxCoords === 'undefined' || targetBoxCoords == null)) { // here, box = [row, col]
          enemy = [Board.getPieceByPosition(rowLookup, columnLookup),
            Board.getBoxByPosition(targetBoxCoords[0], targetBoxCoords[1])] // format: ememies = [pieceObj, boxObj]
        }
      }
      return enemy
    },

    this.enemiesInRange = function (row, column) {
      // stil needs the force jump loop

      // top-right (p2) -1, +1
      // top-left (p2) -1, -1
      // bottom-right (p1) +1, +1
      // bottom-left (p1) +1, -1

      let enemies = [] // we will always have either 0, 1 or 2 enemies in range.

      let thisRow = parseInt(this.pos[0])
      let thisColumn = parseInt(this.pos[1])

      let thisRowUp = thisRow - parseInt(1)
      let thisRowDown = thisRow + parseInt(1)
      let thisColumnLeft = thisColumn - parseInt(1)
      let thisColumnRight = thisColumn + parseInt(1)

      let targetBoxCoords = []

      // below are 2 ifs each for 2  players, meaning you will only ever be able to have 2 eat choices
      if (this.piecePlayer == 1) {
        enemies.push(this.enemiesDirtyWork(thisRowDown, thisColumnRight, 'botR', 2))
        enemies.push(this.enemiesDirtyWork(thisRowDown, thisColumnLeft, 'botL', 2))
        if (this.isKing == true) {
          enemies.push(this.enemiesDirtyWork(thisRowUp, thisColumnRight, 'topR', 2))
          enemies.push(this.enemiesDirtyWork(thisRowUp, thisColumnLeft, 'topL', 2))
        }
      }
      if (this.piecePlayer == 2) {
        if (this.isKing == true) {
          enemies.push(this.enemiesDirtyWork(thisRowDown, thisColumnRight, 'botR', 1))
          enemies.push(this.enemiesDirtyWork(thisRowDown, thisColumnLeft, 'botL', 1))
        }
        enemies.push(this.enemiesDirtyWork(thisRowUp, thisColumnRight, 'topR', 1))
        enemies.push(this.enemiesDirtyWork(thisRowUp, thisColumnLeft, 'topL', 1))
      }
      return enemies
    },
    this.movePiece = function (boxObjpos, eatPiece) {
      console.log("move piece called")
      newPos = boxObjpos
      let moveJSON = null
      let originalPos = this.pos
      let eatPieceID = eatPiece === null ? null : eatPiece.id;

      if (Board.isEmptyBox(newPos[0], newPos[1]) && !Board.isGameOver()) {
        Board.updateBoard(0, this.pos[0], this.pos[1])
        this.pos = newPos // this is extremely important. update the position only after marking the orig pos with 0
        Board.updateBoard(Board.playerTurn, newPos[0], newPos[1])
        $(id).css('top', posToCss[newPos[0]])
        $(id).css('left', posToCss[newPos[1]])
        $(id).removeClass('highlight')

        if (this.isKing == false) {
          if (this.pos[0] == 0 || this.pos[0] == 7) {
            this.kingSelf()
          }
        }
        if(!(typeof eatPiece == "undefined" || eatPiece === null)){
          $('.info-text').text('Player ' + Board.playerTurn + ' captures!')
          Board.updateScore()
          eatPiece.removeSelf();
        }
        Board.changePlayer(Board.playerTurn)
        // Board.changeYou(playerYou); //TESTING PURPOSES ONLY
        Board.printBoard()
      } else {
        console.log("move piece failed")
        return false
      }


      moveJSON = JSON.stringify({'player': this.piecePlayer, 'id': this.id, 'position': originalPos, 'box': boxObjpos, 'zeat': eatPieceID })
      if (connection.readyState == 1) {
        connection.send(moveJSON)
        console.log(moveJSON)
      }
      console.log("move piece sucess")
      updateGameScreen()
      $('.info-text').text('Player ' + Board.playerTurn + ' to move.')
      return true
    },
    this.kingSelf = function () {
      this.isKing = true
      $(id).addClass('king')
    },

    this.removeSelf = function () {
      $(id).css('display', 'none')
      Board.updateBoard(0, this.pos[0], this.pos[1])
      this.pos = []
    }
  }

  /// // I suppose this is the main() ///////
  // initialize the board;

  var Board = new Board(boardConfig)
  Board.init()
  console.log("PLAYER'S turn: " + Board.playerTurn)
  updateGameScreen()
  $('#maingamescreen').data('old-state', $('#maingamescreen').html()) // store the old html config for reset

  function updateGameScreen () {
    winner = Board.playerTurn == 1 ? 2 : 1

    if (Board.isGameOver()) {
      console.log("the modal text should change")
      // console.log('Player ' + winner + ' wins!')
      $('#f-winner').text('Player ' + winner + ' wins!')
      $('#modal-screen').css('display', 'flex')
      sendGameOverJSON(winner, false)
    }
    console.log('is it game over?' + Board.isGameOver())

    if (Board.playerTurn == 1) {
      $('#p1-box').addClass('playing')
      $('#p2-box').removeClass('playing')
    } else if (Board.playerTurn == 2) {
      $('#p2-box').addClass('playing')
      $('#p1-box').removeClass('playing')
    }

    for (let i = 0; i < Board.p1Score; i++) {
      console.log('p1 loop : ' + parseInt(i + 1))
      $('#p1-box > div > span:nth-child(' + parseInt(i + 1) + ')').addClass('dead')
    }

    for (let i = 0; i < Board.p2Score; i++) {
      console.log('p2 loop : ' + parseInt(i + 1))
      $('#p2-box > div > span:nth-child(' + parseInt(i + 1) + ')').addClass('dead')
    }
  }

  $(document).on('click', '.piece', function () {
    let pieceIDString = null
    let pieceObj = null
    let enemiesAround = []
    let isPlayerTurn = ($(this).parent().attr('class') == 'player' + Board.playerTurn) // single player

    if ((isPlayerTurn == true && playerYou == Board.playerTurn) || (singlePlayer == true && isPlayerTurn == true)) {
   //if (isPlayerTurn == true) {
      // if(isPlayerTurn == true && playerYou == Board.playerTurn){
      $(this).toggleClass('highlight')
      $(this).siblings().removeClass('highlight')

      // below is a repeat from box onclick func. see if you can make a function for it
      // we may need this in the future to force a jump
      // other than that it merely outputs to console
      pieceIDString = $('.piece').filter(document.getElementsByClassName('highlight')).attr('id')
      for (element in Board.pieces) {
        if (Board.pieces[element].id == '#' + pieceIDString) {
          pieceObj = Board.pieces[element]
        }
      }
      if (pieceObj) { // if not null
        enemiesAround = pieceObj.enemiesInRange().slice()
        if (!(enemiesAround == undefined || enemiesAround.length == 0)) {
          console.log('YOU CAN KILL HIM HERE')
          // at this point, the piece does not obey the row1 col1 rule. now it obeys the row2 col2 rule
          // but the piece MUST land at the returned empty box
        }
      }
    } else {
      $('.info-text').text("It's Player " + Board.playerTurn + "'s turn!")
    }
  })

  $(document).on('click', '.box', function () {
    let pieceIDString = null
    let boxIDString = null
    let pieceObj = null
    let boxObj = null
    let enemiesAround = []
    let boxesAround = []

    $(this).toggleClass('highlight')
    $(this).siblings().removeClass('highlight')

    // only allow clicking on a box if a piece has been selected.
    pieceIDString = $('.piece').filter(document.getElementsByClassName('highlight')).attr('id')
    if (typeof pieceIDString === 'undefined') {
      console.log('you gotta click on a piece first to move it here')
    } else {
      boxIDString = $(this).attr('id')
      boxObj = Board.getBoxByIDString(boxIDString)

      for (element in Board.pieces) {
        if (Board.pieces[element].id == '#' + pieceIDString) {
          pieceObj = Board.pieces[element]
        }
      }
      if (pieceObj) { // if not null
        enemiesAround = pieceObj.enemiesInRange().slice()
        if (!(enemiesAround == undefined || enemiesAround.length == 0)) {
          console.log('YOU COULD HAVE KILLED HIM THERE') // future TODO we want to restrict any other move if you can kill em
          // this is not the place to do it. you gotta scan the the entire board to see if any jumps are possible from the current player

          // enemiesAround format: [[pieceObj, boxObj], [pieceObj, boxObj]]
          for (i = 0; i < enemiesAround.length; i++) {
            if (!(enemiesAround[i][1] == undefined) && '#' + boxIDString == enemiesAround[i][1].id) {
              pieceObj.movePiece(enemiesAround[i][1].pos, enemiesAround[i][0])
            }
          }
        }
      }
      if (pieceObj.validateMoveByPlayer(boxObj) && pieceObj.validateMoveOneRowCol(boxObj)) {
        console.log("undefined this is not eating")
        pieceObj.movePiece(boxObj.pos, null)

        // updateGameScreen()
        // $('.info-text').text('Player ' + Board.playerTurn + ' to move.')
      }
    }
  })
})
