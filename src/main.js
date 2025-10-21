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

