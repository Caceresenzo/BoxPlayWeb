package caceresenzo.apps.boxplayweb.exchange.implementations.responses;

import java.util.Collections;

import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.apps.boxplayweb.searchandgo.tasks.implementations.ExtractUrlsSearchAndGoTask;
import caceresenzo.libs.json.JsonArray;
import caceresenzo.libs.json.JsonAware;
import caceresenzo.libs.json.JsonObject;

public class ExtractedUrlsResultResponse extends AbstractResponse {
	
	/* Json Key */
	public static final String JSON_KEY_EXTRACTED_FROM_KIND = "extracted_from_kind";
	public static final String JSON_KEY_URLS = "urls";
	
	/* Constants */
	public static final String NAME = "extracted_urls";
	
	/* Variables */
	private final ExtractUrlsSearchAndGoTask task;
	private final String[] urls;
	
	/* Constructor */
	public ExtractedUrlsResultResponse(ExtractUrlsSearchAndGoTask task, String[] urls) {
		super(NAME);
		
		this.task = task;
		this.urls = urls;
	}
	
	@Override
	public JsonAware forge() {
		JsonObject jsonObject = new JsonObject();
		JsonArray urlsJsonArray = new JsonArray();
		
		Collections.addAll(urlsJsonArray, urls);

		jsonObject.put(JSON_KEY_EXTRACTED_FROM_KIND, task.getDataObject().getKind());
		jsonObject.put(JSON_KEY_URLS, urlsJsonArray);
		
		return jsonObject;
	}
	
}