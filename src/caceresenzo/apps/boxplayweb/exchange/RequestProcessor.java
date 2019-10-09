package caceresenzo.apps.boxplayweb.exchange;

import java.util.HashMap;
import java.util.Map;

import org.java_websocket.WebSocket;

import caceresenzo.apps.boxplayweb.client.Client;
import caceresenzo.apps.boxplayweb.client.ClientManager;
import caceresenzo.apps.boxplayweb.exchange.implementations.processors.ClearCacheRequestProcessor;
import caceresenzo.apps.boxplayweb.exchange.implementations.processors.ExtractUrlsRequestProcessor;
import caceresenzo.apps.boxplayweb.exchange.implementations.processors.ExtractVideoDirectUrlRequestProcessor;
import caceresenzo.apps.boxplayweb.exchange.implementations.processors.GetAdditionalDataRequestProcessor;
import caceresenzo.apps.boxplayweb.exchange.implementations.processors.HandshakeRequestProcessor;
import caceresenzo.apps.boxplayweb.exchange.implementations.processors.ProviderListRequestProcessor;
import caceresenzo.apps.boxplayweb.exchange.implementations.processors.SearchRequestProcessor;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.errors.InvalidRequestErrorResponse;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.errors.InvalidTokenErrorResponse;
import caceresenzo.libs.json.JsonAware;
import caceresenzo.libs.json.JsonObject;
import caceresenzo.libs.json.parser.JsonParser;
import caceresenzo.libs.string.StringUtils;

public class RequestProcessor {
	
	/* Json Key */
	public static final String JSON_KEY_CONTAINER_NAME = "name";
	public static final String JSON_KEY_CONTAINER_TOKEN = "token";
	public static final String JSON_KEY_CONTAINER_CONTENT = "content";
	
	/* Singleton */
	private static RequestProcessor INSTANCE;
	
	private Map<String, AbstractRequestProcessor> processors;
	
	/* Private Constructor */
	private RequestProcessor() {
		this.processors = new HashMap<>();
	}
	
	/** Bind {@link AbstractRequestProcessor request processors}. */
	public void initialize() {
		bindProcessor(new HandshakeRequestProcessor());
		bindProcessor(new ProviderListRequestProcessor());
		bindProcessor(new SearchRequestProcessor());
		bindProcessor(new ClearCacheRequestProcessor());
		bindProcessor(new GetAdditionalDataRequestProcessor());
		bindProcessor(new ExtractUrlsRequestProcessor());
		bindProcessor(new ExtractVideoDirectUrlRequestProcessor());
	}
	
	/**
	 * Register a new {@link AbstractRequestProcessor request processor}.
	 * 
	 * @param processor
	 *            Target processor instance to register.
	 * @throws IllegalArgumentException
	 *             If a processor has already been registered with the same name.
	 */
	public void bindProcessor(AbstractRequestProcessor processor) {
		if (processors.containsKey(processor.getName())) {
			throw new IllegalArgumentException("Cannot bind an already bound processor.");
		}
		
		processors.put(processor.getName(), processor);
	}
	
	/**
	 * Process a raw message received by a {@link WebSocket socket}.
	 * 
	 * @param socket
	 *            {@link WebSocket Socket} witch the request was made.
	 * @param raw
	 *            Raw request content.
	 */
	public void process(WebSocket socket, String raw) {
		JsonObject jsonObject;
		
		try {
			jsonObject = (JsonObject) new JsonParser().parse(raw);
			
			if (!jsonObject.containsKey(JSON_KEY_CONTAINER_NAME) || !jsonObject.containsKey(JSON_KEY_CONTAINER_CONTENT)) {
				throw new Exception("Missing some JSON entries...");
			}
		} catch (Exception exception) {
			sendToSocket(socket, new InvalidRequestErrorResponse(exception.getMessage()));
			return;
		}
		
		try {
			String name = (String) jsonObject.get(JSON_KEY_CONTAINER_NAME);
			String token = (String) jsonObject.get(JSON_KEY_CONTAINER_TOKEN);
			JsonAware content = (JsonAware) jsonObject.get(JSON_KEY_CONTAINER_CONTENT);
			
			AbstractRequestProcessor processor = processors.get(name);
			if (processor == null) {
				throw new Exception("Unknown request.");
			}
			
			Client client = ClientManager.get().getClient(token);
			
			if ((!processor.isAcceptingRequestWithoutToken() && (!StringUtils.validate(token) || client == null))) {
				sendToSocket(socket, new InvalidTokenErrorResponse(client == null ? "Unknown token." : null));
			} else {
				sendToSocket(socket, processor.process(socket, client, content));
			}
		} catch (Exception exception) {
			sendToSocket(socket, new InvalidRequestErrorResponse(exception.getMessage()));
			return;
		}
	}
	
	/**
	 * Send a {@link AbstractResponse response} to a socket.
	 * 
	 * @param socket
	 *            Target {@link WebSocket socket}.
	 * @param response
	 *            {@link AbstractResponse Response} to send.
	 */
	public void sendToSocket(WebSocket socket, AbstractResponse response) {
		try {
			JsonObject jsonObject = new JsonObject();
			
			jsonObject.put(JSON_KEY_CONTAINER_NAME, response.getName());
			jsonObject.put(JSON_KEY_CONTAINER_CONTENT, response.forge());
			
			socket.send(jsonObject.toJsonString());
		} catch (Exception ignored) {
			;
		}
	}
	
	/** @return RequestProcessor's singleton instance. */
	public static final RequestProcessor get() {
		if (INSTANCE == null) {
			INSTANCE = new RequestProcessor();
		}
		
		return INSTANCE;
	}
	
}