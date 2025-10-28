export const getPriorityClass = (priority) =>
  ({
    low: "priority-low",
    med: "priority-med",
    high: "priority-high",
  }[priority] ?? "");

export function removeActiveClass(projectsArray) {
  projectsArray.forEach((b) => b.classList.remove("active-project"));
}
