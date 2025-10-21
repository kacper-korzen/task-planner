import Task from "./Task.js";

export default class Project {
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
