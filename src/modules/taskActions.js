import Task from "../classes/Task.js";
import { saveProjectsToStorage } from "./storage.js";
import { renderTasks } from "./render.js";

export function addTask(projects, projectId, container, taskData) {
  const { title, description, dueDate, priority } = taskData;

  if (!title?.trim()) {
    alert("Please enter task title.");
    return;
  }

  const project = projects.find((p) => p.id === projectId);
  if (!project) return console.warn("Activate project not found");

  const newTask = new Task(title.trim(), description, dueDate, priority);
  project.tasks.push(newTask);

  saveProjectsToStorage(projects);
  renderTasks(projects, projectId, container);
}

export function deleteTask(projects, activeProjectId, taskId, tasksContainer) {
  const project = projects.find((p) => p.id === taskId);
  if (!project) return;

  project.tasks = projects.tasks.filter((t) => t.id !== taskId);
}

export function toggleTaskCompletion(projects, projectId, taskId, container) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;

  const task = project.tasks.find((t) => t.id === taskId);
  if (task) task.completed = !task.completed;

  saveProjectsToStorage(projects);
  renderTasks(projects, projectId, container);
}
