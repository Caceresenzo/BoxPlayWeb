package caceresenzo.apps.boxplayweb.exchange.implementations.responses;

import java.util.List;

import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.libs.boxplay.common.extractor.video.model.VideoQuality;
import caceresenzo.libs.json.JsonArray;
import caceresenzo.libs.json.JsonAware;
import caceresenzo.libs.json.JsonObject;

public class ExtractVideoDirectUrlResultResponse extends AbstractResponse {
	
	/* Json Key */
	public static final String JSON_KEY_QUALITIES = "qualities";
	
	/* Constants */
	public static final String NAME = "extracted_video_direct_urls";
	
	/* Variables */
	private final List<VideoQuality> videoQualities;
	
	/* Constructor */
	public ExtractVideoDirectUrlResultResponse(List<VideoQuality> videoQualities) {
		super(NAME);
		
		this.videoQualities = videoQualities;
	}
	
	@Override
	public JsonAware forge() {
		JsonObject jsonObject = new JsonObject();
		JsonArray qualitiesJsonArray = new JsonArray();
		
		qualitiesJsonArray.addAll(videoQualities);
		
		jsonObject.put(JSON_KEY_QUALITIES, qualitiesJsonArray);
		
		return jsonObject;
	}
	
}