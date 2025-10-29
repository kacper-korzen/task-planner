import { getPriorityClass, removeActiveClass } from "./helpers.js";
import { isToday, isThisWeek, parseISO } from "date-fns";

export function renderProjects(projects, container, onProjectClick) {
  container.innerHTML = "";
  projects
    .filter((project) => !project.isDefault)
    .forEach((project) => {
      const btnProject = `<button class="project-btn" data-id=${project.id}>${project.name} </button>`;
      const buttonX = `<button class="delete-project btn-close" data-id="${project.id}" >X</button>`;
      const wrapper = `<div class='flex flex-grow-1'> ${btnProject} ${buttonX} </div>`;
      container.insertAdjacentHTML("beforeend", wrapper);
    });

  onProjectClick();
}

export function renderTasks(projects, activeProjectId, container) {
  container.innerHTML = "";

  const project = projects.find((p) => p.id === activeProjectId);
  if (!project) return;

  let tasksToRender = [];
  const inbox = projects.find((p) => p.id === "Inbox");

  if (activeProjectId === "Today" && inbox) {
    tasksToRender = inbox.tasks.filter((task) =>
      isToday(parseISO(task.dueDate))
    );
  } else if (activeProjectId === "ThisWeek" && inbox) {
    tasksToRender = inbox.tasks.filter((task) =>
      isThisWeek(parseISO(task.dueDate), { weekStartsOn: 1 })
    );
  } else {
    const project = projects.find((p) => p.id === activeProjectId);
    if (!project) return;
    tasksToRender = project.tasks
      .slice()
      .sort((a, b) => parseISO(a.dueDate) - parseISO(b.dueDate));
  }

  if (tasksToRender.length === 0) {
    container.innerHTML = `<p class="no-tasks">Brak tasków do wyświetlenia</p>`;
    return;
  }

  tasksToRender.forEach((task) => {
    const prClass = getPriorityClass(task.priority);
    const completedClass = task.completed ? "completed" : "";

    const html = `
      <div class="task-item ${prClass} ${completedClass}" data-id="${task.id}">
        <div class="task-content">
          <h4 class="task-title">${task.title}</h4>
          <p class="task-desc">${task.description}</p>
        </div>
        <small class="task-date">${task.dueDate}</small>
        <div class="task-actions">
          <button class="toggle-task">✔</button>
          <button class="delete-task">🗑</button>
        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", html);
  });
}

export function addEventListenerToProjectsBtns(
  projects,
  tasksContainer,
  setActiveProject,
  renderTasks
) {
  const defaultBtns = Array.from(
    document.querySelectorAll(".default-projects button")
  );
  const projectBtns = Array.from(document.querySelectorAll(".project-btn"));

  const allBtns = [...defaultBtns, ...projectBtns];

  allBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      removeActiveClass(allBtns);
      this.classList.add("active-project");

      const newActive = this.dataset.id || this.id;
      setActiveProject(newActive);
      renderTasks(projects, newActive, tasksContainer);
    });
  });
}

export function renderTaskForm(container, onSubmit) {
  const today = new Date().toISOString().split("T")[0];

  const html = `<div class="task-form">
      <input type="text" id="taskTitle" placeholder="Task title" required />
      <input type="text" id="taskDesc" placeholder="Description" />
      <input type="date" id="taskDate" value="${today}" />
      <select id="taskPriority">
        <option value="low" selected>Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button id="confirmAddTask">Add Task</button>
    </div>`;

  container.insertAdjacentHTML("beforeend", html);

  const addBtn = document.querySelector("#confirmAddTask");
  addBtn.addEventListener("click", () => {
    const taskData = {
      title: document.querySelector("#taskTitle").value.trim(),
      description: document.querySelector("#taskDesc").value.trim(),
      dueDate: document.querySelector("#taskDate").value,
      priority: document.querySelector("#taskPriority").value,
    };

    if (!taskData.title) return;
    onSubmit(taskData);
  });
}
