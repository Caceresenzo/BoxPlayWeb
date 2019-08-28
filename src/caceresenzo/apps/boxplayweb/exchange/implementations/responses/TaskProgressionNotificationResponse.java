package caceresenzo.apps.boxplayweb.exchange.implementations.responses;

import caceresenzo.apps.boxplayweb.exchange.AbstractResponse;
import caceresenzo.apps.boxplayweb.searchandgo.tasks.AbstractSearchAndGoTask;
import caceresenzo.libs.json.JsonAware;
import caceresenzo.libs.json.JsonObject;

public class TaskProgressionNotificationResponse extends AbstractResponse {
	
	/* Json Key */
	public static final String JSON_KEY_TASK = "task";
	public static final String JSON_KEY_PROGRESSION = "progression";
	public static final String JSON_KEY_MESSAGE = "message";
	
	/* Constants */
	public static final String NAME = "task_progression_notification";
	
	/* Variables */
	private final AbstractSearchAndGoTask task;
	private final AbstractSearchAndGoTask.Progression progression;
	private final Object message;
	
	/* Constructor */
	public TaskProgressionNotificationResponse(AbstractSearchAndGoTask task, AbstractSearchAndGoTask.Progression progression, Object message) {
		super(NAME);
		
		this.task = task;
		this.progression = progression;
		this.message = message;
	}
	
	@Override
	public JsonAware forge() {
		JsonObject jsonObject = new JsonObject();

		jsonObject.put(JSON_KEY_TASK, task.getName());
		jsonObject.put(JSON_KEY_PROGRESSION, progression.toString());
		jsonObject.put(JSON_KEY_MESSAGE, message);
		
		return jsonObject;
	}
	
}
