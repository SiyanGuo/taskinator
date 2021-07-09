var taskIdCounter = 0;

// form element
var formEl = document.querySelector('#task-form');
// todo, inprogress, completed column - ul element
var tasksToDoEl = document.querySelector('#tasks-to-do');
var tasksInProgressEl = document.querySelector('#tasks-in-progress');
var tasksCompletedEl = document.querySelector('#tasks-completed');
// main element
var pageContentEl = document.querySelector('#page-content');

//create a task array variable
var tasks = [];

var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert('You need to fill out the task form!');
        return false;
    }

    // check if task is new or one being edited by seeing if it has a data-task-id attribute

    var isEdit = formEl.hasAttribute('data-task-id');
    if (isEdit) {
        var taskId = formEl.getAttribute('data-task-id');
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } else {
        //package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: 'to do'
        }
        //send it as an argument to createTaskEl
        createTaskEL(taskDataObj);
    }
    //reset the Form
    formEl.reset();
};

var createTaskEL = function (taskDataObj) {
    // create list item 
    var listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';
    //assign a custom attribute (data-task-id) to list item (add ID)
    listItemEl.setAttribute('data-task-id', taskIdCounter)

    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement('div');
    //give it a class name
    taskInfoEl.className = 'task-info';
    //add HTML content to div
    taskInfoEl.innerHTML = '<h3 class ="task-name">' + taskDataObj.name + '</h3> <span class= "task-type">' + taskDataObj.type + '</span>';
    //append div to list item <li>
    listItemEl.appendChild(taskInfoEl);

    // create task actions (buttons and select) for task
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    
    switch (taskDataObj.status) {
        case "to do":
          taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
          tasksToDoEl.append(listItemEl);
          break;
        case "in progress":
          taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
          tasksInProgressEl.append(listItemEl);
          break;
        case "completed":
          taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
          tasksCompletedEl.append(listItemEl);
          break;
        default:
          console.log("Something went wrong!");
      }
    
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    // increase task counter for next unique id
    taskIdCounter++;

    //update localStorage
    saveTasks();
};


var createTaskActions = function (taskId) {
    // create container to hold elements    
    var actionContainerEl = document.createElement('div');
    actionContainerEl.className = 'task-actions';

    // create edit button
    var editButtonEl = document.createElement('button');
    editButtonEl.textContent = 'Edit';
    editButtonEl.className = 'btn edit-btn';
    editButtonEl.setAttribute('data-task-id', taskId);
    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement('button');
    deleteButtonEl.textContent = 'Delete';
    deleteButtonEl.className = 'btn delete-btn';
    deleteButtonEl.setAttribute('data-task-id', taskId);
    actionContainerEl.appendChild(deleteButtonEl);

    // create change status dropdown list 
    var statusSelectEl = document.createElement('select');
    statusSelectEl.className = 'select-status';
    statusSelectEl.setAttribute('name', 'status-change');
    statusSelectEl.setAttribute('data-task-id', taskId);

    // create status options
    var statusChoices = ['To Do', 'In Progress', 'Completed'];

    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement('option');
        statusOptionEl.setAttribute('value', statusChoices[i]);
        statusOptionEl.textContent = statusChoices[i];
        //append to Select
        statusSelectEl.appendChild(statusOptionEl);
    }
    actionContainerEl.appendChild(statusSelectEl);
    return actionContainerEl
}

var completeEditTask = function (taskName, taskType, taskId) {
    // find the matching task list item
    var taskSelected = document.querySelector('.task-item[data-task-id = "' + taskId + '"]');

    //set new values
    taskSelected.querySelector('h3.task-name').textContent = taskName;
    taskSelected.querySelector('span.task-type').textContent = taskType;

    // loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    alert('task updated!');

    // remove data attribute from form
    formEl.removeAttribute('data-task-id');
    // update formEl button to go back to saying "Add Task" instead of "Edit Task"
    document.querySelector('#save-task').textContent = 'Add Task';

    //update localStorage
    saveTasks();
}

var taskButtonHandler = function (event) {
    // get target element from event
    var targetEl = event.target;
    if (targetEl.matches('.delete-btn')) {
        var taskId = event.target.getAttribute('data-task-id');
        deleteTask(taskId);
    } else if (targetEl.matches('.edit-btn')) {
        var taskId = event.target.getAttribute('data-task-id');
        editTask(taskId);
    }
}

