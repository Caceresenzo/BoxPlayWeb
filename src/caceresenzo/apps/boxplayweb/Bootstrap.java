package caceresenzo.apps.boxplayweb;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import caceresenzo.apps.boxplayweb.config.Config;
import caceresenzo.apps.boxplayweb.exchange.RequestProcessor;
import caceresenzo.apps.boxplayweb.server.MainWebSocketServer;

public class Bootstrap {
	
	/* Static */
	private static Logger LOGGER = LoggerFactory.getLogger(Bootstrap.class);
	
	public static void main(String[] args) {
		LOGGER.info("Starting server...");
		
		Config.initialize();
		RequestProcessor.get().initialize();
		MainWebSocketServer mainWebSocketServer = new MainWebSocketServer();
		mainWebSocketServer.start();
	}
	
}