package caceresenzo.apps.boxplayweb.searchandgo.tasks.implementations;

import caceresenzo.apps.boxplayweb.client.Client;
import caceresenzo.apps.boxplayweb.searchandgo.tasks.AbstractSearchAndGoTask;
import caceresenzo.libs.boxplay.culture.searchngo.providers.ProviderWeakCache;

public class ClearCacheSearchAndGoTask extends AbstractSearchAndGoTask {
	
	/* Constants */
	public static final String NAME = "clear_cache";
	
	/* Constructor */
	public ClearCacheSearchAndGoTask(Client client) {
		super(NAME, client);
	}
	
	@Override
	public void work() throws Exception {
		ProviderWeakCache.clear();
	}
	
}