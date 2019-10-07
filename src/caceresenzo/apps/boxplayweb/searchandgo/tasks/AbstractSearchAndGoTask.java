package caceresenzo.apps.boxplayweb.searchandgo.tasks;

import caceresenzo.apps.boxplayweb.client.Client;
import caceresenzo.apps.boxplayweb.exchange.implementations.responses.TaskProgressionNotificationResponse;

public abstract class AbstractSearchAndGoTask implements Runnable {
	
	/* Variables */
	private final String name;
	protected final Client client;
	
	/* Constructor */
	public AbstractSearchAndGoTask(String name, Client client) {
		this.name = name;
		this.client = client;
		
		notifyProgression(Progression.WAITING, null);
	}
	
	@Override
	public void run() {
		notifyProgression(Progression.START, null);
		
		try {
			work();
		} catch (Exception exception) {
			notifyProgression(Progression.ERROR, exception.getMessage());
			return;
		}
		
		notifyProgression(Progression.FINISHED, null);
	}
	
	/**
	 * Do the task work.
	 */
	public abstract void work() throws Exception;
	
	/**
	 * Same as {@link #notifyProgression(Progression, Object)} but with the {@link Progression progression} argument set to {@link Progression#WORKING WORKING}.
	 * 
	 * @param message
	 *            Additional message.
	 */
	public void notifyWorkingProgression(Object message) {
		notifyProgression(Progression.WORKING, message);
	}
	
	/**
	 * Send a progression notification to the client.
	 * 
	 * @param progression
	 *            Current progression to notify.
	 * @param message
	 *            Additional message.
	 */
	public void notifyProgression(Progression progression, Object message) {
		client.send(new TaskProgressionNotificationResponse(this, progression, message));
	}
	
	/** @return Task's name. */
	public String getName() {
		return name;
	}
	
	/** @return Task's targetted client. */
	public Client getClient() {
		return client;
	}
	
	public enum Progression {
		/** The task is waiting in the thread pool. */
		WAITING,
		
		/** The task has been started. */
		START,
		
		/** The task is currently working and sending information about its progression. */
		WORKING,
		
		/** The task is finished. */
		FINISHED,
		
		/** The task returned an error and can't continue. */
		ERROR;
	}
	
}