package caceresenzo.apps.boxplayweb.exchange.implementations.processors;

import org.java_websocket.WebSocket;

import caceresenzo.apps.boxplayweb.client.Client;
import caceresenzo.apps.boxplayweb.exchange.AbstractRequestProcessor;
import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.EmptyResponse;
import caceresenzo.apps.boxplayweb.searchandgo.SearchAndGoTaskExecutor;
import caceresenzo.apps.boxplayweb.searchandgo.tasks.implementations.ClearCacheSearchAndGoTask;
import caceresenzo.libs.json.JsonAware;

public class ClearCacheRequestProcessor extends AbstractRequestProcessor {
	
	/* Constants */
	public static final String NAME = "clear_cache";
	
	/* Constructor */
	public ClearCacheRequestProcessor() {
		super(NAME);
	}
	
	@Override
	public AbstractResponse process(WebSocket socket, Client client, JsonAware jsonAware) {
		SearchAndGoTaskExecutor.get().execute(new ClearCacheSearchAndGoTask(client));
		
		return new EmptyResponse();
	}
	
}