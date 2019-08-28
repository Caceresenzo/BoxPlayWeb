package caceresenzo.apps.boxplayweb.searchandgo;

import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import caceresenzo.apps.boxplayweb.config.Config;
import caceresenzo.apps.boxplayweb.searchandgo.tasks.AbstractSearchAndGoTask;

public class SearchAndGoTaskExecutor {
	
	/* Static */
	private static Logger LOGGER = LoggerFactory.getLogger(SearchAndGoTaskExecutor.class);
	
	/* Singleton */
	private static SearchAndGoTaskExecutor INSTANCE;
	
	/* Executor */
	private ThreadPoolExecutor pool;
	
	/* Private Constructor */
	private SearchAndGoTaskExecutor() {
		this.pool = (ThreadPoolExecutor) Executors.newFixedThreadPool(Config.SEARCHANDGO_EXECUTOR_POOL_SIZE);
		this.pool.prestartAllCoreThreads();
	}
	
	public void execute(AbstractSearchAndGoTask task) {
		LOGGER.info("Starting new task: {}", task.getName());
		pool.execute(task);
	}
	
	/** @return SearchAndGoTaskExecutor's singleton instance. */
	public static final SearchAndGoTaskExecutor get() {
		if (INSTANCE == null) {
			INSTANCE = new SearchAndGoTaskExecutor();
		}
		
		return INSTANCE;
	}
	
}