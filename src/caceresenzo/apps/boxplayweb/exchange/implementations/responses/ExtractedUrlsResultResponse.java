package caceresenzo.apps.boxplayweb.exchange.implementations.responses;

import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.apps.boxplayweb.searchandgo.tasks.implementations.ExtractUrlsSearchAndGoTask;
import caceresenzo.libs.boxplay.common.extractor.ContentExtractionManager;
import caceresenzo.libs.boxplay.common.extractor.ContentExtractionManager.ExtractorType;
import caceresenzo.libs.boxplay.common.extractor.ContentExtractor;
import caceresenzo.libs.json.JsonArray;
import caceresenzo.libs.json.JsonAware;
import caceresenzo.libs.json.JsonObject;

public class ExtractedUrlsResultResponse extends AbstractResponse {
	
	/* Json Key */
	public static final String JSON_KEY_EXTRACTED_FROM_KIND = "extracted_from_kind";
	public static final String JSON_KEY_URLS = "urls";
	public static final String JSON_KEY_URL_EXTRACTOR = "extractor";
	public static final String JSON_KEY_URL_URL = "url";
	public static final String JSON_KEY_URL_EXTRACTOR_CLASS = "class";
	public static final String JSON_KEY_URL_EXTRACTOR_CLIENT_SENSIBILITY = "client_sensibility";
	
	/* Constants */
	public static final String NAME = "extracted_urls";
	
	/* Variables */
	private final ExtractUrlsSearchAndGoTask task;
	private final ExtractorType extractorType;
	private final String[] urls;
	
	/* Constructor */
	public ExtractedUrlsResultResponse(ExtractUrlsSearchAndGoTask task, ExtractorType extractorType, String[] urls) {
		super(NAME);
		
		this.task = task;
		this.extractorType = extractorType;
		this.urls = urls;
	}
	
	@Override
	public JsonAware forge() {
		JsonObject jsonObject = new JsonObject();
		JsonArray urlsJsonArray = new JsonArray();
		
		for (String url : urls) {
			JsonObject urlJsonObject = new JsonObject();
			JsonObject extractorJsonObject = null;
			
			ContentExtractor contentExtractor = ContentExtractionManager.getExtractorFromBaseUrl(extractorType, url);
			
			if (contentExtractor != null) {
				extractorJsonObject = new JsonObject();
				extractorJsonObject.put(JSON_KEY_URL_EXTRACTOR_CLASS, contentExtractor.getClass().getSimpleName());
				extractorJsonObject.put(JSON_KEY_URL_EXTRACTOR_CLIENT_SENSIBILITY, contentExtractor.getClientSensitivity());
			}
			
			urlJsonObject.put(JSON_KEY_URL_URL, url);
			urlJsonObject.put(JSON_KEY_URL_EXTRACTOR, extractorJsonObject);
			
			urlsJsonArray.add(urlJsonObject);
		}
		
		jsonObject.put(JSON_KEY_EXTRACTED_FROM_KIND, task.getDataObject().getKind());
		jsonObject.put(JSON_KEY_URLS, urlsJsonArray);
		
		return jsonObject;
	}
	
}