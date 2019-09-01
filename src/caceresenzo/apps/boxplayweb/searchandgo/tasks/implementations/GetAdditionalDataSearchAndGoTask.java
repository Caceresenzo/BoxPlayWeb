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

public class GetAdditionalDataSearchAndGoTask extends AbstractSearchAndGoTask {
	
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
		
		List<AdditionalResultData> moreData = safeFetch(() -> parentProvider.fetchMoreData(result));
		List<AdditionalResultData> content = safeFetch(() -> parentProvider.fetchContent(result));
		
		client.send(new FetchAdditionalDataResponse(this, moreData, content));
	}
	
	/**
	 * Will alaways return a non-null {@link List list} of {@link AdditionalResultData additional data} without throwing any exception.
	 * 
	 * @param supplier
	 *            Fetch function.
	 * @return Fetched {@link List list}.
	 */
	private List<AdditionalResultData> safeFetch(Supplier<List<AdditionalResultData>> supplier) {
		List<AdditionalResultData> additionals = new ArrayList<>();
		
		try {
			additionals.addAll(supplier.get());
		} catch (Exception ignored) {
			;
		}
		
		return additionals;
	}
	
	/** @return Source {@link SearchAndGoResult result}. */
	public SearchAndGoResult getSearchAndGoResult() {
		return result;
	}
	
}