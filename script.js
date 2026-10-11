console.log("Student Task Manager started");
console.log("Task done bye Student B");
console.log("Hahah hehe");

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Fetch and display tasks from backend
async function fetchTasks() {
    try {
        const response = await fetch("/api/tasks");
        if (response.ok) {
            const tasks = await response.json();
            renderTasks(tasks);
        }
    } catch (err) {
        console.log("Running in offline mode or static view");
    }
}

// Render task list
function renderTasks(tasks) {
    taskList.innerHTML = "";
    tasks.forEach(task => {
        addTaskToUI(task.text, task.id);
    });
}

// Add task to DOM
function addTaskToUI(text, id) {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";

    const span = document.createElement("span");
    span.textContent = text;

    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.style.marginLeft = "10px";
    delBtn.style.padding = "4px 8px";
    delBtn.onclick = async () => {
        if (id) {
            try {
                await fetch(`/api/tasks/${id}`, { method: "DELETE" });
            } catch (e) {
                console.error(e);
            }
        }
        li.remove();
    };

    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
}

// Add new task
async function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    try {
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });
        if (response.ok) {
            const newTask = await response.json();
            addTaskToUI(newTask.text, newTask.id);
        } else {
            addTaskToUI(text, Date.now());
        }
    } catch (err) {
        addTaskToUI(text, Date.now());
    }

    taskInput.value = "";
}

if (addTaskBtn) {
    addTaskBtn.addEventListener("click", addTask);
}

if (taskInput) {
    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTask();
    });
}

// Initial load
fetchTasks();