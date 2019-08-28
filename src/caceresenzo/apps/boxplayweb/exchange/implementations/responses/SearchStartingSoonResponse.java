package caceresenzo.apps.boxplayweb.exchange.implementations.responses;

import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.libs.json.JsonAware;
import caceresenzo.libs.json.JsonObject;

public class SearchStartingSoonResponse extends AbstractResponse {
	
	/* Constants */
	public static final String NAME = "search_starting_soon";
	public static final JsonAware OBJECT;
	
	static {
		OBJECT = new JsonObject();
	}
	
	/* Constructor */
	public SearchStartingSoonResponse() {
		super(NAME);
	}
	
	@Override
	public JsonAware forge() {
		return OBJECT;
	}
	
}