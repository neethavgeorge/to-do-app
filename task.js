//function call on form submit
//get user input
//display the input value to user

const taskForm = document.getElementById('taskForm')
const taskInput = document.getElementById('taskInput')
const errorMsg = document.getElementById('error')
const taskCardContainer = document.getElementById('taskCardContainer');

let tasks = [];
loadTaskList();

function loadTaskList() {
    if (tasks.length === 0) {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(res => res.json())
            .then(json => {
                tasks = json.map(item => ({
                    title: item.title,
                    completed: item.completed
                }));
                saveTaskList();
                filterTask('all');
            });
    } else {
        filterTask('all')
    }
    const stored = JSON.parse(localStorage.getItem('tasks'));
    if (stored) tasks = stored;

}

function getStatusList() {
    var dropdown = document.getElementById("data-filter").value;
    filterTask(dropdown)
}

function saveTaskList() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask(e) {
    e.preventDefault();// to prevent page refresh
    const title = taskInput.value.trim();

    if (title === '') {
        taskInput.classList.add('error');
        errorMsg.textContent = 'Task title cannot be empty.';
        return;
    }

    taskInput.classList.remove('error');
    errorMsg.textContent = '';

    let index = tasks.push({ title, completed: false }) - 1;
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';

    const taskTitle = document.createElement('span');
    taskTitle.className = 'task-title';
    taskTitle.textContent = title;

    const status = document.createElement('span');
    status.className = 'task-status';
    status.textContent = 'Pending';

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete'
    completeBtn.textContent = 'Completed'
    completeBtn.disabled = false;
    completeBtn.onclick = () => {
        tasks[index].completed = true;
        saveTaskList();
        filterTask('all');
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => {
        tasks.splice(index, 1);
        saveTaskList();
        filterTask('all');
    };

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);

    taskCard.appendChild(taskTitle);
    taskCard.appendChild(status);
    taskCard.appendChild(actions);

    // taskList.appendChild(taskCard);
    cell.appendChild(taskCard);
    row.appendChild(cell);
    taskCardContainer.appendChild(row);
    taskForm.reset();

}

function filterTask(filterValue) {
    // taskList.innerHTML = ''
    if ($.fn.DataTable.isDataTable('#taskTable')) {
        $('#taskTable').DataTable().clear().destroy();
    }
    taskCardContainer.innerHTML = '';
    const filtered = tasks.filter(task => {
        if (filterValue === 'all') return true
        if (filterValue === 'completed') return task.completed
        if (filterValue === 'pending') return !task.completed
        return true
    });

    filtered.forEach((task, index) => {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';

        const title = document.createElement('span');
        title.className = 'task-title';
        title.textContent = task.title;

        const status = document.createElement('span');
        status.className = 'task-status';
        status.textContent = task.completed ? 'Completed' : 'Pending';

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete';
        completeBtn.textContent = 'Completed';
        completeBtn.disabled = task.completed;
        completeBtn.onclick = () => {
            tasks[index].completed = true;
            saveTaskList();
            filterTask(filterValue);
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => {
            tasks.splice(index, 1);
            saveTaskList();
            filterTask(filterValue);
        };

        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);

        taskCard.appendChild(title);
        taskCard.appendChild(status);
        taskCard.appendChild(actions);

        // taskList.appendChild(taskCard);
        cell.appendChild(taskCard);
        row.appendChild(cell);
        taskCardContainer.appendChild(row);
    });

    loadTableData();
}

function loadTableData() {
    if (!$.fn.DataTable.isDataTable('#taskTable')) {
        $('#taskTable').DataTable({
            paging: true,
            pageLength: 5,
            lengthChange: false,
            ordering: false
        });
    } else {
        $('#taskTable').DataTable().clear().destroy();
        $('#taskTable').DataTable({
            paging: true,
            pageLength: 5,
            lengthChange: false,
            ordering: false
        });
    }
}