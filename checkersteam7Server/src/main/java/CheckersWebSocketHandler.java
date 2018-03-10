import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.json.JSONObject;

import java.io.InputStreamReader;

@WebSocket
public class CheckersWebSocketHandler {

    private String sender, msg;

    @OnWebSocketConnect
    public void onConnect(Session user) throws Exception {
        String username = "User" + Checkers.nextUserNumber++;
        Checkers.userUsernameMap.put(user, username);
        System.out.println ("player added to socket" );
        Checkers.broadcastGames ();
    }

    @OnWebSocketClose
    public void onClose(Session user, int statusCode, String reason) {
        String username = Checkers.userUsernameMap.get(user);
        Checkers.userUsernameMap.remove(user);
        Checkers.broadcastGames();
    }

    @OnWebSocketMessage
    public void onMessage(Session user, String message) {
        System.out.println (message );
        Checkers.broadcastMove ( message );
        Checkers.broadcastGames();
        System.out.println ("message sent" );
    }

}
