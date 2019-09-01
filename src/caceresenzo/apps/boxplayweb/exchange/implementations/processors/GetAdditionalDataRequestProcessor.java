package caceresenzo.apps.boxplayweb.exchange.implementations.processors;

import org.java_websocket.WebSocket;

import caceresenzo.apps.boxplayweb.client.Client;
import caceresenzo.apps.boxplayweb.exchange.AbstractRequestProcessor;
import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.SearchResultResponse;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.TaskEnqueuedResponse;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.errors.FailedRequestErrorResponse;
import caceresenzo.apps.boxplayweb.searchandgo.SearchAndGoTaskExecutor;
import caceresenzo.apps.boxplayweb.searchandgo.tasks.implementations.GetAdditionalDataSearchAndGoTask;
import caceresenzo.libs.boxplay.culture.searchngo.result.SearchAndGoResult;
import caceresenzo.libs.boxplay.mylist.binder.ListItemBinder;
import caceresenzo.libs.json.JsonAware;
import caceresenzo.libs.json.JsonObject;

public class GetAdditionalDataRequestProcessor extends AbstractRequestProcessor {
	
	/* Json Key */
	public static final String JSON_KEY_OBJECT = "object";
	
	/* Constants */
	public static final String NAME = "get_additional";
	public static final ListItemBinder<?, SearchAndGoResult> BINDER = SearchResultResponse.BINDER;
	
	/* Constructor */
	public GetAdditionalDataRequestProcessor() {
		super(NAME);
	}
	
	@Override
	public AbstractResponse process(WebSocket socket, Client client, JsonAware jsonAware) {
		SearchAndGoResult searchAndGoResult;
		
		try {
			JsonObject jsonObject = (JsonObject) jsonAware;
			
			JsonObject objectJsonObject = (JsonObject) jsonObject.get(JSON_KEY_OBJECT);
			if (objectJsonObject == null) {
				return new FailedRequestErrorResponse("Field \"item\" is null or missing.");
			}
			String itemString = objectJsonObject.toJsonString();
			
			searchAndGoResult = BINDER.restoreItemFromString(itemString);
		} catch (Exception exception) {
			return new FailedRequestErrorResponse(exception.getMessage());
		}
		
		SearchAndGoTaskExecutor.get().execute(new GetAdditionalDataSearchAndGoTask(client, searchAndGoResult));
		
		return new TaskEnqueuedResponse();
	}
	
}