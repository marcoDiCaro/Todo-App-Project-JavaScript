class Todo {
  constructor(id = 0, text, completed = false) {
    this.id = id;
    this.text = text;
    this.completed = completed;
  }
}

let todos = [];

const notificaRendering = (notifica) => {
  const notificaContainer = document.getElementById("notificaContenitore");

  notificaContainer.innerHTML = ""; // Svuota il contenitore

  const text = document.createElement("p");
  text.classList.add("notifica-text");
  text.textContent = notifica;
  const removeNotifica = document.createElement("i");
  removeNotifica.classList.add(
    "fa-solid",
    "fa-xmark",
    "fa-2x",
    "remove-notifica"
  );

  notificaContainer.classList.add("notifica-container");
  notificaContainer.append(text, removeNotifica);

  removeNotifica.addEventListener("click", () => {
    notificaContainer.classList.remove("notifica-container");
    notificaContainer.innerHTML = ""; // Svuota il contenitore
  });
};

const inserimetoDatiLocalStorage = (todos) =>
  localStorage.setItem("todos", JSON.stringify(todos));

const updateTodos = (id, isCompleted) => {
  const todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todo.completed = isCompleted;
  }
  inserimetoDatiLocalStorage(todos); // Salvo dati nel localStorage (usando JSON)
};

const rimuoviTodo = (id) => {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    inserimetoDatiLocalStorage(todos); // Salvo dati nel localStorage (usando JSON)
    todosRendering(todos);
    const textNotifica = "todo rimosso";
    notificaRendering(textNotifica);
  }
};

const todosRendering = (todos) => {
  const todoBox = document.querySelector(".todo-box");
  todoBox.innerHTML = ""; // Svuota il contenitore prima di aggiungere nuovi elementi

  const activeBtn = document.querySelector(".active");
  const completedBtn = document.querySelector(".isCompleted");

  if (todos.length === 0) {
    todoBox.innerHTML = "<p class='empty'>Nessun todo disponibile</p>";
    activeBtn.disabled = true;
    completedBtn.disabled = true;
    return;
  }

  activeBtn.disabled = false;
  completedBtn.disabled = false;

  todos.forEach((todo) => {
    const { id, text, completed } = todo;

    const elementoTodo = document.createElement("div");

    elementoTodo.classList.add("elementoTodo");

    const remove = document.createElement("i");

    remove.classList.add("fa-solid", "fa-trash", "fa-2x", "remove");

    remove.addEventListener("click", () => {
      rimuoviTodo(id);
    });

    const p = document.createElement("p");

    p.classList.add("todo-text", completed ? "completed" : null);

    p.addEventListener("click", () => {
      p.classList.toggle("completed");
      const isCompleted = !completed;
      updateTodos(id, isCompleted);
    });

    p.textContent = text;

    elementoTodo.append(p, remove);

    todoBox.appendChild(elementoTodo);
  });
};

const createNewTodo = (input) => {
  const id = todos.length + 1;
  const todoObj = new Todo(id, input, false);
  todos = [...todos, todoObj]; // Crea un nuovo array invece di modificare l'originale
  inserimetoDatiLocalStorage(todos); // Salvo dati nel localStorage (usando JSON)
  todosRendering(todos);
  const textNotifica = "todo aggiunto";
  notificaRendering(textNotifica);
};

document.querySelector(".input-todo").addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (e.target.value !== "") {
      const inputUser = e.target.value.trim();
      createNewTodo(inputUser);
      e.target.value = "";
    }
  }
});

const filterTodos = (isActive) => {
  const todosFiltered = todos.filter((todo) =>
    isActive ? !todo.completed : todo.completed
  );
  return todosFiltered;
};

document
  .querySelector(".all")
  .addEventListener("click", () => todosRendering(todos));

document.querySelector(".active").addEventListener("click", () => {
  const filtered = filterTodos(true);
  todosRendering(filtered);
});

document.querySelector(".isCompleted").addEventListener("click", () => {
  const filtered = filterTodos(false);
  todosRendering(filtered);
});

document.querySelector(".clear-completed").addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed); // Rimuovi direttamente i completed
  inserimetoDatiLocalStorage(todos); // Salvo dati nel localStorage (usando JSON)
  todosRendering(todos);
});

const loadDati = () => {
  const dati = JSON.parse(localStorage.getItem("todos"));
  if (dati && dati.length > 0) {
    todos = dati;
  }
  todosRendering(todos);
};

loadDati();
