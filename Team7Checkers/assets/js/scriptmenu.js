window.onload = function() {

    $(document).on("click", "#cancel-join",function(){
        $("#mainmenuscreen > #modal-screen").css("display", "none")
    })
    $(document).on("click", "#join", function(){

        $("#mainmenuscreen > #modal-screen").css("display", "flex")
        console.log("hello")
    })

    
}