var taskStatusChangeHandler = function (event) {
    // get the task item's id
    var taskId = event.target.getAttribute('data-task-id');
    // find the parent task item element based on the id
    var taskSelected = document.querySelector('.task-item[data-task-id = "' + taskId + '"]');
    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    if (statusValue === 'to do') {
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === 'in progress') {
        tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === 'completed') {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    //update localStorage
    saveTasks();
}

var deleteTask = function (taskId) {
    console.log("deleting task #" + taskId);
    // find task list element with taskId value and remove it
    var selectedTask = document.querySelector('.task-item[data-task-id="' + taskId + '"]');
    selectedTask.remove();

    // create new array to hold updated list of tasks
    var updatedTasksArr = [];
    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTasksArr.push(tasks[i]);
        }
    }
    tasks = updatedTasksArr;

    //update localStorage
    saveTasks();
}

var editTask = function (taskId) {
    console.log("editing task #" + taskId);
    //get task list item element
    var selectedTask = document.querySelector('.task-item[data-task-id="' + taskId + '"]');
    // get content from task name and type
    var taskName = selectedTask.querySelector('h3.task-name').textContent;
    var taskType = selectedTask.querySelector('span.task-type').textContent;

    // write values of taskname and taskType to form to be edited
    document.querySelector('input[name="task-name"]').value = taskName;
    document.querySelector('select[name="task-type"]').value = taskType;

    // set data attribute to the form with a value of the task's id so it knows which one is being edited
    formEl.setAttribute('data-task-id', taskId);
    // update form's button to reflect editing a task rather than creating a new one
    document.querySelector('#save-task').textContent = 'Save Task';
}

var saveTasks = function () {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

var loadTasks = function () {

    // Gets task items from localStorage.
    var savedTasks = localStorage.getItem('tasks');
    // check for a null value
    if (!savedTasks) {
        // We don't want this function to keep running with no tasks to load onto the page.
        return false;
    }
    // convert a string to an array of objects
    savedTasks = JSON.parse(savedTasks);

    // Optimize the Code
    for (var i = 0; i < savedTasks.length; i++) {
        // pass each task object into the `createTaskEl()` function
        createTaskEL(savedTasks[i])
    }
}


    // for (var i = 0; i < tasks.length; i++) {

    //     taskIdCounter = tasks[i].id;

    //     // create list item 
    //     var listItemEl = document.createElement('li');
    //     listItemEl.className = 'task-item';
    //     //assign an id to list item 
    //     listItemEl.setAttribute('data-task-id', taskIdCounter)

    //     //create div to hold task info and add to list item
    //     var taskInfoEl = document.createElement('div');
    //     taskInfoEl.className = 'task-info';
    //     taskInfoEl.innerHTML = '<h3 class ="task-name">' + tasks[i].name + '</h3> <span class= "task-type">' + tasks[i].type + '</span>';
    //     listItemEl.appendChild(taskInfoEl);

    //     // create task actions (buttons and select) for task and add to list item
    //     var taskActionsEl = createTaskActions(taskIdCounter);
    //     listItemEl.appendChild(taskActionsEl);

    //     //append entire list item to list
    //     if (tasks[i].status === 'to do') {
    //         tasksToDoEl.appendChild(listItemEl);
    //         listItemEl.querySelector('select[name = "status-change"]').selectedIndex = 0;
    //     } else if (tasks[i].status === 'in progress') {
    //         tasksInProgressEl.appendChild(listItemEl);
    //         listItemEl.querySelector('select[name = "status-change"]').selectedIndex = 1;
    //     } else if (tasks[i].status === 'completed') {
    //         tasksCompletedEl.appendChild(listItemEl);
    //         listItemEl.querySelector('select[name = "status-change"]').selectedIndex = 2;
    //     }
    //     taskIdCounter++;
    //     console.log(listItemEl)
    // }



// Create a new task
formEl.addEventListener('submit', taskFormHandler);
// for edit and delete buttons
pageContentEl.addEventListener('click', taskButtonHandler);
// for changing the status
pageContentEl.addEventListener('change', taskStatusChangeHandler);

loadTasks();




