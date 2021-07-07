// form element
var formEl = document.querySelector('#task-form');
// ul element
var tasksToDoEl = document.querySelector('#tasks-to-do');
// main element
var pageContentEl = document.querySelector('#page-content');
var taskIdCounter = 0;

var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    //package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    }
    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert('You need to fill out the task form!')
        return false;
    }
    //send it as an argument to createTaskEl
    createTaskEL(taskDataObj);
    //reset the Form
    formEl.reset();
};

var createTaskEL = function (taskDataObj) {
    // create list item 
    var listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';

    //assign a custom attribute(data-task-id) to list item
    listItemEl.setAttribute('data-task-id', taskIdCounter)

    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement('div');
    //give it a class name
    taskInfoEl.className = 'task-info';
    //add HTML content to div
    taskInfoEl.innerHTML = '<h3 class ="task-name">' + taskDataObj.name + '</h3> <span class= "task-type">' + taskDataObj.type + '</span>';

    listItemEl.appendChild(taskInfoEl);

    //function returns a DOM element, we store it in a var and append it to the list item with task info
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    //add entire list item to list
    tasksToDoEl.appendChild(listItemEl);
    // increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function (taskId) {
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

    // create dropdown list 
    var statusSelectEl = document.createElement('select');
    statusSelectEl.className = 'select-status';
    statusSelectEl.setAttribute('name', 'status-change');
    statusSelectEl.setAttribute('data-task-id', taskId);

    // add options to select
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

formEl.addEventListener('submit', taskFormHandler);

var deleteTask = function (taskId) {
    console.log("deleting task #" + taskId);
    //get task list item element
    var selectedTask = document.querySelector('.task-item[data-task-id="' + taskId + '"]');
    selectedTask.remove();
}

var editTask = function(taskId){
    console.log("editing task #" + taskId);
    //get task list item element
    var selectedTask = document.querySelector('.task-item[data-task-id="' + taskId + '"]');
    // get content from task name and type
    var taskName = selectedTask.querySelector('h3.task-name').textContent;
    var taskType = selectedTask.querySelector('span.task-type').textContent;
    document.querySelector('input[name="task-name"]').value = taskName;
    document.querySelector('select[name="task-type"]').value = taskType;
    document.querySelector('#save-task').textContent = 'Save Task';
    formEl.setAttribute('data-task-id', taskId);

}

var taskButtonHandler = function (event) {
var targetEl= event.target;
    if (targetEl.matches('.delete-btn')) {
        var taskId = event.target.getAttribute('data-task-id');
        deleteTask(taskId);
    }
    if (targetEl.matches('.edit-btn')) {
        var taskId = event.target.getAttribute('data-task-id');
        editTask(taskId);
    }

}

pageContentEl.addEventListener('click', taskButtonHandler);








