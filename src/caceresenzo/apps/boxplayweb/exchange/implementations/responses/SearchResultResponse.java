package caceresenzo.apps.boxplayweb.exchange.implementations.responses;

import java.util.Map;
import java.util.Map.Entry;

import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.apps.boxplayweb.searchandgo.tasks.implementations.SearchSearchAndGoTask;
import caceresenzo.libs.boxplay.culture.searchngo.result.SearchAndGoResult;
import caceresenzo.libs.boxplay.mylist.binder.ListItemBinder;
import caceresenzo.libs.boxplay.mylist.binder.ListItemBinderManager;
import caceresenzo.libs.json.JsonArray;
import caceresenzo.libs.json.JsonAware;
import caceresenzo.libs.json.JsonObject;

public class SearchResultResponse extends AbstractResponse {
	
	/* Json Key */
	public static final String JSON_KEY_QUERY = "query";
	public static final String JSON_KEY_RESULTS = "results";
	public static final String JSON_KEY_ITEM_KEY = "unique";
	public static final String JSON_KEY_ITEM_SCORE = "score";
	public static final String JSON_KEY_ITEM_OBJECT = "object";
	
	/* Constants */
	public static final String NAME = "search_result";
	public static final ListItemBinder<?, SearchAndGoResult> BINDER;
	
	static {
		BINDER = ListItemBinderManager.getCorrespondingBinder(SearchAndGoResult.class);
	}
	
	/* Variables */
	private final SearchSearchAndGoTask task;
	private final Map<String, SearchAndGoResult> workmap;
	
	/* Constructor */
	public SearchResultResponse(SearchSearchAndGoTask task, Map<String, SearchAndGoResult> workmap) {
		super(NAME);
		
		this.task = task;
		this.workmap = workmap;
	}
	
	@Override
	public JsonAware forge() {
		JsonObject jsonObject = new JsonObject();
		JsonArray resultsjsonArray = new JsonArray();
		
		jsonObject.put(JSON_KEY_QUERY, task.getQuery());
		jsonObject.put(JSON_KEY_RESULTS, resultsjsonArray);
		
		int count = 0;
		for (Entry<String, SearchAndGoResult> entry : workmap.entrySet()) {
			if (count++ >= 70) {
				break;
			}
			
			String uniqueKey = entry.getKey();
			SearchAndGoResult result = entry.getValue();
			
			JsonObject resultJsonObject = new JsonObject();
			
			resultJsonObject.put(JSON_KEY_ITEM_KEY, uniqueKey);
			resultJsonObject.put(JSON_KEY_ITEM_SCORE, result.score());
			resultJsonObject.put(JSON_KEY_ITEM_OBJECT, (JsonAware) () -> BINDER.convertItemToString(result));
			
			resultsjsonArray.add(resultJsonObject);
		}
		
		return jsonObject;
	}
	
}
