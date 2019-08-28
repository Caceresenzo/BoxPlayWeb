package caceresenzo.apps.boxplayweb.exchange.implementations.responses;

import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.libs.json.JsonAware;
import caceresenzo.libs.json.JsonObject;

public class EmptyResponse extends AbstractResponse {
	
	/* Constants */
	public static final String NAME = "empty";
	public static final JsonAware OBJECT;
	
	static {
		OBJECT = new JsonObject();
	}
	
	/* Constructor */
	public EmptyResponse() {
		super(NAME);
	}
	
	@Override
	public JsonAware forge() {
		return OBJECT;
	}
	
}