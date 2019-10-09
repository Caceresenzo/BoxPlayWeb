package caceresenzo.apps.boxplayweb.exchange.implementations.processors;

import org.java_websocket.WebSocket;

import caceresenzo.apps.boxplayweb.client.Client;
import caceresenzo.apps.boxplayweb.exchange.AbstractRequestProcessor;
import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.TaskEnqueuedResponse;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.errors.FailedRequestErrorResponse;
import caceresenzo.apps.boxplayweb.searchandgo.SearchAndGoTaskExecutor;
import caceresenzo.apps.boxplayweb.searchandgo.tasks.implementations.ExtractVideoDirectUrlSearchAndGoTask;
import caceresenzo.libs.json.JsonAware;
import caceresenzo.libs.json.JsonObject;

public class ExtractVideoDirectUrlRequestProcessor extends AbstractRequestProcessor {
	
	/* Json Key */
	public static final String JSON_KEY_URL = "url";
	
	/* Constants */
	public static final String NAME = "extract_video_direct_url";
	
	/* Constructor */
	public ExtractVideoDirectUrlRequestProcessor() {
		super(NAME);
	}
	
	@Override
	public AbstractResponse process(WebSocket socket, Client client, JsonAware jsonAware) {
		String url;
		
		try {
			JsonObject jsonObject = (JsonObject) jsonAware;
			
			url = (String) jsonObject.get(JSON_KEY_URL);
		} catch (Exception exception) {
			return new FailedRequestErrorResponse(exception.getMessage());
		}
		
		SearchAndGoTaskExecutor.get().execute(new ExtractVideoDirectUrlSearchAndGoTask(client, url));
		
		return new TaskEnqueuedResponse();
	}
	
}