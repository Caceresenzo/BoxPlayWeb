package caceresenzo.apps.boxplayweb.searchandgo.tasks.implementations;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

import caceresenzo.apps.boxplayweb.client.Client;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.FetchAdditionalDataResponse;
import caceresenzo.apps.boxplayweb.searchandgo.tasks.AbstractSearchAndGoTask;
import caceresenzo.libs.boxplay.culture.searchngo.data.AdditionalResultData;
import caceresenzo.libs.boxplay.culture.searchngo.providers.SearchAndGoProvider;
import caceresenzo.libs.boxplay.culture.searchngo.result.SearchAndGoResult;
import caceresenzo.libs.json.JsonObject;

public class GetAdditionalDataSearchAndGoTask extends AbstractSearchAndGoTask {
	
	/* Json Key */
	public static final String JSON_KEY_DATA_PROGRESSION = "current";
	public static final String JSON_KEY_DATA_PROGRESSION_ETA = "eta";
	
	/* Constants */
	public static final String NAME = "additional_data";
	
	/* Variables */
	private final SearchAndGoResult result;
	
	/* Constructor */
	public GetAdditionalDataSearchAndGoTask(Client client, SearchAndGoResult result) {
		super(NAME, client);
		
		this.result = result;
	}
	
	@Override
	public void work() throws Exception {
		final SearchAndGoProvider parentProvider = result.getParentProvider();
		
		List<AdditionalResultData> moreData = safeFetch(DataProgression.INFORMATIONS, () -> parentProvider.fetchMoreData(result));
		List<AdditionalResultData> content = safeFetch(DataProgression.CONTENT, () -> parentProvider.fetchContent(result));
		
		client.send(new FetchAdditionalDataResponse(this, moreData, content));
	}
	
	/**
	 * Will alaways return a non-null {@link List list} of {@link AdditionalResultData additional data} without throwing any exception.<br>
	 * This will also automatically notify of all the progression to the {@link Client client}.
	 * 
	 * @param dataProgression
	 *            What data is currently being fetch.
	 * @param supplier
	 *            Fetch function.
	 * @return Fetched {@link List list}.
	 */
	private List<AdditionalResultData> safeFetch(DataProgression dataProgression, Supplier<List<AdditionalResultData>> supplier) {
		List<AdditionalResultData> additionals = new ArrayList<>();
		
		notifyDataProgression(dataProgression, DataProgressionEta.STARTED);
		try {
			additionals.addAll(supplier.get());
			notifyDataProgression(dataProgression, DataProgressionEta.FINISHED);
		} catch (Exception ignored) {
			notifyDataProgression(dataProgression, DataProgressionEta.FAILED);
		}
		
		return additionals;
	}
	
	/**
	 * Notify to the client what data the task is currently fetching.
	 * 
	 * @param dataProgression
	 *            What data is currently being fetch.
	 * @param dataProgressionEta
	 *            Fetch eta.
	 */
	private void notifyDataProgression(DataProgression dataProgression, DataProgressionEta dataProgressionEta) {
		JsonObject jsonObject = new JsonObject();
		
		jsonObject.put(JSON_KEY_DATA_PROGRESSION, dataProgression.toString());
		jsonObject.put(JSON_KEY_DATA_PROGRESSION_ETA, dataProgressionEta.toString());
		
		notifyWorkingProgression(jsonObject);
	}
	
	/** @return Source {@link SearchAndGoResult result}. */
	public SearchAndGoResult getSearchAndGoResult() {
		return result;
	}
	
	public enum DataProgression {
		INFORMATIONS, CONTENT;
	}
	
	public enum DataProgressionEta {
		STARTED, FAILED, FINISHED;
	}
	
}