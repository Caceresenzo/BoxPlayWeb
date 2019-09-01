package caceresenzo.apps.boxplayweb.exchange.implementations.processors;

import java.util.ArrayList;
import java.util.List;

import org.java_websocket.WebSocket;

import caceresenzo.apps.boxplayweb.client.Client;
import caceresenzo.apps.boxplayweb.exchange.AbstractRequestProcessor;
import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.TaskEnqueuedResponse;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.errors.FailedRequestErrorResponse;
import caceresenzo.apps.boxplayweb.searchandgo.SearchAndGoTaskExecutor;
import caceresenzo.apps.boxplayweb.searchandgo.tasks.implementations.SearchSearchAndGoTask;
import caceresenzo.libs.boxplay.culture.searchngo.providers.ProviderManager;
import caceresenzo.libs.boxplay.culture.searchngo.providers.SearchAndGoProvider;
import caceresenzo.libs.json.JsonAware;
import caceresenzo.libs.json.JsonObject;

public class SearchRequestProcessor extends AbstractRequestProcessor {
	
	/* Json Key */
	public static final String JSON_KEY_QUERY = "query";
	public static final String JSON_KEY_PROVIDERS = "providers";
	
	/* Constants */
	public static final String NAME = "search";
	
	/* Constructor */
	public SearchRequestProcessor() {
		super(NAME);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public AbstractResponse process(WebSocket socket, Client client, JsonAware jsonAware) {
		String query;
		List<SearchAndGoProvider> providers = new ArrayList<>();
		
		try {
			JsonObject jsonObject = (JsonObject) jsonAware;
			
			query = (String) jsonObject.get(JSON_KEY_QUERY);
			List<String> rawProviders = (List<String>) jsonObject.get(JSON_KEY_PROVIDERS);
			
			for (String rawProvider : rawProviders) {
				ProviderManager provider = ProviderManager.fromString(rawProvider);
				
				if (provider != null) {
					providers.add(provider.create());
				}
			}
		} catch (Exception exception) {
			return new FailedRequestErrorResponse(exception.getMessage());
		}
		
		SearchAndGoTaskExecutor.get().execute(new SearchSearchAndGoTask(client, query, providers));
		
		return new TaskEnqueuedResponse();
	}
	
}