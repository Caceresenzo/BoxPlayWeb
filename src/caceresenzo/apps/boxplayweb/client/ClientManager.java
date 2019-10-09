package caceresenzo.apps.boxplayweb.client;

import java.util.HashMap;
import java.util.Map;

public class ClientManager {
	
	/* Singleton */
	private static ClientManager INSTANCE;
	
	/* Variables */
	private Map<String, Client> clients;
	
	/* Private Constructor */
	private ClientManager() {
		this.clients = new HashMap<>();
	}
	
	/**
	 * Register a token to a new {@link Client client}.
	 * 
	 * @param token
	 *            Token to register with.
	 * @return Created {@link Client client}.
	 * @throws IllegalStateException
	 *             If there are already a {@link Client client} registered with this token.
	 */
	public Client registerClient(String token) {
		if (isTokenRegistered(token)) {
			throw new IllegalStateException("Cannot register a client with an already in use token.");
		}
		
		Client client = new Client(token);
		clients.put(token, client);
		return client;
	}
	
	/**
	 * Tell weather or not a {@link Client client} instance exist with this token.
	 * 
	 * @param token
	 *            Token to match.
	 * @return Weather or not an instance exist.
	 */
	public boolean isTokenRegistered(String token) {
		return clients.containsKey(token);
	}
	
	/**
	 * Get a {@link Client client} by a token.
	 * 
	 * @param token
	 *            Token to match.
	 * @return Corresponding {@link Client client}, <code>null</code> if not found.
	 */
	public Client getClient(String token) {
		return clients.get(token);
	}
	
	/** Clear {@link Client} instances if they are not still connected. */
	public void clearClosedClients() {
		clients.values().removeIf((client) -> !client.isStillConnected());
	}
	
	/** @return ClientManager's singleton instance. */
	public static final ClientManager get() {
		if (INSTANCE == null) {
			INSTANCE = new ClientManager();
		}
		
		return INSTANCE;
	}
	
}