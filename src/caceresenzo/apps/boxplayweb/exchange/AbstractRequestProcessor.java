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
	
	public abstract AbstractResponse process(WebSocket socket, Client client, JsonAware jsonAware);
	
	public boolean isAcceptingRequestWithoutToken() {
		return false;
	}
	
	/** @return Request's name to process. */
	public String getName() {
		return name;
	}
	
}