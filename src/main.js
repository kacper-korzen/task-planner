import './css/style.css';

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
    this.tasks = this.tasks.filter(task  => { return task.id !== taskId; })
  }

}

const project = new Project("Frontend learning");
const newTask = new Task("Learn JS", "Study classes", "2025-10-25", "3");

project.addTask(newTask);

// DEFAULT PROJECTS
const Inbox = new Project("Inbox");
Inbox.addTask(newTask);
const Today = new Project("Today");
const ThisWeek = new Project("ThisWeek");

//adding default projects to local storage
let serializedInbox = JSON.stringify(Inbox);
localStorage.setItem(Inbox.name, serializedInbox);
let deserializedInbox = JSON.parse(localStorage.getItem(Inbox.name));

let serializedToday = JSON.stringify(Today);
localStorage.setItem(Today.name, serializedToday);
let deserializedToday = JSON.parse(localStorage.getItem(Today.name));

let serializedThisWeek = JSON.stringify(ThisWeek);
localStorage.setItem(ThisWeek.name, serializedThisWeek);
let deserializedThisWeek = JSON.parse(localStorage.getItem(ThisWeek.name));


console.log(deserializedInbox);
console.log(deserializedToday);
console.log(deserializedThisWeek);

