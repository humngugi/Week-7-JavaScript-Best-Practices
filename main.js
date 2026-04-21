// ================= STATE =================
const STORAGE_KEY = "todo_tasks";

let tasks = [];
let currentFilter = "all";

// ================= DOM =================
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");

const totalEl = document.getElementById("total");
const activeEl = document.getElementById("active");
const completedEl = document.getElementById("completed");

const filters = document.querySelectorAll(".filter");
const clearBtn = document.getElementById("clearCompleted");

// ================= INIT =================
function init() {
  loadTasks();
  render();

  addBtn.addEventListener("click", handleAddTask);
  input.addEventListener("keypress", handleKeyPress);
  list.addEventListener("click", handleListClick);
  list.addEventListener("change", handleListChange);

  filters.forEach(btn => {
    btn.addEventListener("click", handleFilterChange);
  });

  clearBtn.addEventListener("click", handleClearCompleted);
}

init();

// ================= STORAGE =================
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  tasks = stored ? JSON.parse(stored) : [];
}

// ================= HANDLERS =================

// Add task button / Enter key
function handleAddTask() {
  const text = input.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false
  };

  tasks.push(newTask);
  input.value = "";

  saveTasks();
  render();
}

function handleKeyPress(e) {
  if (e.key === "Enter") handleAddTask();
}

// Handle checkbox toggle
function handleListChange(e) {
  if (e.target.matches('input[type="checkbox"]')) {
    const id = Number(e.target.closest("li").dataset.id);
    toggleTask(id);
  }
}

// Handle delete button
function handleListClick(e) {
  if (e.target.matches("button")) {
    const id = Number(e.target.closest("li").dataset.id);
    deleteTask(id);
  }
}

// Filter buttons
function handleFilterChange(e) {
  document.querySelector(".filter.active").classList.remove("active");
  e.target.classList.add("active");

  currentFilter = e.target.dataset.filter;
  render();
}

// Clear completed
function handleClearCompleted() {
  tasks = tasks.filter(task => !task.completed);

  saveTasks();
  render();
}

// ================= LOGIC =================

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );

  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);

  saveTasks();
  render();
}

// ================= RENDER =================

function render() {
  renderTasks();
  updateStats();
}

function renderTasks() {
  list.innerHTML = "";

  const filteredTasks = getFilteredTasks();

  filteredTasks.forEach(task => {
    const li = createTaskElement(task);
    list.appendChild(li);
  });
}

function getFilteredTasks() {
  if (currentFilter === "active") {
    return tasks.filter(task => !task.completed);
  }
  if (currentFilter === "completed") {
    return tasks.filter(task => task.completed);
  }
  return tasks;
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;

  if (task.completed) {
    li.classList.add("completed");
  }

  li.innerHTML = `
    <label class="task-item">
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <span>${task.text}</span>
    </label>
    <button>✖</button>
  `;

  return li;
}

// ================= STATS =================

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;

  totalEl.textContent = total;
  activeEl.textContent = active;
  completedEl.textContent = completed;
}