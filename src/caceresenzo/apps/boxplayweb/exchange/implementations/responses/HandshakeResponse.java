package caceresenzo.apps.boxplayweb.exchange.implementations.responses;

import caceresenzo.apps.boxplayweb.config.Config;
import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.libs.json.JsonAware;
import caceresenzo.libs.json.JsonObject;
import caceresenzo.libs.random.RandomString;

public class HandshakeResponse extends AbstractResponse {
	
	/* Json Key */
	public static final String JSON_KEY_TOKEN = "token";
	
	/* Constants */
	public static final String NAME = "handshake";
	public static final RandomString RANDOM_STRING;
	
	static {
		RANDOM_STRING = new RandomString(Config.WEB_SOCKET_TOKEN_LENGTH);
	}
	
	/* Variables */
	private String generatedToken;
	
	/* Constructor */
	public HandshakeResponse() {
		super(NAME);
	}
	
	/**
	 * Generate a random token.
	 * 
	 * @return Generated token.
	 * @throws IllegalStateException
	 *             If the token has already been generated.
	 */
	public String generateToken() {
		if (generatedToken != null) {
			throw new IllegalStateException("Cannot generate another token.");
		}
		
		return generatedToken = RANDOM_STRING.nextString();
	}
	
	@Override
	public JsonAware forge() {
		JsonObject jsonObject = new JsonObject();
		
		jsonObject.put(JSON_KEY_TOKEN, getGeneratedToken());
		
		return jsonObject;
	}
	
	/** @return The previously generated token. */
	public String getGeneratedToken() {
		if (generatedToken == null) {
			generateToken();
		}
		
		return generatedToken;
	}
	
}