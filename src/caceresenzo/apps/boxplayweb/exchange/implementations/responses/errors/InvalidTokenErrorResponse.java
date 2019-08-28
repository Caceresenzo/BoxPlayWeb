package caceresenzo.apps.boxplayweb.exchange.implementations.responses.errors;

import caceresenzo.apps.boxplayweb.config.BoxPlayWebError;
import caceresenzo.apps.boxplayweb.exchange.AbstractErrorResponse;

public class InvalidTokenErrorResponse extends AbstractErrorResponse {
	
	public InvalidTokenErrorResponse(String cause) {
		super(BoxPlayWebError.INVALID_TOKEN, cause);
	}
	
}