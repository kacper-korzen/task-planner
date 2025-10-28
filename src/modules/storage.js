import Project from "../classes/Project.js";
import Task from "../classes/Task.js";

export function saveProjectsToStorage(projects) {
  if (projects instanceof Array) {
    let serializedProjects = JSON.stringify(projects);
    localStorage.setItem("projects", serializedProjects);
  } else {
    console.warn("You tried to add something that isn't an Array instance");
  }
}

export function saveDefaultProjects() {
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

export function loadProjectsFromStorage() {
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
