package caceresenzo.apps.boxplayweb.server;

import java.io.File;
import java.io.FileInputStream;
import java.net.InetSocketAddress;
import java.security.KeyStore;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.DefaultSSLWebSocketServerFactory;
import org.java_websocket.server.WebSocketServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import caceresenzo.apps.boxplayweb.config.Config;
import caceresenzo.apps.boxplayweb.exchange.RequestProcessor;
import caceresenzo.libs.stream.StreamUtils;

public class MainWebSocketServer extends WebSocketServer {
	
	/* Static */
	private static final Logger LOGGER = LoggerFactory.getLogger(MainWebSocketServer.class);
	
	/* Constructor */
	public MainWebSocketServer() {
		this(false);
	}
	
	/* Constructor */
	public MainWebSocketServer(boolean secure) {
		this(secure ? Config.WEB_SOCKET_SECURE_PORT : Config.WEB_SOCKET_PORT);
	}
	
	/* Constructor */
	public MainWebSocketServer(int port) {
		super(new InetSocketAddress(port));
		
		if (port == Config.WEB_SOCKET_SECURE_PORT && Config.WEB_SOCKET_SECURE_ENABLED) {
			FileInputStream fileInputStream = null;
			try {
				KeyStore keyStore = KeyStore.getInstance(Config.WEB_SOCKET_SECURE_STORE_TYPE);
				File keyStoreFile = new File(Config.WEB_SOCKET_SECURE_KEY_FILE);
				
				fileInputStream = new FileInputStream(keyStoreFile);
				keyStore.load(fileInputStream, Config.WEB_SOCKET_SECURE_STORE_PASSWORD.toCharArray());
				
				KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance("SunX509");
				keyManagerFactory.init(keyStore, Config.WEB_SOCKET_SECURE_KEY_PASSWORD.toCharArray());
				
				TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance("SunX509");
				trustManagerFactory.init(keyStore);
				
				SSLContext sslContext = SSLContext.getInstance("TLS");
				sslContext.init(keyManagerFactory.getKeyManagers(), trustManagerFactory.getTrustManagers(), null);
				
				setWebSocketFactory(new DefaultSSLWebSocketServerFactory(sslContext));
			} catch (Exception exception) {
				throw new RuntimeException("Failed to initiate secure server.", exception);
			} finally {
				StreamUtils.close(fileInputStream);
			}
		}
	}
	
	@Override
	public void onStart() {
		LOGGER.info("Server {}: WebSocket Server started!", getPort());
		
		setConnectionLostTimeout(Config.WEB_SOCKET_SERVER_CONNECTION_LOST_TIMEOUT);
	}
	
	@Override
	public void onOpen(WebSocket socket, ClientHandshake handshake) {
		LOGGER.info("Server {}: Socket {}({}) connected.", getPort(), ip(socket), port(socket));
	}
	
	@Override
	public void onClose(WebSocket socket, int code, String reason, boolean remote) {
		LOGGER.info("Server {}: Socket {}({}) has been disconnected. (reason = \"{}\", remote = {})", getPort(), ip(socket), port(socket), reason, remote);
	}
	
	@Override
	public void onMessage(WebSocket socket, String message) {
		LOGGER.info("Server {}: Received message from socket {}({}): {}", getPort(), ip(socket), port(socket), message);
		
		RequestProcessor.get().process(socket, message);
	}
	
	@Override
	public void onError(WebSocket socket, Exception exception) {
		if (socket != null) {
			LOGGER.warn("Server {}: WebSocket with ip " + socket.getRemoteSocketAddress().getAddress().getHostAddress() + " generated an exception.", exception);
		} else {
			LOGGER.warn("An error append with the WebSocket Server.", exception);
		}
	}
	
	public void end() {
		LOGGER.info("Server {}: Stopping WebSocket server...", getPort());
		
		try {
			stop();
		} catch (Exception exception) {
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