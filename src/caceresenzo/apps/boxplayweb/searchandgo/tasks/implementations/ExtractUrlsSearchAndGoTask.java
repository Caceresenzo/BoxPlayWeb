package caceresenzo.apps.boxplayweb.searchandgo.tasks.implementations;

import caceresenzo.apps.boxplayweb.client.Client;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.ExtractedUrlsResultResponse;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.errors.FailedRequestErrorResponse;
import caceresenzo.apps.boxplayweb.searchandgo.tasks.AbstractSearchAndGoTask;
import caceresenzo.libs.boxplay.common.extractor.ContentExtractionManager.ExtractorType;
import caceresenzo.libs.boxplay.culture.searchngo.content.image.implementations.IMangaContentProvider;
import caceresenzo.libs.boxplay.culture.searchngo.content.video.IVideoContentProvider;
import caceresenzo.libs.boxplay.culture.searchngo.data.models.SimpleUrlData;
import caceresenzo.libs.boxplay.culture.searchngo.data.models.content.ChapterItemResultData;
import caceresenzo.libs.boxplay.culture.searchngo.data.models.content.VideoItemResultData;
import caceresenzo.libs.boxplay.culture.searchngo.data.models.content.completed.CompletedVideoItemResultData;
import caceresenzo.libs.boxplay.culture.searchngo.providers.SearchAndGoProvider;
import caceresenzo.libs.boxplay.culture.searchngo.result.SearchAndGoResult;

public class ExtractUrlsSearchAndGoTask extends AbstractSearchAndGoTask {
	
	/* Constants */
	public static final String NAME = "extract_url";
	
	/* Variables */
	private final SearchAndGoResult searchAndGoResult;
	private final SimpleUrlData dataObject;
	
	/* Constructor */
	public ExtractUrlsSearchAndGoTask(Client client, SearchAndGoResult searchAndGoResult, SimpleUrlData dataObject) {
		super(NAME, client);
		
		this.searchAndGoResult = searchAndGoResult;
		this.dataObject = dataObject;
	}
	
	@Override
	public void work() throws Exception {
		final SearchAndGoProvider searchAndGoProvider = searchAndGoResult.getParentProvider();
		ExtractorType extractorType = null;
		String[] urls = null;
			
		if (dataObject instanceof CompletedVideoItemResultData) {
			CompletedVideoItemResultData completedVideoItemResultData = (CompletedVideoItemResultData) dataObject;
			
			extractorType = ExtractorType.VIDEO;
			urls = completedVideoItemResultData.getPlayerUrlsAsArray();
		} else if (dataObject instanceof VideoItemResultData) {
			VideoItemResultData videoItemResultData = (VideoItemResultData) dataObject;
			IVideoContentProvider videoContentProvider = (IVideoContentProvider) searchAndGoProvider;

			extractorType = ExtractorType.VIDEO;
			urls = videoContentProvider.extractVideoPageUrl(videoItemResultData);
		} else if (dataObject instanceof ChapterItemResultData) {
			ChapterItemResultData chapterItemResultData = (ChapterItemResultData) dataObject;
			IMangaContentProvider mangaContentProvider = (IMangaContentProvider) searchAndGoProvider;

			extractorType = ExtractorType.fromChapterType(chapterItemResultData.getChapterType());
			urls = new String[] { mangaContentProvider.extractMangaPageUrl(chapterItemResultData) };
		}
		
		
		if (urls != null) {
			client.send(new ExtractedUrlsResultResponse(this, extractorType, urls));
		} else {
			client.send(new FailedRequestErrorResponse("Unknown data object instance: " + dataObject.getClass().getSimpleName()));
		}
	}
	
	/** @return Original {@link SearchAndGoResult} used to do the task. */
	public SearchAndGoResult getSearchAndGoResult() {
		return searchAndGoResult;
	}
	
	/** @returne Original {@link SimpleUrlData} sub-implementation used to do the task. */
	public SimpleUrlData getDataObject() {
		return dataObject;
	}
	
}