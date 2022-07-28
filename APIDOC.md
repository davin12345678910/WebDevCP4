# TasksList API Documentation
The TasksList app allows a user to add to a list of tasks, remove tasks when
they are complete, and get a list of the current tasks in which they have to
complete.

## Add in a task into the list of tasks so far
**Request Format:** /addTask endpoint with POST parameters of 'task'

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Give a valid 'task' to add, we will be given a plain text message with the name of the task added

**Example Request:** /addTask with POST parameters of 'task=Get some milk'

**Example Response:**
```text
get some milk
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If missing the body field of task, error message "Body paramaters were not set for post request!" will be given
  - If you insert a task that has already been added to the list, error message "Element has already been added!" will be given

## Remove a task from the current list
**Request Format:** /removeTask endpoint with POST parameters of 'task'

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Given a valid 'task' to remove, we will be given a plain text response of the thing we removed

**Example Request:** /removeTask with POST parameters of 'task=Get some milk'

**Example Response:**
```
get some milk
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If missing the body field of task, error message "Body paramaters were not set for post request!" will be given
  - If we are trying to remove an element not in the list, we will get the error message "Tasks is not in list!" will be given



## This will list out the task which you have to do
**Request Format:** /listTasks

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns a list of all of the task that need to be complete

**Example Request:** /listTasks

**Example Response:**
```json
{
  "list": [
    "Get some milk",
    "Get some fish"
  ]
}
```

**Error Handling:**
N/A



