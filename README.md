# Task planner

A modern and responsive to-do list web application built using **Vanilla JavaScript (ES6 modules)**, **HTML**, and **CSS** — developed as part of The Odin Project’s JavaScript curriculum, then extended with improved logic and UI refinements.

## 🧩 Description

Task Planner is a lightweight, dynamic task management app that allows users to create, organize, and track tasks efficiently.  
The app emphasizes **clean modular architecture**, **DOM-based rendering**, and **persistent local data storage** via `localStorage`.

Each task can be assigned a **priority**, **due date**, and completion state.  
Tasks are grouped under **projects**, making it easy to manage different categories of work or personal goals.

---

## ✨ Features

- 🧱 **Modular JavaScript (ES6)** – clean separation into classes and modules (`Project`, `Task`, `render`, `taskActions`, `storage`).
- 💾 **Persistent data** – all projects and tasks are saved using `localStorage`.
- 🗂️ **Project-based organization** – create, rename, and delete projects to group related tasks.
- 📝 **Task management** – add, delete, and mark tasks as completed.
- 🎯 **Task priorities** – low / medium / high, each visually highlighted with custom colors.
- 📅 **Due dates** – sort tasks by upcoming deadlines.
- 🧠 **Smart views** – “Today” and “This Week” dynamically filter tasks from the Inbox.
- 🎨 **Modern responsive UI** – fully redesigned cards, smooth hover effects, and soft color palette.
- ⚙️ **No frameworks** – built entirely in vanilla JS, HTML, and CSS for learning purposes.
- 🚀 **Built with [Vite](https://vitejs.dev/)** – fast local development and automatic reloading.

---

## Demo

[**Live Demo**](https://kacper-korzen.github.io/task-planner) | [**Project Specs**](https://www.theodinproject.com/lessons/node-path-javascript-todo-list#project-solution)

## Screenshots

![To-Do List Screenshot](./public/app-screenshot.png)

## Getting Started

To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/kacper-korzen/todo-list.git
   cd todo-list
   npm install
   npm run dev
