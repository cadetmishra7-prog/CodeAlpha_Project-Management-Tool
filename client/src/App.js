import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [projects, setProjects] = useState(() => {
  const savedProjects = localStorage.getItem("projects");

  return savedProjects
    ? JSON.parse(savedProjects)
    : [
        {
          id: 1,
          title: "Project Alpha",
          description: "Project Management Tool",
          tasks: [],
        },
        {
          id: 2,
          title: "Project Beta",
          description: "E-Commerce Website",
          tasks: [],
        },
      ];
});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] =
  useState(false);
useEffect(() => {
  

  localStorage.setItem(
    "projects",
    JSON.stringify(projects)
  );
}, [projects]);

  const addProject = () => {
    if (title.trim() === "" || description.trim() === "") {
      alert("Please fill all fields");
      return;
    }

    const newProject = {
      id: Date.now(),
      title,
      description,
      tasks: [],
    };

    setProjects([...projects, newProject]);

    setTitle("");
    setDescription("");
  };

  const addTask = (projectId) => {
    const taskName = prompt("Enter Task Name");
    const dueDate = prompt("Enter Due Date");
    const priority = prompt("Enter Priority (High/Medium/Low)");

const validPriority =
  priority === "High" ||
  priority === "Medium" ||
  priority === "Low"
    ? priority
    : "Medium";
    if (!taskName) return;

    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: [
                ...project.tasks,
                {
  name: taskName,
  status: "To Do",
  assignedTo: "Unassigned",
  dueDate: dueDate,
  priority: validPriority,
},
              ],
            }
          : project
      )
    );
  };

  const deleteTask = (projectId, taskIndex) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.filter(
                (_, index) => index !== taskIndex
              ),
            }
          : project
      )
    );
  };

  const deleteProject = (projectId) => {
    setProjects(projects.filter((p) => p.id !== projectId));
  };

  const editProject = (projectId) => {
    const newTitle = prompt("Enter new project title");

    if (!newTitle) return;

    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? { ...project, title: newTitle }
          : project
      )
    );
  };

  const changeStatus = (projectId, taskIndex) => {
    const updatedProjects = [...projects];

    const project = updatedProjects.find(
      (p) => p.id === projectId
    );

    const task = project.tasks[taskIndex];

    if (task.status === "To Do") {
      task.status = "In Progress";
    } else if (task.status === "In Progress") {
      task.status = "Done";
    }

    setProjects(updatedProjects);
  };
  const assignTask = (projectId, taskIndex) => {
  const member = prompt("Assign task to:");

  if (!member) return;

  const updatedProjects = [...projects];

  const project = updatedProjects.find(
    (p) => p.id === projectId
  );

  project.tasks[taskIndex].assignedTo = member;

  setProjects(updatedProjects);
};
const editTask = (projectId, taskIndex) => {
  const updatedProjects = [...projects];

  const project = updatedProjects.find(
    (p) => p.id === projectId
  );

  const task = project.tasks[taskIndex];

  const newName = prompt("Enter Task Name:", task.name);
  if (!newName) return;

  const newDueDate = prompt(
    "Enter Due Date:",
    task.dueDate || ""
  );

  const newPriority = prompt(
    "Enter Priority (High/Medium/Low):",
    task.priority || "Medium"
  );

  const newAssignedTo = prompt(
    "Assign To:",
    task.assignedTo || "Unassigned"
  );

  task.name = newName;
  task.dueDate = newDueDate;
  task.priority = ["High", "Medium", "Low"].includes(newPriority)
    ? newPriority
    : "Medium";
  task.assignedTo = newAssignedTo || "Unassigned";

  setProjects(updatedProjects);
};
  const exportData = () => {
  const dataStr = JSON.stringify(
    projects,
    null,
    2
  );

  const blob = new Blob([dataStr], {
    type: "application/json",
  });

  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download = "projects.json";

  link.click();
};
  return (
    <div className={darkMode ? "dark" : ""}>
      <Navbar />
       <button
  className="theme-btn"
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
</button>
      <div className="dashboard">
        <h1>📋 Project Management Dashboard</h1>

        <div className="form-container">
          <input
            type="text"
            placeholder="Project Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            className="create-btn"
            onClick={addProject}
          >
            + Create Project
          </button>
          <input
  type="text"
  placeholder="Search Project"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    marginTop: "10px",
    padding: "10px",
    width: "100%"
  }}
/>
        </div>
        <div className="stats">
  <h3>Total Projects: {projects.length}</h3>

  <h3>
    Total Tasks: {
      projects.reduce(
        (total, project) =>
          total + project.tasks.length,
        0
      )
    }
  </h3>

  <h3>
    Completed Tasks: {
      projects.reduce(
        (total, project) =>
          total +
          project.tasks.filter(
            (task) => task.status === "Done"
          ).length,
        0
      )
    }
  </h3>
  <h3>
  Pending Tasks: {
    projects.reduce(
      (total, project) =>
        total +
        project.tasks.filter(
          (task) => task.status !== "Done"
        ).length,
      0
    )
  }
</h3>
<h3>
  In Progress: {
    projects.reduce(
      (total, project) =>
        total +
        project.tasks.filter(
          (task) =>
            task.status === "In Progress"
        ).length,
      0
    )
  }
