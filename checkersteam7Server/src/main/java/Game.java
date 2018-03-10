import java.util.ArrayList;
import java.util.List;

public class Game {

    public int[][] boxes;
    public Player player1;
    public Player player2;
    public Integer playercount;
    public String gameName;
    public ArrayList<Player> players = new ArrayList ( );

    public void newGame(){

        this.boxes =
                new int[][]{
                        {-1, 1, -1, 1, -1, 1, -1, 1},
                        {1, -1, 1, -1, 1, -1, 1, -1},
                        {-1, 1, -1, 1, -1, 1, -1, 1},
                        {0, -1, 0, -1, 0, -1, 0, -1},
                        {-1, 0, -1, 0, -1, 0, -1, 0},
                        {2, -1, 2, -1, 2, -1, 2, -1},
                        {-1, 2, -1, 2, -1, 2, -1, 2},
                        {2, -1, 2, -1, 2, -1, 2, -1}
                };
    }

    public void resetGame(){

        this.boxes =
                new int[][]{
                        {-1, 1, -1, 1, -1, 1, -1, 1},
                        {1, -1, 1, -1, 1, -1, 1, -1},
                        {-1, 1, -1, 1, -1, 1, -1, 1},
                        {0, -1, 0, -1, 0, -1, 0, -1},
                        {-1, 0, -1, 0, -1, 0, -1, 0},
                        {2, -1, 2, -1, 2, -1, 2, -1},
                        {-1, 2, -1, 2, -1, 2, -1, 2},
                        {2, -1, 2, -1, 2, -1, 2, -1}
                };

    }

    public void movePiece(Player player, int fromrow, int fromcolumn, int torow, int tocolumn){
        if (isValid (player, fromrow, fromcolumn, torow, tocolumn )) {
            this.boxes[fromrow][fromcolumn] = player.playerID;
        }

    }

    public void joinGame(Player p) {

        switch (players.size ()) {
            case 0:
                this.player1 = p;
                this.players.add ( p );
                p.playerID=1;
                break;

            case 1:
                this.player2 = p;
                this.players.add ( p );
                p.playerID=2;
                break;

            default:
                System.out.println ( "Max two players allowed");;
        }
    }

    public List getPlayers (){

        List<String> names = new ArrayList<String>();
        for (Player p : players){
            names.add ( p.name );
        }

        return names;
    }

    private boolean isValid (Player player, int fromrow, int fromcolumn, int torow, int tocolumn) {
        // TODO: 2/27/18 check moves according to rules
        return true;
    }


}
