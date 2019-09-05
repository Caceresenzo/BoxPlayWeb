package caceresenzo.apps.boxplayweb.config;

import caceresenzo.libs.config.Configuration;
import caceresenzo.libs.config.annotations.ConfigFile;
import caceresenzo.libs.config.annotations.ConfigProperty;
import caceresenzo.libs.config.processor.implementations.PropertiesConfigProcessor;

public class Config extends Configuration {
	
	/* Instances */
	private static Config CONFIG;
	
	/* Files */
	@ConfigFile(name = "config", processor = PropertiesConfigProcessor.class)
	public static String CONFIG_FILE = "config.properties";
	
	/* Entries */
	@ConfigProperty(defaultValue = "8000", type = ConfigProperty.PropertyType.INTEGER, file = "config", key = "websocket.port")
	public static int WEB_SOCKET_PORT;
	
	@ConfigProperty(defaultValue = "false", type = ConfigProperty.PropertyType.BOOLEAN, file = "config", key = "websocket.secure.enabled")
	public static boolean WEB_SOCKET_SECURE_ENABLED;
	
	@ConfigProperty(defaultValue = "JKS", type = ConfigProperty.PropertyType.STRING, file = "config", key = "websocket.secure.store-type")
	public static String WEB_SOCKET_SECURE_STORE_TYPE;
	
	@ConfigProperty(defaultValue = "keystore.ks", type = ConfigProperty.PropertyType.STRING, file = "config", key = "websocket.secure.key-file")
	public static String WEB_SOCKET_SECURE_KEY_FILE;
	
	@ConfigProperty(defaultValue = "password", type = ConfigProperty.PropertyType.STRING, file = "config", key = "websocket.secure.store-password")
	public static String WEB_SOCKET_SECURE_STORE_PASSWORD;
	
	@ConfigProperty(defaultValue = "password", type = ConfigProperty.PropertyType.STRING, file = "config", key = "websocket.secure.key-password")
	public static String WEB_SOCKET_SECURE_KEY_PASSWORD;

	@ConfigProperty(defaultValue = "8100", type = ConfigProperty.PropertyType.INTEGER, file = "config", key = "websocket.secure.port")
	public static int WEB_SOCKET_SECURE_PORT;
	
	@ConfigProperty(defaultValue = "100", type = ConfigProperty.PropertyType.INTEGER, file = "config", key = "websocket.server.connection.lost.timeout")
	public static int WEB_SOCKET_SERVER_CONNECTION_LOST_TIMEOUT;
	
	@ConfigProperty(defaultValue = "64", type = ConfigProperty.PropertyType.INTEGER, file = "config", key = "websocket.token.port")
	public static int WEB_SOCKET_TOKEN_LENGTH;
	
	@ConfigProperty(defaultValue = "1", type = ConfigProperty.PropertyType.INTEGER, file = "config", key = "searchandgo.executor.pool-size")
	public static int SEARCHANDGO_EXECUTOR_POOL_SIZE;
	
	/** Initialize config file. */
	public static void initialize() {
		CONFIG = (Config) initialize(Config.class);
	}
	
	/** @return Config's singleton. */
	public static Config getConfig() {
		return CONFIG;
	}
	
}