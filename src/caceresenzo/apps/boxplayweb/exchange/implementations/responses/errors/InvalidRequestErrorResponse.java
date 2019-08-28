package caceresenzo.apps.boxplayweb.exchange.implementations.responses.errors;

import caceresenzo.apps.boxplayweb.config.BoxPlayWebError;
import caceresenzo.apps.boxplayweb.exchange.AbstractErrorResponse;

public class InvalidRequestErrorResponse extends AbstractErrorResponse {

	public InvalidRequestErrorResponse(String cause) {
		super(BoxPlayWebError.INVALID_REQUEST, cause);
	}
	
}