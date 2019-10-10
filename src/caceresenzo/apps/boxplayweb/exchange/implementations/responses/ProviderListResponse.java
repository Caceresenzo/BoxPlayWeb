package caceresenzo.apps.boxplayweb.exchange.implementations.responses;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.libs.boxplay.culture.searchngo.providers.ProviderManager;
import caceresenzo.libs.boxplay.culture.searchngo.providers.SearchAndGoProvider;
import caceresenzo.libs.json.JsonArray;
import caceresenzo.libs.json.JsonAware;
import caceresenzo.libs.json.JsonObject;

public class ProviderListResponse extends AbstractResponse {
	
	/* Json Key */
	public static final String JSON_KEY_PROVIDER_ID = "id";
	public static final String JSON_KEY_PROVIDER_CLASS = "class";
	public static final String JSON_KEY_PROVIDER_MANAGER = "manager";
	public static final String JSON_KEY_PROVIDER_SITE = "site";
	public static final String JSON_KEY_PROVIDER_SITE_URL = "url";
	public static final String JSON_KEY_PROVIDER_SITE_NAME = "name";
	
	/* Constants */
	public static final String NAME = "provider_list";
	public static final JsonAware OBJECT;
	
	static {
		JsonArray jsonArray = new JsonArray();
		List<SearchAndGoProvider> providers = new ArrayList<>();
		
		for (ProviderManager providerManager : Arrays.asList(ProviderManager.JETANIME, ProviderManager.ADKAMI, ProviderManager.ANIMEULTIME, ProviderManager.NEKOSAMA)) {
			providers.add(providerManager.create());
		}
		
		for (int index = 0; index < providers.size(); index++) {
			SearchAndGoProvider provider = providers.get(index);
			
			JsonObject providerJsonObject = new JsonObject();
			JsonObject siteJsonObject = new JsonObject();
			
			providerJsonObject.put(JSON_KEY_PROVIDER_ID, index);
			providerJsonObject.put(JSON_KEY_PROVIDER_CLASS, provider.getClass().getSimpleName());
			providerJsonObject.put(JSON_KEY_PROVIDER_MANAGER, provider.getSourceManager().toString());
			providerJsonObject.put(JSON_KEY_PROVIDER_SITE, siteJsonObject);
			siteJsonObject.put(JSON_KEY_PROVIDER_SITE_URL, provider.getSiteUrl());
			siteJsonObject.put(JSON_KEY_PROVIDER_SITE_NAME, provider.getSiteName());
			
			jsonArray.add(providerJsonObject);
		}
		
		OBJECT = jsonArray;
	}
	
	/* Constructor */
	public ProviderListResponse() {
		super(NAME);
	}
	
	@Override
	public JsonAware forge() {
		return OBJECT;
	}
	
}