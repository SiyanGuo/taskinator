var buttonEl = document.querySelector('#save-task');
var tasksToDoEl = document.querySelector('#tasks-to-do');

buttonEl.addEventListener('click', function(){
    var listItemEl = document.createElement('li');
    listItemEl.textContent = 'This is a new task';
    listItemEl.className = 'task-item';
    tasksToDoEl.appendChild(listItemEl);
});







