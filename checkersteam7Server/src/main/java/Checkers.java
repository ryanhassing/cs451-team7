import java.io.ObjectOutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.eclipse.jetty.websocket.api.Session;
import org.json.JSONObject;

import static spark.Spark.*;

public class Checkers {
    static Boolean gameStatus = false;
    static Map <Session, String> userUsernameMap = new ConcurrentHashMap <> ( );
    static int nextUserNumber = 1; //Assign to username for next connecting user
    static CheckersController checkersController = new CheckersController ( );

    public static void main (String[] args) {
        staticFiles.location ( "/public" ); //index.html is served at localhost:4567 (default port)
        staticFiles.expireTime ( 1200 );

        //createIntialScene();

        webSocket ( "/socket", CheckersWebSocketHandler.class );

        get ( "/game/:userName", (request, response) -> {

            if (gameStatus) {
                String player2 = request.params ( "userName" );
                checkersController.addPlayerToGame ( player2, "Game1" );
                broadcastGames ( );
                return "Game present";

            } else {
                //create game and send info
                String player1 = request.params ( "userName" );
                checkersController.startNewGame ( player1, "Game1" );
                gameStatus = true;
                broadcastGames ( );
                return "Game started";
            }
        } );
    }

    public static void broadcastGames () {

        userUsernameMap.keySet ( ).stream ( ).filter ( Session::isOpen ).forEach ( session -> {
            try {

                session.getRemote ( ).sendString ( String.valueOf ( new JSONObject ( )
                        .put ( "games", checkersController.currentgames )
                ) );

            } catch (Exception e) {
                e.printStackTrace ( );
            }
        } );

    }

    public static void broadcastMove (String move) {

        userUsernameMap.keySet ( ).stream ( ).filter ( Session::isOpen ).forEach ( session -> {
            try {

                session.getRemote ( ).sendString ( String.valueOf ( new JSONObject ( )
                        .put ( "move", move )
                ) );

            } catch (Exception e) {
                e.printStackTrace ( );
            }
        } );

    }
}
