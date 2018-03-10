import java.util.HashMap;
import java.util.List;
import java.util.Set;

public class CheckersController {

    HashMap <String, Game> currentgames = new HashMap <String, Game> ( );


    public Set <String> getCurrentGameNames () {
        return currentgames.keySet ( );
    }

    public int[][] getGameBoard (String gameName) {
        return currentgames.get ( gameName ).boxes;
    }

    public List getPlayers (String gameName){
        return currentgames.get ( gameName ).getPlayers ();
    }

    public void restartGame (String gameName) {
        currentgames.get ( gameName ).resetGame ( );
        System.out.println ( "Game Restarted" );
    }

    public void startNewGame (String playerName, String gameName) {
        Game c = new Game ( );
        c.gameName = gameName;
        Player p = new Player ( playerName );
        c.joinGame ( p );
        System.out.println (playerName );
        currentgames.put ( c.gameName,c );
        System.out.println ( "New Game Created" );
        System.out.println ("players in game 1"+getPlayers ( gameName ) );

    }

    public void addPlayerToGame (String playerName, String gameName) {

        Player p = new Player ( playerName );

        System.out.println ("current games array"+currentgames.toString () );
        System.out.println ("game: "+ currentgames.get ( gameName ) );
        currentgames.get ( gameName ).joinGame ( p );
        System.out.println ( "Player added to game" );
        System.out.println ("players in game 2"+getPlayers ( gameName ) );

    }

    public void startGame(String gameName){
        currentgames.get ( gameName ).newGame ( );
        System.out.println ("game started" );
    }
}


