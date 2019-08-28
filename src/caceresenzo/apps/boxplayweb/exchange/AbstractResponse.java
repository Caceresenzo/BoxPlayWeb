package caceresenzo.apps.boxplayweb.exchange;

import caceresenzo.libs.json.JsonAware;

public abstract class AbstractResponse {
	
	/* Variables */
	private final String name;
	
	/* Constructor */
	public AbstractResponse(String name) {
		this.name = name;
	}
	
	/**
	 * Forge the response for him to be send.
	 * 
	 * @return A send-ready {@link JsonAware} object.
	 */
	public abstract JsonAware forge();
	
	/** @return Response's name. */
	public String getName() {
		return name;
	}
	
}