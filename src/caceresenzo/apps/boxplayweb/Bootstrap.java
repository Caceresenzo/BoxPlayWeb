package caceresenzo.apps.boxplayweb;

import java.util.Arrays;
import java.util.List;

import org.java_websocket.server.WebSocketServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import caceresenzo.apps.boxplayweb.config.Config;
import caceresenzo.apps.boxplayweb.exchange.RequestProcessor;
import caceresenzo.apps.boxplayweb.server.MainWebSocketServer;

public class Bootstrap {
	
	/* Static */
	private static final Logger LOGGER = LoggerFactory.getLogger(Bootstrap.class);
	
	/* Main */
	public static void main(String[] args) {
		LOGGER.info("Starting server...");
		
		Config.initialize();
		RequestProcessor.get().initialize();
		
		List<WebSocketServer> servers = Arrays.asList(new MainWebSocketServer());
		if (Config.WEB_SOCKET_SECURE_ENABLED) {
			servers.add(new MainWebSocketServer(true));
		}
		
		servers.forEach((server) -> {
			try {
				server.start();
			} catch (Exception exception) {
				LOGGER.error("Failed to start websocket server.", exception);
			}
		});
	}
	
}