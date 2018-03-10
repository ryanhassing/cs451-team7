$( document ).ready(function() {

    $(document).on("click", "#forfeit",function(){
        $("#modal-screen").css("display", "flex")
        console.log("hey")
    })
    $(document).on("click", ".leave", function(){
        Board.resetBoard(boardConfig);
        $("#modal-screen").css("display", "none")
    })
    $(document).on("click", "#restart-game", function(){
        Board.resetBoard(boardConfig);
    })

    var yourName = "";
        // BELOW: perhaps it would be better if main menu js was seperate
        $(document).on("click", "#playtemp", function(){
            $("#mainmenuscreen > #modal-screen").css("display", "none")
           yourName = $("#fname").val();
           console.log("clicked playtemp: " + yourName);
           $.getScript("./script.js");
        })
       



    $("#fname, #fip").on('keyup', function() {
        console.log("sdsdsdsdsd")
        let val = 0
        if($("#fname").val().length== 0 || $('#fip').val().length == 0){
            $("#playtemp").prop("disabled", true);
        }
        else{
            $("#playtemp").prop("disabled", false);
        }
    
        
    });

    $(document).on("click", "#cancel-join",function(){
        $("#mainmenuscreen > #modal-screen").css("display", "none")
    })
    $(document).on("click", "#join", function(){

        $("#mainmenuscreen > #modal-screen").css("display", "flex")
        console.log("hello")
    })

});