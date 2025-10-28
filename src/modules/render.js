import { getPriorityClass } from "./helpers.js";
import { deleteActiveClass } from "./helpers.js";

//fix adding event listeners to project
export function renderProjects(
  projects,
  projectsContainer,
  addEventListenerToProjectsBtns
) {
  projectsContainer.innerHTML = "";
  projects
    .filter((project) => !project.isDefault)
    .forEach((project) => {
      const btnProject = `<button class="project-btn" data-id=${project.id}>${project.name} </button>`;
      const buttonX = `<button class="delete-project btn-close" data-id="${project.id}" >X</button>`;
      const wrapper = `<div  class='flex flex-grow-1'> ${btnProject} ${buttonX} </div>`;
      projectsContainer.insertAdjacentHTML("beforeend", wrapper);
    });

  addEventListenerToProjectsBtns(
    projects,
    tasksContainer,
    setActiveProjectId,
    renderTasks
  );
}

export function renderTasks(projects, activeProject, tasksContainer) {
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
      deleteActiveClass(allBtns);
      this.classList.add("active-project");
      const newActive = this.dataset.id || this.id;
      setActiveProject(newActive);
      renderTasks(projects, newActive, tasksContainer);
    });
  });
}
