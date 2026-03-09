const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const openModalBtn = document.querySelector("#toggle-modal");
const modalBg = document.querySelector("#modal-bg");
const taskForm = document.querySelector("#task-form");
const taskTitle = document.querySelector("#task-title");
const taskDesc = document.querySelector("#task-desc");
const taskStatus = document.querySelector("#task-status");

                
let tasksData = [];

// Drag and drop setup
document.querySelectorAll(".task").forEach(task => {
    task.addEventListener("dragstart", () => {
        draggedTask = task;
    });
});

// Column drag events
[todo, progress, done].forEach(column => addDragEventsOnColumn(column));

function addDragEventsOnColumn(column) {
    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add("hover-over");
    });

    column.addEventListener("dragover", (e) => e.preventDefault());

    column.addEventListener("dragleave", () => {
        column.classList.remove("hover-over");
    });

    column.addEventListener("drop", (e) => {
        e.preventDefault();
        if (!draggedTask) return;

        const task = tasksData.find(t => t.id === draggedTask.dataset.id);
        if (task) {
            task.status = column.id;
            saveTasks();
        }

        column.insertBefore(draggedTask, column.querySelector(".heading").nextSibling);
        draggedTask = null;
        column.classList.remove("hover-over");
        updateCounts();
    });
}

// Modal events
openModalBtn.addEventListener("click", () => modalBg.classList.remove("hidden"));
modalBg.addEventListener("click", (e) => {
        

    if (e.target === modalBg) {
        modalBg.classList.add("hidden");}
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modalBg.classList.add("hidden");
});

// Task management
function createTask(taskObj) {
    const task = document.createElement("div");
    task.classList.add("task");
    task.setAttribute("draggable", "true");
    task.dataset.id = taskObj.id;
    task.innerHTML = `<h2>${taskObj.title}</h2><p>${taskObj.description}</p><button>Delete</button>`;
    task.querySelector("button").addEventListener("click", () => deleteTask(taskObj.id));
    task.addEventListener("dragstart", () => { draggedTask = task; });
    return task;
}

function renderTask(taskObj) {
    const taskEl = createTask(taskObj);
    const columnMap = { todo, progress, done };
    columnMap[taskObj.status]?.appendChild(taskEl);
}

function deleteTask(id) {
    tasksData = tasksData.filter(task => task.id !== id);
    document.querySelector(`[data-id="${id}"]`).remove();
    saveTasks();
    updateCounts();
}

function updateCounts() {
    document.querySelector("#todo-count").textContent = todo.querySelectorAll(".task").length;
    document.querySelector("#inprogress-count").textContent = progress.querySelectorAll(".task").length;
    document.querySelector("#done-count").textContent = done.querySelectorAll(".task").length;
}

function saveTasks() {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasksData));
}

function loadTasks() {
    const stored = localStorage.getItem("kanbanTasks");
    tasksData = stored ? JSON.parse(stored) : [];
}
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    tasksData.push({
        id: crypto.randomUUID(),
        title: taskTitle.value.trim(),
        description: taskDesc.value.trim(),
        status: taskStatus.value
    });
    saveTasks();
    renderTask(tasksData[tasksData.length - 1]);
    modalBg.classList.add("hidden");
    taskForm.reset();
    updateCounts();
});


// Initialize
loadTasks();
tasksData.forEach(renderTask);
updateCounts();

