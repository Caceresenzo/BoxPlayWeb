package caceresenzo.apps.boxplayweb.exchange.implementations.responses;

import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.libs.json.JsonAware;
import caceresenzo.libs.json.JsonObject;

public class TaskEnqueuedResponse extends AbstractResponse {
	
	/* Constants */
	public static final String NAME = "task_enqueued";
	public static final JsonAware OBJECT;
	
	static {
		OBJECT = new JsonObject();
	}
	
	/* Constructor */
	public TaskEnqueuedResponse() {
		super(NAME);
	}
	
	@Override
	public JsonAware forge() {
		return OBJECT;
	}
	
}