</h3>
<h3>
  To Do: {
    projects.reduce(
      (total, project) =>
        total +
        project.tasks.filter(
          (task) =>
            task.status === "To Do"
        ).length,
      0
    )
  }
</h3>
<h3>
  Done: {
    projects.reduce(
      (total, project) =>
        total +
        project.tasks.filter(
          (task) =>
            task.status === "Done"
        ).length,
      0
    )
  }
</h3>
</div>
         <button className="create-btn" onClick={exportData}>
  Export Projects
</button>
        <div className="project-container">
          {projects
  .filter((project) =>
    project.title
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  .map((project) => (
            <div
              className="project-card"
              key={project.id}
            >
              <h3>{project.title}</h3>
              <p>{project.description}</p>
               <div
  style={{
    background: "#ddd",
    height: "20px",
    borderRadius: "10px",
    marginBottom: "10px",
  }}
>
  <div
    style={{
  background: "linear-gradient(90deg,#22c55e,#16a34a)",
  height: "100%",
  borderRadius: "10px",
  width: "...",
  transition: "width 0.5s ease",
}}
  />
</div>

<p>
  Progress:{" "}
  {project.tasks.length === 0
    ? 0
    : Math.round(
        (project.tasks.filter(
          (task) => task.status === "Done"
        ).length /
          project.tasks.length) *
          100
      )}
  %
</p>
              <h4>Tasks</h4>

              
              <div className="board">

  <div className="column">
    <h4>🟧 To Do</h4>

    {project.tasks
      .filter((task) => task.status === "To Do")
      .map((task, index) => (
        <div className="task-item todo" key={index}>
          <strong>{task.name}</strong>

          <p>👤 {task.assignedTo}</p>
           <p>📅 {task.dueDate}</p>
          <p
  className={`priority-${(task.priority || "Medium")
    .trim()
    .toLowerCase()}`}
>
  Priority: {task.priority}
</p>
          <button
            onClick={() =>
              assignTask(
                project.id,
                project.tasks.indexOf(task)
              )
            }
          >
            Assign
          </button>
          <button
  onClick={() =>
    editTask(
      project.id,
      project.tasks.indexOf(task)
    )
  }
  style={{ marginLeft: "5px" }}
>
  Edit
</button>

          <button
  onClick={() =>
    changeStatus(
      project.id,
      project.tasks.indexOf(task)
    )
  }
  disabled={task.status === "Done"}
  style={{ marginLeft: "5px" }}
>
  Next Status
</button>
        </div>
      ))}
  </div>

  <div className="column">
    <h4>🟦 In Progress</h4>

    {project.tasks
      .filter((task) => task.status === "In Progress")
      .map((task, index) => (
        <div className="task-item progress" key={index}>
          <strong>{task.name}</strong>

          <p>👤 {task.assignedTo}</p>
           <p>📅 {task.dueDate}</p>
           <p
  className={`priority-${(task.priority || "Medium")
    .trim()
    .toLowerCase()}`}
>
  Priority: {task.priority}
</p>
          <button
            onClick={() =>
              assignTask(
                project.id,
                project.tasks.indexOf(task)
              )
            }
          >
            Assign
          </button>
          <button
  onClick={() =>
    editTask(
      project.id,
      project.tasks.indexOf(task)
    )
  }
  style={{ marginLeft: "5px" }}
>
  Edit
</button>

          <button
            onClick={() =>
              changeStatus(
                project.id,
                project.tasks.indexOf(task)
              )
            }
            style={{ marginLeft: "5px" }}
          >
            Next Status
          </button>
        </div>
      ))}
  </div>

  <div className="column">
    <h4>🟩 Done</h4>

    {project.tasks
      .filter((task) => task.status === "Done")
      .map((task, index) => (
        <div className="task-item done" key={index}>
          <strong>{task.name}</strong>

          <p>👤 {task.assignedTo}</p>
<p>📅 {task.dueDate}</p>
           <p
  className={`priority-${(task.priority || "Medium")
    .trim()
    .toLowerCase()}`}
>
  Priority: {task.priority}
</p>      
          <button
  onClick={() =>
    editTask(
      project.id,
      project.tasks.indexOf(task)
    )
  }
  style={{ marginLeft: "5px" }}
>
  Edit
</button>
          <button
            onClick={() => {
  if (
    window.confirm(
      "Delete this task?"
    )
  ) {
    deleteTask(
      project.id,
      project.tasks.indexOf(task)
    );
  }
}}
          >
            Delete
          </button>
        </div>
      ))}
  </div>

</div>

              <button
                className="task-btn"
                onClick={() => addTask(project.id)}
              >
                + Add Task
              </button>

              <button
                onClick={() => editProject(project.id)}
                style={{ marginLeft: "10px" }}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => {
  if (
    window.confirm(
      "Delete this project?"
    )
  ) {
    deleteProject(project.id);
  }
}}
                style={{ marginLeft: "10px" }}
              >
                Delete Project
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
<footer style={{ textAlign: "center", marginTop: "30px" }}>
  Developed by Atul Mishra © 2026
</footer>