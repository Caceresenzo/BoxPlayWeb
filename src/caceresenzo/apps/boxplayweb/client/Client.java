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
	
	/**
	 * Send a {@link AbstractResponse response} to the {@link Client client} via the first, still active, {@link WebSocket} connection found.<br>
	 * If the {@link Client} is no longer connected, nothing will append.
	 * 
	 * @param response
	 *            {@link AbstractResponse Response} to send.
	 * @see #isStillConnected() Check if the client is still connected.
	 * @see #getFirstOpenConnection() Get the first, still active, WebSocket connection.
	 */
	public void send(AbstractResponse response) {
		if (!isStillConnected()) {
			return;
		}
		
		RequestProcessor.get().sendToSocket(getFirstOpenConnection(), response);
	}
	
	/** @return The first {@link WebSocket} that still open and not closed in the registered connections list. */
	public WebSocket getFirstOpenConnection() {
		for (WebSocket socket : connections) {
			if (socket.isOpen() && !socket.isClosed()) {
				return socket;
			}
		}
		
		return null;
	}
	
	/** @return Tell weather or not at least one of the client registered connection is still open. */
	public boolean isStillConnected() {
		if (connections.isEmpty()) {
			return false;
		}
		
		return getFirstOpenConnection() != null;
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