import "./css/style.css";
import Task from './classes/Task.js'
import Task from './classes/Project.js'

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
  const Inbox = new Project("Inbox");
  const Today = new Project("Today");
  const ThisWeek = new Project("ThisWeek");

  const projects = [Inbox, Today, ThisWeek];

  saveProjectsToStorage(projects);
}

function loadProjectsFromStorage() {
  saveDefaultProjects();
  let parsedProjects = JSON.parse(localStorage.getItem("projects")) ?? [];
  const projects = parsedProjects.map((project) => {
    const p = new Project(project.name);
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
}

