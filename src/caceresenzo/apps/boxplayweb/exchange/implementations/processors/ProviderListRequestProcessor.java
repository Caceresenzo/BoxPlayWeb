package caceresenzo.apps.boxplayweb.exchange.implementations.processors;

import org.java_websocket.WebSocket;

import caceresenzo.apps.boxplayweb.client.Client;
import caceresenzo.apps.boxplayweb.exchange.AbstractRequestProcessor;
import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.ProviderListResponse;
import caceresenzo.libs.json.JsonAware;

public class ProviderListRequestProcessor extends AbstractRequestProcessor {
	
	/* Constants */
	public static final String NAME = ProviderListResponse.NAME;
	
	/* Constructor */
	public ProviderListRequestProcessor() {
		super(NAME);
	}

	@Override
	public AbstractResponse process(WebSocket socket, Client client, JsonAware jsonAware) {
		return new ProviderListResponse();
	}
	
}