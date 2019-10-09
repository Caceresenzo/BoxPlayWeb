package caceresenzo.apps.boxplayweb.exchange.implementations.processors;

import java.util.List;

import org.java_websocket.WebSocket;

import caceresenzo.apps.boxplayweb.client.Client;
import caceresenzo.apps.boxplayweb.exchange.AbstractRequestProcessor;
import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.TaskEnqueuedResponse;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.errors.FailedRequestErrorResponse;
import caceresenzo.apps.boxplayweb.searchandgo.SearchAndGoTaskExecutor;
import caceresenzo.apps.boxplayweb.searchandgo.tasks.implementations.ExtractUrlsSearchAndGoTask;
import caceresenzo.libs.boxplay.culture.searchngo.content.image.IImageContentProvider;
import caceresenzo.libs.boxplay.culture.searchngo.content.video.IVideoContentProvider;
import caceresenzo.libs.boxplay.culture.searchngo.data.models.SimpleData;
import caceresenzo.libs.boxplay.culture.searchngo.data.models.SimpleUrlData;
import caceresenzo.libs.boxplay.culture.searchngo.data.models.content.ChapterItemResultData;
import caceresenzo.libs.boxplay.culture.searchngo.data.models.content.ChapterItemResultData.ChapterType;
import caceresenzo.libs.boxplay.culture.searchngo.data.models.content.VideoItemResultData;
import caceresenzo.libs.boxplay.culture.searchngo.data.models.content.completed.CompletedVideoItemResultData;
import caceresenzo.libs.boxplay.culture.searchngo.providers.SearchAndGoProvider;
import caceresenzo.libs.boxplay.culture.searchngo.result.SearchAndGoResult;
import caceresenzo.libs.json.JsonAware;
import caceresenzo.libs.json.JsonObject;

public class ExtractUrlsRequestProcessor extends AbstractRequestProcessor {
	
	/* Json Key */
	public static final String JSON_KEY_SOURCE_RESULT = "source_result";
	public static final String JSON_KEY_DATA_OBJECT = "data_object";
	
	/* Constants */
	public static final String NAME = "extract_url";
	
	/* Constructor */
	public ExtractUrlsRequestProcessor() {
		super(NAME);
	}
	
	@Override
	public AbstractResponse process(WebSocket socket, Client client, JsonAware jsonAware) {
		SearchAndGoResult searchAndGoResult;
		SimpleUrlData dataObject;
		
		try {
			JsonObject jsonObject = (JsonObject) jsonAware;
			
			String rawSearchAndGoResult = ((JsonAware) jsonObject.get(JSON_KEY_SOURCE_RESULT)).toJsonString();
			searchAndGoResult = new SearchAndGoResult.ItemBinder().restoreItemFromString(rawSearchAndGoResult);
			
			dataObject = recreateObjectFromJson(searchAndGoResult, (JsonAware) jsonObject.get(JSON_KEY_DATA_OBJECT));
		} catch (Exception exception) {
			return new FailedRequestErrorResponse(exception.getMessage());
		}
		
		SearchAndGoTaskExecutor.get().execute(new ExtractUrlsSearchAndGoTask(client, searchAndGoResult, dataObject));
		
		return new TaskEnqueuedResponse();
	}
	
	/**
	 * Recreate a {@link SimpleUrlData} sub-implementation from provided JSON informations.
	 * 
	 * @param searchAndGoResult
	 *            Source result (but provided by the client, never trust it!).
	 * @param jsonAware
	 *            Original JSON item.
	 * @return A {@link SimpleUrlData} subclass instance.
	 * @throws IllegalStateException
	 *             If the kind is item's unknown.
	 * @throws IllegalStateException
	 *             If the video result subsclass is unknown.
	 */
	@SuppressWarnings("unchecked")
	private SimpleUrlData recreateObjectFromJson(SearchAndGoResult searchAndGoResult, JsonAware jsonAware) {
		SearchAndGoProvider searchAndGoProvider = searchAndGoResult.getParentProvider();
		JsonObject jsonObject = (JsonObject) jsonAware;
		
		String clazz = (String) jsonObject.get(SimpleData.JSON_KEY_CLASS);
		String kind = (String) jsonObject.get(SimpleData.JSON_KEY_KIND);
		JsonObject itemJsonObject = (JsonObject) jsonObject.get(SimpleData.JSON_KEY_OBJECT);
		
		String url = (String) itemJsonObject.get(SimpleUrlData.JSON_KEY_URL);
		
		switch (kind) {
			case VideoItemResultData.KIND: {
				IVideoContentProvider videoContentProvider = (IVideoContentProvider) searchAndGoProvider;
				String name = (String) itemJsonObject.get(VideoItemResultData.JSON_KEY_NAME);
				
				if (VideoItemResultData.class.getSimpleName().equals(clazz)) {
					return new VideoItemResultData(videoContentProvider, url, name);
				} else if (CompletedVideoItemResultData.class.getSimpleName().equals(clazz)) {
					List<String> playerUrls = (List<String>) itemJsonObject.get(CompletedVideoItemResultData.JSON_KEY_PLAYER_URLS);
					
					return new CompletedVideoItemResultData(videoContentProvider, name, playerUrls);
				}
				
				throw new IllegalStateException("Unknown video result subclass: " + clazz);
			}
			
			case ChapterItemResultData.KIND: {
				String name = (String) itemJsonObject.get(ChapterItemResultData.JSON_KEY_NAME);
				String title = (String) itemJsonObject.get(ChapterItemResultData.JSON_KEY_TITLE);
				ChapterType chapterType = ChapterType.valueOf((String) itemJsonObject.get(ChapterItemResultData.JSON_KEY_TYPE));
				
				return new ChapterItemResultData((IImageContentProvider) searchAndGoProvider, url, name, title, chapterType);
			}
			
			default: {
				throw new IllegalStateException("Unknown item kind: " + kind);
			}
		}
	}
	
}