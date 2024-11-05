// DOM Elements
const todoInput = document.getElementById("todoInput");
const addButton = document.getElementById("addButton");
const todoList = document.getElementById("todoList");
const emptyState = document.getElementById("emptyState");

// Load todos from localStorage
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Save todos to localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Create new todo element
function createTodoElement(todo) {
  const li = document.createElement("li");
  li.className = `todo-item ${todo.completed ? "completed" : ""}`;
  li.dataset.id = todo.id;

  li.innerHTML = `
        <input type="checkbox" ${todo.completed ? "checked" : ""}>
        <span class="todo-text">${todo.text}</span>
        <input type="text" class="edit-input">
        <button class="action-btn edit-btn">✏️</button>
        <button class="action-btn delete-btn">🗑️</button>
    `;

  // Add event listeners
  const checkbox = li.querySelector('input[type="checkbox"]');
  const editBtn = li.querySelector(".edit-btn");
  const deleteBtn = li.querySelector(".delete-btn");

  checkbox.addEventListener("change", () => toggleTodo(todo.id));
  editBtn.addEventListener("click", () => editTodo(todo.id));
  deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

  return li;
}

// Add new todo
function addTodo() {
  const text = todoInput.value.trim();
  if (text) {
    const todo = {
      id: Date.now(),
      text,
      completed: false,
    };
    todos.push(todo);
    todoInput.value = "";
    renderTodos();
    saveTodos();
  }
}

// Toggle todo completion
function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  renderTodos();
  saveTodos();
}

// Delete todo
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  renderTodos();
  saveTodos();
}

// Edit todo
function editTodo(id) {
  const todoItem = document.querySelector(`[data-id="${id}"]`);
  const todoText = todoItem.querySelector(".todo-text");
  const editInput = todoItem.querySelector(".edit-input");

  todoItem.classList.add("editing");
  editInput.value = todoText.textContent;
  editInput.focus();

  function saveEdit() {
    const newText = editInput.value.trim();
    if (newText) {
      todos = todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      );
      renderTodos();
      saveTodos();
    }
  }

  editInput.addEventListener("blur", saveEdit);
  editInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveEdit();
      editInput.removeEventListener("blur", saveEdit);
    }
  });
}

// Render todos
function renderTodos() {
  todoList.innerHTML = "";
  emptyState.style.display = todos.length ? "none" : "block";

  todos.forEach((todo) => {
    todoList.appendChild(createTodoElement(todo));
  });
}

// Event Listeners
addButton.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTodo();
});

// Initial render
renderTodos();
