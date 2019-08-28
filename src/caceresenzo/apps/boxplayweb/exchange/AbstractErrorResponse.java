package caceresenzo.apps.boxplayweb.exchange;

import caceresenzo.apps.boxplayweb.config.BoxPlayWebError;
import caceresenzo.libs.json.JsonAware;
import caceresenzo.libs.json.JsonObject;

public abstract class AbstractErrorResponse extends AbstractResponse {
	
	/* Json Key */
	public static final String JSON_KEY_CODE = "code";
	public static final String JSON_KEY_MESSAGE = "message";
	public static final String JSON_KEY_CAUSE = "cause";
	
	/* Constants */
	public static final String NAME = "error";
	
	/* Variables */
	private BoxPlayWebError error;
	private String cause;
	
	public AbstractErrorResponse(BoxPlayWebError error, String cause) {
		super(NAME);

		this.error = error;
		this.cause = cause;
	}
	
	@Override
	public JsonAware forge() {
		JsonObject jsonObject = new JsonObject();

		jsonObject.put(JSON_KEY_CODE, error.getCode());
		jsonObject.put(JSON_KEY_MESSAGE, error.getMessage());
		jsonObject.put(JSON_KEY_CAUSE, cause);
		
		return jsonObject;
	}
	
}