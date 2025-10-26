import "./css/style.css";
import Task from "./classes/Task.js";
import Project from "./classes/Project.js";

const addProjectBtn = document.querySelector("#addProject");
const projectsContainer = document.querySelector(".projects");
const tasksContainer = document.querySelector(".tasks");
const defaultProjects = document.querySelector(".default-projects");
const defaultProjectsBtns = Array.from(defaultProjects.querySelectorAll('button'));
const projectsBtns = Array.from(projectsContainer.querySelectorAll('button'));


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
  const Today = new Project("Today", true);
  const ThisWeek = new Project("ThisWeek", true);

  const projects = [Inbox, Today, ThisWeek];

  saveProjectsToStorage(projects);
}

function loadProjectsFromStorage() {
  let parsedProjects = JSON.parse(localStorage.getItem("projects")) ?? [];
  const projects = parsedProjects.map((project) => {
    const p = new Project(project.name, project.isDefault ?? false);
    p.id = project.id;
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
      const btnProject = `<button>${project.name} </button>`;
      const buttonX = `<button class="delete-project btn-close" data-id="${project.id}" >X</button>`;
      const wrapper = `<div  class='flex flex-grow-1'> ${btnProject} ${buttonX} </div>`;
      projectsContainer.insertAdjacentHTML("beforeend", wrapper);
    });
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

  const currentProject = projects.find((p) => p.name === activeProject);
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
  projectsArray.forEach(b => b.classList.remove('active-project'));
}


function addEventListenerToProjectsBtns() {
  // fix adding projects buttons to this array
  let allProjecsBtns = [...defaultProjects, ...projectsBtns];

  for (let btn of allProjecsBtns) {
    btn.addEventListener('click', function ()  {
      deleteActiveClass(defaultProjectsBtns);
      this.classList.add('active-project');
      activeProject = this.id;
      renderTasks();     
    });
  }

}

addEventListenerToProjectsBtns();


