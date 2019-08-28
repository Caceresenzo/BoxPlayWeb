package caceresenzo.apps.boxplayweb.searchandgo.tasks.implementations;

import java.util.List;
import java.util.Map;

import caceresenzo.apps.boxplayweb.client.Client;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.SearchResultResponse;
import caceresenzo.apps.boxplayweb.searchandgo.tasks.AbstractSearchAndGoTask;
import caceresenzo.libs.boxplay.culture.searchngo.callback.delegate.CallbackDelegate;
import caceresenzo.libs.boxplay.culture.searchngo.providers.SearchAndGoProvider;
import caceresenzo.libs.boxplay.culture.searchngo.result.SearchAndGoResult;
import caceresenzo.libs.json.JsonObject;

public class SearchSearchAndGoTask extends AbstractSearchAndGoTask {
	
	/* Constants */
	public static final String NAME = "search";
	
	/* Variables */
	private final String query;
	private final List<SearchAndGoProvider> providers;
	
	/* Constructor */
	public SearchSearchAndGoTask(Client client, String query, List<SearchAndGoProvider> providers) {
		super(NAME, client);
		
		this.query = query;
		this.providers = providers;
	}
	
	@Override
	public void work() throws Exception {
		client.send(new SearchResultResponse(this, SearchAndGoProvider.provide(providers, query, true, new TaskCallbackDelegate(), true)));
	}
	
	/** @return Original query used to do the search. */
	public String getQuery() {
		return query;
	}
	
	/** @return {@link List} of {@link SearchAndGoProvider provider} used to do the search. */
	public List<SearchAndGoProvider> getProviders() {
		return providers;
	}
	
	private class TaskCallbackDelegate extends CallbackDelegate {
		
		@Override
		public void onProviderSearchStarting(SearchAndGoProvider provider) {
			notifyWorkingProgression(createProviderSearchMessage(provider, createEtaMessage("provider.search.start")));
		}
		
		@Override
		public void onProviderSorting(SearchAndGoProvider provider) {
			notifyWorkingProgression(createProviderSearchMessage(provider, createEtaMessage("provider.search.sorting")));
		}
		
		@Override
		public void onProviderSearchFinished(SearchAndGoProvider provider, Map<String, SearchAndGoResult> workmap) {
			notifyWorkingProgression(createProviderSearchMessage(provider, createEtaMessage("provider.search.finished")));
		}
		
		@Override
		public void onProviderFailed(SearchAndGoProvider provider, Exception exception) {
			JsonObject errorJsonObject = new JsonObject();
			JsonObject detailJsonObject = new JsonObject();
			
			errorJsonObject.put("error", errorJsonObject);
			detailJsonObject.put("on", provider.getSourceManager());
			detailJsonObject.put("cause", exception.getMessage());
			
			notifyWorkingProgression(createGlobalSearchMessage(errorJsonObject));
		}
		
		@Override
		public void onSearchStarting() {
			notifyWorkingProgression(createGlobalSearchMessage(createEtaMessage("global.search.start")));
		}
		
		@Override
		public void onSearchSorting() {
			notifyWorkingProgression(createGlobalSearchMessage(createEtaMessage("global.search.sorting")));
		}
		
		@Override
		public void onSearchFinished(Map<String, SearchAndGoResult> workmap) {
			notifyWorkingProgression(createGlobalSearchMessage(createEtaMessage("global.search.finished")));
		}
		
		@Override
		public void onSearchFail(Exception exception) {
			JsonObject errorJsonObject = new JsonObject();
			JsonObject detailJsonObject = new JsonObject();
			
			errorJsonObject.put("error", errorJsonObject);
			detailJsonObject.put("on", null);
			detailJsonObject.put("cause", exception.getMessage());
			
			notifyWorkingProgression(createGlobalSearchMessage(errorJsonObject));
		}
		
		private JsonObject createEtaMessage(String eta) {
			JsonObject jsonObject = new JsonObject();
			
			jsonObject.put("eta", eta);
			
			return jsonObject;
		}
		
		private JsonObject createGlobalSearchMessage(Object submessage) {
			JsonObject jsonObject = new JsonObject();
			
			jsonObject.put("from", "GLOBAL");
			jsonObject.put("submessage", submessage);
			
			return jsonObject;
		}
		
		private JsonObject createProviderSearchMessage(SearchAndGoProvider provider, Object submessage) {
			JsonObject jsonObject = new JsonObject();
			
			jsonObject.put("from", "PROVIDER");
			jsonObject.put("manager", provider.getSourceManager().toString());
			jsonObject.put("submessage", submessage);
			
			return jsonObject;
		}
		
	}
	
}