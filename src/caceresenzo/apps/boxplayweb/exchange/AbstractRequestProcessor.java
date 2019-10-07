package caceresenzo.apps.boxplayweb.exchange;

import org.java_websocket.WebSocket;

import caceresenzo.apps.boxplayweb.client.Client;
import caceresenzo.apps.boxplayweb.client.ClientManager;
import caceresenzo.libs.json.JsonAware;

public abstract class AbstractRequestProcessor {
	
	/* Managers */
	protected ClientManager clientManager;
	
	/* Variables */
	private final String name;
	
	/* Constructor */
	public AbstractRequestProcessor(String name) {
		this.name = name;
		
		this.clientManager = ClientManager.get();
	}
	
	/**
	 * Process a {@link WebSocket}'s request.
	 * 
	 * @param socket
	 *            Author's {@link WebSocket socket} of the request.
	 * @param client
	 *            Target {@link Client client} found with the request provided's token.
	 * @param jsonAware
	 *            Content of the request.
	 * @return A {@link AbstractResponse response} to send back to the author of the request.
	 */
	public abstract AbstractResponse process(WebSocket socket, Client client, JsonAware jsonAware);
	
	/** @return Weather or not this request can accept request without a token, and so without a client. */
	public boolean isAcceptingRequestWithoutToken() {
		return false;
	}
	
	/** @return Request's name to process. */
	public String getName() {
		return name;
	}
	
}