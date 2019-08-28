package caceresenzo.apps.boxplayweb.exchange.implementations.processors;

import org.java_websocket.WebSocket;

import caceresenzo.apps.boxplayweb.client.Client;
import caceresenzo.apps.boxplayweb.exchange.AbstractRequestProcessor;
import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.HandshakeResponse;
import caceresenzo.libs.json.JsonAware;

public class HandshakeRequestProcessor extends AbstractRequestProcessor {
	
	/* Constants */
	public static final String NAME = HandshakeResponse.NAME;
	
	/* Constructor */
	public HandshakeRequestProcessor() {
		super(NAME);
	}

	@Override
	public AbstractResponse process(WebSocket socket, Client client, JsonAware jsonAware) {
		HandshakeResponse handshakeResponse = new HandshakeResponse();
		
		Client newClient = clientManager.registerClient(handshakeResponse.getGeneratedToken());
		newClient.getConnections().add(socket);
		
		return handshakeResponse;
	}
	
	@Override
	public boolean isAcceptingRequestWithoutToken() {
		return true;
	}
	
}