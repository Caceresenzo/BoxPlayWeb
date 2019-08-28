package caceresenzo.apps.boxplayweb.config;

public class BoxPlayWebError {

	public static final BoxPlayWebError INVALID_REQUEST = new BoxPlayWebError(1, "Invalid Request");
	public static final BoxPlayWebError FAILED_REQUEST = new BoxPlayWebError(2, "Failed Request");
	public static final BoxPlayWebError INVALID_TOKEN = new BoxPlayWebError(3, "Invalid Token");
	
	/* Variables */
	private final int code;
	private final String message;
	
	/* Constructor */
	private BoxPlayWebError(int code, String message) {
		this.code = code;
		this.message = message;
	}
	
	public int getCode() {
		return code;
	}
	
	public String getMessage() {
		return message;
	}
	
}