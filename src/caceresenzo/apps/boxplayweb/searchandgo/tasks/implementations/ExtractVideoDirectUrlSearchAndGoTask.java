package caceresenzo.apps.boxplayweb.searchandgo.tasks.implementations;

import java.util.ArrayList;
import java.util.List;

import caceresenzo.apps.boxplayweb.client.Client;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.ExtractVideoDirectUrlResultResponse;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.errors.FailedRequestErrorResponse;
import caceresenzo.apps.boxplayweb.searchandgo.tasks.AbstractSearchAndGoTask;
import caceresenzo.libs.boxplay.common.extractor.ContentExtractionManager;
import caceresenzo.libs.boxplay.common.extractor.ContentExtractionManager.ExtractorType;
import caceresenzo.libs.boxplay.common.extractor.video.VideoContentExtractor;
import caceresenzo.libs.boxplay.common.extractor.video.VideoQualityContentExtractor;
import caceresenzo.libs.boxplay.common.extractor.video.base.BaseVideoContentExtractor;
import caceresenzo.libs.boxplay.common.extractor.video.base.BaseVideoContentExtractor.VideoContentExtractorProgressCallback;
import caceresenzo.libs.boxplay.common.extractor.video.model.VideoQuality;
import caceresenzo.libs.http.client.webb.Response;
import caceresenzo.libs.http.client.webb.Webb;
import caceresenzo.libs.json.JsonAware;

public class ExtractVideoDirectUrlSearchAndGoTask extends AbstractSearchAndGoTask {
	
	/* Constants */
	public static final String NAME = "extract_video_direct_url";
	
	/* Variables */
	private final String url;
	
	/* Constructor */
	public ExtractVideoDirectUrlSearchAndGoTask(Client client, String url) {
		super(NAME, client);
		
		this.url = url;
	}
	
	@Override
	public void work() throws Exception {
		List<VideoQuality> videoQualities = new ArrayList<>();
		
		BaseVideoContentExtractor baseVideoContentExtractor = (BaseVideoContentExtractor) ContentExtractionManager.getExtractorFromBaseUrl(ExtractorType.VIDEO, url);
		
		if (baseVideoContentExtractor instanceof VideoContentExtractor) {
			VideoContentExtractor videoContentExtractor = (VideoContentExtractor) baseVideoContentExtractor;
			
			String directUrl = videoContentExtractor.extractDirectVideoUrl(url, new TaskVideoContentExtractorProgressCallback());
			
			switch (baseVideoContentExtractor.getClientSensitivity()) {
				case ONLY_REDIRECT: {
					Response<Void> response = Webb.create()
							.get(directUrl)
							.chromeUserAgent()
							.followRedirects(true)
							.asVoid();
					
					if (response.getStatusCode() == 200) {
						directUrl = response.getConnection().getURL().toString();
					}
					
					break;
				}
				
				case IP_MATCH: {
					// TODO
					break;
				}
				
				case NONE:
				default: {
					break;
				}
			}
			
			videoQualities.add(new VideoQuality(null, directUrl));
		} else if (baseVideoContentExtractor instanceof VideoQualityContentExtractor) {
			VideoQualityContentExtractor videoQualityContentExtractor = (VideoQualityContentExtractor) baseVideoContentExtractor;
			
			videoQualities.addAll(videoQualityContentExtractor.extractVideoQualities(url, new TaskVideoContentExtractorProgressCallback()));
		} else {
			client.send(new FailedRequestErrorResponse("No valid content extractor found for URL: " + url));
			return;
		}
		
		client.send(new ExtractVideoDirectUrlResultResponse(videoQualities));
	}
	
	private class TaskVideoContentExtractorProgressCallback implements VideoContentExtractorProgressCallback {
		
		@Override
		public void onDownloadingUrl(String targetUrl) {
			notifyProgression(Progression.WORKING, Message.DOWNLOADING_URL);
		}
		
		@Override
		public void onFileNotAvailable() {
			notifyProgression(Progression.ERROR, Message.FILE_NOT_AVAILABLE);
		}
		
		@Override
		public void onExtractingLink() {
			notifyProgression(Progression.WORKING, Message.EXTRACTING_LINK);
		}
		
		@Override
		public void onFormattingResult() {
			notifyProgression(Progression.WORKING, Message.FORMATTING_RESULT);
		}
		
	}
	
	private enum Message implements JsonAware {
		
		DOWNLOADING_URL, FILE_NOT_AVAILABLE, EXTRACTING_LINK, FORMATTING_RESULT;
		
		@Override
		public String toJsonString() {
			return "\"" + toString() + "\"";
		}
		
	}
	
}