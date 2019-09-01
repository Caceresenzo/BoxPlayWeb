package caceresenzo.apps.boxplayweb.exchange.implementations.responses;

import java.util.List;

import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.apps.boxplayweb.searchandgo.tasks.implementations.GetAdditionalDataSearchAndGoTask;
import caceresenzo.libs.boxplay.culture.searchngo.data.AdditionalResultData;
import caceresenzo.libs.boxplay.culture.searchngo.result.SearchAndGoResult;
import caceresenzo.libs.boxplay.mylist.binder.ListItemBinder;
import caceresenzo.libs.json.JsonAware;
import caceresenzo.libs.json.JsonObject;

public class FetchAdditionalDataResponse extends AbstractResponse {
	
	/* Json Key */
	public static final String JSON_KEY_ORIGINAL = "original";
	public static final String JSON_KEY_INFORMATIONS = "informations";
	public static final String JSON_KEY_CONTENT = "content";
	
	/* Constants */
	public static final String NAME = "additional_data";
	public static final ListItemBinder<?, SearchAndGoResult> BINDER = SearchResultResponse.BINDER;
	
	/* Variables */
	private final GetAdditionalDataSearchAndGoTask task;
	private final List<AdditionalResultData> moreData, content;
	
	/* Constructor */
	public FetchAdditionalDataResponse(GetAdditionalDataSearchAndGoTask task, List<AdditionalResultData> moreData, List<AdditionalResultData> content) {
		super(NAME);
		
		this.task = task;
		this.moreData = moreData;
		this.content = content;
	}
	
	@Override
	public JsonAware forge() {
		JsonObject jsonObject = new JsonObject();
		
		jsonObject.put(JSON_KEY_ORIGINAL, (JsonAware) () -> BINDER.convertItemToString(task.getSearchAndGoResult()));
		jsonObject.put(JSON_KEY_INFORMATIONS, moreData);
		jsonObject.put(JSON_KEY_CONTENT, content);
		
		return jsonObject;
	}
	
}
