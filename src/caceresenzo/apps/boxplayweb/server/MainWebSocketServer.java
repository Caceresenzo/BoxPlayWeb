package caceresenzo.apps.boxplayweb.server;

import java.io.IOException;
import java.net.InetSocketAddress;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import caceresenzo.apps.boxplayweb.config.Config;
import caceresenzo.apps.boxplayweb.exchange.RequestProcessor;

public class MainWebSocketServer extends WebSocketServer {
	
	/* Static */
	private static Logger LOGGER = LoggerFactory.getLogger(MainWebSocketServer.class);
	
	/* Constructor */
	public MainWebSocketServer() {
		this(Config.WEB_SOCKET_PORT);
	}
	
	/* Constructor */
	public MainWebSocketServer(int port) {
		super(new InetSocketAddress(port));
	}
	
	@Override
	public void onStart() {
		LOGGER.info("WebSocket Server started!");
		
		setConnectionLostTimeout(Config.WEB_SOCKET_SERVER_CONNECTION_LOST_TIMEOUT);
	}
	
	@Override
	public void onOpen(WebSocket socket, ClientHandshake handshake) {
		LOGGER.info("Socket {}({}) connected.", ip(socket), port(socket));
	}
	
	@Override
	public void onClose(WebSocket socket, int code, String reason, boolean remote) {
		LOGGER.info("Socket {}({}) has been disconnected. (reason = \"{}\", remote = {})", ip(socket), port(socket), reason, remote);
	}
	
	@Override
	public void onMessage(WebSocket socket, String message) {
		LOGGER.info("Received message from socket {}({}): {}", ip(socket), port(socket), message);
		
		RequestProcessor.get().process(socket, message);
	}
	
	@Override
	public void onError(WebSocket socket, Exception exception) {
		if (socket != null) {
			LOGGER.warn("WebSocket with ip " + socket.getRemoteSocketAddress().getAddress().getHostAddress() + " generated an exception.", exception);
		} else {
			LOGGER.warn("An error append with the WebSocket Server.", exception);
		}
	}
	
	public void end() {
		LOGGER.info("Stopping WebSocket server...");
		
		try {
			stop();
		} catch (IOException | InterruptedException exception) {
			LOGGER.warn("Failed to stop the WebSocket server.", exception);
		}
	}
	
	private String ip(WebSocket socket) {
		return socket.getRemoteSocketAddress().getAddress().getHostAddress();
	}
	
	private int port(WebSocket socket) {
		return socket.getRemoteSocketAddress().getPort();
	}
	
}