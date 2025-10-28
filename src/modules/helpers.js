export function getPriorityClass(priority) {
  switch (priority) {
    case "low":
      return "priority-low";
    case "med":
      return "priority-med";
    case "high":
      return "priority-high";
    default:
      return "";
  }
}

export function deleteActiveClass(projectsArray) {
  projectsArray.forEach((b) => b.classList.remove("active-project"));
}
