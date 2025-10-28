import "./css/style.css";
import Task from "./classes/Task.js";
import Project from "./classes/Project.js";

const addProjectBtn = document.querySelector("#addProject");
const projectsContainer = document.querySelector(".projects");
const tasksContainer = document.querySelector(".tasks");
const defaultProjectsArray = Array.from(
  document.querySelector(".default-projects").querySelectorAll("button")
);

let projectsBtnsArray = [];
let projects = loadProjectsFromStorage();
let activeProject = "Inbox";

if (!localStorage.getItem("projects")) {
  saveDefaultProjects();
}

renderProjects();
renderTasks();

function saveProjectsToStorage(projects) {
  if (projects instanceof Array) {
    let serializedProjects = JSON.stringify(projects);
    localStorage.setItem("projects", serializedProjects);
  } else {
    console.warn("You tried to add something that isn't an Array instance");
  }
}

function saveDefaultProjects() {
  // DEFAULT PROJECTS
  const Inbox = new Project("Inbox", true);
  Inbox.id = "Inbox";
  const Today = new Project("Today", true);
  Today.id = "Today";
  const ThisWeek = new Project("ThisWeek", true);
  ThisWeek.id = "ThisWeek";

  const projects = [Inbox, Today, ThisWeek];

  saveProjectsToStorage(projects);
}

function loadProjectsFromStorage() {
  let parsedProjects = JSON.parse(localStorage.getItem("projects")) ?? [];

  const seenIds = new Set();

  const projects = parsedProjects.map((project) => {
    const p = new Project(project.name, project.isDefault ?? false);

    if (project.id && !seenIds.has(project.id)) {
      p.id = project.id;
      seenIds.add(project.id);
    }

    if (!p.id || seenIds.has(p.id)) {
      p.id = crypto.randomUUID();
      seenIds.add(p.id);
    }

    p.tasks = project.tasks.map((t) => {
      const task = new Task(
        t.title,
        t.description,
        t.dueDate,
        t.priority,
        t.id
      );
      task.completed = t.completed;
      return task;
    });
    return p;
  });

  return projects;
}

function renderProjects() {
  projectsContainer.innerHTML = "";
  projects
    .filter((project) => !project.isDefault)
    .forEach((project) => {
      const btnProject = `<button class="project-btn" data-id=${project.id}>${project.name} </button>`;
      const buttonX = `<button class="delete-project btn-close" data-id="${project.id}" >X</button>`;
      const wrapper = `<div  class='flex flex-grow-1'> ${btnProject} ${buttonX} </div>`;
      projectsContainer.insertAdjacentHTML("beforeend", wrapper);
    });

  addEventListenerToProjectsBtns();
}

function getPriorityClass(priority) {
  switch (priority) {
    case "low":
      return "priority-low";
    case "med":
      return "priority-med";
    case "high":
      return "priority-high";
    default:
      return "";
  }
}

function renderTasks() {
  tasksContainer.innerHTML = "";

  const currentProject = projects.find((p) => p.id === activeProject);
  if (!currentProject) return;

  currentProject.tasks.forEach((task) => {
    const prClass = getPriorityClass(task.priority);
    const completedClass = task.completed ? "completed" : "";

    const html = `
      <div class="task-item ${prClass} ${completedClass}" data-id="${task.id}">
        <div class="task-content">
          <h4 class="task-title">${task.title}</h4>
          <p class="task-desc">${task.description}</p>
        </div>
        <small class="task-date">${task.dueDate}</small>
      </div>
    `;

    tasksContainer.insertAdjacentHTML("beforeend", html);
  });
}

addProjectBtn.addEventListener("click", () => {
  if (!document.querySelector(".new-project-wrapper")) {
    const input = `<input type="text" class="new-project-input" placeholder="project name">`;
    const button = `<button class="confirm-add">Add</button>`;
    const buttonX = `<button class="close-input">X</button>`;
    const wrapper = `<div class='flex new-project-wrapper'> ${input} ${button} ${buttonX} </div>`;
    projectsContainer.insertAdjacentHTML("beforeend", wrapper);
  }
});

projectsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("confirm-add")) {
    const input = document.querySelector(".new-project-input");
    const projectName = input.value.trim();

    if (projectName) {
      const newProject = new Project(projectName);
      projects.push(newProject);
      saveProjectsToStorage(projects);
      document.querySelector(".new-project-wrapper").remove();

      renderProjects();
    }
  }

  if (e.target.classList.contains("close-input")) {
    document.querySelector(".new-project-wrapper").remove();
  }

  if (e.target.classList.contains("delete-project")) {
    projects = projects.filter((p) => p.id !== e.target.dataset.id);
    saveProjectsToStorage(projects);
    renderProjects();
  }
});

function deleteActiveClass(projectsArray) {
  projectsArray.forEach((b) => b.classList.remove("active-project"));
}

function addEventListenerToProjectsBtns() {
  projectsBtnsArray = [...document.querySelectorAll(".project-btn")];
  let allProjectsBtns = [...defaultProjectsArray, ...projectsBtnsArray];

  allProjectsBtns.forEach((btn) => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });

  const updatedBtns = [
    ...document.querySelectorAll(".default-projects button"),
    ...document.querySelectorAll(".project-btn"),
  ];

  for (let btn of updatedBtns) {
    btn.addEventListener("click", function () {
      deleteActiveClass(updatedBtns);
      this.classList.add("active-project");
      activeProject = this.dataset.id || this.id;
      renderTasks();
    });
  }
}
