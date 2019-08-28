package caceresenzo.apps.boxplayweb.client;

import java.util.ArrayList;
import java.util.List;

import org.java_websocket.WebSocket;

import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.apps.boxplayweb.exchange.RequestProcessor;

public class Client {
	
	/* Variables */
	private final String token;
	private final List<WebSocket> connections;
	
	/* Constructor */
	public Client(String token) {
		this.token = token;
		this.connections = new ArrayList<>();
	}
	
	/** @return Tell weather or not at least one of the client registered connection is still open. */
	public boolean isStillConnected() {
		if (connections.isEmpty()) {
			return false;
		}
		
		return getFirstOpenConnection() != null;
	}
	
	public void send(AbstractResponse response) {
		if (!isStillConnected()) {
			return;
		}
		
		RequestProcessor.get().sendToSocket(getFirstOpenConnection(), response);
	}
	
	public WebSocket getFirstOpenConnection() {
		for (WebSocket socket : connections) {
			if (socket.isOpen() && !socket.isClosed()) {
				return socket;
			}
		}
		
		return null;
	}
	
	/** @return Client's token. */
	public String getToken() {
		return token;
	}
	
	/** @return Client's registered connections. */
	public List<WebSocket> getConnections() {
		return connections;
	}
	
}