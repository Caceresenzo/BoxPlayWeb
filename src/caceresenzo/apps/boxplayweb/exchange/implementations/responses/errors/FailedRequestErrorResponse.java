package caceresenzo.apps.boxplayweb.exchange.implementations.responses.errors;

import caceresenzo.apps.boxplayweb.config.BoxPlayWebError;
import caceresenzo.apps.boxplayweb.exchange.AbstractErrorResponse;

public class FailedRequestErrorResponse extends AbstractErrorResponse {

	/* Constructor */
	public FailedRequestErrorResponse(String cause) {
		super(BoxPlayWebError.FAILED_REQUEST, cause);
	}
	
}