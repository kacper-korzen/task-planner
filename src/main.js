import "./css/style.css";
import Task from "./classes/Task.js";
import Project from "./classes/Project.js";
import {
  saveProjectsToStorage,
  saveDefaultProjects,
  loadProjectsFromStorage,
} from "./modules/storage.js";
import {
  renderProjects,
  renderTasks,
  addEventListenerToProjectsBtns,
} from "./modules/render.js";

const addProjectBtn = document.querySelector("#addProject");
const projectsContainer = document.querySelector(".projects");
const tasksContainer = document.querySelector(".tasks");
const defaultProjectsArray = Array.from(
  document.querySelector(".default-projects button")
);

let projects = loadProjectsFromStorage();
let activeProjectId = "Inbox";

function setActiveProjectId(id) {
  activeProjectId = id;
  renderTasks(projects, id, tasksContainer);
}

function renderAllProjects() {
  renderProjects(projects, projectsContainer, () =>
    addEventListenerToProjectsBtns(
      projects,
      tasksContainer,
      setActiveProjectId,
      renderTasks
    )
  );
}

function init() {
  if (!localStorage.getItem("projects")) {
    saveDefaultProjects();
    projects = loadProjectsFromStorage();
  }

  renderAllProjects();
  setActiveProjectId(activeProjectId);
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
  const target = e.target;
  if (target.classList.contains("confirm-add")) {
    const input = document.querySelector(".new-project-input");
    const projectName = input.value.trim();

    if (projectName) {
      const newProject = new Project(projectName);
      projects.push(newProject);
      saveProjectsToStorage(projects);
      document.querySelector(".new-project-wrapper").remove();

      renderAllProjects();
    }
  }

  if (target.classList.contains("close-input")) {
    document.querySelector(".new-project-wrapper").remove();
  }

  if (target.classList.contains("delete-project")) {
    projects = projects.filter((p) => p.id !== target.dataset.id);
    saveProjectsToStorage(projects);
    renderProjects(projects, projectsContainer, () => {
      addEventListenerToProjectsBtns(
        projects,
        defaultProjectsArray,
        tasksContainer,
        setActiveProjectId,
        renderTasks
      );
    });
  }
});

init();
