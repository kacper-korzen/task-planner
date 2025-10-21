export default class Task {
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
