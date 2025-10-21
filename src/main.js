import "./css/style.css";
import Task from "./classes/Task.js";
import Project from "./classes/Project.js";

const addProjectBtn = document.querySelector("#addProject");
const projectsContainer = document.querySelector(".projects");

if (!localStorage.getItem("projects")) {
  saveDefaultProjects();
}

let projects = loadProjectsFromStorage();
renderProjects();

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
      const btnProject = `<button data-id="${project.id}">${project.name} </button>`;
      projectsContainer.insertAdjacentHTML("beforeend", btnProject);
    });
}

addProjectBtn.addEventListener("click", () => {
  if (!document.querySelector(".new-project-wrapper")) {
    const input = `<input type="text" class="new-project-input" placeholder="project name">`;
    const button = `<button class="confirm-add">Add</button>`;
    const wrapper = `<div class='flex new-project-wrapper'> ${input} ${button} </div>`;
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
      console.log(projects);
      document.querySelector(".new-project-wrapper").remove();

      renderProjects();
    }
  }
});
