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
  renderTaskForm,
} from "./modules/render.js";
import {
  addTask,
  deleteTask,
  toggleTaskCompletion,
} from "./modules/taskActions.js";

// --- DOM Elements ---
const addProjectBtn = document.querySelector("#addProject");
const projectsContainer = document.querySelector(".projects");
const tasksContainer = document.querySelector(".tasks");
const defaultProjectsArray = Array.from(
  document.querySelectorAll(".default-projects button")
);
const addTaskBtn = document.querySelector(".btn-task");

// --- State ---
let projects = loadProjectsFromStorage();
let activeProjectId = "Inbox";

// --- State Management ---
function setActiveProjectId(id) {
  activeProjectId = id;
  updateAddTaskBtnState(activeProjectId);
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

function updateAddTaskBtnState(projectId) {
  if (projectId === "Today" || projectId === "ThisWeek") {
    addTaskBtn.classList.add('hidden');
  } else {
    addTaskBtn.classList.remove('hidden');
  } 
}


// --- Initialization ---
function init() {
  if (!localStorage.getItem("projects")) {
    saveDefaultProjects();
    projects = loadProjectsFromStorage();
  }

  renderAllProjects();
  setActiveProjectId(activeProjectId);
  setupEventListeners();
}

// --- Event Listeners ---
function setupEventListeners() {
  // Adding project
  addProjectBtn.addEventListener("click", () => {
    if (!document.querySelector(".new-project-wrapper")) {
      const input = `<input type="text" class="new-project-input" placeholder="project name">`;
      const button = `<button class="confirm-add">Add</button>`;
      const buttonX = `<button class="close-input">X</button>`;
      const wrapper = `<div class='flex new-project-wrapper'> ${input} ${button} ${buttonX} </div>`;
      projectsContainer.insertAdjacentHTML("beforeend", wrapper);
    }
  });

  // Handling clicks in the project container
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

  // Adding tasks
  addTaskBtn.addEventListener("click", () => {
    const existingForm = document.querySelector(".task-form");
    if (existingForm) return;

    renderTaskForm(tasksContainer, (taskData) => {
      console.log("Adding task to:", activeProjectId, projects.map(p => p.id));
      addTask(projects, activeProjectId, tasksContainer, taskData);
      saveProjectsToStorage(projects);
    });
  });

  tasksContainer.addEventListener("click", (e) => {
    const taskEl = e.target.closest(".task-item");
    if (!taskEl) return;

    const taskId = taskEl.dataset.id;

    if (e.target.classList.contains("delete-task")) {
      deleteTask(projects, activeProjectId, taskId, tasksContainer);
      saveProjectsToStorage(projects);
    }

    if (e.target.classList.contains("toggle-task")) {
      toggleTaskCompletion(projects, activeProjectId, taskId, tasksContainer);
      saveProjectsToStorage(projects);
    }
  });
}

init();
