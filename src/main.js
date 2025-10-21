import "./css/style.css";

class Task {
  constructor(title, description, dueDate, priority) {
    this.id = Date.now();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = false;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  getInfo() {
    console.log(JSON.stringify(this, null, 2));
  }
}

class Project {
  constructor(name) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.tasks = [];
  }

  addTask(task) {
    if (task instanceof Task) {
      this.tasks.push(task);
    } else {
      console.warn("You tried to add something that isn't a Task instance");
    }
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter((task) => {
      return task.id !== taskId;
    });
  }
}

const project = new Project("Frontend learning");
const newTask = new Task("Learn JS", "Study classes", "2025-10-25", "3");

project.addTask(newTask);

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

loadProjectsFromStorage();

// let deserializedToday = JSON.parse(localStorage.getItem('Today'));
// let deserializedInbox = JSON.parse(localStorage.getItem('Inbox'));
// let deserializedThisWeek = JSON.parse(localStorage.getItem('ThisWeek'));
// console.log(JSON.stringify(deserializedInbox, null, 2));
// console.log(JSON.stringify(deserializedToday, null, 2));
// console.log(JSON.stringify(deserializedThisWeek, null, 2));
